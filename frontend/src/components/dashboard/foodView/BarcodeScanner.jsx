import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { Camera, ChevronDown } from 'lucide-react';

export const BarcodeScanner = ({ onScanSuccess, onClose }) => {
    const html5QrCodeRef = useRef(null)
    const scanHandledRef = useRef(false)
    const [cameras, setCameras] = useState([]);
    const [selectedCameraId, setSelectedCameraId] = useState(null);
    const [camError, setCamError] = useState(null)

    const onScanSuccessRef = useRef(onScanSuccess)
    useEffect(() => {
        onScanSuccessRef.current = onScanSuccess
    }, [onScanSuccess]);
    useEffect(() => {
        Html5Qrcode.getCameras().then(devices => {
            if (devices && devices.length > 0) {
                setCameras(devices);

                const backCam = devices.find(device =>
                    device.label.toLowerCase().includes('back') ||
                    device.label.toLowerCase().includes('posteriore')
                )


                setSelectedCameraId(backCam ? backCam.id : devices[devices.length - 1].id);
            } else {
                setCamError("No camera found on device.")
            }
        }).catch(err => {
            console.error("Error getting cameras:", err)
            setCamError("Camera permissions denied. Allow and reload.")
        });
    }, []);

    useEffect(() => {
        let isMounted = true;

        if (!selectedCameraId) return;

        const html5QrCode = new Html5Qrcode("reader");
        html5QrCodeRef.current = html5QrCode;
        scanHandledRef.current = false;

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
            selectedCameraId,
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
            console.error("Camera boot error:", err);
            if (isMounted) setCamError(err?.message || "Unknown camera error");
        });

        return () => {
            isMounted = false;
            if (html5QrCode.isScanning) {
                html5QrCode.stop().then(() => {
                    html5QrCode.clear();
                }).catch(console.error);
            } else {
                html5QrCode.clear();
            }
        };
    }, [selectedCameraId]);

    const handleCameraChange = (e) => {
        setSelectedCameraId(e.target.value);
    };

    return (
        <div className="p-3 d-flex flex-column h-100 align-items-center justify-content-center">

            {cameras.length > 0 && !camError && (
                <div className="camera-select-wrapper mt-3">
                    <select
                        className="custom-camera-select text-truncate"
                        value={selectedCameraId || ''}
                        onChange={handleCameraChange}
                    >
                        {cameras.map(camera => (
                            <option key={camera.id} value={camera.id}>
                                {camera.label || `Camera ${camera.id.substring(0, 5)}...`}
                            </option>
                        ))}
                    </select>
                    <ChevronDown size={20} className="camera-select-icon" />
                </div>
            )}

            <div className="scanner-container mb-3">
                <div id="reader"></div>

                {!camError && selectedCameraId && (
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
                    <strong>Impossibile avviare:</strong><br />{camError}
                </div>
            ) : (
                <p className="text-muted small text-center mb-auto px-4 d-flex align-items-center justify-content-center gap-2">
                    <Camera size={16} /> Point at a barcode
                </p>
            )}

            <button className="btn btn-light w-100 mt-auto fw-bold" onClick={onClose}>
                Cancel Scan
            </button>
        </div>
    );
};