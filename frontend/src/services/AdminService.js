import api from './api'

export const getAdminUsers = async () => (await api.get('/admin/users')).data.users
export const updateAdminUser = async (id, body) => (await api.patch(`/admin/users/${id}`, body)).data.user
export const getAdminFoods = async () => (await api.get('/admin/foods')).data.foods
export const updateAdminFood = async (id, body) => (await api.patch(`/admin/foods/${id}`, body)).data.food
export const getAdminFeedback = async () => (await api.get('/admin/feedback')).data.feedback
export const updateAdminFeedback = async (id, body) => (await api.patch(`/admin/feedback/${id}`, body)).data.feedback
