import { Popover, Transition } from '@headlessui/react'
import { UsersIcon } from '@heroicons/react/24/solid'
import { Fragment } from 'react'
import UserAvatar from './UserAvatar'
import { Link } from '@inertiajs/react'

export default function GroupUsersPopover({ users = [] }) {
    return (
        <Popover className="relative">
            {/* Popover render prop gives us the `open` state */}
            {({ open }) => (
                <>
                    {/* Button to toggle the popover */}
                    <Popover.Button
                        className={`${
                            open ? "text-base-content" : "text-base-content/70"
                        } hover:text-primary`}
                    >
                        <UsersIcon className="w-4" />
                    </Popover.Button>

                    {/* Animated panel with transition */}
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                    >
                        {/* Popover content panel (user list) */}
                        <Popover.Panel className="absolute right-0 z-20 mt-3 w-[240px] px-4 sm:px-0">
                            <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-base-300 bg-base-200">
                                <div className="p-2">
                                    {/* List of users with avatars and names */}
                                    {users.map((user) => (
                                        <Link
                                            href={route("chat.user", user.id)}
                                            key={user.id}
                                            className="flex items-center gap-2 py-2 px-3 hover:bg-base-300 rounded text-base-content"
                                        >
                                            <UserAvatar user={user} />
                                            <div className="text-xs">{user.name}</div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    )
}
