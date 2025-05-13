import { useEffect, useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import UserAvatar from "./UserAvatar";
import GroupAvatar from "./GroupAvatar";
import UserOptionsDropdown from "./UserOptionsDropdown";
import { formatMessageDateShort } from "@/helper";
import {
    loadPrivateKey,
    decryptAESKeyWithPrivateKey,
    decryptMessageAES,
} from "@/cryptoHelpers";

const ConversationItem = ({
    conversation,
    selectedConversation = null,
    online = null,
}) => {
    const page = usePage();
    const currentUser = page.props.auth.user;
    const [preview, setPreview] = useState("...");

    let classes = "border-transparent";

    function formatDate(conversationDate) {
        const now = new Date();
        const date = new Date(conversationDate);
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        } else if (diffDays === 1) {
            return "Yesterday";
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else if (diffDays < 30) {
            return `${Math.floor(diffDays / 7)} weeks ago`;
        } else if (diffDays < 365) {
            return `${Math.floor(diffDays / 30)} months ago`;
        } else {
            return `${Math.floor(diffDays / 365)} years ago`;
        }
    }

    if (selectedConversation) {
        if (
            !selectedConversation.is_group &&
            !conversation.is_group &&
            conversation.id == selectedConversation.id
        ) {
            classes = "border-blue-500 bg-black/20";
        }
        if (
            selectedConversation.is_group &&
            conversation.is_group &&
            conversation.id == selectedConversation.id
        ) {
            classes = "border-blue-500 bg-black/20";
        }
    }

    const formattedDate = formatDate(conversation.last_message_date);

    useEffect(() => {
        const decryptPreview = async () => {
            if (
                conversation.last_message &&
                conversation.last_message_encrypted_key
            ) {
                try {
                    const privateKey = await loadPrivateKey();
                    const aesKey = await decryptAESKeyWithPrivateKey(
                        conversation.last_message_encrypted_key,
                        privateKey
                    );
                    const plaintext = await decryptMessageAES(conversation.last_message, aesKey);
                    setPreview(plaintext);
                } catch (err) {
                    console.error("❌ Failed to decrypt sidebar message:", err);
                    setPreview("[Decryption failed]");
                }
            } else {
                setPreview(conversation.last_message || "");
            }
        };

        decryptPreview();
    }, [conversation]);

    return (
        <Link
            href={
                conversation.is_group
                    ? route("chat.group", conversation)
                    : route("chat.user", conversation)
            }
            preserveState
            className={
                "conversation-item flex items-center gap-2 p-2 text-gray-300 transition-all cursor-pointer border-l-4 hover:bg-black/30 " +
                classes +
                (conversation.is_user && currentUser.is_admin ? "pr-2" : "pr-4")
            }
        >
            {conversation.is_user && <UserAvatar user={conversation} online={online} />}
            {conversation.is_group && <GroupAvatar group={conversation} />}

            <div
                className={
                    "flex-1 text-xs max-w-full overflow-hidden " +
                    (conversation.is_user && conversation.blocked_at ? "opacity-50" : "")
                }
            >
                <div className="flex gap-1 justify-between items-center">
                    <h3 className="text-sm font-semibold overflow-hidden text-nowrap text-ellipsis">
                        {conversation.name}
                    </h3>
                    {conversation.last_message_date && (
                        <span className="text-nowrap">
                            {formatMessageDateShort(conversation.last_message_date)}
                        </span>
                    )}
                </div>

                <p className="text-xs text-nowrap overflow-hidden text-ellipsis">
                    {preview}
                </p>
            </div>

            {currentUser.is_admin && conversation.is_user && (
                <UserOptionsDropdown conversation={conversation} />
            )}
        </Link>
    );
};

export default ConversationItem;
