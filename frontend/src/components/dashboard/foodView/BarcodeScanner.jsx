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

        html5QrCode.start(
            { facingMode: "environment" }, 
            config, 
            (decodedText) => {
                if (!scanHandledRef.current) {
                    scanHandledRef.current = true;
                    html5QrCode.pause();
                    onScanSuccessRef.current(decodedText);
                }
            },
            (errorMessage) => { }
        ).catch((err) => {
            console.error("Errore fotocamera:", err);
            const errMsg = typeof err === 'string' ? err : (err?.message || "Unknown camera error");
            setCamError(errMsg);
        })

        return () => {
            if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
                html5QrCodeRef.current.stop().then(() => {
                    html5QrCodeRef.current.clear()
                }).catch((err) => console.error("Failed to clear scanner.", err))
            }
        }
    }, [])


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
                    <strong>Not possible to start camera</strong><br />
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