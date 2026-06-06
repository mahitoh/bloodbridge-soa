import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import BloodTypeBadge from '../../components/ui/BloodTypeBadge'
import Button from '../../components/ui/Button'
import LiveMap from '../../components/map/LiveMap'
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Navigation,
  AlertTriangle,
  MoreVertical
} from 'lucide-react'
import { twMerge } from 'tailwind-merge'

const DonorRow = ({ donor }) => {
  const getStatusBadge = (status) => {
    switch(status) {
      case 'Accepted': return <span className="badge bg-success-light text-success"><CheckCircle2 size={12} className="mr-1"/> Accepted</span>
      case 'Pending': return <span className="badge bg-warning-light text-warning"><Clock size={12} className="mr-1"/> Pending</span>
      case 'Declined': return <span className="badge bg-gray-100 text-gray-500"><XCircle size={12} className="mr-1"/> Declined</span>
      default: return null
    }
  }

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500 relative">
          {donor.name.charAt(0)}
          <div className={twMerge(
            "absolute -bottom-1 -right-1 w-3.5 h-3.5 border-2 border-white rounded-full",
            donor.status === 'Accepted' ? 'bg-success' : donor.status === 'Pending' ? 'bg-warning' : 'bg-gray-400'
          )} />
        </div>
        <div>
          <h4 className="font-bold text-gray-900 group-hover:text-primary-red transition-colors flex items-center gap-2">
            {donor.status === 'Accepted' ? donor.name : `Donor #${donor.id}`}
            <BloodTypeBadge type={donor.bloodType} className="scale-50 origin-left -ml-2 -mt-1" />
          </h4>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <MapPin size={12} /> {donor.distance} km away • Responded {donor.timeAgo}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {getStatusBadge(donor.status)}
        {donor.status === 'Accepted' && (
          <Button className="btn-secondary px-3 py-1.5 text-xs gap-2 hidden sm:flex">
            <Phone size={14} /> Contact
          </Button>
        )}
        <button className="text-gray-400 hover:text-gray-900">
          <MoreVertical size={16} />
        </button>
      </div>
    </div>
  )
}

const HospitalRequestDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('All')

  // Mock Request Data
  const request = {
    id: id || '1042',
    bloodType: 'O+',
    urgency: 'Critical',
    status: 'Active',
    timeAgo: '2h ago',
    expiresIn: '1h 30m',
    needed: 3,
    secured: 1,
    radius: 20,
    notes: 'Please bring ID to the emergency entrance.',
     donors: [
       { id: '891', name: 'Jean Tendo', bloodType: 'O+', distance: 2.4, status: 'Accepted', timeAgo: '15m ago', phone: '+237 6xx xxx xxx' },
       { id: '892', name: 'Hidden', bloodType: 'O-', distance: 5.1, status: 'Pending', timeAgo: '-' },
       { id: '893', name: 'Amina Nji', bloodType: 'O+', distance: 8.5, status: 'Accepted', timeAgo: '1h ago', phone: '+237 6xx xxx xxx' },
       { id: '894', name: 'Hidden', bloodType: 'O+', distance: 12.0, status: 'Declined', timeAgo: '30m ago' },
       { id: '895', name: 'Hidden', bloodType: 'O+', distance: 1.2, status: 'Pending', timeAgo: '-' },
     ]
  }

  const tabs = [
    { id: 'All', label: 'All', count: request.donors.length },
    { id: 'Accepted', label: 'Accepted', count: request.donors.filter(d => d.status === 'Accepted').length },
    { id: 'Pending', label: 'Pending', count: request.donors.filter(d => d.status === 'Pending').length },
    { id: 'Declined', label: 'Declined', count: request.donors.filter(d => d.status === 'Declined').length },
  ]

  const filteredDonors = activeTab === 'All' ? request.donors : request.donors.filter(d => d.status === activeTab)
  const progressPercent = Math.round((request.secured / request.needed) * 100)

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header Navigation */}
        <button 
          onClick={() => navigate('/hospital/requests')}
          className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary-red transition-colors mb-6"
        >
          <ArrowLeft size={16} /> Back to Requests
        </button>

        {/* Request Overview Card */}
        <div className="card mb-8 p-0 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-red/5 rounded-full blur-3xl -mr-20 -mt-20" />
          
          <div className="p-8 relative z-10">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
              <div className="flex items-start gap-6">
                <BloodTypeBadge type={request.bloodType} className="w-20 h-20 text-3xl shadow-lg" />
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold">Request #{request.id}</h1>
                    <span className="badge bg-critical-light text-critical text-sm font-bold">{request.urgency}</span>
                    <span className="badge bg-success-light text-success text-sm font-bold">{request.status}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-gray-500">
                    <span className="flex items-center gap-1"><Clock size={14}/> Posted {request.timeAgo}</span>
                    <span className="flex items-center gap-1 text-primary-red animate-pulse"><AlertTriangle size={14}/> Expires in {request.expiresIn}</span>
                    <span className="flex items-center gap-1"><Navigation size={14}/> {request.radius}km search radius</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="btn-secondary">Cancel Request</Button>
                <Button className="btn-primary gap-2 bg-success hover:bg-success/90 shadow-success/20 hover:shadow-success/30">
                  <CheckCircle2 size={18} /> Mark Fulfilled
                </Button>
              </div>
            </div>

            {/* Progress Section */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="flex justify-between items-end mb-3">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Progress</p>
                  <p className="text-2xl font-bold text-gray-900">{request.secured} <span className="text-lg font-medium text-gray-500">of {request.needed} units secured</span></p>
                </div>
                <span className="text-3xl font-display font-bold text-primary-red">{progressPercent}%</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary-red to-red-500 rounded-full transition-all duration-1000 relative" 
                  style={{ width: `${progressPercent}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 w-full animate-shimmer" />
                </div>
              </div>
            </div>

            {request.notes && (
              <div className="mt-6 border-l-4 border-gray-200 pl-4 py-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Notes</p>
                <p className="text-sm text-gray-700 italic">"{request.notes}"</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Donors List Column */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              Notified Donors
            </h3>
            
            <div className="card p-0">
              <div className="flex overflow-x-auto border-b border-gray-100 scrollbar-hide">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={twMerge(
                      "flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap",
                      activeTab === tab.id ? "border-primary-red text-primary-red" : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                    )}
                  >
                    {tab.label}
                    <span className={twMerge(
                      "px-2 py-0.5 rounded-full text-xs",
                      activeTab === tab.id ? "bg-primary-red text-white" : "bg-gray-100 text-gray-500"
                    )}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              <div className="divide-y divide-gray-50">
                {filteredDonors.map(donor => (
                  <DonorRow key={donor.id} donor={donor} />
                ))}
                {filteredDonors.length === 0 && (
                  <div className="p-12 text-center text-gray-500">
                    No donors found in this category.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Map Column */}
          <div>
            <div className="card p-0 overflow-hidden sticky top-24">
              <div className="bg-gray-900 p-4">
                <h3 className="text-white font-bold flex items-center gap-2">
                  <MapPin size={18} /> Live Response Map
                </h3>
              </div>
              <div className="h-[400px] relative z-0">
                 <LiveMap 
                   center={[37.7749, -122.4194]} 
                   zoom={13}
                   markers={[
                     { position: [37.7849, -122.4094], type: 'success', popup: <div className="font-bold text-success">Accepted</div> },
                     { position: [37.7649, -122.4294], type: 'success', popup: <div className="font-bold text-success">Accepted</div> },
                     { position: [37.7949, -122.4394], type: 'urgent', popup: <div className="font-bold text-warning">Pending</div> },
                     { position: [37.7549, -122.3994], type: 'urgent', popup: <div className="font-bold text-warning">Pending</div> }
                   ]}
                 />
                
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur rounded-xl p-3 shadow-lg text-xs font-bold text-gray-600 flex justify-center gap-4 z-[400]">
                  <span className="flex items-center gap-1"><div className="w-2 h-2 bg-success rounded-full"/> Accepted</span>
                  <span className="flex items-center gap-1"><div className="w-2 h-2 bg-warning rounded-full"/> Pending</span>
                  <span className="flex items-center gap-1"><div className="w-2 h-2 bg-gray-400 rounded-full"/> Declined</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default HospitalRequestDetails
