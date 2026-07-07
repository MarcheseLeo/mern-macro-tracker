import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import { CalorieCard } from "../../components/dashboard/calorieCard/CalorieCard"
import { MacroCards } from "../../components/dashboard/macroCards/MacroCards"
import { DashboardHeader } from "../../components/dashboard/dashboardHeader/DashboardHeader"
import { MealSection } from "../../components/dashboard/mealSection/MealSection"
import { DashboardContext } from '../../context/DashboardContext'
import { getDashboardData } from "../../services/MealService"

const emptySummary = { carbs: { total: 0 }, proteins: 0, fats: { total: 0 }, kcal: 0 }

const Home = () => {
    const { user } = useContext(AuthContext)

    const today = new Date().toISOString().split('T')[0]

    const {
        selectedDate, setSelectedDate,
        setIsAddFoodOpen, setTargetMeal,
        refreshTrigger
    } = useContext(DashboardContext)

    const [dailySummary, setDailySummary] = useState(null)
    const [dailyMeals, setDailyMeals] = useState([])
    const [isDashboardLoading, setIsDashboardLoading] = useState(true)
    const [errors, setErrors] = useState()

    const onDatechange = (date) => {
        setSelectedDate(date)
    }

    const fetchDashboardData = async (date = today) => {
        setIsDashboardLoading(true)
        setErrors(null)

        try {
            const data = await getDashboardData(date)
            const { summary, meals } = data

            setDailySummary(summary)
            setDailyMeals(meals)
        } catch (e) {
            console.error("Fetch Dashboard Error: ", e)
            setErrors("Not possible to load data. Please try again later.")
            setDailySummary(emptySummary)
            setDailyMeals([])
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
                <div className="alert alert-danger radius-xl small py-2 mb-3">
                    {errors}
                </div>
            )}

            {isDashboardLoading ? (
                <DashboardSkeleton />
            ) : (
                <div>
                    <CalorieCard
                        dailyGoal={user?.dailyKcalGoal || 2000}
                        totalEaten={dailySummary?.kcal || 0}
                    />
                    <MacroCards
                        userGoals={user?.macroGoals}
                        summary={dailySummary || emptySummary}
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
            )}
        </div>
    )
}

const DashboardSkeleton = () => {
    return (
        <div className="d-flex flex-column gap-3" aria-label="Loading dashboard">
            <section className="app-card p-4 skeleton-card">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="skeleton skeleton-line" style={{ width: '9rem' }}></div>
                    <div className="skeleton skeleton-line" style={{ width: '6rem' }}></div>
                </div>
                <div className="row g-4 align-items-center">
                    <div className="col-12 col-md-5 d-flex justify-content-center">
                        <div className="skeleton skeleton-circle" style={{ width: '11rem', height: '11rem' }}></div>
                    </div>
                    <div className="col-12 col-md-7 d-flex flex-column gap-3">
                        <div className="skeleton skeleton-line w-100"></div>
                        <div className="skeleton skeleton-line w-75"></div>
                        <div className="skeleton skeleton-line w-50"></div>
                    </div>
                </div>
            </section>

            <div className="row g-3">
                {[1, 2, 3].map((item) => (
                    <div className="col-4" key={item}>
                        <div className="app-card p-3 h-100">
                            <div className="skeleton skeleton-circle mb-3" style={{ width: '2.25rem', height: '2.25rem' }}></div>
                            <div className="skeleton skeleton-line mb-2" style={{ width: '55%' }}></div>
                            <div className="skeleton skeleton-line" style={{ width: '85%' }}></div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="d-flex flex-column gap-3 mt-2">
                {[1, 2, 3].map((item) => (
                    <div className="app-card p-3" key={item}>
                        <div className="d-flex align-items-center gap-3">
                            <div className="skeleton skeleton-circle" style={{ width: '2.75rem', height: '2.75rem' }}></div>
                            <div className="flex-grow-1">
                                <div className="skeleton skeleton-line mb-2" style={{ width: '40%' }}></div>
                                <div className="skeleton skeleton-line" style={{ width: '65%' }}></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Home
