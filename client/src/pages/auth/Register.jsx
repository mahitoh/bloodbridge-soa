import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Card from '../../components/ui/Card'
import { Droplets, User, Hospital } from 'lucide-react'
import { BLOOD_TYPES } from '../../utils/bloodTypes'

const Register = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [role, setRole] = useState(searchParams.get('role') || 'donor')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    bloodType: '',
    dob: '',
    city: '',
    address: '',
    registrationNumber: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match')
    }

    setLoading(true)
    const result = await register({ ...formData, role })
    if (result.success) {
      navigate('/login')
    } else {
      setError(result.message)
    }
    setLoading(false)
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 py-12">
      <div className="mb-8 text-center flex flex-col items-center">
        <Link to="/" className="w-16 h-16 bg-primary-red rounded-2xl flex items-center justify-center shadow-lg mb-4">
          <Droplets className="text-white" size={32} />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Create account</h1>
        <p className="text-gray-500 mt-1 max-w-md text-center">
          Donors share blood type and city so we can match urgent needs. Hospitals add registration details for verification.
        </p>
      </div>

      <Card className="w-full max-w-2xl">
        <div className="flex p-1 bg-gray-100 rounded-xl mb-8">
          <button
            onClick={() => setRole('donor')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${
              role === 'donor' ? 'bg-white text-primary-red shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <User size={20} />
            I'm a Donor
          </button>
          <button
            onClick={() => setRole('hospital')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${
              role === 'hospital' ? 'bg-white text-primary-red shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Hospital size={20} />
            I'm a Hospital
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label={role === 'donor' ? "Full Name *" : "Hospital Name *"}
              name="name"
              placeholder={role === 'donor' ? "John Doe" : "General Hospital"}
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Email Address *"
              name="email"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Phone Number *"
              name="phone"
              placeholder="6xxxxxxxx"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
            {role === 'donor' ? (
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Blood Type *</label>
                <select
                  name="bloodType"
                  className="bg-gray-100 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-primary-red transition-all duration-200 border-none appearance-none"
                  value={formData.bloodType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Type</option>
                  {BLOOD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            ) : (
              <Input
                label="Registration Number *"
                name="registrationNumber"
                placeholder="REG-123456"
                value={formData.registrationNumber}
                onChange={handleInputChange}
                required
              />
            )}
            
            {role === 'donor' && (
              <Input
                label="Date of Birth *"
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleInputChange}
                required
              />
            )}
            
            <Input
              label="City *"
              name="city"
              placeholder="Yaoundé"
              value={formData.city}
              onChange={handleInputChange}
              required
            />
            
            {role === 'hospital' && (
              <Input
                label="Address *"
                name="address"
                className="md:col-span-2"
                placeholder="123 Hospital St, Bastos"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            )}

            <Input
              label="Password *"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Confirm Password *"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
          </div>

          <Button type="submit" className="w-full py-4 text-lg" disabled={loading}>
            {loading ? 'Creating Account...' : (role === 'donor' ? 'Create Account' : 'Register Hospital')}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-red font-semibold hover:underline">
              Log in instead
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}

export default Register
