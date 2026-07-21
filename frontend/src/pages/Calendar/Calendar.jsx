import React, { useState, useContext, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Flame, PieChart, Check } from 'lucide-react';
import { DashboardContext } from '../../context/DashboardContext';
import { AuthContext } from '../../context/AuthContext';
import { getAllMealsForCalendar } from '../../services/MealService';
import { getDashboardData } from '../../services/Dashboard';
import { MetricTile } from '../../components/ui/metricTile/MetricTile';
import './Calendar.css';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WEEK = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const toKey = (year, month, day) => `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
const todayKey = () => {
    const d = new Date();
    return toKey(d.getFullYear(), d.getMonth(), d.getDate());
};

export const Calendar = () => {
    const { selectedDate, setSelectedDate, refreshTrigger } = useContext(DashboardContext)
    const { user } = useContext(AuthContext)

    const [summary, setSummary] = useState({ kcal: 0, carbs: { total: 0 }, proteins: 0, fats: { total: 0 } })
    const [dailyMeals, setDailyMeals] = useState([])
    const [isLoadingStats, setIsLoadingStats] = useState(false)
    const [monthlyData, setMonthlyData] = useState({})

    const [view, setView] = useState(() => {
        const d = new Date(selectedDate || todayKey())
        return { year: d.getFullYear(), month: d.getMonth() }
    });

    const first = new Date(view.year, view.month, 1)
    const startOffset = (first.getDay() + 6) % 7
    const daysInMonth = new Date(view.year, view.month + 1, 0).getDate()
    const today = todayKey()

    const cells = [];
    for (let i = 0; i < startOffset; i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) {
        cells.push(toKey(view.year, view.month, d))
    }

    const shift = (delta) => {
        setView((v) => {
            const m = v.month + delta
            return { year: v.year + Math.floor(m / 12), month: ((m % 12) + 12) % 12 }
        });
    };

    useEffect(() => {
        const fetchDayStats = async () => {
            setIsLoadingStats(true)
            try {
                const data = await getDashboardData(selectedDate);
                setSummary(data.summary)
                setDailyMeals(data.meals || [])
            } catch (e) {
                console.error("Error loading day stats", e)
            } finally {
                setIsLoadingStats(false)
            }
        }
        fetchDayStats()
    }, [selectedDate, refreshTrigger])

    useEffect(() => {
        const fetchMonthly = async () => {
            try {
                const data = await getAllMealsForCalendar()
                setMonthlyData(data)
            } catch (error) {
                console.error("Error loading monthly data", error)
            }
        }
        fetchMonthly()
    }, [refreshTrigger])


    const kcalGoal = user?.dailyKcalGoal || 2000;
    const isTarget = summary.kcal >= (kcalGoal * 0.85);
    const targetClass = selectedDate <= today ? `${summary.kcal >= (kcalGoal * 0.85) ? "text-success" : `${summary.kcal >= (kcalGoal * 0.40) ? "text-warning" : "text-danger"}`}` : "text-secondary"
    const targetStr = selectedDate <= today ? `${summary.kcal >= (kcalGoal * 0.85) ? "On target" : `${summary.kcal >= (kcalGoal * 0.40) ? "Partial" : "Missed"}`}` : "Arriving"
    const loggedMealTypes = dailyMeals.map(meal => meal.mealType);


    const summaryDateObj = new Date(selectedDate);
    const summaryDateStr = `${MONTHS[summaryDateObj.getMonth()].slice(0, 3)} ${summaryDateObj.getDate()}`


    const calculateWeeklyPercentage = () => {
        if (!monthlyData || Object.keys(monthlyData).length === 0) return 0

        let totalKcalWeek = 0;
        const targetDate = new Date(selectedDate)

        for (let i = 0; i < 7; i++) {
            const d = new Date(targetDate)
            d.setDate(d.getDate() - i)
            const key = toKey(d.getFullYear(), d.getMonth(), d.getDate())

            totalKcalWeek += (monthlyData[key] || 0)
        }

        const weeklyGoal = kcalGoal * 7
        if (weeklyGoal === 0) return 0

        const percentage = Math.round((totalKcalWeek / weeklyGoal) * 100)


        return percentage > 100 ? 100 : percentage
    }

    const weeklyPercentage = calculateWeeklyPercentage()

    return (
        <div className="container py-4 d-flex flex-column gap-4" style={{ maxWidth: '600px' }}>
            <header>
                <h1 className="font-heading fs-3 fw-bold mb-0 text-dark">Calendar</h1>
                <p className="text-muted small">Pick a day to review your log</p>
            </header>

            {/* CALENDAR SECTION */}
            <section className="app-card p-4">
                <div className="d-flex align-items-center justify-content-between mb-4">
                    <button onClick={() => shift(-1)} aria-label="Previous month" className="btn btn-light rounded-3 d-flex justify-content-center align-items-center p-2 border-0">
                        <ChevronLeft size={20} />
                    </button>
                    <p className="font-heading fs-5 fw-bold mb-0 text-dark">
                        {MONTHS[view.month]} {view.year}
                    </p>
                    <button onClick={() => shift(1)} aria-label="Next month" className="btn btn-light rounded-3 d-flex justify-content-center align-items-center p-2 border-0">
                        <ChevronRight size={20} />
                    </button>
                </div>

                <div className="calendar-grid mb-2 text-center small fw-medium text-muted">
                    {WEEK.map((w, i) => <span key={i}>{w}</span>)}
                </div>

                <div className="calendar-grid">
                    {cells.map((key, i) => {
                        if (!key) return <span key={`empty-${i}`} />;

                        const active = key === selectedDate;
                        const isToday = key === today;
                        const day = Number(key.split('-')[2]);

                        const dailyKcal = monthlyData[key];
                        let dotColor = null;

                        if (key <= today) {
                            if (dailyKcal !== undefined && dailyKcal > 0) {
                                if (dailyKcal >= kcalGoal * 0.85) dotColor = active ? "bg-light" : 'bg-success';
                                else if (dailyKcal >= kcalGoal * 0.40) dotColor = active ? "bg-light" : 'bg-warning';
                                else dotColor = active ? "bg-light" : 'bg-danger';
                            } else {
                                dotColor = active ? "bg-light" : 'bg-danger';
                            }
                        }

                        return (
                            <button
                                key={key}
                                onClick={() => setSelectedDate(key)}
                                className={`position-relative d-flex flex-column justify-content-center align-items-center rounded-4 border-0 transition-colors w-100 
                                    ${active ? 'btn-primary-custom text-white shadow-soft-sm' : 'bg-transparent hover-bg-light'}
                                    ${key > today ? 'text-muted-foreground' : (!active && isToday ? "text-muted-foreground" : "text-dark") }
                                    `}
                                style={{ aspectRatio: '1 / 1', fontSize: '0.9rem', fontWeight: '700'}}
                            >
                                <span>{day}</span>
                                {dotColor && <span className={`rounded-circle ${dotColor} mt-1`} style={{ width: '6px', height: '6px' }}></span>}
                                {isToday && !dotColor && !active && <span className="rounded-circle bg-primary mt-1" style={{ width: '6px', height: '6px' }}></span>}
                            </button>
                        );
                    })}
                </div>

                <div className="d-flex align-items-center justify-content-center gap-3 mt-4 pt-3 border-top small fw-medium text-muted">
                    <div className="d-flex align-items-center gap-1"><span className="rounded-circle bg-success" style={{ width: '8px', height: '8px' }}></span> On target</div>
                    <div className="d-flex align-items-center gap-1"><span className="rounded-circle bg-warning" style={{ width: '8px', height: '8px' }}></span> Partial</div>
                    <div className="d-flex align-items-center gap-1"><span className="rounded-circle bg-danger" style={{ width: '8px', height: '8px' }}></span> Missed</div>
                </div>
            </section>

            {/* STATS */}
            <div style={{ opacity: isLoadingStats ? 0.5 : 1, transition: 'opacity 0.2s' }} className="d-flex flex-column gap-3">

                <section className="app-card p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4 text-dark">
                        <h2 className="font-heading fs-5 fw-bold mb-0">{summaryDateStr} Summary</h2>
                        <span className={`small fw-bold ${targetClass}`}>
                            {targetStr}
                        </span>
                    </div>

                    <div className="row g-3 mb-4">
                        <div className="col-6">
                            <MetricTile
                                label="Calories"
                                value={summary.kcal.toLocaleString()}
                                detail={`of ${kcalGoal.toLocaleString()} goal`}
                                tone="fat"
                                className="calendar-summary-tile"
                            />
                        </div>
                        <div className="col-6">
                            <MetricTile
                                label="Water"
                                value={summary.water ? summary.water.toLocaleString() : 0}
                                unit="L"
                                detail="of 2.0L goal"
                                tone="carbs"
                                className="calendar-summary-tile"
                            />
                        </div>
                    </div>

                    <p className="small text-muted fw-semibold mb-2">Macro Split</p>
                    <div className="row g-2 mb-4 text-center">
                        <div className="col-4">
                            <div className="bg-light rounded-3 p-2">
                                <p className="small fw-bold text-protein mb-1">Protein</p>
                                <p className="font-heading fw-bold mb-0 text-dark">{Math.round(summary.proteins)}g</p>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="bg-light rounded-3 p-2">
                                <p className="small fw-bold text-carbs mb-1">Carbs</p>
                                <p className="font-heading fw-bold mb-0 text-dark">{Math.round(summary.carbs.total)}g</p>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="bg-light rounded-3 p-2">
                                <p className="small fw-bold text-fat mb-1">Fat</p>
                                <p className="font-heading fw-bold mb-0 text-dark">{Math.round(summary.fats.total)}g</p>
                            </div>
                        </div>
                    </div>

                    <p className="small text-muted fw-semibold mb-2">Meals Logged</p>
                    <div className="d-flex flex-wrap gap-2">
                        {['breakfast', 'lunch', 'dinner', 'snack'].map((type) => {
                            if (!loggedMealTypes.includes(type)) return null;
                            return (
                                <span key={type} className="badge bg-success-subtle text-success d-flex align-items-center gap-1 py-2 px-3 rounded-pill text-capitalize border border-success-subtle">
                                    <Check size={14} /> {type}
                                </span>
                            );
                        })}
                        {loggedMealTypes.length === 0 && (
                            <span className="small text-muted">No meals logged yet.</span>
                        )}
                    </div>
                </section>


                <div className="row g-3">
                    <div className="col-6">
                        <MetricTile
                            icon={Flame}
                            label="Day Streak"
                            value={user?.currentStreak || 0}
                            tone="danger"
                            align="center"
                            className="h-100"
                        />
                    </div>
                    <div className="col-6">
                        <MetricTile
                            icon={PieChart}
                            label="Weekly"
                            value={weeklyPercentage}
                            unit="%"
                            tone="primary"
                            align="center"
                            className="h-100"
                        />
                    </div>
                </div>

            </div>
        </div>
    );
};
