import api from './api'

export const updateWater = async (date, amount) => {
    const res = api.patch('/metrics/water', { date, amount })

    return res.data
}