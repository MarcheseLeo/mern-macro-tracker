import React, { useContext, useEffect, useState } from 'react'
import {
    Bar, BarChart, CartesianGrid, Line, LineChart, ReferenceLine,
    ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts'
import { AuthContext } from '../../context/AuthContext'
import { getAllMealsForCalendar } from '../../services/MealService'
import { ChartCard } from '../../components/ui/chartCard/ChartCard'
import { MetricTile } from '../../components/ui/metricTile/MetricTile'

export const Stats = () => {
    const { user, refreshUser } = useContext(AuthContext)
    const [calorieData, setCalorieData] = useState([])
    const [avgCalories, setAvgCalories] = useState(0)

    const history = user?.weightHistory || []

    const weightData = [...history]
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map(entry => {
            const dateObj = new Date(entry.date);
            const formattedDate = new Intl.DateTimeFormat('en-GB', { 
                day: '2-digit', 
                month: 'short' 
            }).format(dateObj);

            return {
                label: formattedDate, 
                kg: entry.weight      
            };
        })

    const fetchWeeklyStats = async () =>{
        try {
            const data = await getAllMealsForCalendar()

            const last7Days = []
            let totalKcal = 0
            let daysWithLogs = 0

            for (let i = 6; i >=0; i--) {
                const d = new Date()
                d.setDate(d.getDate() - i)
                const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
                const dayLabel = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(d)

                const calories = data[dateKey] || 0
                if (calories > 0) {
                    totalKcal += calories
                    daysWithLogs++
                }

                last7Days.push({
                    day: dayLabel,
                    calories: calories
                })

                setCalorieData(last7Days)
                setAvgCalories(daysWithLogs > 0 ? Math.round(totalKcal / daysWithLogs) : 0)
            }
        } catch (e) {
            console.error("Error loading stats", e)
        }

    }

    useEffect(() => {
        fetchWeeklyStats()
    }, [user])

    const startW = weightData[0]?.kg ?? 0
    const endW = weightData[weightData.length - 1]?.kg ?? 0
    const weightChange = Math.round((endW - startW) * 10) / 10
    const goalKcal = user?.dailyKcalGoal || 2000
    
    return (
        <div className="container py-4 d-flex flex-column gap-4" style={{ maxWidth: '800px' }}>
            <header>
                <h1 className="font-heading fs-3 fw-bold tracking-tight mb-1 text-dark">Statistics</h1>
                <p className="text-muted-foreground small mb-0">Your weekly nutrition & body trends</p>
            </header>

            <div className="row g-3">
                <div className="col-6">
                    <MetricTile
                        label="Avg. calories"
                        value={avgCalories.toLocaleString()}
                        unit="kcal"
                        detail="per logged day"
                        tone="fat"
                    />
                </div>
                <div className="col-6">
                    <MetricTile
                        label="Weight change"
                        value={`${weightChange > 0 ? '+' : ''}${weightChange}`}
                        unit="kg"
                        detail="last 30 days"
                        tone="protein"
                    />
                </div>
            </div>

            <ChartCard
                title="Calories this week"
                meta={`Goal ${goalKcal.toLocaleString()}`}
                isEmpty={!calorieData.some((day) => day.calories > 0)}
                emptyText="No calories logged this week"
            >
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={calorieData} margin={{ top: 8, right: 4, left: -25, bottom: 0 }}>
                            <CartesianGrid vertical={false} stroke="var(--border)" />
                            <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} dy={10} />
                            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                            <Tooltip
                                cursor={{ fill: 'var(--muted)' }}
                                contentStyle={{
                                    borderRadius: '16px',
                                    border: '1px solid var(--border)',
                                    background: 'var(--card)',
                                    fontSize: '12px',
                                    fontWeight: '600'
                                }}
                            />
                            <ReferenceLine y={goalKcal} stroke="var(--primary)" strokeDasharray="6 6" />
                            <Bar dataKey="calories" fill="var(--chart-1)" radius={[8, 8, 8, 8]} maxBarSize={32} />
                        </BarChart>
                    </ResponsiveContainer>
            </ChartCard>

            <ChartCard
                title="Weight trend"
                meta="Last 30 days"
                isEmpty={weightData.length === 0}
                emptyText="Add a weight entry to see the trend"
            >
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={weightData} margin={{ top: 8, right: 8, left: -25, bottom: 0 }}>
                            <CartesianGrid vertical={false} stroke="var(--border)" />
                            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} dy={10} />
                            <YAxis domain={['dataMin - 1', 'dataMax + 1']} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: '16px',
                                    border: '1px solid var(--border)',
                                    background: 'var(--card)',
                                    fontSize: '12px',
                                    fontWeight: '600'
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="kg"
                                stroke="var(--chart-3)"
                                strokeWidth={4}
                                dot={false}
                                activeDot={{ r: 6, fill: 'var(--chart-3)', stroke: '#fff', strokeWidth: 2 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
            </ChartCard>
        </div>
    )
}
