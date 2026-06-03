import React, { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import StatCard from '../../components/ui/StatCard'
import BloodTypeBadge from '../../components/ui/BloodTypeBadge'
import Button from '../../components/ui/Button'
import { 
  History, 
  Calendar, 
  Award, 
  Download,
  Filter,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react'

const HistoryTable = ({ history }) => (
  <div className="card overflow-hidden p-0">
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            <th className="p-4 font-bold text-gray-500 text-sm uppercase tracking-wider">Date</th>
            <th className="p-4 font-bold text-gray-500 text-sm uppercase tracking-wider">Hospital</th>
            <th className="p-4 font-bold text-gray-500 text-sm uppercase tracking-wider">Type</th>
            <th className="p-4 font-bold text-gray-500 text-sm uppercase tracking-wider">Status</th>
            <th className="p-4 font-bold text-gray-500 text-sm uppercase tracking-wider">Notes</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {history.map((record) => (
            <tr key={record.id} className="hover:bg-gray-50/50 transition-colors group">
              <td className="p-4">
                <p className="font-bold text-gray-900 group-hover:text-primary-red transition-colors">{record.date}</p>
                <p className="text-xs text-gray-500">{record.time}</p>
              </td>
              <td className="p-4 font-medium text-gray-700">{record.hospital}</td>
              <td className="p-4"><BloodTypeBadge type={record.bloodType} className="scale-75 origin-left" /></td>
              <td className="p-4">
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                  record.status === 'Completed' ? 'bg-success-light text-success' :
                  record.status === 'Cancelled' ? 'bg-critical-light text-critical' :
                  'bg-warning-light text-warning'
                }`}>
                  {record.status === 'Completed' && <CheckCircle2 size={12} />}
                  {record.status === 'Cancelled' && <XCircle size={12} />}
                  {record.status === 'Pending' && <Clock size={12} />}
                  {record.status}
                </div>
              </td>
              <td className="p-4 text-sm text-gray-500 max-w-xs truncate">{record.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)

const DonorHistory = () => {
  const [filter, setFilter] = useState('All')

  const history = [
    { id: 1, date: 'Mar 12, 2024', time: '10:30 AM', hospital: 'City Memorial Hospital', bloodType: 'O+', status: 'Completed', notes: 'Routine whole blood donation.' },
    { id: 2, date: 'Dec 05, 2023', time: '02:15 PM', hospital: 'Red Cross Clinic', bloodType: 'O+', status: 'Completed', notes: 'Urgent request response.' },
    { id: 3, date: 'Sep 18, 2023', time: '09:00 AM', hospital: 'St. Jude Medical Center', bloodType: 'O+', status: 'Completed', notes: 'Donated at mobile drive.' },
    { id: 4, date: 'Jun 22, 2023', time: '11:45 AM', hospital: 'Hope General Hospital', bloodType: 'O+', status: 'Cancelled', notes: 'Low iron levels. Deferred for 2 weeks.' },
  ]

  const filteredHistory = filter === 'All' ? history : history.filter(h => h.status === filter)

  return (
    <DashboardLayout>
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl mb-1">Donation History</h1>
          <p className="text-gray-500">Track your life-saving impact over time.</p>
        </div>
        <Button className="btn-secondary gap-2">
          <Download size={18} /> Download Report
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard label="Total Donations" value="12" icon={History} color="red" />
        <StatCard label="This Year" value="1" icon={Calendar} color="blue" />
        <StatCard label="Donation Streak" value="4 yrs" icon={Award} color="amber" />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex gap-2">
          {['All', 'Completed', 'Pending', 'Cancelled'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                filter === f ? 'bg-gray-900 text-white' : 'bg-white border border-gray-100 text-gray-500 hover:bg-gray-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <Button className="btn-secondary px-3">
          <Filter size={18} /> Filter by Date
        </Button>
      </div>

      {filteredHistory.length > 0 ? (
        <HistoryTable history={filteredHistory} />
      ) : (
        <div className="card text-center py-16">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <History className="text-gray-300" size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">No records found</h3>
          <p className="text-gray-500 mt-2">You haven't made any donations matching this filter.</p>
        </div>
      )}
    </DashboardLayout>
  )
}

export default DonorHistory
