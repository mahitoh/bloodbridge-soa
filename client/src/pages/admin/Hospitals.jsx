import React, { useState } from 'react'
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

const HospitalRow = ({ hospital }) => {
  return (
    <tr className={`hover:bg-gray-50/50 transition-colors group border-b border-gray-50 last:border-0 ${hospital.verified ? '' : 'bg-amber-50/30'}`}>
      <td className="p-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-xl">
            🏥
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-bold text-gray-900 group-hover:text-primary-red transition-colors">{hospital.name}</p>
              {hospital.verified && <ShieldCheck size={14} className="text-success" />}
            </div>
            <p className="text-xs text-gray-500">Reg: {hospital.regNumber}</p>
          </div>
        </div>
      </td>
      <td className="p-4 text-sm font-medium text-gray-700">{hospital.city}</td>
      <td className="p-4 text-sm font-bold text-gray-900">{hospital.totalRequests}</td>
      <td className="p-4">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
          hospital.status === 'Active' ? 'bg-success-light text-success' :
          hospital.status === 'Suspended' ? 'bg-critical-light text-critical' :
          'bg-gray-100 text-gray-600'
        }`}>
          {hospital.status}
        </span>
      </td>
      <td className="p-4">
        {hospital.verified ? (
          <span className="text-success font-bold text-sm flex items-center gap-1"><CheckCircle2 size={16}/> Verified</span>
        ) : (
          <Button className="btn-secondary py-1 px-3 text-xs bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200 gap-1 font-bold">
            <CheckCircle2 size={14}/> Verify
          </Button>
        )}
      </td>
      <td className="p-4 text-sm text-gray-500">{hospital.registered}</td>
      <td className="p-4 text-right">
        <button className="p-2 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
          <MoreVertical size={16} />
        </button>
      </td>
    </tr>
  )
}

const AdminHospitals = () => {
  const [filter, setFilter] = useState('All')

  const hospitals = [
    { id: 1, name: 'General Hospital', regNumber: 'BB-88291', city: 'San Francisco, CA', status: 'Active', verified: true, totalRequests: 142, registered: 'Mar 12, 2021' },
    { id: 2, name: 'City Heights Clinic', regNumber: 'BB-99210', city: 'Los Angeles, CA', status: 'Active', verified: false, totalRequests: 5, registered: '2 days ago' },
    { id: 3, name: 'St. Mary\'s Hospital', regNumber: 'BB-10392', city: 'San Diego, CA', status: 'Active', verified: false, totalRequests: 0, registered: '5 hours ago' },
    { id: 4, name: 'Valley General', regNumber: 'BB-29381', city: 'San Jose, CA', status: 'Suspended', verified: true, totalRequests: 89, registered: 'Jan 15, 2022' },
    { id: 5, name: 'Red Cross Blood Center', regNumber: 'BB-00001', city: 'National', status: 'Active', verified: true, totalRequests: 1542, registered: 'Jan 01, 2020' },
  ]

  const filteredHospitals = filter === 'All' ? hospitals : 
                            filter === 'Unverified' ? hospitals.filter(h => !h.verified) :
                            hospitals.filter(h => h.status === filter)

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
          <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-1 sm:pb-0">
            {['All', 'Active', 'Unverified', 'Suspended'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                  filter === f ? 'bg-white text-primary-red shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'
                }`}
              >
                {f}
                {f === 'Unverified' && <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] leading-none">2</span>}
              </button>
            ))}
          </div>
          
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
                <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider">Requests</th>
                <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider">Status</th>
                <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider">Verification</th>
                <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider">Registered</th>
                <th className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredHospitals.map(hospital => (
                <HospitalRow key={hospital.id} hospital={hospital} />
              ))}
            </tbody>
          </table>
          
          <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
            <span>Showing 1 to 5 of 42 hospitals</span>
            <div className="flex gap-1">
              <button className="px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50" disabled>Prev</button>
              <button className="px-3 py-1 rounded-md bg-primary-red text-white font-bold shadow-sm">1</button>
              <button className="px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors">2</button>
              <button className="px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors">Next</button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AdminHospitals
