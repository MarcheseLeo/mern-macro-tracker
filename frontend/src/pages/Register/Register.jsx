import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/ui/button/Button'
import { Logo } from '../../components/logo/Logo'
import { RegisterForm } from '../../components/form/registerForm/RegisterForm'
import { BlurredBackground } from '../../components/ui/blurredBackground/BlurredBackground'
import '../Login/Login.css'

export const Register = () => {
    return (
        <main className='position-relative d-flex justify-content-center align-items-center w-100 overflow-hidden px-3 py-5 login-container'>
            {/* BLURRED BACKGROUNDS */}
            <BlurredBackground />

            {/* MAIN CONTAINER */}
            <div className="position-relative z-1 w-100 mx-auto login-inner-container">
                {/* LOGO LINK */}
                <Logo />

                {/* REGISTER CARD */}
                <div className="card border-0 radius-3xl shadow-soft bg-white mt-4">
                    <h1 className="h4 fw-bold tracking-tight font-heading mb-1 text-dark">Create an account</h1>
                    <p className="small text-muted-foreground">
                        Start tracking your diet journey today.
                    </p>

                    {/* REGISTER FORM */}
                    <RegisterForm />

                    {/* LOGIN LINK */}
                    <p className="mt-4 mb-0 text-center small fw-normal text-muted-foreground">
                        Already have an account?{' '}
                        <Link to="/login" className="fw-semibold text-primary-custom text-decoration-none hover-underline">
                            Log in
                        </Link>
                    </p>
                </div>

                {/* GO BACK BUTTON */}
                <div className="mt-4 text-center">
                    <Button asChild variant="ghost" className="rounded-pill text-muted-foreground small">
                        <Link to="/">← Go back</Link>
                    </Button>
                </div>

            </div>
        </main>
    )
}
