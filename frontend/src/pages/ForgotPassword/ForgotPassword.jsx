import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Loader2 } from 'lucide-react';
import Button from '../../components/ui/button/Button';
import api from '../../services/api';
import { BlurredBackground } from '../../components/ui/blurredBackground/BlurredBackground';
import { Logo } from '../../components/logo/Logo';


export const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState({ loading: false, message: '', error: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, message: '', error: '' });
        try {
            const res = await api.post('/auth/forgot-password', { email });
            setStatus({ loading: false, message: res.data.message, error: '' });
        } catch (err) {
            setStatus({ loading: false, message: '', error: err.response?.data?.message || 'Error sending request' });
        }
    };

    return (
        <main className="d-flex flex-column justify-content-center align-items-center min-vh-100 px-3 position-relative">
            <BlurredBackground />
            <div className='my-4'>
                <Logo />
            </div>
            <div className="card border-0 radius-3xl shadow-soft bg-white p-4 w-100 z-1" style={{ maxWidth: '400px' }}>
                <h2 className="h4 fw-bold tracking-tight font-heading mb-1 text-dark">Reset Password</h2>
                <p className="small text-muted-foreground">Enter your email and we'll send you a reset link.</p>

                {status.message && <div className="alert alert-success small py-2">{status.message}</div>}
                {status.error && <div className="alert alert-danger small py-2">{status.error}</div>}

                <form onSubmit={handleSubmit} className="d-flex flex-column gap-3 mt-3 recovery-form">
                    <div className="input-group soft-input-group">
                        <span className="input-group-text border-end-0 pe-2"><Mail size={18} /></span>
                        <input type="email" className="form-control border-start-0 ps-0" placeholder="example@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <Button type="submit" disabled={status.loading} className="w-100 rounded-pill py-2">
                        {status.loading ? <Loader2 className="animate-spin" size={20} /> : 'Send Reset Link'}
                    </Button>
                </form>

            </div>
            <div className="mt-4 text-center">
                <Button asChild variant="ghost" className="rounded-pill text-muted-foreground small">
                    <Link to="/login">← Back to login</Link>
                </Button>
            </div>
        </main>
    );
};