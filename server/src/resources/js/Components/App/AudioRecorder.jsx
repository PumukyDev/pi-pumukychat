import { MicrophoneIcon, StopCircleIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

const AudioRecorder = ({ fileReady }) => {
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [recording, setRecording] = useState(false);

    // Handle click on microphone or stop icon
    const onMicrophoneClick = async () => {
        if (recording) {
            // Stop recording
            setRecording(false);
            if (mediaRecorder) {
                mediaRecorder.stop();
                setMediaRecorder(null);
            }
            return;
        }

        // Start recording
        setRecording(true);
        try {
            // Request access to microphone
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });

            const newMediaRecorder = new MediaRecorder(stream);
            const chunks = [];

            // Save audio chunks as they are recorded
            newMediaRecorder.addEventListener("dataavailable", (event) => {
                chunks.push(event.data);
            });

            // When recording stops, create a File and notify parent
            newMediaRecorder.addEventListener("stop", () => {
                let audioBlob = new Blob(chunks, {
                    type: "audio/ogg; codecs=opus",
                });
                let audioFile = new File([audioBlob], "recorded_audio.ogg", {
                    type: "audio/ogg; codecs=opus",
                });

                const url = URL.createObjectURL(audioFile);

                // Send file and preview URL to parent
                fileReady(audioFile, url);
            });

            // Start recording
            newMediaRecorder.start();
            setMediaRecorder(newMediaRecorder);
        } catch (error) {
            setRecording(false);
            console.error("Error accessing microphone", error);
        }
    };

    return (
        // Toggle button to start/stop recording
        <button
            onClick={onMicrophoneClick}
            className="p-1 text-base-content/70 hover:text-base-content transition"
        >
            {recording && <StopCircleIcon className="w-6 text-error" />}
            {!recording && <MicrophoneIcon className="w-6" />}
        </button>
    );
}

export default AudioRecorder;
