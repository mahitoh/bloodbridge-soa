import React, { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import BloodTypeBadge from '../../components/ui/BloodTypeBadge'
import Button from '../../components/ui/Button'
import LiveMap from '../../components/map/LiveMap'
import { 
  Search, 
  Filter, 
  MapPin, 
  Users, 
  Navigation,
  Phone,
  Mail
} from 'lucide-react'

const DonorCard = ({ donor }) => (
  <div className="card p-4 hover:border-primary-red/30 transition-all cursor-pointer group flex flex-col">
    <div className="flex items-start sm:items-center gap-3 mb-3 w-full">
      <div className="w-10 h-10 shrink-0 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 text-lg group-hover:bg-primary-light group-hover:text-primary-red transition-colors">
        {donor.name.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-gray-900 truncate group-hover:text-primary-red transition-colors">{donor.name}</h4>
        <p className="text-xs text-gray-500 truncate flex items-center gap-1">
          <MapPin size={12} className="shrink-0"/> <span className="truncate">{donor.distance} km away</span>
        </p>
      </div>
      <BloodTypeBadge type={donor.bloodType} className="scale-75 origin-top-right sm:origin-right shrink-0" />
    </div>
    
    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
      <span>Last active: {donor.lastActive}</span>
      <span className="font-bold text-success">Available</span>
    </div>

    <div className="flex gap-2 mt-auto pt-2 border-t border-gray-50">
      <Button className="flex-1 btn-secondary py-2 px-2 text-[11px] sm:text-xs gap-1 whitespace-nowrap justify-center">
        <Phone size={14} className="shrink-0" /> Call
      </Button>
      <Button className="flex-1 btn-secondary py-2 px-2 text-[11px] sm:text-xs gap-1 whitespace-nowrap justify-center">
        <Mail size={14} className="shrink-0" /> Message
      </Button>
    </div>
  </div>
)

const HospitalDonors = () => {
  const [filter, setFilter] = useState('All')

  const donors = [
    { id: 1, name: 'Michael Ross', bloodType: 'O+', distance: 2.4, lastActive: '2 hrs ago' },
    { id: 2, name: 'Sarah Jenkins', bloodType: 'A-', distance: 5.1, lastActive: 'Just now' },
    { id: 3, name: 'David Chen', bloodType: 'B+', distance: 8.5, lastActive: '1 day ago' },
    { id: 4, name: 'Emily White', bloodType: 'O-', distance: 12.0, lastActive: '5 hrs ago' },
    { id: 5, name: 'James Wilson', bloodType: 'AB+', distance: 3.2, lastActive: '15 mins ago' },
    { id: 6, name: 'Lisa Taylor', bloodType: 'O+', distance: 7.8, lastActive: '2 days ago' },
  ]

  const filteredDonors = filter === 'All' ? donors : donors.filter(d => d.bloodType === filter)

  return (
    <DashboardLayout>
      <div className="flex flex-col min-h-[calc(100vh-80px)] lg:h-[calc(100vh-64px)] pb-6 lg:pb-0">
        <header className="mb-6 shrink-0">
          <h1 className="text-3xl lg:text-4xl font-display font-bold mb-1">Nearby Donors Map</h1>
          <p className="text-gray-500">Discover and contact available donors in your area.</p>
        </header>

        <div className="flex-1 flex flex-col lg:flex-row gap-6 lg:overflow-hidden">
          
          {/* Controls & List */}
          <div className="w-full lg:w-96 flex flex-col gap-4 lg:h-full">
            <div className="card p-5 space-y-5 shrink-0 bg-white/80 backdrop-blur-xl border-gray-100 shadow-md relative z-10">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search by name..." 
                  className="input-field pl-9 py-2 text-sm"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Blood Type</label>
                <div className="flex flex-wrap gap-2">
                  {['All', 'O+', 'O-', 'A+', 'A-', 'B+', 'AB+'].map(f => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-3 py-1 rounded-lg text-sm font-bold transition-all ${
                        filter === f ? 'bg-primary-red text-white shadow-sm' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Search Radius</label>
                  <span className="text-primary-red font-bold text-sm">20 km</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="100" 
                  defaultValue="20"
                  className="w-full accent-primary-red h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide pr-2 space-y-3 min-h-[350px] lg:min-h-0 pb-4">
              <div className="flex items-center justify-between px-2 mb-2">
                <span className="font-bold text-gray-900">{filteredDonors.length} Donors Found</span>
                <span className="text-xs text-gray-500 flex items-center gap-1">Sorted by Distance</span>
              </div>
              
              {filteredDonors.map(donor => (
                <DonorCard key={donor.id} donor={donor} />
              ))}
            </div>
          </div>

          {/* Full Map View */}
          <div className="flex-1 card p-0 overflow-hidden relative min-h-[400px] z-0">
             <LiveMap 
               center={[37.7749, -122.4194]} 
               zoom={12}
               markers={[
                 { position: [37.7649, -122.4294], type: 'donor', popup: <div className="font-bold">Michael Ross<br/><span className="text-gray-500 text-xs">O+ • 2.4km</span></div> },
                 { position: [37.7949, -122.4094], type: 'donor', popup: <div className="font-bold">Sarah Jenkins<br/><span className="text-gray-500 text-xs">A- • 5.1km</span></div> },
                 { position: [37.7849, -122.4394], type: 'donor', popup: <div className="font-bold">David Chen<br/><span className="text-gray-500 text-xs">B+ • 8.5km</span></div> },
                 { position: [37.7549, -122.3994], type: 'donor', popup: <div className="font-bold">Emily White<br/><span className="text-gray-500 text-xs">O- • 12.0km</span></div> }
               ]}
             />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default HospitalDonors
