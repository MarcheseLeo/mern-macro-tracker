import React from 'react'
import './BlurredBackground.css'
export const BlurredBackground = ({ variant = 'default' }) => {
    if (variant === '404') {
        return (
            <div className="bg-blob blob-404"></div>
        )
    }
    return (
        <>
            <div aria-hidden="true" className='bg-blob blob-left'></div>
            <div aria-hidden="true" className='bg-blob blob-right'></div>
            <div aria-hidden="true" className='bg-blob blob-bottom'></div>
        </>
    )
}
