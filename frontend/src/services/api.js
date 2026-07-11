import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_SERVER_BASE_URL,
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error)
        } else {
            prom.resolve(token)
        }
    })
    failedQueue = []
}

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) config.headers.Authorization = `Bearer ${token}`
        return config
    },
    (error) => Promise.reject(error)
)

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (originalRequest.url.includes('/auth/login')) {
            return Promise.reject(error);
        }
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            
            if (isRefreshing) {
                return new Promise(function(resolve, reject) {
                    failedQueue.push({ resolve, reject })
                }).then(token => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + token
                    return api(originalRequest)
                }).catch(err => Promise.reject(err))
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const { data } = await axios.post(`${import.meta.env.VITE_SERVER_BASE_URL}/auth/refresh`, {}, { withCredentials: true });
                
                const newAuthToken = data.token;
                localStorage.setItem('token', newAuthToken)
                
                api.defaults.headers.common['Authorization'] = 'Bearer ' + newAuthToken
                originalRequest.headers['Authorization'] = 'Bearer ' + newAuthToken
                
                processQueue(null, newAuthToken)
                return api(originalRequest)
                
            } catch (err) {

                processQueue(err, null);
                localStorage.removeItem('token')
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login'
                }
                return Promise.reject(err)
            } finally {
                isRefreshing = false
            }
        }

        if (error.code === 'ECONNABORTED') {
            console.error("The request is taking too much time (Timeout).")
        }
        return Promise.reject(error)
    }
)

export default api