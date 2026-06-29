import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import { Navigate } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { CalorieCard } from "../../components/dashboard/calorieCard/CalorieCard"
import { MacroCards } from "../../components/dashboard/macroCards/MacroCards"
import { DashboardHeader } from "../../components/dashboard/dashboardHeader/DashboardHeader"


const Home = () => {
    const { user, isLoading } = useContext(AuthContext)
    const today = new Date().toISOString().split('T')[0]
    const token = localStorage.getItem('token')
    const [dailySummary, setDailySummary] = useState(null)
    const [isSummaryLoading, setIsSummaryLoading] = useState(false)
    const [errors, setErrors] = useState()
    const [selectedDate, setSelectedDate] = useState(today)

    const onDatechange = (date) => {
        setSelectedDate(date)
    }

    const getDailySummary = async (date = today) => {
        setIsSummaryLoading(true)
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/meals/summary/daily/?date=${date}`, {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (response.ok) {
                const data = await response.json()
                setDailySummary(data.summary)
            }
        } catch (e) {
            console.error(e)
            setErrors(e)
        } finally {
            setIsSummaryLoading(false)
        }
    }

    useEffect(() => {
        getDailySummary(selectedDate)

    }, [selectedDate])

    if (dailySummary)
        console.log(dailySummary.kcal)

    console.log(user)
    return (
        <div className="container py-3">
            <DashboardHeader
                user={user}
                selectedDate={selectedDate}
                onDateChange={onDatechange}
            />


            <div style={{ opacity: isSummaryLoading ? 0.5 : 1, transition: 'opacity 0.2s ease' }}>

                <CalorieCard
                    dailyGoal={user?.dailyKcalGoal || 2000}
                    // Se dailySummary è null (es. nessun pasto), passiamo 0
                    totalEaten={dailySummary?.kcal || 0}
                />

                <MacroCards
                    userGoals={user?.macroGoals}
                    // Se dailySummary è null, passiamo un oggetto vuoto di sicurezza
                    summary={dailySummary || { carbs: { total: 0 }, proteins: 0, fats: { total: 0 } }}
                />

            </div>
        </div>
    )
}
export default Home