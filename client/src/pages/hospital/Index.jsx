import React from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import StatCard from '../../components/ui/StatCard'
import BloodTypeBadge from '../../components/ui/BloodTypeBadge'
import Button from '../../components/ui/Button'
import { 
  PlusCircle, 
  Users, 
  CheckCircle2, 
  Timer, 
  MapPin, 
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  TrendingUp,
  History,
  Droplets
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import LiveMap from '../../components/map/LiveMap'

const ActiveRequestRow = ({ request }) => (
  <div className="card p-5 group hover:border-primary-red/20 transition-all">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
      <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto overflow-hidden">
        <BloodTypeBadge type={request.bloodType} className="shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-0.5">
            <h4 className="font-bold text-gray-900 truncate">Request #{request.id}</h4>
            <span className={`badge shrink-0 ${
              request.urgency === 'Critical' ? 'bg-critical-light text-critical' : 
              request.urgency === 'Urgent' ? 'bg-warning-light text-warning' : 'bg-info-light text-info'
            }`}>
              {request.urgency}
            </span>
          </div>
          <p className="text-xs text-gray-500 truncate">Posted {request.timeAgo} • Exp {request.expiresIn}</p>
        </div>
      </div>
      <div className="text-left sm:text-right shrink-0">
        <p className="text-sm font-bold text-gray-900">{request.responses} Responses</p>
        <p className="text-[10px] text-gray-400 uppercase tracking-wider">{request.notified} Notified</p>
      </div>
    </div>
    
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-bold mb-1">
        <span className="text-gray-500">Progress: {request.secured}/{request.needed} units</span>
        <span className="text-primary-red">{Math.round((request.secured/request.needed) * 100)}%</span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary-red rounded-full transition-all duration-1000" 
          style={{ width: `${(request.secured/request.needed) * 100}%` }}
        />
      </div>
    </div>

    <div className="flex gap-2 mt-5">
      <Link to={`/hospital/requests/${request.id}`} className="flex-1 btn btn-secondary text-sm py-2">View Details</Link>
      <Button className="btn-primary text-sm py-2">Mark Fulfilled</Button>
    </div>
  </div>
)

const ActivityItem = ({ activity }) => (
  <div className="flex gap-4 p-3 hover:bg-gray-50 rounded-xl transition-all">
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
      activity.type === 'accepted' ? 'bg-success-light text-success' : 
      activity.type === 'fulfilled' ? 'bg-primary-light text-primary-red' : 'bg-info-light text-info'
    }`}>
      {activity.type === 'accepted' ? <Users size={18} /> : 
       activity.type === 'fulfilled' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm text-gray-800 leading-tight">
        <span className="font-bold">{activity.user}</span> {activity.message}
      </p>
      <p className="text-xs text-gray-400 mt-1">{activity.timeAgo}</p>
    </div>
  </div>
)

const HospitalDashboard = () => {
  const { user } = useAuth()

  const stats = [
    { label: 'Active Requests', value: '2', icon: AlertCircle, color: 'red' },
    { label: 'Donors Notified', value: '142', icon: Users, color: 'blue' },
    { label: 'Fulfilled', value: '12', icon: CheckCircle2, color: 'green', trend: '+15%' },
    { label: 'Avg Response', value: '18m', icon: Timer, color: 'amber' },
  ]

  const activeRequests = [
    { id: 1042, bloodType: 'O+', urgency: 'Critical', secured: 1, needed: 3, responses: 2, notified: 23, timeAgo: '2h ago', expiresIn: '1h 30m' },
    { id: 1038, bloodType: 'A-', urgency: 'Urgent', secured: 2, needed: 2, responses: 5, notified: 18, timeAgo: '6h ago', expiresIn: '18h' },
  ]

  const activities = [
    { id: 1, type: 'accepted', user: 'John D.', message: 'accepted your O+ request', timeAgo: '3 min ago' },
    { id: 2, type: 'fulfilled', user: 'Request #1042', message: 'fulfilled — 2 units secured', timeAgo: '15 min ago' },
    { id: 3, type: 'accepted', user: 'Sarah M.', message: 'responded to your urgent call', timeAgo: '1h ago' },
  ]

  return (
    <DashboardLayout>
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl lg:text-4xl">{user?.name || 'General Hospital'}</h1>
            <div className="badge bg-success-light text-success flex items-center gap-1">
              <ShieldCheck size={14} /> Verified
            </div>
          </div>
          <p className="text-gray-500 flex items-center gap-2">
            <MapPin size={16} /> San Francisco, CA • Reg: BB-88291
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/hospital/inventory" className="btn btn-secondary gap-2 h-12 px-8">
            <Droplets size={20} />
            Manage Inventory
          </Link>
          <Link to="/hospital/requests/new" className="btn btn-primary gap-2 h-12 px-8 shadow-xl shadow-red-500/20">
            <PlusCircle size={20} />
            Post New Request
          </Link>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Requests */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Active Requests</h3>
            <Link to="/hospital/requests" className="text-primary-red font-bold text-sm hover:underline flex items-center gap-1">
              All Requests <ArrowRight size={14} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeRequests.map(req => (
              <ActiveRequestRow key={req.id} request={req} />
            ))}
          </div>

          {/* Map Preview */}
          <div className="card p-0 overflow-hidden h-[400px] relative group z-0">
             <LiveMap 
               center={[37.7749, -122.4194]} 
               zoom={12}
               markers={[
                 { position: [37.7649, -122.4294], type: 'donor' },
                 { position: [37.7949, -122.4094], type: 'donor' },
                 { position: [37.7849, -122.4394], type: 'donor' },
               ]}
             />
            <div className="absolute top-6 left-6 p-4 bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-white/20 z-10">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Available Donors</p>
              <h3 className="text-2xl font-bold text-gray-900">47 <span className="text-sm font-normal text-gray-500">within 20km</span></h3>
            </div>
            <div className="absolute bottom-6 right-6 z-10">
              <Link to="/hospital/donors" className="btn btn-primary gap-2">
                Open Full Map <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="space-y-6">
          <div className="card h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Response Activity</h3>
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            </div>
            <div className="space-y-4">
              {activities.map(activity => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
            <button className="w-full mt-8 py-3 text-sm font-bold text-gray-400 hover:text-primary-red border-t border-gray-50 transition-colors flex items-center justify-center gap-2 group">
              View History <History size={16} className="group-hover:-translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default HospitalDashboard
