import React from 'react'
import './BlurredBackground.css'
export const BlurredBackground = () => {
    return (
        <>
            <div aria-hidden="true" className='bg-blob blob-left'></div>
            <div aria-hidden="true" className='bg-blob blob-right'></div>
        </>
    )
}
