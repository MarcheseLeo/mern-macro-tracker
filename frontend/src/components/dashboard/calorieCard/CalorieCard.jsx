import React from 'react'
import './CalorieCard.css'
import { Flame } from 'lucide-react';

export const CalorieCard = ({ dailyGoal = 2000, totalEaten = 0 }) => {

    const remaining = Math.max(0, dailyGoal - totalEaten)
    const percentage = Math.min(100, Math.round((totalEaten / dailyGoal) * 100))

    const radius = 84
    const circumference = 2 * Math.PI * radius
    const dashOffset = circumference - (percentage / 100) * circumference

    return (
        <section className='radius-3xl card border-0 shadow-sm calorie-card'>
            <div className='d-flex justify-content-between align-items-center'>
                <div className='d-flex align-items-center gap-2'>
                    <Flame size={20} />
                    <span className=' fw-semibold font-heading small'>Daily calories</span>
                </div>
                <span className='goal-kcal-badge  fw-medium'>
                    Goal {dailyGoal} kcal
                </span>
            </div>

            <div className='d-flex align-items-center  mt-4 gap-4'>
                <div className='position-relative d-flex justify-content-center align-items-center'>
                    <svg width="200" height='200'   viewBox="0 0 200 200"  style={{ transform: 'rotate(-90deg)' }} >
                        <circle cx="100" cy="100" r={radius} fill='none' stroke="rgba(255,255,255,0.2)" strokeWidth="16" />
                        <circle
                            cx="100" cy="100" r={radius}
                            fill="none"
                            stroke="white"
                            strokeWidth="16"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={dashOffset}
                            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                        />
                    </svg>

                    <div className='position-absolute text-center d-flex flex-column'>
                        <span className='font-heading kcal-left lh-1'>{remaining}</span>
                        <span className='opacity-75'>kcal left</span>
                    </div>
                </div>
                <div className="d-flex flex-column flex-grow-1 gap-3">
                    <Stat label="Eaten" value={`${totalEaten} kcal`} />
                    <div className="line" />
                    <Stat label="Remaining" value={`${remaining} kcal`} />
                    <div className="line" />
                    <Stat label="Progress" value={`${percentage}%`} />
                </div>
            </div>

        </section>
    )
}


const Stat = ({ label, value }) => {
    return (
        <div className="d-flex align-items-center justify-content-between">
            <span className="calorie-card-label opacity-75">{label}</span>
            <span className="font-heading fw-bold">{value}</span>
        </div>
    )
}