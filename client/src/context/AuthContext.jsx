import React, { createContext, useState, useEffect, useContext } from 'react'
import { authAPI } from '../api/axios'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      verifyToken(token)
    } else {
      setLoading(false)
    }
  }, [])

  const verifyToken = async (token) => {
    if (token === 'demo-token') {
      // Mock user for demo purposes if token is demo-token
      setUser({ id: 'demo', name: 'Demo User', email: 'demo@bloodbridge.com', role: 'donor', bloodType: 'O+' })
      setLoading(false)
      return
    }
    try {
      const response = await authAPI.post('/auth/verify', { token })
      setUser(response.data.user)
    } catch (error) {
      localStorage.removeItem('token')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    try {
      const response = await authAPI.post('/auth/login', credentials)
      const { token, user } = response.data
      localStorage.setItem('token', token)
      setUser(user)
      return { success: true, user }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
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
