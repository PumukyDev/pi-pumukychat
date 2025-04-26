import {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
} from "@headlessui/react";
import { EllipsisVerticalIcon, ShieldCheckIcon, TrashIcon, UserIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { Fragment } from "react";
import { useEventBus } from "@/EventBus";


export default function MessageOptionsDropdown({ message }) {

    const { emit } = useEventBus();

    const onMessageDelete = () => {
        console.log("Delete message");

        axios
            .delete(route("message.destroy", message.id))
            .then((res) => {
                emit('message.deleted', {
                    message,
                    prevMessage: res.data.message,
                });
            })
            .catch((err) => {
                console.error(err);
            });
    };

    return (
        <div className="absolute right-full text-gray-100 top-1/2 -translate-y-1/2 z-10">
            <Menu as="div" className="relative inline-block text-left">
                <div>
                    <MenuButton
                        className={
                            "flex justify-center items-center w-8 h-8 rounded-full hover:bg-black/40"
                        }
                    >
                        <EllipsisVerticalIcon className="h-5 w-5" />
                    </MenuButton>
                </div>
                <MenuItems
                    transition
                    className="absolute left-0 mt-2 w-48 rounded-md bg-gray-900 shadow-lg z-50"
                >
                    <div className="px-1 py-1 ">
                        <MenuItem as={Fragment}>
                            {({ focus }) => (
                                <button
                                    onClick={onMessageDelete}
                                    className={`${
                                        focus
                                            ? "bg-black/30 text-white"
                                            : "text-gray-100"
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
