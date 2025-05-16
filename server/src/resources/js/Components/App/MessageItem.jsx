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

    const isOwnMessage = currentUser?.id === message?.sender_id;

    return (
        <div
            className={
                "chat " +
                (isOwnMessage ? "chat-end" : "chat-start")
            }
        >
            <UserAvatar user={message.sender} />

            <div className="chat-header">
                {!isOwnMessage ? message.sender.name : ""}
                <time className="text-xs opacity-50 ml-2">
                    {formatMessageDateLong(message.created_at)}
                </time>
            </div>

            <div
                className={`chat-bubble relative ${
                    isOwnMessage
                        ? 'bg-bubbleown text-bubbleown-content'
                        : 'bg-bubbleother text-bubbleother-content'
                }`}
            >
                {isOwnMessage && (
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
