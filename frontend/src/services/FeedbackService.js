import api from './api'

export const createFeedback = async (body) => (await api.post('/feedback', body)).data.feedback
