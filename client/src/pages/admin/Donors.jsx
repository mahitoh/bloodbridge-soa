import React, { useState } from 'react'
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

const DonorRow = ({ donor }) => {
  return (
    <tr className="hover:bg-gray-50/50 transition-colors group border-b border-gray-50 last:border-0">
      <td className="p-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-gray-500 group-hover:bg-primary-light group-hover:text-primary-red transition-colors">
            {donor.name.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-gray-900 group-hover:text-primary-red transition-colors">{donor.name}</p>
            <p className="text-xs text-gray-500">{donor.email}</p>
          </div>
        </div>
      </td>
      <td className="p-4"><BloodTypeBadge type={donor.bloodType} className="scale-75 origin-left" /></td>
      <td className="p-4 text-sm font-medium text-gray-700">{donor.city}</td>
      <td className="p-4">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
          donor.status === 'Active' ? 'bg-success-light text-success' :
          donor.status === 'Suspended' ? 'bg-critical-light text-critical' :
          'bg-warning-light text-warning'
        }`}>
          {donor.status === 'Active' && <CheckCircle2 size={12} />}
          {donor.status === 'Suspended' && <XCircle size={12} />}
          {donor.status === 'Pending' && <Clock size={12} />}
          {donor.status}
        </span>
      </td>
      <td className="p-4 text-sm text-gray-500">
        <div><span className="font-bold text-gray-900">{donor.totalDonations}</span> donations</div>
        <div className="text-xs mt-0.5">Last: {donor.lastDonation}</div>
      </td>
      <td className="p-4 text-sm text-gray-500">{donor.registered}</td>
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

  const donors = [
    { id: 1, name: 'Michael Ross', email: 'michael.r@example.com', bloodType: 'O+', city: 'New York, NY', status: 'Active', lastDonation: 'Mar 12, 2024', totalDonations: 14, registered: 'Jan 2021' },
    { id: 2, name: 'Sarah Jenkins', email: 'sarah.j@example.com', bloodType: 'A-', city: 'San Francisco, CA', status: 'Active', lastDonation: 'Dec 05, 2023', totalDonations: 8, registered: 'Mar 2022' },
    { id: 3, name: 'David Chen', email: 'd.chen@example.com', bloodType: 'B+', city: 'Seattle, WA', status: 'Pending', lastDonation: 'Never', totalDonations: 0, registered: 'Today' },
    { id: 4, name: 'Emily White', email: 'emily.w@example.com', bloodType: 'O-', city: 'Austin, TX', status: 'Suspended', lastDonation: 'Jun 22, 2023', totalDonations: 3, registered: 'Feb 2023' },
    { id: 5, name: 'James Wilson', email: 'j.wilson@example.com', bloodType: 'AB+', city: 'Chicago, IL', status: 'Active', lastDonation: 'Jan 15, 2024', totalDonations: 21, registered: 'Aug 2019' },
  ]

  const filteredDonors = filter === 'All' ? donors : donors.filter(d => d.status === filter)

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

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card p-4 flex items-center justify-between">
          <div><p className="text-xs font-bold text-gray-400 uppercase">Total</p><p className="text-2xl font-bold">1,284</p></div>
        </div>
        <div className="card p-4 flex items-center justify-between">
          <div><p className="text-xs font-bold text-success uppercase">Active</p><p className="text-2xl font-bold">1,102</p></div>
        </div>
        <div className="card p-4 flex items-center justify-between">
          <div><p className="text-xs font-bold text-critical uppercase">Suspended</p><p className="text-2xl font-bold">45</p></div>
        </div>
        <div className="card p-4 flex items-center justify-between">
          <div><p className="text-xs font-bold text-warning uppercase">Pending</p><p className="text-2xl font-bold">137</p></div>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-1 sm:pb-0">
            {['All', 'Active', 'Pending', 'Suspended'].map(f => (
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
                placeholder="Search name or email..." 
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
              {filteredDonors.map(donor => (
                <DonorRow key={donor.id} donor={donor} />
              ))}
            </tbody>
          </table>
          
          <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
            <span>Showing 1 to 5 of 1,284 donors</span>
            <div className="flex gap-1">
              <button className="px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50" disabled>Prev</button>
              <button className="px-3 py-1 rounded-md bg-primary-red text-white font-bold shadow-sm">1</button>
              <button className="px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors">2</button>
              <button className="px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors">3</button>
              <button className="px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors">Next</button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AdminDonors
