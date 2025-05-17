import {
    PaperClipIcon,
    ArrowDownCircleIcon,
    PlayCircleIcon,
} from "@heroicons/react/24/solid";
import { isAudio, isImage, isPDF, isPreviewable, isVideo } from "@/helper";

// Renders a preview of message attachments: images, videos, audio, PDFs, and others
const MessageAttachments = ({ attachments, attachmentClick }) => {
    return (
        <>
            {attachments.length > 0 && (
                // Container for all attachments
                <div className="mt-2 flex flex-wrap justify-end gap-1">
                    {attachments.map((attachment, ind) => (
                        // Each attachment wrapper
                        <div
                            onClick={(ev) => attachmentClick(attachments, ind)}
                            key={attachment.id}
                            className={
                                `group flex flex-col items-center justify-center text-base-content/50 relative cursor-pointer ` +
                                (isAudio(attachment)
                                    ? "w-84"
                                    : "w-32 aspect-square bg-base-300")
                            }
                        >
                            {/* Download button (shown for all except audio) */}
                            {!isAudio(attachment) && (
                                <a
                                    onClick={(ev) => ev.stopPropagation()}
                                    download
                                    href={attachment.url}
                                    className="z-20 opacity-100 group-hover:opacity-100 transition-all w-8 h-8 flex items-center justify-center text-base-content bg-base-300 rounded absolute right-0 top-0 cursor-pointer hover:bg-base-200"
                                >
                                    <ArrowDownCircleIcon className="w-4 h-4" />
                                </a>
                            )}

                            {/* Show image preview */}
                            {isImage(attachment) && (
                                <img
                                    src={attachment.url}
                                    alt={attachment.name}
                                    className="aspect-square object-contain"
                                />
                            )}

                            {/* Show video preview with overlay */}
                            {isVideo(attachment) && (
                                <div className="relative flex justify-center items-center">
                                    <PlayCircleIcon className="z-20 absolute w-16 h-16 text-base-content opacity-70" />
                                    <div className="absolute left-0 top-0 w-full h-full bg-base-300/80 z-10"></div>
                                    <video src={attachment.url}></video>
                                </div>
                            )}

                            {/* Audio player */}
                            {isAudio(attachment) && (
                                <div className="relative flex justify-center items-center">
                                    <audio
                                        src={attachment.url}
                                        controls
                                    ></audio>
                                </div>
                            )}

                            {/* PDF viewer using iframe */}
                            {isPDF(attachment) && (
                                <div className="relative flex justify-center items-center">
                                    <div className="absolute left-0 top-0 right-0 bottom-0"></div>
                                    <iframe
                                        src={attachment.url}
                                        className="w-full h-full"
                                    ></iframe>
                                </div>
                            )}

                            {/* Generic file (not previewable) */}
                            {!isPreviewable(attachment) && (
                                <a
                                    onClick={(ev) => ev.stopPropagation()}
                                    download
                                    href={attachment.url}
                                    className="flex flex-col justify-center items-center"
                                >
                                    <PaperClipIcon className="w-10 h-10 mb-3" />
                                    <small className="text-center">{attachment.name}</small>
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default MessageAttachments;
