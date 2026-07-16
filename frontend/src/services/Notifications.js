import api from './api'

export const getNotifications = async () => {
    const res = await api.get('/notifications')
    return res.data
}

export const markNotificationAsRead = async(id) =>{
    await api.patch(`/notifications/${id}/read`)
}

export const createAchievementNotification = async(message) =>{
    await api.post('/notifications/achievements', {message})
}