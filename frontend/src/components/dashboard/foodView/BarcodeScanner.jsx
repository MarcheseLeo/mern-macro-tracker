import React, { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';


export const BarcodeScanner = ({ onScanSuccess, onClose }) => {
    const scanHandledRef = useRef(false);
    const onScanSuccessRef = useRef(onScanSuccess);

    useEffect(() => {
        onScanSuccessRef.current = onScanSuccess;
    }, [onScanSuccess]);

    useEffect(() => {

        const scanner = new Html5QrcodeScanner(
            "reader", 
            { 
                fps: 10,
            },
            false
        );

        scanner.render(
            (decodedText) => {
                if (!scanHandledRef.current) {
                    scanHandledRef.current = true;
                    scanner.pause(true);
                    onScanSuccessRef.current(decodedText);
                }
            },
            (error) => { }
        );

        return () => {
            scanner.clear().catch(error => {
                console.error("Failed to clear html5QrcodeScanner. ", error);
            });
        }
    }, []);

    return (
        <div className="p-3 d-flex flex-column h-100 align-items-center justify-content-center">
            
            <div className="scanner-container mt-4 mb-3">
                {}
                <div id="reader"></div>
                
                {}
                <div className="scanner-overlay">
                    <div className="scanner-reticle">
                        <span className="reticle-bottom-corners"></span>
                        <div className="scanner-laser"></div>
                    </div>
                </div>
            </div>

            <p className="text-muted small text-center mb-auto px-4">
                Point your camera at a barcode to log it instantly.
            </p>

            <button className="btn btn-light w-100 mt-auto fw-bold" onClick={onClose}>
                Cancel Scan
            </button>
        </div>
    );
};