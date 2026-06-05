import React, { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import BloodTypeBadge from '../../components/ui/BloodTypeBadge'
import Button from '../../components/ui/Button'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  ShieldCheck,
  AlertTriangle,
  Edit2,
  Save,
  X,
  Droplet,
  HeartPulse
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { donorAPI } from '../../api/axios'

const DonorProfile = () => {
  const { user } = useAuth()
  const [donor, setDonor] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || 'John Doe',
    email: user?.email || 'john@example.com',
    phone: '+1 (555) 123-4567',
    dob: '1990-05-15',
    city: 'San Francisco, CA',
  })

  useEffect(() => {
    const fetchDonor = async () => {
      if (!user?.email) return
      try {
        const response = await donorAPI.get('/donors/me')
        setDonor(response.data.donor)
        setFormData({
          name: response.data.donor.name || user?.name || 'John Doe',
          email: user?.email || 'john@example.com',
          phone: response.data.donor.phone || '+1 (555) 123-4567',
          dob: response.data.donor.date_of_birth || '1990-05-15',
          city: response.data.donor.city || 'San Francisco, CA',
        })
      } catch (err) {
        console.error('Failed to fetch donor profile:', err)
      }
    }
    fetchDonor()
  }, [user])

  const handleSave = async () => {
    try {
      await donorAPI.put(`/donors/${donor?.id}`, {
        name: formData.name,
        phone: formData.phone,
        city: formData.city.split(',')[0].trim()
      })
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update profile:', error)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
        
        {/* Banner & Profile Header (Twitter/LinkedIn Style) */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative">
          {/* Cover Banner */}
          <div className="h-48 w-full bg-gradient-to-r from-red-600 via-rose-500 to-red-500"></div>
          
          <div className="px-6 sm:px-10 pb-8">
            <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 relative">
              {/* Profile Picture */}
              <div className="-mt-20 relative z-10 inline-block">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white bg-white shadow-md overflow-hidden flex items-center justify-center">
                  <div className="w-full h-full bg-red-50 text-primary-red flex items-center justify-center text-5xl sm:text-6xl font-display font-bold">
                    {formData.name.charAt(0)}
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
                    <Button onClick={handleSave} className="btn-primary rounded-full px-6 font-bold shadow-md shadow-red-500/20">
                      <Save size={16} className="mr-2" /> Save Changes
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Profile Intro */}
            <div className="mt-4 sm:mt-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{formData.name}</h1>
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
            
            {/* Personal Information */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <h2 className="text-xl font-bold mb-6 text-gray-900">Personal Information</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Full Name</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red transition-all" 
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
                  <label className="block text-sm font-semibold text-gray-700">Email Address</label>
                  {isEditing ? (
                    <div className="relative">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="email" 
                        className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red transition-all" 
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
                        className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red transition-all" 
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

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Date of Birth</label>
                  {isEditing ? (
                    <div className="relative">
                      <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="date" 
                        className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red transition-all" 
                        value={formData.dob}
                        onChange={e => setFormData({...formData, dob: e.target.value})}
                      />
                    </div>
                  ) : (
                    <div className="w-full flex items-center gap-3 bg-gray-50/50 border border-transparent rounded-xl px-4 py-3 text-gray-900 font-medium">
                      <Calendar size={18} className="text-gray-400" />
                      {formData.dob}
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
                    <AlertTriangle size={18} /> Danger Zone
                  </h3>
                  <p className="text-sm text-gray-600">
                    Deactivating your account will remove your profile and availability from the BloodBridge network.
                  </p>
                </div>
                <Button className="bg-white border-2 border-red-200 text-critical hover:bg-critical hover:text-white hover:border-critical font-bold whitespace-nowrap px-6 rounded-full transition-all">
                  Deactivate
                </Button>
              </div>
            </div>
          </div>

          {/* Side Column */}
          <div className="space-y-6">
            
            {/* Medical Profile Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Medical Profile</h3>
              
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col items-center justify-center">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Blood Type</p>
                  <BloodTypeBadge type={user?.bloodType || 'O+'} className="scale-150 shadow-md shadow-red-500/10" />
                </div>
                
                <div className="space-y-2">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Status</p>
                  <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-success-light text-success text-sm font-bold w-full">
                    <ShieldCheck size={18} /> Eligible to Donate
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics Card */}
            <div className="bg-gray-900 rounded-3xl shadow-sm border border-gray-800 p-6 sm:p-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-lg font-bold mb-6">Your Impact</h3>
                <div className="space-y-5">
                  <div className="flex justify-between items-center pb-5 border-b border-gray-800">
                    <div className="flex items-center gap-3 text-gray-400">
                      <Droplet size={18} />
                      <span className="font-medium">Total Donations</span>
                    </div>
                    <span className="font-bold text-2xl font-display text-white">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3 text-gray-400">
                      <HeartPulse size={18} className="text-primary-red" />
                      <span className="font-medium">Lives Saved</span>
                    </div>
                    <span className="font-bold text-2xl text-primary-red font-display">36</span>
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

export default DonorProfile
