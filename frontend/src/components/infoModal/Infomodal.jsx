import React from 'react';
import Button from '../ui/button/Button';

export const InfoModal = ({ show, onHide, title, description, icon: Icon, onConfirm, confirmText = "Confirm", isDanger = false}) => {
    if (!show) return null;

    return (
        <div className="modal-backdrop d-flex justify-content-center align-items-center"
            style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', zIndex: 1050 }}>

            <div
                className="card rounded-4 p-4 shadow-lg text-center"
                style={{
                    maxWidth: '400px',
                    margin: '1rem',
                    backgroundColor: 'var(--card)',
                    color: 'var(--card-foreground)',
                    border: '1px solid var(--border)'
                }}
            >
                
                {Icon && (
                    <div
                        className="mx-auto mb-3 d-flex justify-content-center align-items-center rounded-circle"
                        style={{
                            width: '60px',
                            height: '60px',
                            color: 'var(--primary)',
                            backgroundColor: 'var(--accent)'
                        }}
                    >
                        <Icon size={30} />
                    </div>
                )}

                <h4 className="fw-bold font-heading">{title}</h4>
                <p className="small" style={{ color: 'var(--muted-foreground)' }}>
                    {description}
                </p>

                {onConfirm ? (
                    <div className="d-flex gap-2 mt-3">
                        <Button variant="outline" className="w-50 rounded-pill" onClick={onHide}>
                            Cancel
                        </Button>
                        <button 
                            className={`btn ${isDanger ? 'btn-danger' : 'btn-primary'} w-50 rounded-pill`} 
                            onClick={onConfirm}
                        >
                            {confirmText}
                        </button>
                    </div>
                ) : (
                    <Button variant="default" className="w-100 rounded-pill mt-2" onClick={onHide}>
                        Got it
                    </Button>
                )}
            </div>
        </div>
    );
};

