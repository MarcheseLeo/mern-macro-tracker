import './DashboardHeader.css'
import { Bell } from 'lucide-react';

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

    const generateWeek = (currentDateStr) => {
        const current = new Date(currentDateStr)
        const week = []
        const todayStr = new Date().toDateString().split('T')[0]
        const today = new Date().toISOString().split('T')[0]

        for (let i = -3; i <= 3; i++) {
            const date = new Date(current)
            date.setDate(current.getDate() + i)

            const key = date.toISOString().split('T')[0]
            const label = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date)
            const number = date.getDate()

            week.push({ key, label, number, isToday: key === today })
        }
        return week
    }

    const weekDays = generateWeek(selectedDate)

    return (
        <header className='d-flex flex-column gap-4 mb-2'>

            {/* TOP BAR */}
            <div className='d-flex align-items-center justify-content-between'>
                <div>
                    <p className='mb-0 dashboard-greetins'>{getGreetings()} ✌️</p>
                    <h1 className='font-heading fw-bold mb-0 text-truncate tracking-tight'>
                        {user?.firstName || 'User'}
                    </h1>
                </div>

                <div className='d-flex align-items-center gap-2'>
                    {/* NOTIFICATION BUTTON */}
                    <button
                        aria-label='Notifications'
                        className='btn position-relative shadow-sm d-flex justify-content-center align-items-center radius-2xl notification-button'
                    >
                        <Bell size={20} />
                        <span className='position-absolute rounded-circle'></span>
                    </button>

                    {/* AVATAR */}
                    <span
                        className='radius-2xl fw-bold shadow-sm font-heading d-flex  justify-content-center align-items-center avatar'
                    >
                        {getInitials()}
                    </span>
                </div>
            </div>

            {/* CALENDAR */}
            <div className='d-flex gap-2 overflow-x-auto pb-2 mx-n2 px-2 no-scrollbar'>
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
                                    backgroundColor: day.isToday? (isActive ? 'var(--primary-foreground)' : 'var(--primary)') : 'transparent'
                                }}
                            ></span>
                        </button>
                    )
                })}
            </div>
        </header>
    )
}
