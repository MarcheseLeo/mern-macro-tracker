import React from 'react';
import { Mail } from 'lucide-react';
import Button from '../ui/button/Button';

export const VerifyEmailModal = ({ show, onHide, email }) => {
    if (!show) return null;

    return (
        <div className="modal-backdrop d-flex justify-content-center align-items-center"
            style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', zIndex: 1050 }}>

            <div className="card border-0 rounded-4 p-4 shadow-lg text-center" style={{ maxWidth: '400px', margin: '1rem' }}>
                <div className="mx-auto mb-3 d-flex justify-content-center align-items-center rounded-circle bg-primary-subtle"
                    style={{ width: '60px', height: '60px', color: 'var(--primary)' }}>
                    <Mail size={30} />
                </div>

                <h4 className="fw-bold font-heading">Verify your email</h4>
                <p className="text-muted small">
                    We've sent a verification link to <b>{email}</b>.
                    Please check your inbox and click the link to activate your account.
                </p>

                <Button variant="default" className="w-100 rounded-pill mt-2" onClick={onHide}>
                    Got it
                </Button>
            </div>
        </div>
    );
};