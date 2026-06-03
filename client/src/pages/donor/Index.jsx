import React, { useState } from 'react'
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
  User
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/ui/Button'
import { Link } from 'react-router-dom'

const AvailabilityCard = ({ available, onToggle, lastDonationDate }) => {
  const nextEligibleDate = new Date(lastDonationDate)
  nextEligibleDate.setDate(nextEligibleDate.getDate() + 56)
  const isEligible = new Date() >= nextEligibleDate
  
  return (
    <div className="card-glass rounded-3xl p-8 mb-8 overflow-hidden relative">
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-gray-900">Donation Status</h2>
            {isEligible ? (
              <span className="badge bg-success-light text-success animate-pulse">✓ Eligible</span>
            ) : (
              <span className="badge bg-critical-light text-critical">⚠ Ineligible</span>
            )}
          </div>
          <p className="text-gray-500 max-w-md">
            {isEligible 
              ? "You are currently eligible to donate. Toggle your availability to let hospitals find you."
              : `You can donate again in ${Math.ceil((nextEligibleDate - new Date()) / (1000 * 60 * 60 * 24))} days.`
            }
          </p>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <button 
            onClick={onToggle}
            className={`relative inline-flex h-12 w-24 items-center rounded-full transition-colors duration-300 focus:outline-none ${available ? 'bg-success' : 'bg-gray-200'}`}
          >
            <span className={`inline-block h-10 w-10 transform rounded-full bg-white transition-transform duration-300 shadow-md ${available ? 'translate-x-13' : 'translate-x-1'}`} />
          </button>
          <span className={`text-sm font-bold uppercase tracking-widest ${available ? 'text-success' : 'text-gray-400'}`}>
            {available ? 'Available' : 'Unavailable'}
          </span>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute right-0 top-0 -mr-16 -mt-16 w-64 h-64 bg-primary-red/5 rounded-full blur-3xl" />
    </div>
  )
}

const RequestMiniCard = ({ request }) => (
  <div className="card p-5 group hover:border-primary-red/20 transition-all">
    <div className="flex items-start justify-between mb-4">
      <BloodTypeBadge type={request.bloodType} />
      <div className={`badge ${
        request.urgency === 'Critical' ? 'bg-critical-light text-critical' : 
        request.urgency === 'Urgent' ? 'bg-warning-light text-warning' : 'bg-info-light text-info'
      }`}>
        {request.urgency}
      </div>
    </div>
    <h4 className="font-bold text-gray-900 mb-1">{request.hospital}</h4>
    <div className="flex items-center gap-1 text-xs text-gray-500 mb-4">
      <MapPin size={12} />
      <span>{request.distance} km away • {request.timeAgo}</span>
    </div>
    <Button className="w-full btn-primary text-sm py-2">
      I Can Help
    </Button>
  </div>
)

const DonorDashboard = () => {
  const { user } = useAuth()
  const [available, setAvailable] = useState(true)

  const urgentRequests = [
    { id: 1, bloodType: 'O+', hospital: 'City Memorial Hospital', distance: 2.4, urgency: 'Critical', timeAgo: '10m ago' },
    { id: 2, bloodType: 'O+', hospital: 'Red Cross Clinic', distance: 5.1, urgency: 'Urgent', timeAgo: '25m ago' },
    { id: 3, bloodType: 'A-', hospital: 'St. Jude Medical Center', distance: 12.0, urgency: 'Standard', timeAgo: '1h ago' },
  ]

  return (
    <DashboardLayout>
      {/* Welcome Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl">Good morning, {user?.name?.split(' ')[0] || 'John'} 👋</h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2">
            <MapPin size={16} /> San Francisco, CA • {user?.bloodType || 'O+'} Blood Type
          </p>
        </div>
        <div className="flex gap-2">
          <div className="px-4 py-2 bg-white border border-gray-100 rounded-xl shadow-sm text-center">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Last Donation</p>
            <p className="font-bold text-gray-900 text-sm">March 12, 2024</p>
          </div>
        </div>
      </header>

      {/* Availability Toggle */}
      <AvailabilityCard 
        available={available} 
        onToggle={() => setAvailable(!available)} 
        lastDonationDate="2024-03-12"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Urgent Requests */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Zap size={20} className="text-primary-red" />
              <h3 className="text-xl font-bold">Urgent Requests Near You</h3>
            </div>
            <Link to="/donor/requests" className="text-primary-red font-bold text-sm hover:underline flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {urgentRequests.map(req => (
              <RequestMiniCard key={req.id} request={req} />
            ))}
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="card">
            <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="flex items-center gap-3 w-full p-3 rounded-xl bg-gray-50 hover:bg-primary-light hover:text-primary-red transition-all group">
                <div className="p-2 rounded-lg bg-white shadow-sm group-hover:scale-110 transition-transform">
                  <Activity size={18} />
                </div>
                <span className="font-semibold text-sm">Update Availability</span>
              </button>
              <button className="flex items-center gap-3 w-full p-3 rounded-xl bg-gray-50 hover:bg-primary-light hover:text-primary-red transition-all group">
                <div className="p-2 rounded-lg bg-white shadow-sm group-hover:scale-110 transition-transform">
                  <History size={18} />
                </div>
                <span className="font-semibold text-sm">View My History</span>
              </button>
              <button className="flex items-center gap-3 w-full p-3 rounded-xl bg-gray-50 hover:bg-primary-light hover:text-primary-red transition-all group">
                <div className="p-2 rounded-lg bg-white shadow-sm group-hover:scale-110 transition-transform">
                  <User size={18} />
                </div>
                <span className="font-semibold text-sm">Edit Profile</span>
              </button>
            </div>
          </div>

          {/* Map Widget Preview */}
          <div className="card overflow-hidden p-0 h-64 relative group">
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
               <div className="flex flex-col items-center text-gray-400">
                 <MapPin size={32} className="mb-2 animate-bounce" />
                 <span className="text-sm font-bold uppercase tracking-widest">Live Map View</span>
               </div>
            </div>
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
              <h4 className="text-white font-bold">5 Hospitals active</h4>
              <p className="text-white/80 text-xs mb-4">Within 10km of your location</p>
              <Link to="/donor/map" className="btn btn-primary text-sm py-2">
                Open Full Map
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default DonorDashboard
