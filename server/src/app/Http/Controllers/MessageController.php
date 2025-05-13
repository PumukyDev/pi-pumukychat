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

        // Load older messages that are older than the given message, sort them by the latest
        if($message->group_id) {
            $messages = Message::where('created_at', '<' , $message->created_at)
                ->where('group_id', $message->group_id)
                ->latest()
                ->paginate(10);
        } else {
            $messages = Message::where('created_at', '<', $message->created_at)
                ->where(function($query) use ($message) {
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
     * Store a newly created resource in storage.
     */
    public function store(StoreMessageRequest $request)
    {
        $data = $request->validated();
        $senderId = auth()->id();
        $data['sender_id'] = $senderId;
        $receiverId = $data['receiver_id'] ?? null;
        $groupId = $data['group_id'] ?? null;
        $files = $data['attachments'] ?? [];

        // 1. Validación extra si es mensaje directo (no grupo)
        if ($receiverId) {
            if (!$request->has('encrypted_key_for_sender') || !$request->has('encrypted_key_for_receiver')) {
                return response()->json(['message' => 'Missing encrypted AES keys for sender/receiver'], 422);
            }
        }

        // 2. Guardamos el mensaje cifrado
        $message = Message::create([
            'message' => $data['message'],
            'sender_id' => $senderId,
            'receiver_id' => $receiverId,
            'group_id' => $groupId,
        ]);

        // 3. Guardamos claves cifradas si es chat privado
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
        }

        // 4. Adjuntos (opcional)
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

        // 5. Actualizamos la conversación o grupo
        if ($receiverId) {
            Conversation::updateConversationWithMessage($receiverId, $senderId, $message);
        } elseif ($groupId) {
            Group::updateGroupWithMessage($groupId, $message);
        }

        // 6. Emitimos el mensaje plano por WebSocket
        $messageToEmit = clone $message;
        if ($request->has('plain_message')) {
            $messageToEmit->message = $request->input('plain_message');
        }

        SocketMessage::dispatch($messageToEmit);

        return new MessageResource($message);
    }

    public function destroy(Message $message)
    {
        // Check if the user is the owner of the message
        if($message->sender_id !== auth()->id()){
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $group = null;
        $conversation = null;
        // Check if the message is the group message
        if ($message->group_id) {
            $group = Group::where('last_message_id', $message->id)->first();
        } else {
            $conversation = Conversation::where('last_message_id', $message->id)->first();
        }

        $message->delete();

        if ($group) {
            // Repopulate $group with latest database data
            $group = Group::find($group->id);
            $lastMessage = $group->lastMessage;
        } else if ($conversation) {
            $conversation = Conversation::find($conversation->id);
            $lastMessage = $conversation->lastMessage;
        }

        return response()->json(['message' => $lastMessage ? new MessageResource($lastMessage) : null]);
    }
}