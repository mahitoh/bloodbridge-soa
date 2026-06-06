import React, { createContext, useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../api/axios'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null')
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const setUser = (nextUser) => {
    setUserState(nextUser)
    if (nextUser) {
      localStorage.setItem('user', JSON.stringify(nextUser))
    } else {
      localStorage.removeItem('user')
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      verifyToken(token)
    } else {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const handler = () => {
      setUser(null)
      setLoading(false)
      navigate('/login')
    }
    window.addEventListener('auth:logout', handler)
    return () => window.removeEventListener('auth:logout', handler)
  }, [navigate])

  const verifyToken = async (token) => {
    if (token === 'demo-token') {
      const role = localStorage.getItem('demoRole') || 'donor'
      const demoUsers = {
        donor: { id: 'demo-donor', name: 'Jean Tendo', email: 'donor@demo.cm', role: 'donor', bloodType: 'O+', phone: '', city: '' },
        hospital: { id: 'demo-hospital', name: 'Bamenda Regional Hospital', email: 'contact@bamenda-regional.cm', role: 'hospital', bloodType: '', phone: '', city: '' },
        admin: { id: 'demo-admin', name: 'Admin User', email: 'admin@demo.com', role: 'admin', bloodType: '', phone: '', city: '' },
      }
      setUser(demoUsers[role] || demoUsers.donor)
      setLoading(false)
      return
    }
    try {
      const response = await authAPI.post('/auth/verify', { token })
      const verifiedUser = response.data.user
      setUser({
        ...verifiedUser,
        bloodType: verifiedUser.bloodType || 'O+',
        phone: verifiedUser.phone || '',
        city: verifiedUser.city || '',
      })
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 404) {
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        setUser(null)
      }
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    try {
      const response = await authAPI.post('/auth/login', credentials)
      const { token, refreshToken, user } = response.data
      localStorage.setItem('token', token)
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken)
      setUser(user)
      return { success: true, user }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || error.response?.data?.message || 'Login failed'
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('isDemo')
    localStorage.removeItem('demoRole')
    localStorage.removeItem('demoUser')
    setUser(null)
  }

  const register = async (data) => {
    try {
      const response = await authAPI.post('/auth/register', data)
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        login,
        logout,
        register,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
