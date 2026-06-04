import React, { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import BloodTypeBadge from '../../components/ui/BloodTypeBadge'
import Button from '../../components/ui/Button'
import LiveMap from '../../components/map/LiveMap'
import { MapPin, Clock, Filter, Search, ChevronRight, AlertTriangle } from 'lucide-react'
import { requestAPI } from '../../api/axios'

const RequestCard = ({ request }) => (
  <div className="card p-6 mb-4 group hover:border-primary-red/30 transition-all border-l-4 border-l-transparent hover:border-l-primary-red">
    <div className="flex justify-between items-start mb-4">
      <div className="flex gap-4">
        <BloodTypeBadge type={request.bloodType} />
        <div>
          <h4 className="font-bold text-gray-900 group-hover:text-primary-red transition-colors">{request.hospital}</h4>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <MapPin size={12} /> {request.distance} km away
          </p>
        </div>
      </div>
      <div className={`badge ${
        request.urgency === 'Critical' ? 'bg-critical-light text-critical' : 
        request.urgency === 'Urgent' ? 'bg-warning-light text-warning' : 'bg-info-light text-info'
      }`}>
        {request.urgency}
      </div>
    </div>
    
    <div className="flex items-center justify-between text-xs text-gray-400 mb-6">
      <span className="flex items-center gap-1"><Clock size={12} /> Posted {request.timeAgo}</span>
      <span className="flex items-center gap-1 text-primary-red font-bold animate-pulse">
        <AlertTriangle size={12} /> {request.expiry} remaining
      </span>
    </div>

    <div className="flex gap-3">
      <Button className="flex-1 btn-primary">I Can Help</Button>
      <Button className="btn-secondary px-3">Not Available</Button>
    </div>
  </div>
)

const NearbyRequests = () => {
  const [filter, setFilter] = useState('All')
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await requestAPI.get('/requests')
        setRequests(response.data.requests || [])
      } catch (err) {
        console.error('Failed to fetch requests:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchRequests()
  }, [])

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-120px)] lg:h-[calc(100vh-64px)]">
        {/* Header & Filters */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl">Nearby Blood Requests</h1>
              <p className="text-gray-500">Find people who need your help in your area</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search hospital..." 
                  className="input-field pl-10 py-2 text-sm w-64"
                />
              </div>
              <Button className="btn-secondary px-3">
                <Filter size={18} />
              </Button>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {['All', 'Critical', 'Urgent', 'Standard', 'O+', 'A-', 'B+'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  filter === f ? 'bg-primary-red text-white shadow-lg shadow-red-500/20' : 'bg-white border border-gray-100 text-gray-500 hover:bg-gray-50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </header>

        {/* Split View */}
        <div className="flex-1 flex flex-col lg:flex-row gap-8 overflow-hidden">
          {/* List View */}
          <div className="w-full lg:w-[400px] overflow-y-auto pr-2 scrollbar-hide">
            {requests.length > 0 ? (
              requests.map(req => <RequestCard key={req.id} request={req} />)
            ) : (
              <div className="card text-center py-12">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="text-gray-300" size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">No requests near you</h3>
                <p className="text-gray-500 text-sm mt-1">You'll be notified as soon as someone needs your blood type.</p>
              </div>
            )}
          </div>

          {/* Map View */}
          <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden relative min-h-[400px] z-0">
             <LiveMap 
               center={[37.7749, -122.4194]} 
               zoom={13}
               markers={[
                 { position: [37.7849, -122.4094], type: 'critical', popup: <div className="font-bold">City Memorial Hospital<br/><span className="text-critical text-xs">Critical O+ Request</span></div> },
                 { position: [37.7649, -122.4294], type: 'urgent', popup: <div className="font-bold">Red Cross Clinic<br/><span className="text-warning text-xs">Urgent O+ Request</span></div> },
                 { position: [37.7949, -122.4394], type: 'info', popup: <div className="font-bold">St. Jude Medical<br/><span className="text-info text-xs">Standard A- Request</span></div> }
               ]}
             />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default NearbyRequests
