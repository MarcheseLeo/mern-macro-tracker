import { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

export const BarcodeScanner = ({ onScanSuccess, onClose }) => {
    const scannerRef = useRef(null);

    useEffect(() => {
        const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
        scanner.render(
            (decodedText) => {
                scanner.clear()
                onScanSuccess(decodedText);
            },
            (error) => { /* Errori */ }
        );
        return () => scanner.clear();
    }, [onScanSuccess]);

    return (
        <div className="p-3">
            <div id="reader" style={{ width: '100%' }}></div>
            <button className="btn btn-secondary w-100 mt-3" onClick={onClose}>Chiudi Scanner</button>
        </div>
    );
};