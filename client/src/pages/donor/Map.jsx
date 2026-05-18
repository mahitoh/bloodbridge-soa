import React, { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import LiveMap from '../../components/map/LiveMap'
import { MapPin, Navigation, Filter, Info } from 'lucide-react'

const DonorMap = () => {
  const [radius, setRadius] = useState(10)

  const markers = [
    { position: [37.7849, -122.4094], type: 'critical', popup: <div className="font-bold">City Memorial Hospital<br/><span className="text-critical text-xs">Critical Need (2.4km)</span></div> },
    { position: [37.7649, -122.4294], type: 'urgent', popup: <div className="font-bold">Red Cross Clinic<br/><span className="text-warning text-xs">Urgent Need (5.1km)</span></div> },
    { position: [37.7949, -122.4394], type: 'info', popup: <div className="font-bold">St. Jude Medical Center<br/><span className="text-info text-xs">Standard Need (12.0km)</span></div> }
  ]

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-120px)] lg:h-[calc(100vh-64px)] -m-6 sm:m-0">
        
        {/* Mobile Header (Hidden on desktop as sidebar covers it, but good for context) */}
        <div className="p-4 bg-white border-b border-gray-100 z-10 flex items-center justify-between shadow-sm sm:hidden">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <MapPin size={20} className="text-primary-red" /> Live Map
          </h1>
          <button className="p-2 bg-gray-50 text-gray-600 rounded-lg">
            <Filter size={18} />
          </button>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative z-0">
          <LiveMap 
            center={[37.7749, -122.4194]} 
            zoom={12}
            markers={markers}
            className="rounded-none sm:rounded-xl"
          />

          {/* Floating Action Panel (Desktop & Tablet) */}
          <div className="hidden sm:block absolute top-6 left-6 w-80 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white p-5 z-[400]">
            <h3 className="font-bold text-lg mb-1">Nearby Hospitals</h3>
            <p className="text-gray-500 text-sm mb-4">Showing locations within {radius}km</p>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-gray-500 uppercase">
                  <span>Search Radius</span>
                  <span className="text-primary-red">{radius} km</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="50" 
                  value={radius}
                  onChange={(e) => setRadius(parseInt(e.target.value))}
                  className="w-full accent-primary-red h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="pt-4 border-t border-gray-100 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-3 h-3 bg-critical rounded-full" />
                  <span>Critical Request (1)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-3 h-3 bg-warning rounded-full" />
                  <span>Urgent Request (1)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-3 h-3 bg-info rounded-full" />
                  <span>Standard Request (1)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Info Banner (Mobile) */}
          <div className="sm:hidden absolute bottom-6 left-4 right-4 bg-white rounded-xl shadow-lg border border-gray-100 p-4 z-[400] flex gap-3">
            <div className="p-2 bg-primary-light text-primary-red rounded-lg h-fit">
              <Info size={20} />
            </div>
            <div>
              <p className="font-bold text-sm">3 Hospitals found</p>
              <p className="text-xs text-gray-500">Tap on the markers to see details and respond to requests.</p>
            </div>
          </div>

          {/* Recenter Button */}
          <button className="absolute bottom-6 sm:bottom-6 right-4 sm:right-6 w-12 h-12 bg-white rounded-xl shadow-lg border border-gray-100 flex items-center justify-center text-gray-600 hover:text-primary-red transition-colors z-[400]">
            <Navigation size={20} className="ml-[-2px] mt-[2px]" />
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default DonorMap
