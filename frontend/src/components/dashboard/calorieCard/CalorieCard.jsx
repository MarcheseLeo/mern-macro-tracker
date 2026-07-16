import React, { useContext, useEffect } from 'react'
import './CalorieCard.css'
import { Flame, Trophy } from 'lucide-react';
import { createAchievementNotification } from '../../../services/Notifications';
import { NotificationContext } from '../../../context/NotificationContext';
import { AuthContext } from '../../../context/AuthContext';

export const CalorieCard = ({ dailyGoal = 2000, totalEaten = 0 }) => {
    const { user } = useContext(AuthContext)
    const { triggerFetch } = useContext(NotificationContext)

    const isGoalReached = totalEaten >= dailyGoal
    const overCalories = isGoalReached ? totalEaten - dailyGoal : 0

    const remaining = Math.max(0, dailyGoal - totalEaten)
    const percentage = Math.min(100, Math.round((totalEaten / dailyGoal) * 100))

    const radius = 84
    const circumference = 2 * Math.PI * radius
    const dashOffset = circumference - (percentage / 100) * circumference

    const sendNotif = async (msg) => {
        await createAchievementNotification(msg)
        triggerFetch()
    }

    useEffect(() => {
        const todayStr = new Date().toISOString().split('T')[0]
        const storageKey = `achiev_kcal_${user._id}_${todayStr}`

        if (localStorage.getItem(storageKey) == undefined)
            localStorage.setItem(storageKey, 'false')

        console.log(typeof localStorage.getItem(storageKey))
        const alreadySent = localStorage.getItem(storageKey)

        if (isGoalReached && totalEaten > 0 && alreadySent ==='false') {
            sendNotif("🎉 Amazing! You hit your daily calorie target!")
            localStorage.setItem(storageKey, 'true')
        }
    }, [isGoalReached])

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

            <div className='d-flex flex-column flex-md-row align-items-md-center mt-4 gap-4'>

                <div className='position-relative d-flex justify-content-center align-items-center'>
                    {/* CIRCLE */}
                    <svg width="200" height='200' viewBox="0 0 200 200" style={{ transform: 'rotate(-90deg)' }} >
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

                    <div className='position-absolute text-center d-flex flex-column align-items-center justify-content-center' style={{ animation: 'fadeIn 0.5s ease-in' }}>
                        {isGoalReached ? (
                            <>
                                <Trophy size={32} className="mb-1" style={{ animation: 'popIn 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)' }} />
                                <span className='font-heading fw-bold lh-1' style={{ fontSize: '1.25rem' }}>Goal<br />Reached!</span>
                            </>
                        ) : (
                            <>
                                <span className='font-heading kcal-left lh-1'>{remaining}</span>
                                <span className='opacity-75'>kcal left</span>
                            </>
                        )}
                    </div>

                </div>
                {/* STATS */}
                <div className="d-flex flex-column flex-grow-1 gap-3 w-100">
                    <Stat label="Eaten" value={`${totalEaten} kcal`} />
                    <div className="line" style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.2)' }} />

                    {isGoalReached && overCalories > 0 ? (
                        <Stat label="Over" value={`+${overCalories} kcal`} />
                    ) : (
                        <Stat label="Remaining" value={`${remaining} kcal`} />
                    )}

                    <div className="line" style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
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