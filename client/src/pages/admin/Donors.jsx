import React, { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import BloodTypeBadge from '../../components/ui/BloodTypeBadge'
import Button from '../../components/ui/Button'
import {
  Search,
  Filter,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  UserPlus
} from 'lucide-react'
import { donorAPI } from '../../api/axios'

const DonorRow = ({ donor }) => {
  return (
    <tr className="hover:bg-gray-50/50 transition-colors group border-b border-gray-50 last:border-0">
      <td className="p-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-gray-500 group-hover:bg-primary-light group-hover:text-primary-red transition-colors">
            {donor.name?.charAt(0) || '?'}
          </div>
          <div>
            <p className="font-bold text-gray-900 group-hover:text-primary-red transition-colors">{donor.name}</p>
            <p className="text-xs text-gray-500">{donor.phone || donor.city || ''}</p>
          </div>
        </div>
      </td>
      <td className="p-4"><BloodTypeBadge type={donor.blood_type} className="scale-75 origin-left" /></td>
      <td className="p-4 text-sm font-medium text-gray-700">{donor.city}</td>
      <td className="p-4">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
          donor.available ? 'bg-success-light text-success' : 'bg-gray-100 text-gray-500'
        }`}>
          {donor.available ? <CheckCircle2 size={12} /> : <Clock size={12} />}
          {donor.available ? 'Active' : 'Unavailable'}
        </span>
      </td>
      <td className="p-4 text-sm text-gray-500">
        <div><span className="font-bold text-gray-900">—</span> donations</div>
        <div className="text-xs mt-0.5">Last: —</div>
      </td>
      <td className="p-4 text-sm text-gray-500">
        {donor.created_at ? new Date(donor.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''}
      </td>
      <td className="p-4 text-right">
        <button className="p-2 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
          <MoreVertical size={16} />
        </button>
      </td>
    </tr>
  )
}

const AdminDonors = () => {
  const [filter, setFilter] = useState('All')
  const [donors, setDonors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const response = await donorAPI.get('/donors')
        setDonors(response.data.donors || [])
      } catch (err) {
        console.error('Failed to fetch donors:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchDonors()
  }, [])

  const filteredDonors = filter === 'All' ? donors : donors.filter(d => d.available ? 'Active' : 'Unavailable' === filter || (!d.available && filter === 'Unavailable'))

  const stats = {
    total: donors.length,
    active: donors.filter(d => d.available).length,
    inactive: donors.filter(d => !d.available).length,
  }

  return (
    <DashboardLayout>
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl mb-1">Manage Donors</h1>
          <p className="text-gray-500">View and administer registered blood donors across the platform.</p>
        </div>
        <div className="flex gap-2">
          <Button className="btn-secondary gap-2 hidden sm:flex">
            <Download size={18} /> Export
          </Button>
          <Button className="btn-primary gap-2 shadow-xl shadow-red-500/20">
            <UserPlus size={18} /> Add Donor
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card p-4 flex items-center justify-between">
          <div><p className="text-xs font-bold text-gray-400 uppercase">Total</p><p className="text-2xl font-bold">{stats.total}</p></div>
        </div>
        <div className="card p-4 flex items-center justify-between">
          <div><p className="text-xs font-bold text-success uppercase">Active</p><p className="text-2xl font-bold">{stats.active}</p></div>
        </div>
        <div className="card p-4 flex items-center justify-between">
          <div><p className="text-xs font-bold text-gray-400 uppercase">Unavailable</p><p className="text-2xl font-bold">{stats.inactive}</p></div>
        </div>
        <div className="card p-4 flex items-center justify-between">
          <div><p className="text-xs font-bold text-warning uppercase">Loading</p><p className="text-2xl font-bold">{loading ? '…' : '—'}</p></div>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-1 sm:pb-0">
            {['All', 'Active', 'Unavailable'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                  filter === f ? 'bg-white text-primary-red shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search name or city..."
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
                <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider">Donor Info</th>
                <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider">Blood Type</th>
                <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider">City</th>
                <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider">Status</th>
                <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider">Donations</th>
                <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider">Registered</th>
                <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="p-16 text-center text-gray-500">Loading donors...</td></tr>
              ) : filteredDonors.length > 0 ? (
                filteredDonors.map(donor => <DonorRow key={donor.id} donor={donor} />)
              ) : (
                <tr><td colSpan={7} className="p-16 text-center text-gray-500">No donors found.</td></tr>
              )}
            </tbody>
          </table>

          <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
            <span>Showing {filteredDonors.length} donors</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AdminDonors
