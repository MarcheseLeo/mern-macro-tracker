import React from 'react'
import { Link } from 'react-router-dom';
import { LoginForm } from '../../components/loginForm/LoginForm'
import Button from "../../components/ui/button/Button"
import { Flame } from 'lucide-react';
import './Login.css'
import { Logo } from '../../components/logo/Logo';
import { BlurredBackground } from '../../components/ui/blurredBackground/BlurredBackground';

export const Login = () => {
  return (
    <main className='position-relative d-flex justify-content-center align-items-center w-100 overflow-hidden px-3 py-5 login-container'>
      {/* BLURRED BACKGROUNDS */}
      <BlurredBackground/>

      {/* MAIN CONTAINER */}
      <div className="position-relative z-1 w-100 mx-auto login-inner-container">
        {/* LOGO LINK */}
        <Logo />

        {/* Login CARD */}
        <div className="card border-0 radius-3xl shadow-soft  bg-white mt-4">
          <h1 className="h4 fw-bold tracking-tight font-heading mb-1">Welcome back</h1>
          <p className="small text-muted-foreground">
            Log in to continue your diet journey.
          </p>

          {/*LOGIN FORM */}
          <LoginForm />

          {/*REGISTRATION LINK */}
          <p className="mt-4 mb-0 text-center small fw-normal text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="fw-semibold text-primary-custom text-decoration-none hover-underline">
              Sign up
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
