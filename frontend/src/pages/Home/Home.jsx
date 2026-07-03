import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import { Navigate } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { CalorieCard } from "../../components/dashboard/calorieCard/CalorieCard"
import { MacroCards } from "../../components/dashboard/macroCards/MacroCards"
import { DashboardHeader } from "../../components/dashboard/dashboardHeader/DashboardHeader"
import { MealSection } from "../../components/dashboard/mealSection/MealSection"
import { DashboardContext } from '../../context/DashboardContext'
import { getDashboardData } from "../../services/MealService"

const Home = () => {
    const { user, isLoading } = useContext(AuthContext)

    const today = new Date().toISOString().split('T')[0]

    const {
        selectedDate, setSelectedDate,
        setIsAddFoodOpen, setTargetMeal,
        refreshTrigger
    } = useContext(DashboardContext)

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
            const data = await getDashboardData(date)
            const {summary, meals} = data

            setDailySummary(summary)
            setDailyMeals(meals)
        } catch (e) {
            console.error("Fetch Dashboard Error: ", e)
            setErrors("Not possible to to load data. Please try again later.")
        } finally {
            setIsDashboardLoading(false)
        }
    }

    useEffect(() => {
        fetchDashboardData(selectedDate)

    }, [selectedDate, refreshTrigger])

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
                <MealSection
                    mealsData={dailyMeals}
                    onFoodDeleted={() => fetchDashboardData(selectedDate)}
                    onAddFoodClick={(mealType) => {
                        setTargetMeal(mealType)
                        setIsAddFoodOpen(true)
                    }}
                />

            </div>
        </div>
    )
}
export default Home