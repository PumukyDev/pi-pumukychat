import { useEventBus } from "@/EventBus";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import UserAvatar from "./UserAvatar";
import { Link } from "@inertiajs/react";

export default function NewMessageNotification({}) {
    // Store all active notifications
    const [toasts, setToasts] = useState([]);
    const { on } = useEventBus();

    useEffect(() => {
        // Listen for custom event "newMessageNotification"
        on("newMessageNotification", ({ message, user, group_id }) => {
            const uuid = uuidv4(); // Unique ID for each toast

            // Add new notification to the list
            setToasts((oldToasts) => [
                ...oldToasts,
                { message, uuid, user, group_id }
            ]);

            // Auto-remove notification after 5 seconds
            setTimeout(() => {
                setToasts((oldToasts) =>
                    oldToasts.filter((toast) => toast.uuid !== uuid)
                );
            }, 5000);
        });
    }, [on]);

    return (
        // Toast container at the top center
        <div className="toast toast-top toast-center min-w-[280px] z-50">
            {toasts.map((toast, index) => (
                <div
                    key={toast.uuid}
                    className="alert alert-success text-base-content shadow-md"
                >
                    {/* Link to the group or user chat */}
                    <Link
                        href={
                            toast.group_id
                                ? route('chat.group', toast.group_id)
                                : route('chat.user', toast.user.id)
                        }
                        className="flex items-center gap-2"
                    >
                        <UserAvatar user={toast.user} />
                        <span>{toast.message}</span>
                    </Link>
                </div>
            ))}
        </div>
    );
}
