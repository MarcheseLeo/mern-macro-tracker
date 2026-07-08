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
            { fps: 10, qrbox: { width: 250, height: 250 } },
            false
        );

        scanner.render(
            (decodedText) => {
                if (!scanHandledRef.current) {
                    scanHandledRef.current = true
                    scanner.pause(true)
                    onScanSuccessRef.current(decodedText);
                }
            },
            (error) => { }
        );

        return () => {
            scanner.clear().catch(error => {
                console.error("Failed to clear html5QrcodeScanner. ", error);
            })
        }
    }, []);

    return (
        <div className="p-3 d-flex flex-column h-100">
            <div id="reader" style={{ width: '100%', borderRadius: '1rem', overflow: 'hidden' }}></div>
            <button className="btn btn-light w-100 mt-auto fw-bold" onClick={onClose}>
                Cancel Scan
            </button>
        </div>
    );
};