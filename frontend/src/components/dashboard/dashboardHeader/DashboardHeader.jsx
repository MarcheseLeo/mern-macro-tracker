import './DashboardHeader.css'
import { Bell, ChevronDown } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { NotificationContext } from '../../../context/NotificationContext';


export const DashboardHeader = ({ user, selectedDate, onDateChange }) => {
    const [showNotifs, setShowNotifs] = useState(false)
    const { notifications, markAsRead } = useContext(NotificationContext)
    const areNotificationsEnabled = user?.preferences?.notifications ?? false;

    const unreadCount = notifications.filter(n => !n.isRead).length
    const getGreetings = () => {
        const h = new Date().getHours()
        if (h < 12) return 'Good morning'
        if (h < 18) return 'Good afternoon'
        return 'Good evening'
    }

    const getInitials = () => {
        if (!user) return 'U'
        return `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase()
    }
    const getLocalDateString = (d) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0')
        const day = String(d.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
    }

    const generateWeek = (currentDateStr) => {
        const [y, m, d] = currentDateStr.split('-')
        const current = new Date(y, m - 1, d)

        const week = []
        const today = getLocalDateString(new Date())


        for (let i = -3; i <= 3; i++) {
            const date = new Date(current)
            date.setDate(current.getDate() + i)

            const key = getLocalDateString(date)
            const label = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date)
            const number = date.getDate()

            week.push({ key, label, number, isToday: key === today })
        }
        return week
    }


    const weekDays = generateWeek(selectedDate)

    const navigate = useNavigate()

    const handleRedirectToProfile = () => {
        navigate('/profile')
    }

    return (
        <header className='d-flex flex-column gap-4 mb-2'>

            {/* TOP BAR */}
            <div className='d-flex align-items-center justify-content-between'>
                <div>
                    <p className='mb-0 dashboard-greetins text-secondary'>{getGreetings()} ✌️</p>
                    <h1 className='font-heading fw-bold mb-0 text-truncate tracking-tight text-dark'>
                        {user?.firstName || 'User'}
                    </h1>
                </div>

                <div className='d-flex align-items-center gap-2'>
                    {/* NOTIFICATION BUTTON */}
                    <div className="position-relative">
                        <button
                            aria-label='Notifications'
                            onClick={() => setShowNotifs(!showNotifs)}
                            className='btn position-relative shadow-sm d-flex justify-content-center align-items-center radius-2xl notification-button'
                        >
                            <Bell size={18} />
                            {unreadCount > 0 && areNotificationsEnabled &&<span className='position-absolute rounded-circle' style={{ top: '10px' }}></span>}
                        </button>

                        {/* NOTIFICATIONS DROPDOWN */}
                        {showNotifs && (
                            <div className="notification-panel bg-white shadow-soft rounded-4 p-3">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h6 className="font-heading fw-bold mb-0 text-dark">Notifications</h6>
                                    <span className="badge bg-primary rounded-pill">{unreadCount} new</span>
                                </div>

                                {areNotificationsEnabled? (
                                    <>
                                        {notifications.length === 0 ? (
                                            <p className="small text-muted mb-0 text-center py-3">No notifications yet.</p>
                                        ) : (
                                            <div className={`notification-list-wrap ${notifications.length > 4 ? 'has-more' : ''}`}>
                                                <div className="notification-list d-flex flex-column gap-2 overflow-auto">
                                                    {notifications.map(n => (
                                                        <div
                                                            key={n._id}
                                                            onClick={() => markAsRead(n._id)}
                                                            className={`notification-item p-2 rounded-3 cursor-pointer transition-colors ${n.isRead ? 'is-read' : 'bg-accent'}`}
                                                        >
                                                            <p className={`small mb-0 ${n.isRead ? 'text-muted' : 'text-accent-foreground fw-bold'}`}>
                                                                {n.message}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                                {notifications.length > 4 && (
                                                    <div className="notification-scroll-cue">
                                                        <ChevronDown size={14} />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <p className="small text-muted mb-0 text-center py-3">Notifications disabled.</p>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* AVATAR */}
                    <div className='profile-mini-avatar border-0 p-0 cursor-pointer d-flex align-items-center justify-content-center' onClick={handleRedirectToProfile} aria-label="Go to profile">
                        {user?.avatar ? <img src={user.avatar} /> : <span>{getInitials()}</span>}
                    </div>
                </div>
            </div>

            {/* CALENDAR */}
            <div className='d-flex gap-2 overflow-x-auto pb-md-3 mx-2 px-2 no-scrollbar'>
                {weekDays.map((day) => {
                    const isActive = day.key === selectedDate
                    return (
                        <button
                            key={day.key}
                            onClick={() => onDateChange(day.key)}
                            className={`btn d-flex flex-column align-items-center radius-2xl calendar-btn ${isActive ? 'active shadow-soft-sm' : ''}`}
                        >
                            <span className="fw-medium">
                                {day.label}
                            </span>
                            <span className={`font-heading fw-bold lh-1 ${isActive ? 'active' : ''}`}>
                                {day.number}
                            </span>
                            <span
                                className="rounded-circle mt-1"
                                style={{
                                    width: '0.4rem',
                                    height: '0.4rem',
                                    backgroundColor: day.isToday ? (isActive ? 'var(--primary-foreground)' : 'var(--primary)') : 'transparent'
                                }}
                            ></span>
                        </button>
                    )
                })}
            </div>
        </header>
    )
}
