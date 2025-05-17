<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Conversation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id1',
        'user_id2',
        'last_message_id',
    ];

    public function lastMessage() {
        return $this->belongsTo(Message::class, 'last_message_id');
    }

    public function user1() {
        return $this->belongsTo(User::class, 'user_id1');
    }

    public function user2() {
        return $this->belongsTo(User::class, 'user_id2');
    }

    public function lastMessageKey()
    {
        return $this->hasOneThrough(
            MessageKey::class,
            Message::class,
            'id', // Message.id = Conversation.last_message_id
            'message_id', // MessageKey.message_id = Message.id
            'last_message_id', // Conversation.last_message_id
            'id' // Message.id
        )->where('user_id', Auth::id());
    }

    public static function getConversationsForSidebar(User $user)
    {
        $users = User::getUsersExceptUser($user);
        $groups = Group::getGroupsForUser($user);

        return $users->map(function (User $u) {
            return $u->toConversationArray();
        })->concat($groups->map(function (Group $g) {
            return $g->toConversationArray();
        }));
    }

    public static function updateConversationWithMessage($userId1, $userId2, $message)
    {
        $conversation = self::where(function ($query) use ($userId1, $userId2) {
            $query->where('user_id1', $userId1)
                ->where('user_id2', $userId2);
        })->orWhere(function ($query) use ($userId1, $userId2) {
            $query->where('user_id1', $userId2)
                ->where('user_id2', $userId1);
        })->first();

        if ($conversation) {
            $conversation->update([
                'last_message_id' => $message->id,
            ]);
        } else {
            self::create([
                'user_id1' => $userId1,
                'user_id2' => $userId2,
                'last_message_id' => $message->id,
            ]);
        }
    }
}
