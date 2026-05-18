import React, { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import BloodTypeBadge from '../../components/ui/BloodTypeBadge'
import Button from '../../components/ui/Button'
import { 
  Search, 
  Filter, 
  MoreHorizontal,
  Clock,
  Download,
  AlertCircle
} from 'lucide-react'
import { Link } from 'react-router-dom'

const AdminRequestRow = ({ request }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'bg-success-light text-success'
      case 'Pending': return 'bg-warning-light text-warning'
      case 'Fulfilled': return 'bg-info-light text-info'
      case 'Cancelled': return 'bg-gray-100 text-gray-500'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <tr className="hover:bg-gray-50/50 transition-colors group border-b border-gray-50 last:border-0">
      <td className="p-4">
        <div className="flex items-center gap-4">
          <BloodTypeBadge type={request.bloodType} className="scale-75 origin-left" />
          <div>
            <p className="font-bold text-gray-900">Req #{request.id}</p>
            <p className="text-xs text-gray-500 flex items-center gap-1"><Clock size={12}/> {request.date}</p>
          </div>
        </div>
      </td>
      <td className="p-4">
        <p className="font-bold text-gray-900">{request.hospital}</p>
        <p className="text-xs text-gray-500">{request.city}</p>
      </td>
      <td className="p-4">
        <span className={`badge ${
          request.urgency === 'Critical' ? 'bg-critical-light text-critical' : 
          request.urgency === 'Urgent' ? 'bg-warning-light text-warning' : 'bg-info-light text-info'
        }`}>
          {request.urgency}
        </span>
      </td>
      <td className="p-4">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs font-bold w-32">
            <span className="text-gray-500">{request.secured}/{request.needed} units</span>
            <span className="text-primary-red">{Math.round((request.secured/request.needed) * 100)}%</span>
          </div>
          <div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary-red rounded-full" 
              style={{ width: `${(request.secured/request.needed) * 100}%` }}
            />
          </div>
        </div>
      </td>
      <td className="p-4">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(request.status)}`}>
          {request.status}
        </span>
      </td>
      <td className="p-4 text-right">
        <button className="p-1.5 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
          <MoreHorizontal size={16} />
        </button>
      </td>
    </tr>
  )
}

const AdminRequests = () => {
  const [activeTab, setActiveTab] = useState('All')

  const requests = [
    { id: 1045, hospital: 'General Hospital', city: 'San Francisco, CA', bloodType: 'O+', urgency: 'Critical', secured: 1, needed: 3, status: 'Active', date: 'Today, 10:30 AM' },
    { id: 1044, hospital: 'City Memorial', city: 'Los Angeles, CA', bloodType: 'AB-', urgency: 'Urgent', secured: 0, needed: 1, status: 'Active', date: 'Today, 09:15 AM' },
    { id: 1042, hospital: 'Valley General', city: 'San Jose, CA', bloodType: 'A-', urgency: 'Urgent', secured: 2, needed: 2, status: 'Pending', date: 'Yesterday, 02:15 PM' },
    { id: 1038, hospital: 'Red Cross Clinic', city: 'National', bloodType: 'B+', urgency: 'Standard', secured: 4, needed: 4, status: 'Fulfilled', date: 'Oct 12, 09:00 AM' },
    { id: 1035, hospital: 'St. Mary\'s', city: 'San Diego, CA', bloodType: 'AB+', urgency: 'Critical', secured: 0, needed: 2, status: 'Cancelled', date: 'Oct 10, 11:45 AM' },
  ]

  const tabs = ['All', 'Active', 'Pending', 'Fulfilled', 'Cancelled']
  
  const filteredRequests = activeTab === 'All' ? requests : requests.filter(r => r.status === activeTab)

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl mb-1">Global Requests</h1>
          <p className="text-gray-500">Monitor all blood requests across the network.</p>
        </div>
        <Button className="btn-secondary gap-2">
          <Download size={18} /> Export Log
        </Button>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-1 sm:pb-0">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                  activeTab === tab ? 'bg-white text-primary-red shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search ID or Hospital..." 
                className="input-field pl-9 py-2 text-sm w-full sm:w-56 bg-white"
              />
            </div>
            <Button className="btn-secondary px-3 py-2 bg-white">
              <Filter size={16} />
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider">Request ID</th>
                <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider">Hospital</th>
                <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider">Urgency</th>
                <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider">Progress</th>
                <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider">Status</th>
                <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map(req => (
                <AdminRequestRow key={req.id} request={req} />
              ))}
              {filteredRequests.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-16 text-center text-gray-500">
                    <div className="flex justify-center mb-4 text-gray-300">
                      <AlertCircle size={48} />
                    </div>
                    No requests found matching this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AdminRequests
