import { useEventBus } from "@/EventBus";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function Toast({ }) {
    // State to store all active toasts
    const [toasts, setToasts] = useState([]);
    const {on} = useEventBus();

    useEffect(() => {
        // Subscribe to "toast.show" events
        on('toast.show', (message) => {
            const uuid = uuidv4(); // Generate a unique identifier for the toast

            // Add new toast to the list
            setToasts((oldToasts) => [...oldToasts, { message, uuid }]);

            // Automatically remove the toast after 5 seconds
            setTimeout(() => {
                setToasts((oldToasts) =>
                    oldToasts.filter((toast) => toast.uuid !== uuid)
                );
            }, 5000);
        });
    }, [on]);

    return (
        // Toast container (mapping to be able to show several toasts)
        <div className="toast toast-end min-w-[280px] w-full xs:w-auto z-50">
            {toasts.map((toast, index) => (
                // Toast alert element
                <div
                    key={toast.uuid}
                    className="alert alert-success text-base-content shadow-md"
                >
                    <span>{toast.message}</span>
                </div>
            ))}
        </div>
    );
}
