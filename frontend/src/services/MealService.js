import api from "./api"

export const getDashboardData = async (date) => {
    const summaryReq = api.get(`/meals/summary/daily/?date=${date}`)

    const mealsReq = api.get(`/meals/?date=${date}`)

    const [summaryRes, mealsRes] = await Promise.all([summaryReq, mealsReq])
    
    return {
        summary: summaryRes.data.summary,
        meals: mealsRes.data.meals
    }
}

export const addFoodToMeal = async (mealType, date, foodId, quantity) => {
    const body = {
        mealType: mealType,
        date: date,
        items: [{
            foodId: foodId,
            consumedQuantity: quantity
        }]
    }
    const res = await api.post('/meals', body)

    return await res.data
}

export const deleteFoodFromMeal = async (mealId, foodId) => {
    
    const res = await api.delete(`/meals/${mealId}/items/${foodId}`)

    console.log("Food deleted")
}