import api from "./api"

export const getDashboardData = async (date) => {
    const res = await api.get(`/dashboard/summary/?date=${date}`)

    return {
        summary: res.data.summary,
        meals: res.data.meals
    }
}