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
export const getAllMealsForCalendar = async () => {
    const res = await api.get('/meals');
    const mealsList = res.data.meals || res.data

    const summaryByDate = {};
    
    mealsList.forEach(meal => {
        const dateKey = meal.date.split('T')[0]
        if (!summaryByDate[dateKey]) summaryByDate[dateKey] = 0;
        summaryByDate[dateKey] += meal.totalMealKcal;
    });

    return summaryByDate
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

    return res.data
}

export const deleteFoodFromMeal = async (mealId, foodId) => {
    const res = await api.delete(`/meals/${mealId}/items/${foodId}`)
    return res.data
}
