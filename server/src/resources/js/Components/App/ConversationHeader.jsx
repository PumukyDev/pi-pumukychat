import { Link, usePage } from '@inertiajs/react';
import { ArrowLeftIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';
import UserAvatar from './UserAvatar';
import GroupAvatar from './GroupAvatar';
import GroupDescriptionPopover from './GroupDescriptionPopover';
import GroupUsersPopover from './GroupUsersPopover';
import { useEventBus } from '@/EventBus';

const ConversationHeader = ({ selectedConversation }) => {
    const authUser = usePage().props.auth.user;
    const { emit } = useEventBus();

    // Trigger group deletion with confirmation
    const onDeleteGroup = () => {
        if (!window.confirm("Are you sure you want to delete this group?")) {
            return;
        }

        axios.delete(route("group.destroy", selectedConversation.id))
            .then((res) => {
                console.log(res)
                emit("toast.show", res.data.message); // Notify user via toast
            }).catch((err) => {
                console.log(err)
            });
    }

    return (
        <>
            {selectedConversation && (
                <div className="p-3 flex justify-between items-center border-b border-base-300 bg-base-200 text-base-content">
                    <div className="flex items-center gap-3">
                        {/* Back button on small screens */}
                        <Link
                            href={route("dashboard")}
                            className="inline-block sm:hidden"
                        >
                            <ArrowLeftIcon className="w-6" />
                        </Link>

                        {/* Show avatar depending on conversation type */}
                        {selectedConversation.is_user && (
                            <UserAvatar user={selectedConversation} />
                        )}
                        {selectedConversation.is_group && <GroupAvatar />}

                        <div>
                            <h3>{selectedConversation.name}</h3>
                            {selectedConversation.is_group && (
                                <p className="text-xs text-base-content/60">
                                    {selectedConversation.users.length} members
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Group management options for owner */}
                    {selectedConversation.is_group && (
                        <div className="flex gap-3">
                            <GroupDescriptionPopover
                                description={selectedConversation.description}
                            />
                            <GroupUsersPopover
                                users={selectedConversation.users}
                            />
                            {selectedConversation.owner_id == authUser.id && (
                                <>
                                    {/* Edit group button */}
                                    <div
                                        className="tooltip tooltip-left"
                                        data-tip="Edit Group"
                                    >
                                        <button
                                            onClick={(ev) =>
                                                emit(
                                                    "GroupModal.show",
                                                    selectedConversation
                                                )
                                            }
                                            className="text-base-content/70 hover:text-primary"
                                        >
                                            <PencilSquareIcon className="w-4" />
                                        </button>
                                    </div>

                                    {/* Delete group button */}
                                    <div
                                        className="tooltip tooltip-left"
                                        data-tip="Delete Group"
                                    >
                                        <button
                                            onClick={onDeleteGroup}
                                            className="text-base-content/70 hover:text-error"
                                        >
                                            <TrashIcon className="w-4" />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default ConversationHeader;
