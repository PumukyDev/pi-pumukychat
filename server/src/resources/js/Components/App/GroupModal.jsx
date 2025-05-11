import TextAreaInput from "@/Components/TextAreaInput";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import TextInput from "@/Components/TextInput";
import SecondaryButton from "@/Components/SecondaryButton";
import PrimaryButton from "@/Components/PrimaryButton";
import UserPicker from "@/Components/App/UserPicker";
import { useForm, usePage } from "@inertiajs/react";
import { useEventBus } from "@/EventBus";
import { useEffect, useState } from "react";

export default function GroupModal({ show = false, onClose = () => {} }) {
    const page = usePage();
    const conversations = page.props.conversations;
    const { on, emit } = useEventBus();
    const [group, setGroup] = useState({});

    // Form state
    const { data, setData, processing, reset, post, put, errors } = useForm({
        id: "",
        name: "",
        description: "",
        user_ids: [],
    });

    // List of non-group users
    const users = conversations.filter((c) => !c.is_group);

    // Submit handler for create or update
    const createOrUpdateGroup = (e) => {
        e.preventDefault();

        if (group.id) {
            put(route("group.update", group.id), {
                onSuccess: () => {
                    closeModal();
                    emit("toast.show", `Group "${data.name}" was updated`);
                },
            });
            return;
        }
        post(route("group.store"), {
            onSuccess: () => {
                emit("toast.show", `Group "${data.name}" was created`);
                closeModal();
            },
        });
    };

    // Reset and close modal
    const closeModal = () => {
        reset();
        onClose();
    };

    // Listen to external event to open the modal and prefill data
    useEffect(() => {
        return on("GroupModal.show", (group) => {
            setGroup(group);
            setData({
                id: group.id || "",
                name: group.name || "",
                description: group.description || "",
                user_ids: group.users
                    ?.filter((u) => group.owner_id !== u.id)
                    ?.map((u) => u.id) || [],
            });
        });
    }, [on, setData]);

    return (
        <Modal show={show} onClose={closeModal}>
            <form
                onSubmit={createOrUpdateGroup}
                className="p-6 bg-base-200 text-base-content overflow-y-auto rounded-lg"
            >
                <h2 className="text-xl font-medium">
                    {group.id
                        ? `Edit Group "${group.name}"`
                        : "Create new Group"}
                </h2>

                {/* Name input */}
                <div className="mt-8">
                    <InputLabel htmlFor="name" value="Name" className="text-white"/>
                    <TextInput
                        id="name"
                        className="mt-1 block w-full bg-base-300"
                        value={data.name}
                        disabled={!!group.id}
                        onChange={(e) => setData("name", e.target.value)}
                        required
                        isFocused
                    />
                    <InputError className="mt-2" message={errors.name} />
                </div>

                {/* Description input */}
                <div className="mt-4">
                    <InputLabel htmlFor="description" value="Description" className="text-white"/>
                    <TextAreaInput
                        id="description"
                        rows="3"
                        className="mt-1 block w-full bg-base-300"
                        value={data.description}
                        onChange={(e) => setData("description", e.target.value)}
                    />
                    <InputError className="mt-2" message={errors.description} />
                </div>

                {/* User selector */}
                <div className="mt-4">
                    <InputLabel value="Select Users" className="text-white"/>
                    <UserPicker
                        value={
                            users.filter(
                                (u) =>
                                    group.owner_id !== u.id &&
                                    data.user_ids.includes(u.id)
                            )
                        }
                        options={users}
                        onSelect={(users) =>
                            setData(
                                "user_ids",
                                users.map((u) => u.id)
                            )
                        }
                    />
                    <InputError className="mt-2" message={errors.user_ids} />
                </div>

                {/* Action buttons */}
                <div className="mt-6 flex justify-end">
                    <SecondaryButton onClick={closeModal}>
                        Cancel
                    </SecondaryButton>
                    <PrimaryButton className="ms-3" disabled={processing}>
                        {group.id ? "Update" : "Create"}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
