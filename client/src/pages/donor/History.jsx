import React, { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import StatCard from '../../components/ui/StatCard'
import BloodTypeBadge from '../../components/ui/BloodTypeBadge'
import Button from '../../components/ui/Button'
import {
  History,
  Calendar,
  Award,
  Download,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { donorAPI } from '../../api/axios'

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
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                  record.status === 'Fulfilled' ? 'bg-success-light text-success' :
                  record.status === 'Cancelled' ? 'bg-critical-light text-critical' :
                  'bg-warning-light text-warning'
                }`}>
                  {record.status}
                </span>
              </td>
              <td className="p-4 text-sm text-gray-500 max-w-xs truncate">{record.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)

const mapStatus = (status) => {
  switch (status) {
    case 'Active':
      return 'Pending'
    default:
      return status
  }
}

const DonorHistory = () => {
  const { user } = useAuth()
  const [history, setHistory] = useState([])

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await donorAPI.get(`/donors/${user?.id}/history`)
        const rows = response.data.history || []
        setHistory(rows.map((row) => ({
          id: row.id,
          hospital: row.hospital_name,
          bloodType: row.blood_type,
          status: mapStatus(row.status),
          notes: row.notes || '',
          date: new Date(row.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          time: new Date(row.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        })))
      } catch (err) {
        console.error('Failed to fetch history:', err)
      }
    }

    if (user?.id) fetchHistory()
  }, [user])

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
        <StatCard label="Total Donations" value={String(history.length)} icon={History} color="red" />
        <StatCard label="This Year" value="0" icon={Calendar} color="blue" />
        <StatCard label="Donation Streak" value="0" icon={Award} color="amber" />
      </div>

      {history.length === 0 ? (
        <div className="card text-center py-16">
          <History className="text-gray-300 mx-auto mb-4" size={32} />
          <h3 className="text-xl font-bold text-gray-900">No records yet</h3>
          <p className="text-gray-500 mt-2">Your accepted requests will appear here.</p>
        </div>
      ) : (
        <HistoryTable history={history} />
      )}
    </DashboardLayout>
  )
}

export default DonorHistory
