import React, { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import {
  Search,
  Filter,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Building2,
  ShieldCheck,
  Plus
} from 'lucide-react'
import { hospitalAPI } from '../../api/axios'

const HospitalRow = ({ hospital }) => {
  return (
    <tr className={`hover:bg-gray-50/50 transition-colors group border-b border-gray-50 last:border-0`}>
      <td className="p-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-xl">
            🏥
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-bold text-gray-900 group-hover:text-primary-red transition-colors">{hospital.name}</p>
            </div>
            <p className="text-xs text-gray-500">{hospital.email}</p>
          </div>
        </div>
      </td>
      <td className="p-4 text-sm font-medium text-gray-700">{hospital.city || '—'}</td>
      <td className="p-4 text-sm font-bold text-gray-900">{hospital.address || '—'}</td>
      <td className="p-4">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
          'bg-success-light text-success'
        }`}>
          Active
        </span>
      </td>
      <td className="p-4 text-sm text-gray-500">
        {hospital.created_at ? new Date(hospital.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
      </td>
      <td className="p-4 text-right">
        <button className="p-2 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
          <MoreVertical size={16} />
        </button>
      </td>
    </tr>
  )
}

const AdminHospitals = () => {
  const [hospitals, setHospitals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await hospitalAPI.get('/hospitals')
        setHospitals(response.data.hospitals || [])
      } catch (err) {
        console.error('Failed to fetch hospitals:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchHospitals()
  }, [])

  return (
    <DashboardLayout>
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl mb-1">Manage Hospitals</h1>
          <p className="text-gray-500">View, verify, and administer hospital accounts.</p>
        </div>
        <Button className="btn-primary gap-2 shadow-xl shadow-red-500/20">
          <Plus size={18} /> Add Hospital
        </Button>
      </header>

      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search hospital or city..."
                className="input-field pl-9 py-2 text-sm w-full sm:w-64 bg-white"
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
                <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider">Hospital Name</th>
                <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider">City</th>
                <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider">Address</th>
                <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider">Status</th>
                <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider">Registered</th>
                <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="p-16 text-center text-gray-500">Loading hospitals...</td></tr>
              ) : hospitals.length > 0 ? (
                hospitals.map(hospital => <HospitalRow key={hospital.id} hospital={hospital} />)
              ) : (
                <tr><td colSpan={6} className="p-16 text-center text-gray-500">No hospitals found.</td></tr>
              )}
            </tbody>
          </table>

          <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
            <span>Showing {hospitals.length} hospitals</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AdminHospitals
