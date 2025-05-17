<?php

namespace App\Http\Controllers;

use App\Events\SocketMessage;
use App\Http\Requests\StoreMessageRequest;
use App\Http\Resources\MessageResource;
use App\Models\Conversation;
use App\Models\Group;
use App\Models\Message;
use App\Models\MessageAttachment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MessageController extends Controller
{
    public function byUser(User $user)
    {
        $messages = Message::where('sender_id', auth()->id())
            ->where('receiver_id', $user->id)
            ->orWhere('sender_id', $user->id)
            ->where('receiver_id', auth()->id())
            ->latest()
            ->paginate(10);

        return inertia('Home', [
            'selectedConversation' => $user->toConversationArray(),
            'messages' => MessageResource::collection($messages),
        ]);
    }

    public function byGroup(Group $group)
    {
        $messages = Message::where('group_id', $group->id)
            ->latest()
            ->paginate(10);

        return inertia('Home', [
            'selectedConversation' => $group->toConversationArray(),
            'messages' => MessageResource::collection($messages),
        ]);
    }

    public function loadOlder(Message $message)
    {
        // Load messages older than the given message, sorted by latest
        if ($message->group_id) {
            $messages = Message::where('created_at', '<', $message->created_at)
                ->where('group_id', $message->group_id)
                ->latest()
                ->paginate(10);
        } else {
            $messages = Message::where('created_at', '<', $message->created_at)
                ->where(function ($query) use ($message) {
                    $query->where('sender_id', $message->sender_id)
                        ->where('receiver_id', $message->receiver_id)
                        ->orWhere('sender_id', $message->receiver_id)
                        ->where('receiver_id', $message->sender_id);
                })
                ->latest()
                ->paginate(10);
        }

        return MessageResource::collection($messages);
    }

    /**
     * Store a newly created message in the database.
     */
    public function store(StoreMessageRequest $request)
    {
        $data = $request->validated();
        $senderId = auth()->id();
        $data['sender_id'] = $senderId;
        $receiverId = $data['receiver_id'] ?? null;
        $groupId = $data['group_id'] ?? null;
        $files = $data['attachments'] ?? [];

        // 1. Additional validation for direct messages (not group)
        if ($receiverId) {
            if (!$request->has('encrypted_key_for_sender') || !$request->has('encrypted_key_for_receiver')) {
                return response()->json(['message' => 'Missing encrypted AES keys for sender/receiver'], 422);
            }
        }

        // 2. Save the encrypted message to the database
        $message = Message::create([
            'message' => $data['message'],
            'sender_id' => $senderId,
            'receiver_id' => $receiverId,
            'group_id' => $groupId,
        ]);

        // 3. Save encrypted AES keys per user
        if ($receiverId) {
            \App\Models\MessageKey::create([
                'message_id' => $message->id,
                'user_id' => $senderId,
                'encrypted_key' => $request->input('encrypted_key_for_sender'),
            ]);
            \App\Models\MessageKey::create([
                'message_id' => $message->id,
                'user_id' => $receiverId,
                'encrypted_key' => $request->input('encrypted_key_for_receiver'),
            ]);
        } elseif ($groupId) {
            $keys = $request->input('keys', []);
            foreach ($keys as $userId => $encryptedKey) {
                \App\Models\MessageKey::create([
                    'message_id' => $message->id,
                    'user_id' => $userId,
                    'encrypted_key' => $encryptedKey,
                ]);
            }
        }

        // 4. Handle file attachments
        $attachments = [];
        if ($files) {
            foreach ($files as $file) {
                $directory = 'attachments/' . Str::random(32);
                Storage::makeDirectory($directory);

                $attachment = MessageAttachment::create([
                    'message_id' => $message->id,
                    'name' => $file->getClientOriginalName(),
                    'mime' => $file->getClientMimeType(),
                    'size' => $file->getSize(),
                    'path' => $file->store($directory, 'public'),
                ]);
                $attachments[] = $attachment;
            }
            $message->attachments = $attachments;
        }

        // 5. Update conversation or group with latest message
        if ($receiverId) {
            Conversation::updateConversationWithMessage($receiverId, $senderId, $message);
        } elseif ($groupId) {
            Group::updateGroupWithMessage($groupId, $message);
        }

        // 6. Broadcast the plain message via WebSocket
        $messageToEmit = clone $message;
        if ($request->has('plain_message')) {
            $messageToEmit->message = $request->input('plain_message');
        }
        SocketMessage::dispatch($messageToEmit);

        // 7. Reload message with relations for response
        $message = Message::with('sender', 'attachments')->find($message->id);

        return new MessageResource($message);
    }

    public function destroy(Message $message)
    {
        if ($message->sender_id !== auth()->id()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $lastMessage = null;

        $group = null;
        $conversation = null;

        if ($message->group_id) {
            $group = Group::where('last_message_id', $message->id)->first();
        } else {
            $conversation = Conversation::where('last_message_id', $message->id)->first();
        }

        // Delete encrypted keys and attachments
        $message->keys()->delete();
        $message->attachments()->each(function ($attachment) {
            Storage::disk('public')->delete($attachment->path);
            $attachment->delete();
        });

        $message->delete();

        // Clear the last_message_id field if it pointed to the deleted message
        if ($group) {
            $group->last_message_id = null;
            $group->save();
        } elseif ($conversation) {
            $conversation->last_message_id = null;
            $conversation->save();
        }

        // Recalculate the last available message, if any
        if ($group) {
            $lastMessage = Message::where('group_id', $group->id)->latest()->first();
        } elseif ($conversation) {
            $lastMessage = Message::where(function ($q) use ($conversation) {
                $q->where('sender_id', $conversation->user_id)
                  ->where('receiver_id', $conversation->owner_id)
                  ->orWhere(function ($q2) use ($conversation) {
                      $q2->where('sender_id', $conversation->owner_id)
                         ->where('receiver_id', $conversation->user_id);
                  });
            })->latest()->first();
        }

        return response()->json([
            'message' => $lastMessage ? new MessageResource($lastMessage) : null,
        ], 200);
    }
}
