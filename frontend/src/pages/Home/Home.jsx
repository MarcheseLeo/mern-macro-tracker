import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import { Navigate } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { CalorieCard } from "../../components/dashboard/calorieCard/CalorieCard"
import { MacroCards } from "../../components/dashboard/macroCards/MacroCards"


const Home = () => {
    const today = new Date().toISOString().split('T')[0]
    const token = localStorage.getItem('token')
    const [dailySummary, setDailySummary] = useState(null)
    const [isSummaryLoading, setIsSummaryLoading] = useState(false)
    const [errors, setErrors] = useState()


    const getDailySummary = async (date = today) => {
        setIsSummaryLoading(true)
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/meals/summary/daily/?date=${date}`, {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (response.ok) {
                const data = await response.json()
                setDailySummary(data.summary)
                console.log(data)
            } 
        } catch (e) {
            console.error(e)
            setErrors(e)
        } finally {
            setIsSummaryLoading(false)
        }
    }

    useEffect(() => {
        console.log(new Date().toISOString().split('T')[0])
        getDailySummary(today)
    }, [])

    if (dailySummary)
        console.log(dailySummary.kcal)
    const { user, isLoading } = useContext(AuthContext)
    console.log(user)
    return (
        <>
            <div className="container py-3">
                <h1 className="h4 fw-bold font-heading">
                    Hi, {user?.firstName || 'Utente'}! 👋
                </h1>
                <p className="text-muted small">This is your dashboard</p>
                {!isSummaryLoading && dailySummary && (
                    <>
                        <CalorieCard dailyGoal={user.dailyKcalGoal} totalEaten={dailySummary.kcal} />
                        <MacroCards userGoals={user.macroGoals} summary={dailySummary}/>
                    </>
                    
                )}
            </div>

        </>
    )
}
export default Home