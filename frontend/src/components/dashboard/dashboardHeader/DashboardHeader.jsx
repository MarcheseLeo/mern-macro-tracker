import './DashboardHeader.css'
import { Bell } from 'lucide-react';

import { useNavigate } from 'react-router-dom';


export const DashboardHeader = ({ user, selectedDate, onDateChange }) => {

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
                    <button
                        aria-label='Notifications'
                        className='btn position-relative shadow-sm d-flex justify-content-center align-items-center radius-2xl notification-button'
                    >
                        <Bell size={18} />
                        <span className='position-absolute rounded-circle' style={{top: '10px'}}></span>
                    </button>

                    {/* AVATAR */}
                    <div className='profile-mini-avatar border-0 p-0 cursor-pointer d-flex align-items-center justify-content-center' onClick={handleRedirectToProfile}  aria-label="Go to profile">
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
