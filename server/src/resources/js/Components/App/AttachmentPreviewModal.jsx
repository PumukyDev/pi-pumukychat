import { Fragment, useEffect, useMemo, useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import {
    PaperClipIcon,
    XMarkIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from "@heroicons/react/24/solid";
import { isAudio, isImage, isPDF, isPreviewable, isVideo } from "@/helper";

const AttachmentPreviewModal = ({
    attachments,
    index,
    show = false,
    onClose = () => {},
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const previewableAttachments = useMemo(() => {
        return attachments.filter((attachment) => isPreviewable(attachment));
    }, [attachments]);

    const attachment = useMemo(() => {
        return previewableAttachments[currentIndex];
    }, [attachments, currentIndex]);

    const close = () => {
        onClose();
    };

    const prev = () => {
        if (currentIndex === 0) return;
        setCurrentIndex(currentIndex - 1);
    };

    const next = () => {
        if (currentIndex === previewableAttachments.length - 1) return;
        setCurrentIndex(currentIndex + 1);
    };

    useEffect(() => {
        setCurrentIndex(index);
    }, [index]);

    return (
        <Dialog open={show} as="div" className="relative z-50" onClose={close}>
            <div className="fixed inset-0 bg-base-300/80 h-full w-full z-10">
                <div className="flex min-h-full max-w-full items-center justify-center p-4">
                    <DialogPanel
                        transition
                        className="flex flex-col w-full h-full max-w-[95vw] max-h-[95vh] transform overflow-hidden bg-base-200 p-6 backdrop-blur-lg text-base-content shadow-xl rounded-xl"
                    >
                        {/* Close button */}
                        <button
                            onClick={close}
                            className="absolute right-3 top-3 w-10 h-10 rounded-full hover:bg-base-300 transition flex items-center justify-center text-base-content z-40"
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>

                        <div className="relative group h-full">
                            {/* Left arrow navigation */}
                            {currentIndex > 0 && (
                                <div
                                    onClick={prev}
                                    className="absolute text-base-content cursor-pointer flex items-center justify-center w-16 h-16 left-4 top-1/2 -translate-y-1/2 rounded-full bg-base-300/80 z-30"
                                >
                                    <ChevronLeftIcon className="w-12" />
                                </div>
                            )}
                            {/* Right arrow navigation */}
                            {currentIndex <
                                previewableAttachments.length - 1 && (
                                <div
                                    onClick={next}
                                    className="absolute text-base-content cursor-pointer flex items-center justify-center w-16 h-16 right-4 top-1/2 -translate-y-1/2 rounded-full bg-base-300/80 z-30"
                                >
                                    <ChevronRightIcon className="w-12" />
                                </div>
                            )}

                            {/* Attachment preview area */}
                            {attachment && (
                                <div className="flex items-center justify-center w-full h-full p-3">
                                    {isImage(attachment) && (
                                        <img
                                            src={attachment.url}
                                            className="max-w-full max-h-[80vh] object-contain"
                                        />
                                    )}
                                    {isVideo(attachment) && (
                                        <div className="flex items-center max-w-full max-h-[80vh]">
                                            <video
                                                src={attachment.url}
                                                controls
                                                autoPlay
                                                className="max-w-full max-h-full"
                                            ></video>
                                        </div>
                                    )}
                                    {isAudio(attachment) && (
                                        <div className="relative flex justify-center items-center w-full">
                                            <audio
                                                src={attachment.url}
                                                controls
                                                autoPlay
                                            ></audio>
                                        </div>
                                    )}
                                    {isPDF(attachment) && (
                                        <div className="flex items-center justify-center w-full h-full overflow-hidden">
                                            <div className="w-full max-w-[90vw] max-h-[80vh] aspect-video">
                                                <iframe
                                                    src={attachment.url}
                                                    className="w-full h-full rounded"
                                                    style={{ border: "none" }}
                                                ></iframe>
                                            </div>
                                        </div>
                                    )}
                                    {!isPreviewable(attachment) && (
                                        <div className="p-32 flex flex-col justify-center items-center text-base-content opacity-80">
                                            <PaperClipIcon className="w-10 h-10 mb-3" />
                                            <small>{attachment.name}</small>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
};

export default AttachmentPreviewModal;
