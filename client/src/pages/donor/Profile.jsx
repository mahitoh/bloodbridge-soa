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
  HeartPulse,
  Zap,
  Award
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { donorAPI } from '../../api/axios'

const DonorProfile = () => {
  const { user } = useAuth()
  const [donor, setDonor] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || 'Jean Tendo',
    email: user?.email || 'john@example.com',
    phone: '+237 (6xx) xxx xxx',
    dob: '1990-05-15',
    city: 'Bamenda, NW',
  })

  useEffect(() => {
    const fetchDonor = async () => {
      if (!user?.email) return
      try {
        const response = await donorAPI.get('/donors/me')
        setDonor(response.data.donor)
        setFormData({
          name: response.data.donor.name || user?.name || 'John Doe',
    email: user?.email || 'donor@demo.cm',
           phone: response.data.donor.phone || '+237 6xx xxx xxx',
          dob: response.data.donor.date_of_birth || '1990-05-15',
          city: response.data.donor.city || 'Bamenda, NW',
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
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
        
        {/* Banner & Profile Header */}
        <div className="rounded-3xl bg-gradient-to-r from-primary-red via-rose-500 to-primary-dark shadow-2xl overflow-hidden relative">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32 blur-3xl" />
          
          <div className="relative z-10 px-6 sm:px-10 py-16 flex flex-col sm:flex-row items-start sm:items-end gap-8 justify-between">
            {/* Profile Picture */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 flex-1">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl border-4 border-white bg-gradient-to-br from-white to-gray-50 shadow-2xl overflow-hidden flex items-center justify-center flex-shrink-0">
                <div className="w-full h-full bg-gradient-to-br from-primary-light to-white text-primary-red flex items-center justify-center text-6xl sm:text-7xl font-black font-display">
                  {formData.name.charAt(0)}
                </div>
              </div>

              {/* Profile Intro */}
              <div className="text-white space-y-2 flex-1">
                <h1 className="text-3xl sm:text-4xl font-black">{formData.name}</h1>
                <div className="flex items-center gap-2 text-white/90 text-base font-medium">
                  <MapPin size={18} className="text-white" /> 
                  <span>{formData.city}</span>
                </div>
                <div className="flex flex-wrap gap-3 pt-2">
                  <div className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-bold">
                    <Droplet size={14} className="inline mr-2" />
                    O+ Blood Type
                  </div>
                  <div className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-bold">
                    <ShieldCheck size={14} className="inline mr-2" />
                    Verified Donor
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 w-full sm:w-auto">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} className="btn-secondary rounded-full px-8 py-3 font-bold text-primary-red bg-white hover:bg-gray-50 shadow-lg">
                  <Edit2 size={16} className="mr-2 inline" /> Edit Profile
                </Button>
              ) : (
                <>
                  <Button onClick={() => setIsEditing(false)} className="rounded-full px-8 py-3 font-bold text-white border-2 border-white/30 hover:bg-white/10 transition-colors">
                    <X size={18} className="mr-2 inline" /> Cancel
                  </Button>
                  <Button onClick={handleSave} className="btn-primary rounded-full px-8 py-3 font-bold shadow-xl shadow-red-500/30">
                    <Save size={16} className="mr-2 inline" /> Save Changes
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Personal Information */}
            <div className="rounded-3xl bg-white border border-gray-100 shadow-lg p-8 sm:p-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-primary-light rounded-2xl">
                  <Mail size={20} className="text-primary-red" />
                </div>
                <h2 className="text-2xl font-black text-gray-900">Personal Information</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Full Name</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      className="w-full bg-white border-2 border-gray-200 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red transition-all font-medium" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  ) : (
                    <div className="w-full bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-2xl px-5 py-3.5 text-gray-900 font-bold text-base">
                      {formData.name}
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Email Address</label>
                  {isEditing ? (
                    <div className="relative">
                      <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="email" 
                        className="w-full bg-white border-2 border-gray-200 rounded-2xl pl-12 pr-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red transition-all font-medium" 
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  ) : (
                    <div className="w-full flex items-center gap-3 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-2xl px-5 py-3.5 text-gray-900 font-bold text-base">
                      <Mail size={18} className="text-primary-red flex-shrink-0" />
                      {formData.email}
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Phone Number</label>
                  {isEditing ? (
                    <div className="relative">
                      <Phone size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="tel" 
                        className="w-full bg-white border-2 border-gray-200 rounded-2xl pl-12 pr-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red transition-all font-medium" 
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  ) : (
                    <div className="w-full flex items-center gap-3 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-2xl px-5 py-3.5 text-gray-900 font-bold text-base">
                      <Phone size={18} className="text-primary-red flex-shrink-0" />
                      {formData.phone}
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Date of Birth</label>
                  {isEditing ? (
                    <div className="relative">
                      <Calendar size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="date" 
                        className="w-full bg-white border-2 border-gray-200 rounded-2xl pl-12 pr-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red transition-all font-medium" 
                        value={formData.dob}
                        onChange={e => setFormData({...formData, dob: e.target.value})}
                      />
                    </div>
                  ) : (
                    <div className="w-full flex items-center gap-3 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-2xl px-5 py-3.5 text-gray-900 font-bold text-base">
                      <Calendar size={18} className="text-primary-red flex-shrink-0" />
                      {formData.dob}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="rounded-3xl bg-gradient-to-br from-red-50 to-red-100/50 border-2 border-red-200 p-8 sm:p-10 shadow-lg">
              <div className="flex flex-col sm:flex-row gap-6 justify-between sm:items-center">
                <div className="flex-1">
                  <h3 className="text-lg font-black text-red-900 flex items-center gap-3 mb-2">
                    <AlertTriangle size={20} className="text-red-600" /> 
                    Danger Zone
                  </h3>
                  <p className="text-sm text-red-700 font-medium">
                    Deactivating your account will remove your profile and availability from the BloodBridge network permanently.
                  </p>
                </div>
                <Button className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-2xl whitespace-nowrap shadow-lg transition-all">
                  Deactivate Account
                </Button>
              </div>
            </div>
          </div>

          {/* Side Column */}
          <div className="space-y-8">
            
            {/* Medical Profile Card */}
            <div className="rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 shadow-lg p-8 sm:p-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-blue-200/50 rounded-2xl">
                  <Droplet size={20} className="text-blue-600" />
                </div>
                <h3 className="text-xl font-black text-gray-900">Medical Profile</h3>
              </div>
              
              <div className="space-y-6">
                <div className="rounded-3xl bg-white border-2 border-blue-100 p-6 flex flex-col items-center justify-center shadow-md">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Blood Type</p>
                  <BloodTypeBadge type={user?.bloodType || 'O+'} className="scale-150 shadow-lg shadow-red-500/20" />
                </div>
                
                <div className="space-y-3">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Eligibility Status</p>
                  <div className="flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-white border-2 border-green-100 text-green-700 text-sm font-bold w-full shadow-md">
                    <ShieldCheck size={18} /> Eligible to Donate
                  </div>
                </div>

                <div className="rounded-2xl bg-white border border-blue-100 p-4 text-center text-sm text-gray-600 font-medium">
                  <p>Next eligible donation:</p>
                  <p className="font-black text-gray-900 text-base mt-1">May 7, 2024</p>
                </div>
              </div>
            </div>

            {/* Statistics Card */}
            <div className="rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-2xl border border-gray-700 p-8 sm:p-10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary-red/10 rounded-full -mr-48 -mt-48 blur-3xl" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-white/10 rounded-2xl">
                    <Award size={20} className="text-primary-red" />
                  </div>
                  <h3 className="text-xl font-black">Your Impact</h3>
                </div>

                <div className="space-y-5">
                  <div className="flex justify-between items-center pb-5 border-b border-gray-700/50">
                    <div className="flex items-center gap-3 text-gray-300">
                      <Droplet size={18} className="text-primary-red" />
                      <span className="font-bold">Total Donations</span>
                    </div>
                    <span className="font-black text-3xl text-white font-display">12</span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-5 border-b border-gray-700/50">
                    <div className="flex items-center gap-3 text-gray-300">
                      <HeartPulse size={18} className="text-primary-red" />
                      <span className="font-bold">Lives Saved</span>
                    </div>
                    <span className="font-black text-3xl text-primary-red font-display">36</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3 text-gray-300">
                      <Zap size={18} className="text-primary-red" />
                      <span className="font-bold">Response Rate</span>
                    </div>
                    <span className="font-black text-3xl text-primary-red font-display">96%</span>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-700/50">
                  <p className="text-xs text-gray-400 font-medium">🎉 You're a lifesaver! Keep up the amazing work.</p>
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

