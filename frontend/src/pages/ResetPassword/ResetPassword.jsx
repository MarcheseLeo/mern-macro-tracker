import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Lock, Loader2 } from 'lucide-react';
import Button from '../../components/ui/button/Button';
import api from '../../services/api';
import { BlurredBackground } from '../../components/ui/blurredBackground/BlurredBackground';
import { Logo } from '../../components/logo/Logo';

export const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState({ loading: false, message: '', error: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, message: '', error: '' });
        try {
            const res = await api.post('/auth/reset-password', { token, newPassword: password });
            setStatus({ loading: false, message: res.data.message, error: '' });
        } catch (err) {
            setStatus({ loading: false, message: '', error: err.response?.data?.message || 'Invalid or expired token' });
        }
    };

    if (!token) return <div className="text-center mt-5">Invalid reset link.</div>;

    return (
        <main className="d-flex flex-column justify-content-center align-items-center min-vh-100 px-3 position-relative">
            <BlurredBackground/>
            <div className='mb-4'>
                <Logo/>
            </div>
            <div className="card border-0 radius-3xl shadow-soft bg-white p-4 w-100 z-1" style={{ maxWidth: '400px' }}>
                <h2 className="h4 fw-bold tracking-tight font-heading mb-1 text-dark">New Password</h2>
                <p className="small text-muted-foreground">Create a new secure password for your account.</p>

                {status.message ? (
                    <div className="text-center">
                        <div className="alert alert-success small py-2">{status.message}</div>
                        <Button asChild className="rounded-pill px-4 mt-2"><Link to="/login">Go to Login</Link></Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="d-flex flex-column gap-3 mt-3 recovery-form">
                        {status.error && <div className="alert alert-danger small py-2">{status.error}</div>}
                        <div className="input-group soft-input-group">
                            <span className="input-group-text bg-white border-end-0 pe-2"><Lock size={18} /></span>
                            <input type="password" minLength="8" className="form-control border-start-0 ps-0" placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <Button type="submit" disabled={status.loading} className="w-100 rounded-pill py-2 mt-2">
                            {status.loading ? <Loader2 className="animate-spin" size={20} /> : 'Save Password'}
                        </Button>
                    </form>
                )}
            </div>
        </main>
    );
};