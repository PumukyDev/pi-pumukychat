<?php

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

// Presence channel for tracking online users
Broadcast::channel('online', function (User $user) {
    return $user ? new UserResource($user) : null;
});

// Private channel for one-on-one messaging between two users
Broadcast::channel('message.user.{userId1}-{userId2}', function (User $user, int $userId1, int $userId2) {
    return $user->id === $userId1 || $user->id === $userId2 ? $user : null;
});

// Private channel for group messaging
Broadcast::channel('message.group.{groupId}', function (User $user, int $groupId) {
    return $user->groups->contains('id', $groupId) ? $user : null;
});

// Private channel for group deletion notifications
Broadcast::channel('group.deleted.{groupId}', function (User $user, int $groupId) {
    return $user->groups->contains('id', $groupId);
});