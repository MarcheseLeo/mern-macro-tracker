import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_SERVER_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)
api.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        if (error.response && error.response.status === 401) { 
            localStorage.removeItem('token')

            if (window.location.pathname !== '/login') {
                window.location.href = '/login'
            }
        }

        if (error.code === 'ECONNABORTED') {
            console.error("The request is taking too much time (Timeout).")
        }
        return Promise.reject(error)
    }   
)

export default api