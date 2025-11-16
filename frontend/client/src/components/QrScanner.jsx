import React, {useEffect, useRef} from "react";
import {BrowserQRCodeReader} from "@zxing/browser";

export default function QrScanner({onScan, onClose}) {
    const videoRef = useRef(null);
    const controlsRef = useRef(null);

    const stopCamera = () => {
        try {
            if (controlsRef.current?.stop) {
                controlsRef.current.stop();
            }
        } catch (err) {
            console.warn("ZXing stop warning:", err)
        }

        const video = videoRef.current;
        if (video && video.srcObject) {
            video.srcObject.getTracks().forEach((track) => track.stop());
            video.srcObject = null;
        }
    };

    useEffect(() => {
        const startScanner = async () => {
            try {
                const reader = new BrowserQRCodeReader();

                const controls = await reader.decodeFromVideoDevice(
                    null,
                    videoRef.current,
                    (result) => {
                        if (result) {
                            onScan(result.getText());
                            stopCamera();
                            setTimeout(onClose, 100);
                        }
                    }
                );
                controlsRef.current = controls;
            } catch (err) {
                console.error("Camera error:", err);

                stopCamera();
                setTimeout(onClose, 100);
            }
        };

        startScanner();
        

        return () => stopCamera();
    }, []);

    return (
        <video
            ref={videoRef}
            autoPlay
            style={{width: "260px", borderRadius: "8px"}}
        ></video>
    )
}