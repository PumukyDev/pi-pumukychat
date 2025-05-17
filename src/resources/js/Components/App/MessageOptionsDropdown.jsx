import {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
} from "@headlessui/react";
import { EllipsisVerticalIcon, TrashIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { Fragment } from "react";
import { useEventBus } from "@/EventBus";

export default function MessageOptionsDropdown({ message }) {
    const { emit } = useEventBus();

    // Function to delete a message
    const onMessageDelete = () => {
        console.log("Delete message");

        axios
            .delete(route("message.destroy", message.id))
            .then((res) => {
                // Emit event with both deleted and previous message
                emit("message.deleted", {
                    message,
                    prevMessage: res.data.message,
                });
            })
            .catch((err) => {
                console.error(err);
            });
    };

    return (
        // Dropdown wrapper, positioned beside the message
        <div className="absolute right-full top-1/2 -translate-y-1/2 z-10">
            <Menu as="div" className="relative inline-block text-left">
                <div>
                    {/* Trigger button: three vertical dots */}
                    <MenuButton className="flex justify-center items-center w-8 h-8 rounded-full hover:bg-base-300">
                        <EllipsisVerticalIcon className="h-5 w-5 text-base-content" />
                    </MenuButton>
                </div>

                {/* Dropdown content */}
                <MenuItems className="absolute left-0 mt-2 min-w-max rounded-md bg-base-200 border border-base-300 shadow-xl backdrop-blur z-50">
                    <div className="px-1 py-1">
                        <MenuItem as={Fragment}>
                            {({ focus }) => (
                                <button
                                    onClick={onMessageDelete}
                                    className={`${
                                        focus
                                            ? "bg-base-300 text-base-content"
                                            : "text-base-content"
                                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                >
                                    <TrashIcon className="w-4 h-4 mr-2" />
                                    Delete
                                </button>
                            )}
                        </MenuItem>
                    </div>
                </MenuItems>
            </Menu>
        </div>
    );
}
