import {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
} from "@headlessui/react";
import {
    EllipsisVerticalIcon,
    LockClosedIcon,
    LockOpenIcon,
    ShieldCheckIcon,
    UserIcon,
} from "@heroicons/react/24/solid";
import { Fragment } from "react";

export default function UserOptionsDropdown({ conversation }) {
    // Triggered to change the user's role (admin <-> regular)
    const changeUserRole = () => {
        console.log("Change User Role");
        if (!conversation.is_user) {
            return;
        }
        axios
            .post(route("user.changeRole", conversation.id))
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    // Triggered to block or unblock the user
    const onBlockUser = () => {
        console.log("Block User");
        if (!conversation.is_user) {
            return;
        }

        axios
            .post(route("user.blockUnblock", conversation.id))
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div>
            <Menu as="div" className="relative inline-block text-left">
                <div>
                    {/* Three-dot icon that opens the dropdown */}
                    <MenuButton className="flex justify-center items-center w-8 h-8 rounded-full hover:bg-base-300">
                        <EllipsisVerticalIcon className="h-5 w-5 text-base-content" />
                    </MenuButton>
                </div>

                {/* Dropdown content */}
                <MenuItems className="absolute right-0 mt-2 w-48 rounded-md bg-base-200 border border-base-300 shadow-xl backdrop-blur z-50">
                    <div className="px-1 py-1">
                        {/* Option to block or unblock the user */}
                        <MenuItem as={Fragment}>
                            {({ focus }) => (
                                <button
                                    onClick={onBlockUser}
                                    className={`${
                                        focus
                                            ? "bg-base-300 text-base-content"
                                            : "text-base-content"
                                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                >
                                    {conversation.blocked_at ? (
                                        <>
                                            <LockOpenIcon className="w-4 h-4 mr-2" />
                                            Unblock User
                                        </>
                                    ) : (
                                        <>
                                            <LockClosedIcon className="w-4 h-4 mr-2" />
                                            Block User
                                        </>
                                    )}
                                </button>
                            )}
                        </MenuItem>
                    </div>

                    <div className="px-1 py-1">
                        {/* Option to change admin role */}
                        <MenuItem as={Fragment}>
                            {({ focus }) => (
                                <button
                                    onClick={changeUserRole}
                                    className={`${
                                        focus
                                            ? "bg-base-300 text-base-content"
                                            : "text-base-content"
                                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                >
                                    {conversation.is_admin ? (
                                        <>
                                            <UserIcon className="w-4 h-4 mr-2" />
                                            Make Regular User
                                        </>
                                    ) : (
                                        <>
                                            <ShieldCheckIcon className="w-4 h-4 mr-2" />
                                            Make Admin
                                        </>
                                    )}
                                </button>
                            )}
                        </MenuItem>
                    </div>
                </MenuItems>
            </Menu>
        </div>
    );
}
