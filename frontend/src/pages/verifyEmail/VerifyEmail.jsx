import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'

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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
            {status === 'loading' && (
                <>
                    <h2>Verifica in corso... ⏳</h2>
                    <p>Stiamo confermando il tuo indirizzo email.</p>
                </>
            )}

            {status === 'success' && (
                <>
                    <h2 style={{ color: 'green' }}>Email verificata con successo! 🎉</h2>
                    <p>Il tuo account è ora attivo.</p>
                    <Link to="/login">
                        <button>Vai al Login</button>
                    </Link>
                </>
            )}

            {status === 'error' && (
                <>
                    <h2 style={{ color: 'red' }}>Ops, qualcosa è andato storto ❌</h2>
                    <p>Il link di verifica potrebbe essere scaduto o non valido.</p>
                    <Link to="/register">
                        <button>Torna alla registrazione</button>
                    </Link>
                </>
            )}
        </div>
    );
}