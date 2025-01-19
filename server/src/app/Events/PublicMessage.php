<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PublicMessage implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */

    // public function broadcastOn(): array
    // {q                                                   ASÍ VENIA ANTES
    //     return [
    //         new PrivateChannel('channel-name'),
    //     ];
    // }

    public function broadcastOn(): array
    {
        return [
            new Channel('public-message-channel'),
        ];
    }

    public function broadcastAS() {
        return 'MessageEvent';
    }

    /**
     * The event's broadcast name.
     *
     * @return array
     */
    public function broadcastWith()
    {
        return ['message' => 'This notification is a public message.'];
    }
}
