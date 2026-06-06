import axios from 'axios'

const defaultApiBase =
    typeof window !== 'undefined'
        ? `${window.location.protocol}//${window.location.hostname}`
        : 'http://64.225.100.80'

const API_BASE = import.meta.env.VITE_API_BASE_URL || defaultApiBase
const AUTH_PORT = import.meta.env.VITE_AUTH_PORT || '30001'
const DONOR_PORT = import.meta.env.VITE_DONOR_PORT || '30002'
const HOSPITAL_PORT = import.meta.env.VITE_HOSPITAL_PORT || '30003'
const REQUEST_PORT = import.meta.env.VITE_REQUEST_PORT || '30004'
const LOCATION_PORT = import.meta.env.VITE_LOCATION_PORT || '30005'
const NOTIFICATION_PORT = import.meta.env.VITE_NOTIFICATION_PORT || '30006'

export const authAPI = axios.create({ baseURL: `${API_BASE}:${AUTH_PORT}` })
export const donorAPI = axios.create({ baseURL: `${API_BASE}:${DONOR_PORT}` })
export const hospitalAPI = axios.create({ baseURL: `${API_BASE}:${HOSPITAL_PORT}` })
export const requestAPI = axios.create({ baseURL: `${API_BASE}:${REQUEST_PORT}` })
export const locationAPI = axios.create({ baseURL: `${API_BASE}:${LOCATION_PORT}` })
export const notificationAPI = axios.create({ baseURL: `${API_BASE}:${NOTIFICATION_PORT}` })

const refreshAPI = axios.create({ baseURL: `${API_BASE}:${AUTH_PORT}` })

const refreshToken = async () => {
    const refresh = localStorage.getItem('refreshToken')
    if (!refresh) return null
    try {
        const response = await refreshAPI.post('/auth/refresh', { refreshToken: refresh })
        if (response.data.token) {
            localStorage.setItem('token', response.data.token)
            if (response.data.refreshToken) localStorage.setItem('refreshToken', response.data.refreshToken)
            return response.data.token
        }
        return null
    } catch {
        return null
    }
}

const addAuthAndErrorHandling = (instance) => {
    instance.interceptors.request.use(async (config) => {
        const token = localStorage.getItem('token')
        if (token) config.headers.Authorization = `Bearer ${token}`
        return config
    }, (error) => Promise.reject(error))

    instance.interceptors.response.use(
        (response) => response,
        async (error) => {
            if (error.response?.status === 401) {
                const token = localStorage.getItem('token')
                // Skip refresh and logout for demo token
                if (token === 'demo-token') {
                    return Promise.reject(error)
                }
                const newToken = await refreshToken()
                if (newToken) {
                    error.config.headers.Authorization = `Bearer ${newToken}`
                    return axios.request(error.config)
                }
                localStorage.removeItem('token')
                localStorage.removeItem('refreshToken')
                window.dispatchEvent(new Event('auth:logout'))
            }
            return Promise.reject(error)
        }
    )
}

addAuthAndErrorHandling(authAPI)
;[donorAPI, hospitalAPI, requestAPI, locationAPI, notificationAPI].forEach((instance) => {
    addAuthAndErrorHandling(instance)
})

export default [authAPI, donorAPI, hospitalAPI, requestAPI, locationAPI, notificationAPI]
