import { Popover, Transition } from '@headlessui/react'
import { ExclamationCircleIcon } from '@heroicons/react/24/solid'
import { Fragment } from 'react'

export default function GroupDescriptionPopover({ description }) {
    return (
        // Main popover container
        <Popover className="relative">
            {({ open }) => (
                <>
                    {/* Popover trigger button */}
                    <Popover.Button
                        className={`${
                            open ? "text-base-content" : "text-base-content/70"
                        } hover:text-primary`}
                    >
                        <ExclamationCircleIcon className="w-4" />
                    </Popover.Button>

                    {/* Popover panel with transition */}
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                    >
                        <Popover.Panel className="absolute right-0 z-50 mt-3 w-[300px] px-4 sm:px-0">
                            <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-base-300 bg-base-200 text-base-content">
                                <div className="p-4">
                                    <h2 className="text-lg mb-3">
                                        Description
                                    </h2>

                                    {/* Render description if available */}
                                    {description && (
                                        <div className="text-xs">
                                            {description}
                                        </div>
                                    )}

                                    {/* Fallback message if no description */}
                                    {!description && (
                                        <div className="text-xs text-base-content/60 text-center py-4">
                                            No description is defined.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    )
}
