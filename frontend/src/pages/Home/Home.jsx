import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import { Navigate } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { CalorieCard } from "../../components/dashboard/calorieCard/CalorieCard"
import { MacroCards } from "../../components/dashboard/macroCards/MacroCards"
import { DashboardHeader } from "../../components/dashboard/dashboardHeader/DashboardHeader"
import { MealSection } from "../../components/dashboard/mealSection/MealSection"


const Home = () => {
    const { user, isLoading } = useContext(AuthContext)
    const token = localStorage.getItem('token')

    const today = new Date().toISOString().split('T')[0]
    const [selectedDate, setSelectedDate] = useState(today)

    const [dailySummary, setDailySummary] = useState(null)
    const [dailyMeals, setDailyMeals] = useState([])
    const [isDashboardLoading, setIsDashboardLoading] = useState(false)
    const [errors, setErrors] = useState()


    const onDatechange = (date) => {
        setSelectedDate(date)
    }

    const fetchDashboardData = async (date = today) => {
        setIsDashboardLoading(true)
        setErrors(null)

        try {
            const summaryReq = fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/meals/summary/daily/?date=${date}`, {
                headers: { Authorization: `Bearer ${token}` }
            })

            const mealsReq = fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/meals/?date=${date}`, {
                headers: { Authorization: `Bearer ${token}` }
            })

            const [summaryRes, mealsRes] = await Promise.all([summaryReq, mealsReq])

            if (!summaryRes.ok || !mealsRes.ok) {
                throw new Error("Error in loading dashboard data");
            }

            const [summaryData, mealsData] = await Promise.all([
                summaryRes.json(),
                mealsRes.json()
            ])

            setDailySummary(summaryData.summary)
            setDailyMeals(mealsData.meals)
        } catch (e) {
            console.error("Fetch Dashboard Error: ", e)
            setErrors("Not possible to to load data. Please try again later.")
        } finally {
            setIsDashboardLoading(false)
        }
    }

    useEffect(() => {
        fetchDashboardData(selectedDate)

    }, [selectedDate])

    // if (dailySummary)
    //     console.log(dailySummary.kcal)

    if (dailyMeals)
        console.log(dailyMeals)
    // console.log(user)
    return (
        <div className="container py-3">
            <DashboardHeader
                user={user}
                selectedDate={selectedDate}
                onDateChange={onDatechange}
            />

            {errors && (
                <div className="alert alert-danger radius-2xl small py-2 mb-3">
                    {errors}
                </div>
            )}

            <div>
                <CalorieCard
                    dailyGoal={user?.dailyKcalGoal || 2000}
                    totalEaten={dailySummary?.kcal || 0}
                />
                <MacroCards
                    userGoals={user?.macroGoals}
                    summary={dailySummary || { carbs: { total: 0 }, proteins: 0, fats: { total: 0 } }}
                />
                <MealSection mealsData={dailyMeals} onFoodDeleted={() => fetchDashboardData(selectedDate)} />
            </div>
        </div>
    )
}
export default Home