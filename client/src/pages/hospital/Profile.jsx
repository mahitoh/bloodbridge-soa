import React, { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import { 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck,
  AlertTriangle,
  Edit2,
  Save,
  X,
  FileText,
  CheckCircle2,
  TrendingUp
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { hospitalAPI } from '../../api/axios'

const HospitalProfile = () => {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    id: '',
    name: 'General Hospital',
    email: 'contact@generalhospital.demo',
    phone: '+1 (555) 987-6543',
    registrationNumber: 'REG-882910-MH',
    address: '123 Medical Center Drive',
    city: 'San Francisco, CA',
  })

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await hospitalAPI.get('/hospitals/me')
        const h = res.data.hospital
        setFormData({
          id: h.id,
          name: h.name,
          email: h.email,
          phone: h.phone || '',
          registrationNumber: 'REG-' + h.id.slice(0, 6).toUpperCase(),
          address: h.address || '',
          city: h.city || '',
        })
      } catch (err) {
        setError('Failed to load hospital profile')
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [user])

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      await hospitalAPI.put(`/hospitals/${formData.id}`, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        city: formData.city.split(',')[0].trim(),
        address: formData.address
      })
      setIsEditing(false)
    } catch (err) {
      setError('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-5xl mx-auto py-20 text-center">
        <p className="text-gray-400 animate-pulse">Loading profile...</p>
      </div>
    </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="max-w-5xl mx-auto py-20 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
        
        {/* Banner & Profile Header (Twitter/LinkedIn Style) */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative">
          {/* Cover Banner */}
          <div className="h-48 w-full bg-gradient-to-r from-blue-700 via-blue-500 to-indigo-500"></div>
          
          <div className="px-6 sm:px-10 pb-8">
            <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 relative">
              {/* Profile Picture */}
              <div className="-mt-20 relative z-10 inline-block">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white bg-white shadow-md overflow-hidden flex items-center justify-center">
                  <div className="w-full h-full bg-blue-50 text-blue-600 flex items-center justify-center text-5xl sm:text-6xl font-display font-bold">
                    🏥
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pb-2 mt-2 sm:mt-0">
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} className="btn-secondary rounded-full px-6 font-bold">
                    <Edit2 size={16} className="mr-2" /> Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button onClick={() => setIsEditing(false)} className="btn-ghost rounded-full px-6 bg-gray-100 font-bold">
                      <X size={18} className="mr-2" /> Cancel
                    </Button>
                    <Button onClick={handleSave} className="btn-primary bg-blue-600 hover:bg-blue-700 shadow-blue-500/20 rounded-full px-6 font-bold shadow-md">
                      <Save size={16} className="mr-2" /> Save Changes
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Profile Intro */}
            <div className="mt-4 sm:mt-2">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{formData.name}</h1>
                <ShieldCheck className="text-success" size={24} />
              </div>
              <div className="flex items-center gap-2 text-gray-500 mt-1">
                <MapPin size={16} /> 
                <span className="font-medium">{formData.city}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Facility Information */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <h2 className="text-xl font-bold mb-6 text-gray-900">Facility Information</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2 sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700">Hospital Name</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  ) : (
                    <div className="w-full bg-gray-50/50 border border-transparent rounded-xl px-4 py-3 text-gray-900 font-medium">
                      {formData.name}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Registration Number</label>
                  {isEditing ? (
                    <div className="relative">
                      <FileText size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text" 
                        className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                        value={formData.registrationNumber}
                        onChange={e => setFormData({...formData, registrationNumber: e.target.value})}
                      />
                    </div>
                  ) : (
                    <div className="w-full flex items-center gap-3 bg-gray-50/50 border border-transparent rounded-xl px-4 py-3 text-gray-900 font-medium">
                      <FileText size={18} className="text-gray-400" />
                      {formData.registrationNumber}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Email Address</label>
                  {isEditing ? (
                    <div className="relative">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="email" 
                        className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  ) : (
                    <div className="w-full flex items-center gap-3 bg-gray-50/50 border border-transparent rounded-xl px-4 py-3 text-gray-900 font-medium">
                      <Mail size={18} className="text-gray-400" />
                      {formData.email}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Phone Number</label>
                  {isEditing ? (
                    <div className="relative">
                      <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="tel" 
                        className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  ) : (
                    <div className="w-full flex items-center gap-3 bg-gray-50/50 border border-transparent rounded-xl px-4 py-3 text-gray-900 font-medium">
                      <Phone size={18} className="text-gray-400" />
                      {formData.phone}
                    </div>
                  )}
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700">Address</label>
                  {isEditing ? (
                    <div className="relative">
                      <MapPin size={18} className="absolute left-4 top-4 text-gray-400" />
                      <textarea 
                        className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all min-h-[100px]" 
                        value={formData.address}
                        onChange={e => setFormData({...formData, address: e.target.value})}
                      />
                    </div>
                  ) : (
                    <div className="w-full flex items-start gap-3 bg-gray-50/50 border border-transparent rounded-xl px-4 py-3 text-gray-900 font-medium">
                      <MapPin size={18} className="text-gray-400 mt-0.5" />
                      <div>
                        {formData.address}
                        <div className="text-gray-500 text-sm font-normal mt-0.5">{formData.city}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50/50 rounded-3xl border border-red-100 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row gap-6 justify-between sm:items-center">
                <div>
                  <h3 className="text-lg font-bold text-critical flex items-center gap-2 mb-1">
                    <AlertTriangle size={18} /> Account Settings
                  </h3>
                  <p className="text-sm text-gray-600">
                    Suspending your account will hide your hospital from the BloodBridge network. You will not be able to post new requests.
                  </p>
                </div>
                <Button className="bg-white border-2 border-red-200 text-critical hover:bg-critical hover:text-white hover:border-critical font-bold whitespace-nowrap px-6 rounded-full transition-all">
                  Suspend Account
                </Button>
              </div>
            </div>
          </div>

          {/* Side Column */}
          <div className="space-y-6">
            
            {/* Platform Activity Card */}
            <div className="bg-gray-900 rounded-3xl shadow-sm border border-gray-800 p-6 sm:p-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-lg font-bold mb-6">Platform Activity</h3>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Account Status</p>
                    <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-success/20 text-success text-sm font-bold w-full">
                      <ShieldCheck size={18} /> Verified Facility
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-800 space-y-4">
                    <div className="flex justify-between items-center group">
                      <div className="flex items-center gap-3 text-gray-400">
                        <FileText size={18} />
                        <span className="font-medium">Total Requests</span>
                      </div>
                      <span className="font-bold text-2xl font-display">142</span>
                    </div>
                    <div className="flex justify-between items-center group">
                      <div className="flex items-center gap-3 text-gray-400">
                        <CheckCircle2 size={18} className="text-success" />
                        <span className="font-medium">Fulfilled</span>
                      </div>
                      <span className="font-bold text-2xl text-success font-display">138</span>
                    </div>
                    <div className="flex justify-between items-center group">
                      <div className="flex items-center gap-3 text-gray-400">
                        <TrendingUp size={18} className="text-blue-400" />
                        <span className="font-medium">Response Rate</span>
                      </div>
                      <span className="font-bold text-2xl text-blue-400 font-display">97%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default HospitalProfile
