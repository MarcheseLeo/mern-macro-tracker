import React, { useContext } from 'react'
import './NotFound.css'
import Button from '../../components/ui/button/Button'
import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'
import { BlurredBackground } from '../../components/ui/blurredBackground/BlurredBackground'
import { AuthContext } from '../../context/AuthContext'

Link
export const NotFound = () => {
    const floaties = [ '🥑', '🍓', '🥗', '🍳', '🍎', '🍔' ]
    const random = Math.floor(Math.random() * (floaties.length))
    
    return (
        <main className='not-found-main d-flex justify-content-center align-items-center min-vh-100 position-relative overflow-hidden px-4 text-center'>
            <BlurredBackground variant='single' />

            <div className='position-relative z-1 d-flex flex-column align-items-center' style={{ maxWidth: '400px' }}>
                <span className='emoji-bounce mb-3'>
                    {floaties[random]}
                </span>
                <p className="h1 fw-bold text-primary-custom mb-0">404</p>
                <h1 className="fw-bold mt-2 text-dark">This plate is empty</h1>
                <p className="text-muted-foreground mt-2" style={{ maxWidth: '350px' }}>
                    The page you're looking for went out for a snack. Let's get you back home.
                </p>
                <Button asChild variant="default" size="lg" className="mt-4 rounded-pill shadow-soft">
                    <Link to="/home">
                        <Home size={18} className="me-1" />
                        Back to home
                    </Link>
                </Button>
            </div>
        </main>
    )
}
