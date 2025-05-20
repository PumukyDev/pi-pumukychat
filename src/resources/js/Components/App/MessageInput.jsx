import { useState, useEffect } from "react";
import {
    PaperClipIcon,
    PhotoIcon,
    FaceSmileIcon,
    HandThumbUpIcon,
    PaperAirplaneIcon,
    XCircleIcon,
} from "@heroicons/react/24/solid";
import NewMessageInput from "./NewMessageInput";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import {
    Popover,
    PopoverButton,
    PopoverPanel,
} from "@headlessui/react";
import { isAudio, isImage } from "@/helper";
import AttachmentPreview from "./AttachmentPreview";
import CustomAudioPlayer from "./CustomAudioPlayer";
import AudioRecorder from "./AudioRecorder";
import { useEventBus } from "@/EventBus";
import { usePage } from "@inertiajs/react";

export default function MessageInput({ conversation = null }) {
    const [newMessage, setNewMessage] = useState("");
    const [inputErrorMessage, setInputErrorMessage] = useState("");
    const [messageSending, setMessageSending] = useState(false);
    const [chosenFiles, setChosenFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [emojiTheme, setEmojiTheme] = useState("light");
    const { emit } = useEventBus();
    const currentUser = usePage().props.auth.user;

    useEffect(() => {
        const darkThemes = ["pumukyChatTheme"];

        const getTheme = () => {
            const theme = document.documentElement.getAttribute("data-theme");
            return darkThemes.includes(theme) ? "dark" : "light";
        };

        setEmojiTheme(getTheme());

        const observer = new MutationObserver(() => {
            setEmojiTheme(getTheme());
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["data-theme"],
        });

        return () => observer.disconnect();
    }, []);

    const onFileChange = (ev) => {
        const files = ev.target.files;
        const updatedFiles = [...files].map((file) => ({
            file: file,
            url: URL.createObjectURL(file),
        }));
        setChosenFiles((prevFiles) => [...prevFiles, ...updatedFiles]);
    };

    const fetchPublicKey = async (userId) => {
        const res = await fetch(`/api/users/${userId}/public-key`);
        const pem = await res.text();
        const b64 = pem.replace(/-----.*-----/g, "").replace(/\n/g, "");
        const binary = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
        return crypto.subtle.importKey(
            "spki",
            binary.buffer,
            { name: "RSA-OAEP", hash: "SHA-256" },
            true,
            ["encrypt"]
        );
    };

    const generateAESKey = () => crypto.subtle.generateKey(
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
    );

    const encryptWithAES = async (key, text) => {
        const encoder = new TextEncoder();
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const ciphertext = await crypto.subtle.encrypt(
            { name: "AES-GCM", iv },
            key,
            encoder.encode(text)
        );
        return {
            iv: btoa(String.fromCharCode(...iv)),
            content: btoa(String.fromCharCode(...new Uint8Array(ciphertext)))
        };
    };

    const exportAndEncryptAESKey = async (aesKey, publicKey) => {
        const rawKey = await crypto.subtle.exportKey("raw", aesKey);
        const encrypted = await crypto.subtle.encrypt(
            { name: "RSA-OAEP" },
            publicKey,
            rawKey
        );
        return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
    };

    const onSend = async () => {
        if (messageSending) return;
        if (newMessage.trim() === "" && chosenFiles.length === 0) {
            setInputErrorMessage("Please type a message or attach a file");
            setTimeout(() => setInputErrorMessage(""), 3000);
            return;
        }

        setMessageSending(true);

        try {
            const aesKey = await generateAESKey();
            const encrypted = await encryptWithAES(aesKey, newMessage);
            const encryptedMessage = `${encrypted.iv}:${encrypted.content}`;

            const formData = new FormData();
            chosenFiles.forEach((file) => {
                formData.append("attachments[]", file.file);
            });
            formData.append("message", encryptedMessage);
            formData.append("plain_message", newMessage);

            if (conversation.is_user) {
                const senderKey = await fetchPublicKey(currentUser.id);
                const receiverKey = await fetchPublicKey(conversation.id);

                const keyForSender = await exportAndEncryptAESKey(aesKey, senderKey);
                const keyForReceiver = await exportAndEncryptAESKey(aesKey, receiverKey);

                formData.append("receiver_id", conversation.id);
                formData.append("encrypted_key_for_sender", keyForSender);
                formData.append("encrypted_key_for_receiver", keyForReceiver);
            }

            if (conversation.is_group) {
                formData.append("group_id", conversation.id);
                const keys = {};

                for (const member of conversation.members) {
                    const pubKey = await fetchPublicKey(member.id);
                    const encryptedKey = await exportAndEncryptAESKey(aesKey, pubKey);
                    keys[member.id] = encryptedKey;
                }

                Object.entries(keys).forEach(([userId, encryptedKey]) => {
                    formData.append(`keys[${userId}]`, encryptedKey);
                });
            }

            await axios.post(route("message.store"), formData, {
                onUploadProgress: (e) => {
                    setUploadProgress(Math.round((e.loaded / e.total) * 100));
                },
            });

            setNewMessage("");
            setChosenFiles([]);
            setUploadProgress(0);

        } catch (err) {
            console.error("❌ Encryption failed", err);
            setInputErrorMessage("Encryption error: " + err.message);
        } finally {
            setMessageSending(false);
        }
    };

    const onLikeClick = () => {
        if (messageSending) return;

        const data = { message: "👍" };

        if (conversation.is_user) {
            data["receiver_id"] = conversation.id;
        } else if (conversation.is_group) {
            data["group_id"] = conversation.id;
        }

        axios.post(route("message.store"), data);
    };

    const recordedAudioReady = (file, url) => {
        setChosenFiles((prevFiles) => [...prevFiles, { file, url }]);
    };

    return (
        <div className="flex flex-wrap items-start border-t border-base-300 py-3">
            <div className="order-2 flex-1 xs:flex-none xs:order-1 p-2">
                <button className="p-1 text-base-content/70 hover:text-base-content transition relative">
                    <PaperClipIcon className="w-6" />
                    <input type="file" multiple onChange={onFileChange} className="absolute left-0 right-0 bottom-0 z-20 opacity-0 cursor-pointer" />
                </button>
                <button className="p-1 text-base-content/70 hover:text-base-content transition relative">
                    <PhotoIcon className="w-6" />
                    <input type="file" multiple accept="image/*" onChange={onFileChange} className="absolute left-0 right-0 bottom-0 z-20 opacity-0 cursor-pointer" />
                </button>
                <AudioRecorder fileReady={recordedAudioReady} className="p-1 text-base-content/70 hover:text-base-content transition" />
            </div>

            <div className="order-1 px-3 xs:p-0 min-w-[220px] basis-full xs:basis-0 xs:order-2 flex-1 relative">
                <div className="flex">
                    <NewMessageInput
                        value={newMessage}
                        onSend={onSend}
                        onChange={(ev) => setNewMessage(ev.target.value)}
                    />
                    <button
                        onClick={onSend}
                        disabled={messageSending}
                        className="btn rounded-l-none bg-base-300 text-base-content hover:bg-base-200 border border-base-300"
                    >
                        {messageSending && <span className="loading loading-spinner loading-xs"></span>}
                        <PaperAirplaneIcon className="w-6" />
                        <span className="hidden sm:inline">Send</span>
                    </button>
                </div>

                {!!uploadProgress && (
                    <progress className="progress progress-info w-full" value={uploadProgress} max="100"></progress>
                )}

                {inputErrorMessage && (
                    <p className="text-xs text-error">{inputErrorMessage}</p>
                )}

                <div className="flex flex-wrap gap-1 mt-2">
                    {chosenFiles.map((file) => (
                        <div key={file.file.name} className={
                            "relative justify-between cursor-pointer " +
                            (!isImage(file.file) ? "w-[240px]" : "")
                        }>
                            {isImage(file.file) && (
                                <img src={file.url} alt="Preview" className="w-16 h-16 object-cover" />
                            )}
                            {isAudio(file.file) && (
                                <CustomAudioPlayer file={file} showVolume={false} />
                            )}
                            {!isAudio(file.file) && !isImage(file.file) && (
                                <AttachmentPreview file={file} />
                            )}
                            <button onClick={() => {
                                setChosenFiles(chosenFiles.filter(f => f.file.name !== file.file.name));
                            }} className="absolute w-6 h-6 rounded-full bg-base-300 -right-2 -top-2 text-base-content hover:text-primary z-10">
                                <XCircleIcon className="w-6" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="order-3 xs:order-3 p-2 flex">
                <Popover className="relative">
                    <PopoverButton className="p-1 text-base-content/70 hover:text-base-content transition">
                        <FaceSmileIcon className="w-6 h-6" />
                    </PopoverButton>
                    <PopoverPanel transition className="absolute z-10 right-0 bottom-full max-h-[300px] w-[90vw] max-w-xs overflow-y-auto rounded-xl shadow-lg">
                        <EmojiPicker
                            theme={emojiTheme}
                            onEmojiClick={(emojiData) => setNewMessage((prev) => prev + emojiData.emoji)}
                            width="100%"
                        />
                    </PopoverPanel>
                </Popover>
            </div>
        </div>
    );
}
