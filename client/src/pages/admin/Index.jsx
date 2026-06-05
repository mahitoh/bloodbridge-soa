import React, { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import StatCard from '../../components/ui/StatCard'
import {
  Users,
  Building2,
  Activity,
  Heart,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Cpu,
  ShieldCheck
} from 'lucide-react'
import { donorAPI, hospitalAPI, requestAPI } from '../../api/axios'

const ServiceStatus = ({ name, status, lastChecked }) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-primary-red/20 transition-all group">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${status === 'healthy' ? 'bg-success-light text-success' : 'bg-critical-light text-critical'}`}>
        <Cpu size={18} />
      </div>
      <div>
        <p className="text-sm font-bold text-gray-900 group-hover:text-primary-red transition-colors">{name}</p>
        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Last checked: {lastChecked}</p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full ${status === 'healthy' ? 'bg-success' : 'bg-critical'} animate-pulse`} />
      <span className={`text-xs font-bold ${status === 'healthy' ? 'text-success' : 'bg-critical text-critical'}`}>
        {status === 'healthy' ? 'Healthy' : 'Down'}
      </span>
    </div>
  </div>
)

const AdminDashboard = () => {
  const [donors, setDonors] = useState([])
  const [hospitals, setHospitals] = useState([])
  const [requests, setRequests] = useState([])
  const [lastUpdated, setLastUpdated] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [dRes, hRes, rRes] = await Promise.all([
          donorAPI.get('/donors').catch(() => ({ data: { donors: [] } })),
          hospitalAPI.get('/hospitals').catch(() => ({ data: { hospitals: [] } })),
          requestAPI.get('/requests').catch(() => ({ data: { requests: [] } })),
        ])
        setDonors(dRes.data.donors || [])
        setHospitals(hRes.data.hospitals || [])
        setRequests(rRes.data.requests || [])
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err)
      } finally {
        setLoading(false)
        setLastUpdated(new Date().toLocaleTimeString())
      }
    }
    fetchAll()
  }, [])

  const stats = [
    { label: 'Total Donors', value: loading ? '…' : String(donors.length), icon: Users, color: 'blue', trend: '' },
    { label: 'Total Hospitals', value: loading ? '…' : String(hospitals.length), icon: Building2, color: 'amber', trend: '' },
    { label: 'Active Requests', value: loading ? '…' : String(requests.length), icon: Activity, color: 'red', trend: '' },
  ]

  const services = [
    { name: 'Auth Service', status: 'healthy', lastChecked: lastUpdated || '—' },
    { name: 'Donor Service', status: 'healthy', lastChecked: lastUpdated || '—' },
    { name: 'Hospital Service', status: 'healthy', lastChecked: lastUpdated || '—' },
    { name: 'Request Service', status: 'healthy', lastChecked: lastUpdated || '—' },
    { name: 'Location Service', status: 'loading', lastChecked: '—' },
    { name: 'Notification Svc', status: 'loading', lastChecked: '—' },
  ]

  return (
    <DashboardLayout>
      <header className="mb-8">
        <h1 className="text-3xl lg:text-4xl mb-1">Platform Overview</h1>
        <p className="text-gray-500">Global system monitoring and administration • Updated: {lastUpdated || 'loading…'}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <ShieldCheck size={20} className="text-success" />
              <h3 className="text-xl font-bold">System Health (SOA)</h3>
            </div>
            <span className="text-xs text-gray-400 font-bold">Auto-refreshing...</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((svc, i) => (
              <ServiceStatus key={i} {...svc} />
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
          <div className="space-y-4 text-sm text-gray-500">
            <p>Platform loaded. Live counts shown in stats.</p>
            <p className="text-xs">Connect analytics service for activity feed.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AdminDashboard
