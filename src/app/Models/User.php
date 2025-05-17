<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Auth;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'avatar',
        'name',
        'email',
        'email_verified_at',
        'password',
        'is_admin',
        'public_key',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function groups()
    {
        return $this->belongsToMany(Group::class, 'group_users');
    }

    public static function getUsersExceptUser(User $user)
    {
        $userId = $user->id;

        $query = User::select([
            'users.*',
            'messages.message as last_message',
            'messages.created_at as last_message_date',
            'message_keys.encrypted_key as last_message_encrypted_key'
        ])
        ->where('users.id', '!=', $userId)
        ->when($user->is_admin, function ($query) {
            $query->whereNull('users.blocked_at');
        })
        ->leftJoin('conversations', function ($join) use ($userId) {
            $join->on('conversations.user_id1', '=', 'users.id')
                ->where('conversations.user_id2', '=', $userId)
                ->orWhere(function ($query) use ($userId) {
                    $query->on('conversations.user_id2', '=', 'users.id')
                        ->where('conversations.user_id1', '=', $userId);
                });
        })
        ->leftJoin('messages', 'messages.id', '=', 'conversations.last_message_id')
        ->leftJoin('message_keys', function ($join) use ($userId) {
            $join->on('message_keys.message_id', '=', 'messages.id')
                ->where('message_keys.user_id', '=', $userId);
        })
        ->orderByRaw('IFNULL(users.blocked_at, 1)')
        ->orderBy('messages.created_at', 'desc')
        ->orderBy('users.name');

        return $query->get();
    }

    public function toConversationArray()
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'is_group' => false,
            'is_user' => true,
            'is_admin' => (bool) $this->is_admin,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'blocked_at' => $this->blocked_at,
            'last_message' => $this->last_message,
            'last_message_date' =>
                $this->last_message_date ? ($this->last_message_date . ' UTC') : null,
            'last_message_encrypted_key' => $this->last_message_encrypted_key,
        ];
    }
}
