import React, { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import StatCard from '../../components/ui/StatCard'
import BloodTypeBadge from '../../components/ui/BloodTypeBadge'
import { 
  Heart, 
  MapPin, 
  Calendar, 
  AlertCircle, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  History,
  User,
  Clock,
  Droplet,
  TrendingUp
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/ui/Button'
import { Link } from 'react-router-dom'
import { donorAPI, requestAPI } from '../../api/axios'

const AvailabilityCard = ({ available, onToggle, lastDonationDate }) => {
  const nextEligibleDate = new Date(lastDonationDate)
  nextEligibleDate.setDate(nextEligibleDate.getDate() + 56)
  const isEligible = new Date() >= nextEligibleDate
  const daysRemaining = Math.ceil((nextEligibleDate - new Date()) / (1000 * 60 * 60 * 24))
  
  return (
    <div className="rounded-3xl bg-gradient-to-br from-red-50 via-white to-primary-light border border-red-100 p-8 mb-8 shadow-lg overflow-hidden relative">
      <div className="absolute right-0 top-0 -mr-20 -mt-20 w-96 h-96 bg-primary-red/5 rounded-full blur-3xl" />
      <div className="absolute left-1/2 bottom-0 -ml-32 -mb-16 w-64 h-64 bg-red-400/5 rounded-full blur-3xl" />
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-3xl font-black text-gray-900">Donation Status</h2>
            {isEligible ? (
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-success to-emerald-500 text-white rounded-full text-sm font-bold shadow-lg shadow-green-500/20">
                <CheckCircle size={16} /> Eligible Now
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-warning to-orange-500 text-white rounded-full text-sm font-bold shadow-lg shadow-orange-500/20">
                <Clock size={16} /> Ineligible
              </span>
            )}
          </div>
          <p className="text-gray-600 max-w-lg text-base leading-relaxed font-medium">
            {isEligible 
              ? "🎉 You're all set! Toggle your availability to help nearby hospitals find you when they need blood donations."
              : `⏳ You can donate again in ${daysRemaining} days. Keep helping the community!`
            }
          </p>
        </div>
        
        <div className="flex flex-col items-center gap-4">
          <button 
            onClick={onToggle}
            className={`relative inline-flex h-16 w-32 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-red/30 shadow-lg ${available ? 'bg-gradient-to-r from-success to-emerald-500' : 'bg-gradient-to-r from-gray-300 to-gray-400'}`}
          >
            <span className={`inline-block h-14 w-14 transform rounded-full bg-white transition-transform duration-300 shadow-xl ${available ? 'translate-x-16' : 'translate-x-1'}`} />
          </button>
          <span className={`text-xs font-black uppercase tracking-widest ${available ? 'text-success' : 'text-gray-500'}`}>
            {available ? '● Available' : '● Unavailable'}
          </span>
        </div>
      </div>
    </div>
  )
}

const RequestMiniCard = ({ request }) => (
  <div className="group rounded-3xl bg-white border border-gray-100 shadow-md hover:shadow-xl hover:border-primary-red/30 transition-all duration-300 p-6 overflow-hidden relative">
    <div className="absolute top-0 right-0 w-24 h-24 bg-primary-light rounded-full -mr-8 -mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    
    <div className="relative z-10">
      <div className="flex items-start justify-between mb-4">
        <BloodTypeBadge type={request.bloodType} />
        <div className={`px-3 py-1 rounded-full text-xs font-bold ${
          request.urgency === 'Critical' ? 'bg-critical-light text-critical' : 
          request.urgency === 'Urgent' ? 'bg-warning-light text-warning' : 'bg-info-light text-info'
        }`}>
          {request.urgency}
        </div>
      </div>
      <h4 className="font-bold text-gray-900 mb-2 text-base">{request.hospital}</h4>
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-5">
        <MapPin size={14} />
        <span>{request.distance} km away</span>
        <span className="text-gray-300">•</span>
        <span>{request.timeAgo}</span>
      </div>
      <Button className="w-full text-sm py-2.5 rounded-2xl font-semibold">
        I Can Help
      </Button>
    </div>
  </div>
)

const CheckCircle = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
)

const DonorDashboard = () => {
  const { user } = useAuth()
  const [donorId, setDonorId] = useState(null)
  const [available, setAvailable] = useState(true)
  const [urgentRequests, setUrgentRequests] = useState([])

  useEffect(() => {
    const fetchDonor = async () => {
      if (!user?.email) return
      try {
        const response = await donorAPI.get('/donors/me')
        setDonorId(response.data.donor.id)
      } catch (err) {
        console.error('Failed to fetch donor profile:', err)
      }
    }
    fetchDonor()
  }, [user])

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await requestAPI.get('/requests')
        setUrgentRequests(response.data.requests?.slice(0, 3) || [])
      } catch (err) {
        console.error('Failed to fetch requests:', err)
      }
    }
    fetchRequests()
  }, [])

  const handleToggleAvailability = async () => {
    try {
      await donorAPI.put(`/donors/${donorId}/availability`, { available: !available })
      setAvailable(!available)
    } catch (err) {
      console.error('Failed to update availability:', err)
    }
  }

  return (
    <DashboardLayout>
      {/* Welcome Header */}
      <header className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-5xl">👋</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-2">
              Good morning, <span className="text-primary-red">{user?.name?.split(' ')[0] || 'John'}</span>
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-600 font-medium">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-primary-red" />
                San Francisco, CA
              </div>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-2">
                <Droplet size={18} className="text-primary-red" />
                {user?.bloodType || 'O+'} Blood Type
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-md p-4 text-center min-w-max">
              <p className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-1">Last Donation</p>
              <p className="font-black text-gray-900 text-lg">March 12, 2024</p>
            </div>
          </div>
        </div>
      </header>

      {/* Availability Toggle */}
      <AvailabilityCard 
        available={available} 
        onToggle={handleToggleAvailability} 
        lastDonationDate="2024-03-12"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard 
          label="Total Donations" 
          value="12" 
          icon={Heart} 
          color="red"
          trend="+2"
        />
        <StatCard 
          label="Lives Saved" 
          value="36" 
          icon={ShieldCheck} 
          color="green"
        />
        <StatCard 
          label="Next Eligible" 
          value="May 07" 
          icon={Calendar} 
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Urgent Requests */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary-light rounded-2xl">
                <Zap size={20} className="text-primary-red" />
              </div>
              <h3 className="text-2xl font-black text-gray-900">Urgent Requests</h3>
            </div>
            <Link to="/donor/requests" className="text-primary-red font-bold text-sm hover:text-primary-dark transition-colors flex items-center gap-2 group">
              View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {urgentRequests.map(req => (
              <RequestMiniCard key={req.id} request={req} />
            ))}
            {urgentRequests.length === 0 && (
              <div className="sm:col-span-2 rounded-3xl border-2 border-dashed border-gray-200 p-12 text-center">
                <Zap size={32} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">No urgent requests nearby right now</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="rounded-3xl bg-white border border-gray-100 shadow-lg p-8">
            <h3 className="text-lg font-black text-gray-900 mb-6">Quick Actions</h3>
            <div className="space-y-3">
              <button className="flex items-center gap-4 w-full p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 hover:from-primary-light hover:to-red-50 transition-all duration-300 group border border-transparent hover:border-primary-red/20">
                <div className="p-3 rounded-xl bg-white shadow-md group-hover:shadow-lg transition-shadow">
                  <Activity size={18} className="text-primary-red" />
                </div>
                <span className="font-bold text-sm text-gray-900 text-left">Update Availability</span>
              </button>
              <button className="flex items-center gap-4 w-full p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 hover:from-primary-light hover:to-red-50 transition-all duration-300 group border border-transparent hover:border-primary-red/20">
                <div className="p-3 rounded-xl bg-white shadow-md group-hover:shadow-lg transition-shadow">
                  <History size={18} className="text-primary-red" />
                </div>
                <span className="font-bold text-sm text-gray-900 text-left">Donation History</span>
              </button>
              <Link to="/donor/profile" className="flex items-center gap-4 w-full p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 hover:from-primary-light hover:to-red-50 transition-all duration-300 group border border-transparent hover:border-primary-red/20">
                <div className="p-3 rounded-xl bg-white shadow-md group-hover:shadow-lg transition-shadow">
                  <User size={18} className="text-primary-red" />
                </div>
                <span className="font-bold text-sm text-gray-900 text-left">Edit Profile</span>
              </Link>
            </div>
          </div>

          {/* Map Widget Preview */}
          <Link to="/donor/map" className="block rounded-3xl border border-gray-100 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-600 p-0 h-72 relative overflow-hidden shadow-lg hover:shadow-xl transition-shadow group">
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="flex flex-col items-center text-white">
                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm mb-3 group-hover:scale-110 transition-transform">
                  <MapPin size={32} className="text-white" />
                </div>
                <span className="text-sm font-black uppercase tracking-widest">Live Map View</span>
              </div>
            </div>
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6 group-hover:from-black/70 transition-colors">
              <h4 className="text-white font-black text-lg mb-1">5 Hospitals Active</h4>
              <p className="text-white/80 text-sm mb-4 font-medium">Within 10km of your location</p>
              <Button className="w-full bg-white text-primary-red font-bold hover:bg-gray-100 py-2.5">
                Open Map
              </Button>
            </div>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default DonorDashboard

