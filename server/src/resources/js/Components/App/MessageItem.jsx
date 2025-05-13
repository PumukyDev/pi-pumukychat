import { usePage } from "@inertiajs/react";
import ReactMarkDown from "react-markdown";
import React from "react";
import UserAvatar from "./UserAvatar";
import { formatMessageDateLong } from "@/helper";
import MessageAttachments from "./MessageAttachments";
import MessageOptionsDropdown from "./MessageOptionsDropdown";

const MessageItem = ({ message, decrypted, attachmentClick }) => {
    const currentUser = usePage().props.auth.user;
    const content = decrypted !== undefined ? decrypted : message.message;

    return (
        <div
            className={
                "chat " +
                (message.sender_id === currentUser.id
                    ? "chat-end"
                    : "chat-start")
            }
        >
            <UserAvatar user={message.sender} />
            <div className="chat-header">
                {message.sender_id !== currentUser.id ? message.sender.name : ""}
                <time className="text-xs opacity-50 ml-2">
                    {formatMessageDateLong(message.created_at)}
                </time>
            </div>

            <div
                className={
                    "chat-bubble relative " +
                    (message.sender_id === currentUser.id
                        ? "bg-gray-700 text-white"
                        : "bg-gray-600 text-white")
                }
            >
                {message.sender_id === currentUser.id && (
                    <MessageOptionsDropdown message={message} />
                )}

                <div className="chat-message">
                    <div className="chat-message-content">
                        <ReactMarkDown>{content}</ReactMarkDown>
                    </div>

                    <MessageAttachments
                        attachments={message.attachments}
                        attachmentClick={attachmentClick}
                    />
                </div>
            </div>
        </div>
    );
};

export default MessageItem;
