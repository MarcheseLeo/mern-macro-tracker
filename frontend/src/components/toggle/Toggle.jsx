import React from 'react'
import './Toggle.css'

export const Toggle = ({onChange, checked}) => {
    return (
        <label className="switch">
            <input type="checkbox" onChange={(e)=>onChange(e.target.checked)} checked={checked} />
            <span className="slider"></span>
        </label>
    )
}
