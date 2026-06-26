import React from 'react'
import { Link } from 'react-router-dom'
import { Flame } from 'lucide-react'
import './Logo.css'
export const Logo = () => {
    return (
        <Link to="/" className="d-flex align-items-center justify-content-center gap-2  text-decoration-none text-dark hover-dark logo-icon">
            <span
                className="d-flex justify-content-center align-items-center rounded-circle shadow-soft-sm text-white"
            >
                <Flame size={20} />
            </span>
            <span className="fs-5 fw-bold tracking-tight font-heading">Macro</span>
        </Link>
    )
}
