import React from 'react'
import './BlurredBackground.css'
export const BlurredBackground = ({ variant = 'default' }) => {

    if (variant === 'single') {
        return <div aria-hidden="true" className="bg-blob blob-single"></div>
    }


    return (
        <>
            <div aria-hidden="true" className='bg-blob blob-left'></div>
            <div aria-hidden="true" className='bg-blob blob-right'></div>
            <div aria-hidden="true" className='bg-blob blob-bottom'></div>
        </>
    )
}
