import ChatLayout from "@/Layouts/ChatLayout";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";
import ConversationHeader from "@/Components/App/ConversationHeader";
import MessageItem from "@/Components/App/MessageItem";
import MessageInput from "@/Components/App/MessageInput";
import { useEventBus } from "@/EventBus";
import axios from "axios";
import AttachmentPreviewModal from "@/Components/App/AttachmentPreviewModal";

import {
    loadPrivateKey,
    decryptAESKeyWithPrivateKey,
    decryptMessageAES,
    storePrivateKeyPem,
    arrayBufferToPem
} from "@/cryptoHelpers";

function Home({ selectedConversation = null, messages = null }) {
    const [localMessages, setLocalMessages] = useState([]);
    const [noMoreMessages, setNoMoreMessages] = useState(false);
    const [scrollFromBottom, setScrollFromBottom] = useState(0);
    const messagesCtrRef = useRef(null);
    const loadMoreIntersect = useRef(null);
    const [showAttachmentPreview, setShowAttachmentPreview] = useState(false);
    const [previewAttachment, setPreviewAttachment] = useState({});
    const { on } = useEventBus();

    const ensureKeyPair = async () => {
        try {
            await loadPrivateKey();
        } catch (e) {
            console.warn("No private key found. Generating a new key pair...");

            const { publicKey, privateKey } = await window.crypto.subtle.generateKey(
                {
                    name: "RSA-OAEP",
                    modulusLength: 4096,
                    publicExponent: new Uint8Array([1, 0, 1]),
                    hash: "SHA-256",
                },
                true,
                ["encrypt", "decrypt"]
            );

            const exportedPrivate = await window.crypto.subtle.exportKey("pkcs8", privateKey);
            const exportedPublic = await window.crypto.subtle.exportKey("spki", publicKey);

            const pemPrivate = arrayBufferToPem(exportedPrivate, "PRIVATE KEY");
            const pemPublic = arrayBufferToPem(exportedPublic, "PUBLIC KEY");

            await storePrivateKeyPem(pemPrivate);
            await axios.post("/api/store-public-key", { public_key: pemPublic });

            console.log("Key pair generated and stored.");
        }
    };

    const decryptAllMessages = async (messageArray) => {
        try {
            const privateKey = await loadPrivateKey();
            console.debug("Loaded private key successfully");

            const decryptedMessages = await Promise.all(
                messageArray.map(async (msg) => {
                    console.debug("Raw message:", msg);

                    try {
                        const aesKey = await decryptAESKeyWithPrivateKey(msg.encrypted_key, privateKey);
                        console.debug(`AES key decrypted for message ID ${msg.id}`);

                        const plaintext = await decryptMessageAES(msg.message, aesKey);
                        console.debug(`Message ID ${msg.id} decrypted:`, plaintext);

                        return { ...msg, decrypted: plaintext };
                    } catch (err) {
                        console.error(`Decryption failed for message ID ${msg.id}:`, err);
                        return { ...msg, decrypted: "[Decryption failed]" };
                    }
                })
            );

            return decryptedMessages;
        } catch (err) {
            console.error("Error loading private key:", err);
            return messageArray.map((m) => ({ ...m, decrypted: "[No key available]" }));
        }
    };



    const messageCreated = (message) => {
        if (
            selectedConversation &&
            selectedConversation.is_group &&
            selectedConversation.id == message.group_id
        ) {
            setLocalMessages((prevMessage) => [...prevMessage, message]);
        }
        if (
            selectedConversation &&
            selectedConversation.is_user &&
            (selectedConversation.id == message.sender_id ||
                selectedConversation.id == message.receiver_id)
        ) {
            setLocalMessages((prevMessage) => [...prevMessage, message]);
        }
    };

    const messageDeleted = ({ message }) => {
        setLocalMessages((prevMessage) =>
            prevMessage.filter((m) => m.id !== message.id)
        );
    };

    const loadMoreMessages = useCallback(() => {
        if (noMoreMessages) return;

        const firstMessage = localMessages[0];
        axios
            .get(route("message.loadOlder", firstMessage.id))
            .then(async ({ data }) => {
                if (data.data.length == 0) {
                    setNoMoreMessages(true);
                    return;
                }

                const scrollHeight = messagesCtrRef.current.scrollHeight;
                const scrollTop = messagesCtrRef.current.scrollTop;
                const clientHeight = messagesCtrRef.current.clientHeight;
                const tmpScrollFromBottom =
                    scrollHeight - scrollTop - clientHeight;

                setScrollFromBottom(tmpScrollFromBottom);

                const decrypted = await decryptAllMessages(data.data);
                setLocalMessages((prev) => [...decrypted.reverse(), ...prev]);
            });
    }, [localMessages, noMoreMessages]);

    const onAttachmentClick = (attachments, ind) => {
        setPreviewAttachment({ attachments, ind });
        setShowAttachmentPreview(true);
    };

    useEffect(() => {
        ensureKeyPair();

        setTimeout(() => {
            if (messagesCtrRef.current) {
                messagesCtrRef.current.scrollTop =
                    messagesCtrRef.current.scrollHeight;
            }
        }, 10);

        const offCreated = on("message.created", messageCreated);
        const offDeleted = on("message.deleted", messageDeleted);
        setScrollFromBottom(0);
        setNoMoreMessages(false);

        return () => {
            offCreated();
            offDeleted();
        };
    }, [selectedConversation]);

    useEffect(() => {
        if (!messages) return;

        (async () => {
            const decrypted = await decryptAllMessages(messages.data);
            setLocalMessages(decrypted.reverse());
        })();
    }, [messages]);

    useEffect(() => {
        if (messagesCtrRef.current && scrollFromBottom !== null) {
            messagesCtrRef.current.scrollTop =
                messagesCtrRef.current.scrollHeight -
                messagesCtrRef.current.offsetHeight -
                scrollFromBottom;
        }

        if (noMoreMessages) return;

        const observer = new IntersectionObserver(
            (entries) =>
                entries.forEach((entry) => entry.isIntersecting && loadMoreMessages()),
            { rootMargin: "0px 0px 250px 0px" }
        );

        if (loadMoreIntersect.current) {
            setTimeout(() => observer.observe(loadMoreIntersect.current), 100);
        }

        return () => observer.disconnect();
    }, [localMessages]);

    return (
        <>
            {!messages && (
                <div className="flex flex-col gap-8 justify-center items-center text-center h-full opacity-35">
                    <div className="text-2xl md:text-4xl text-base-content">
                        Please select conversation to see messages
                    </div>
                    <ChatBubbleLeftRightIcon className="w-32 h-32 inline-block text-base-content" />
                </div>
            )}
            {messages && (
                <>
                    <ConversationHeader selectedConversation={selectedConversation} />
                    <div ref={messagesCtrRef} className="flex-1 overflow-y-auto p-5 bg-base-100">
                        {localMessages.length === 0 && (
                            <div className="flex justify-center items-center h-full">
                                <div className="text-lg text-base-content">No messages found</div>
                            </div>
                        )}
                        {localMessages.length > 0 && (
                            <div className="flex-1 flex flex-col">
                                <div ref={loadMoreIntersect}></div>
                                {localMessages.map((message) => (
                                    <MessageItem
                                        key={message.id}
                                        message={message}
                                        decrypted={message.decrypted}
                                        attachmentClick={onAttachmentClick}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                    <MessageInput conversation={selectedConversation} />
                </>
            )}

            {previewAttachment.attachments && (
                <AttachmentPreviewModal
                    attachments={previewAttachment.attachments}
                    index={previewAttachment.ind}
                    show={showAttachmentPreview}
                    onClose={() => setShowAttachmentPreview(false)}
                />
            )}
        </>
    );

}

Home.layout = (page) => (
    <AuthenticatedLayout user={page.props.auth.user}>
        <ChatLayout children={page} />
    </AuthenticatedLayout>
);

export default Home;
