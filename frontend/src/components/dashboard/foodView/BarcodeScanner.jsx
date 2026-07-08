import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';

export const BarcodeScanner = ({ onScanSuccess, onClose }) => {
    const scanHandledRef = useRef(false);
    const html5QrCodeRef = useRef(null);
    const [camError, setCamError] = useState(null);

    const onScanSuccessRef = useRef(onScanSuccess);
    useEffect(() => {
        onScanSuccessRef.current = onScanSuccess;
    }, [onScanSuccess]);

    useEffect(() => {
        let isMounted = true; 
        const html5QrCode = new Html5Qrcode("reader");
        html5QrCodeRef.current = html5QrCode;

        const config = {
            fps: 15,
            formatsToSupport: [
                Html5QrcodeSupportedFormats.EAN_13,
                Html5QrcodeSupportedFormats.EAN_8,
                Html5QrcodeSupportedFormats.UPC_A,
                Html5QrcodeSupportedFormats.UPC_E,
            ],
            videoConstraints: {
                width: { ideal: 1280, min: 640 },
                advanced: [{ focusMode: "continuous" }]
            }
        };

        Html5Qrcode.getCameras().then(devices => {
            if (!isMounted) return;

            if (devices && devices.length > 0) {

                console.log("Found cams:", devices);

                let cameraId = devices[0].id; 
                const mainBackCamera = devices.find(device => 
                    device.label.toLowerCase().includes('back') && device.label.includes('0')
                ) || devices.find(device => 
                    device.label.toLowerCase().includes('back') || device.label.toLowerCase().includes('posteriore')
                );

                if (mainBackCamera) {
                    cameraId = mainBackCamera.id;
                } else if (devices.length > 1) {
                    cameraId = devices[devices.length - 1].id;
                }
                html5QrCode.start(
                    cameraId, 
                    config,
                    (decodedText) => {
                        if (!scanHandledRef.current) {
                            scanHandledRef.current = true;
                            html5QrCode.pause();
                            onScanSuccessRef.current(decodedText);
                        }
                    },
                    (errorMessage) => { }
                ).catch(handleCamError);

            } else {
                setCamError("No cam found on device");
            }
        }).catch(handleCamError);

        function handleCamError(err) {
            console.error("Cam error:", err);
            const errMsg = typeof err === 'string' ? err : (err?.message || "Unknown cam error");
            if (isMounted) setCamError(errMsg);
        }

        return () => {
            isMounted = false;
            if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
                html5QrCodeRef.current.stop().then(() => {
                    html5QrCodeRef.current.clear();
                }).catch((err) => console.error("Failed to clear scanner.", err));
            }
        };
    }, []);

    return (
        <div className="p-3 d-flex flex-column h-100 align-items-center justify-content-center gap-3">
            
            <div className="scanner-container mt-4 mb-3">
                <div id="reader"></div>
                
                {!camError && (
                    <div className="scanner-overlay">
                        <div className="scanner-reticle">
                            <span className="reticle-bottom-corners"></span>
                            <div className="scanner-laser"></div>
                        </div>
                    </div>
                )}
            </div>

            {camError ? (
                <div className="alert alert-danger w-100 text-center small radius-2xl mb-auto">
                    <strong>Impossibile avviare la fotocamera:</strong><br/>
                </div>
            ) : (
                <p className="text-muted small text-center mb-auto px-4">
                    Point your camera at a barcode to log it instantly.
                </p>
            )}

            <button className="btn btn-light w-100 mt-auto fw-bold" onClick={onClose}>
                Cancel Scan
            </button>
        </div>
    );
};