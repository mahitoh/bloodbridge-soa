import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://64.225.100.80'
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


// Add JWT token to all requests
const addAuth = (instance) => {
    instance.interceptors.request.use((config) => {
        const token = localStorage.getItem('token')
        if (token) config.headers.Authorization = `Bearer ${token}`
        return config
    })
}

const instances = [authAPI, donorAPI, hospitalAPI, requestAPI, locationAPI, notificationAPI]
instances.forEach(addAuth)

export default instances
