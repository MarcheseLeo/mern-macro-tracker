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

const isAuthEndpoint = (url = '') =>
    ['/auth/login', '/auth/refresh', '/auth/logout'].some((endpoint) => url.includes(endpoint))

const notifySessionExpired = (failedToken) => {
    window.dispatchEvent(new CustomEvent('auth:expired', { detail: { failedToken } }))
}

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

        // Network failures do not always include an Axios request config.
        if (!originalRequest || isAuthEndpoint(originalRequest.url)) {
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
                // Use the bare Axios client: the refresh request must never enter
                // this interceptor or inherit an expired Authorization header.
                const { data } = await axios.post(`${import.meta.env.VITE_SERVER_BASE_URL}/auth/refresh`, {}, {
                    withCredentials: true,
                    headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
                });
                
                const newAuthToken = data.token;
                localStorage.setItem('token', newAuthToken)
                
                api.defaults.headers.common['Authorization'] = 'Bearer ' + newAuthToken
                originalRequest.headers['Authorization'] = 'Bearer ' + newAuthToken
                
                processQueue(null, newAuthToken)
                return api(originalRequest)
                
            } catch (err) {

                processQueue(err, null);
                const failedToken = originalRequest.headers?.Authorization?.replace('Bearer ', '')
                const currentToken = localStorage.getItem('token')
                // A request started before a later login must not log the new
                // session out when its refresh attempt eventually fails.
                if (failedToken && failedToken === currentToken) {
                    localStorage.removeItem('token')
                    notifySessionExpired(failedToken)
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
