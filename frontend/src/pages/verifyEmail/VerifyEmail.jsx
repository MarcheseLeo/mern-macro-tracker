import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Loader2, CheckCircle2, XCircle, Home } from 'lucide-react';
import Button from '../../components/ui/button/Button'
import './VerifyEmail.css'
import { BlurredBackground } from '../../components/ui/blurredBackground/BlurredBackground';

export default function VerifyEmail() {
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')
    const [status, setStatus] = useState('loading');

    useEffect(() => {

        if (!token) {
            setStatus('error')
            return
        }

        const verifyTokenAsync = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/auth/verify?token=${token}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                console.log(response)
                if (response.ok) {
                    setStatus('success')
                } else {
                    setStatus('error')
                }
            } catch (error) {
                console.error("Errore di connessione al backend:", error)
                setStatus('error')
            }
        }

        verifyTokenAsync()
    }, [token])

    return (
        <main className="d-flex justify-content-center align-items-center min-vh-100 px-3">
            
            <BlurredBackground variant="single"/>

            <div className="bg-blob-404"></div>
            <div className="text-center" style={{ maxWidth: '400px' }}>
                
                {/* STATUS: LOADING */}
                {status === 'loading' && (
                    <>
                        <Loader2 className="animate-spin mb-4" size={48} color="var(--primary)" />
                        <h2 className="font-heading fw-bold text-dark">Verifying your account...</h2>
                        <p className="text-muted-foreground small">Please wait a moment while we confirm your email.</p>
                    </>
                )}

                {/* STATUS: SUCCESS */}
                {status === 'success' && (
                    <>
                        <div className="mb-4 text-success"><CheckCircle2 size={64} /></div>
                        <h2 className="font-heading fw-bold text-dark">Email verified! 🎉</h2>
                        <p className="text-muted-foreground small mb-4">Your account is now active. You can log in and start tracking your meals.</p>
                        <Button asChild variant="default" className="rounded-pill px-4">
                            <Link to="/login">Go to Login</Link>
                        </Button>
                    </>
                )}

                {/* STATUS: ERROR */}
                {status === 'error' && (
                    <>
                        <div className="mb-4 text-danger"><XCircle size={64} /></div>
                        <h2 className="font-heading fw-bold text-dark">Verification failed</h2>
                        <p className="text-muted-foreground small mb-4">The link is invalid or expired. Try registering again.</p>
                        <Button asChild variant="outline" className="rounded-pill px-4">
                            <Link to="/register">Back to register</Link>
                        </Button>
                    </>
                )}
            </div>
        </main>
    );
}