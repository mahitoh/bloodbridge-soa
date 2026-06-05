import React, { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import BloodTypeBadge from '../../components/ui/BloodTypeBadge'
import Button from '../../components/ui/Button'
import { Search, Filter, MoreHorizontal, Clock, Download, AlertCircle } from 'lucide-react'
import { requestAPI } from '../../api/axios'

const AdminRequestRow = ({ request }) => {
  const dt = request.created_at ? new Date(request.created_at) : null
  return (
    <tr className="hover:bg-gray-50/50 transition-colors group border-b border-gray-50 last:border-0">
      <td className="p-4">
        <div className="flex items-center gap-4">
          <BloodTypeBadge type={request.blood_type} className="scale-75 origin-left" />
          <div>
            <p className="font-bold text-gray-900">Req #{request.id}</p>
            <p className="text-xs text-gray-500 flex items-center gap-1"><Clock size={12}/> {dt ? dt.toLocaleString() : '—'}</p>
          </div>
        </div>
      </td>
      <td className="p-4">
        <p className="font-bold text-gray-900">{request.hospital_id}</p>
        <p className="text-xs text-gray-500">Hospital ID</p>
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
        <span className="text-sm font-bold text-gray-900">{request.units} units</span>
      </td>
      <td className="p-4">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
          request.status === 'Active' ? 'bg-success-light text-success' :
          request.status === 'Fulfilled' ? 'bg-info-light text-info' :
          'bg-gray-100 text-gray-500'
        }`}>
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
                <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider">Blood Type</th>
                <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider">Urgency</th>
                <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider">Units</th>
                <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider">Status</th>
                <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="p-16 text-center text-gray-500">Loading...</td></tr>
              ) : requests.length > 0 ? (
                requests.map(req => <AdminRequestRow key={req.id} request={req} />)
              ) : (
                <tr>
                  <td colSpan={6} className="p-16 text-center text-gray-500">
                    <div className="flex justify-center mb-4 text-gray-300"><AlertCircle size={48} /></div>
                    No requests found.
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
