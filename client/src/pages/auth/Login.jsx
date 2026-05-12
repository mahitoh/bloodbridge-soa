import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Card from '../../components/ui/Card'
import { Droplets } from 'lucide-react'

const Login = () => {
  const { login, setUser } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleDemoLogin = (role) => {
    const mockUsers = {
      donor: { id: 'd1', name: 'John Doe', email: 'donor@demo.com', role: 'donor', bloodType: 'O+' },
      hospital: { id: 'h1', name: 'General Hospital', email: 'hospital@demo.com', role: 'hospital' },
      admin: { id: 'a1', name: 'Admin User', email: 'admin@demo.com', role: 'admin' }
    }
    
    setUser(mockUsers[role])
    localStorage.setItem('token', 'demo-token')
    navigate(`/${role === 'donor' ? 'donor' : role === 'hospital' ? 'hospital' : 'admin'}`)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(formData)
    if (result.success) {
      const role = result.user?.role
      const home =
        role === 'donor' ? '/donor' : role === 'hospital' ? '/hospital' : role === 'admin' ? '/admin' : '/'
      navigate(home, { replace: true })
    } else {
      setError(result.message)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="mb-8 text-center flex flex-col items-center">
        <Link to="/" className="w-16 h-16 bg-primary-red rounded-2xl flex items-center justify-center shadow-lg mb-4" aria-label="BloodBridge home">
          <Droplets className="text-white" size={32} />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
        <p className="text-gray-500 mt-1 max-w-sm">Sign in to respond to requests, update your profile, and stay available to donate.</p>
      </div>

      <Card className="w-full max-w-md shadow-sm border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium">
              {error}
            </div>
          )}
          <Input
            label="Email"
            type="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <a
                href="mailto:support@bloodbridge.com?subject=BloodBridge%20password%20reset"
                className="text-sm text-primary-red hover:underline"
              >
                Forgot password?
              </a>
            </div>
            <Input
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          <Button type="submit" className="w-full py-3" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 text-center">Quick Demo Access</p>
          <div className="grid grid-cols-3 gap-3">
            <button 
              onClick={() => handleDemoLogin('donor')}
              className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-red-50 transition-colors border border-transparent hover:border-red-100 group"
            >
              <div className="w-10 h-10 bg-red-100 text-primary-red rounded-lg flex items-center justify-center group-hover:bg-primary-red group-hover:text-white transition-colors">
                <Droplets size={20} />
              </div>
              <span className="text-xs font-bold text-gray-600">Donor</span>
            </button>
            <button 
              onClick={() => handleDemoLogin('hospital')}
              className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-100 group"
            >
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Droplets size={20} />
              </div>
              <span className="text-xs font-bold text-gray-600">Hospital</span>
            </button>
            <button 
              onClick={() => handleDemoLogin('admin')}
              className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200 group"
            >
              <div className="w-10 h-10 bg-gray-200 text-gray-600 rounded-lg flex items-center justify-center group-hover:bg-gray-800 group-hover:text-white transition-colors">
                <Droplets size={20} />
              </div>
              <span className="text-xs font-bold text-gray-600">Admin</span>
            </button>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <p className="text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-red font-semibold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}

export default Login
