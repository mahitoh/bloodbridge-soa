import React from 'react'
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
  Database,
  Network,
  Bell,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react'

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
      <span className={`text-xs font-bold ${status === 'healthy' ? 'text-success' : 'text-critical'}`}>
        {status === 'healthy' ? 'Healthy' : 'Down'}
      </span>
    </div>
  </div>
)

const PendingVerification = ({ hospital }) => (
  <div className="flex items-center justify-between p-4 border-b border-gray-50 last:border-0 group">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 font-bold">
        {hospital.name.charAt(0)}
      </div>
      <div>
        <p className="text-sm font-bold text-gray-900">{hospital.name}</p>
        <p className="text-xs text-gray-500">{hospital.city} • {hospital.date}</p>
      </div>
    </div>
    <div className="flex gap-2">
      <button className="p-2 text-success hover:bg-success-light rounded-lg transition-colors">
        <CheckCircle2 size={18} />
      </button>
      <button className="p-2 text-critical hover:bg-critical-light rounded-lg transition-colors">
        <AlertCircle size={18} />
      </button>
    </div>
  </div>
)

const AdminDashboard = () => {
  const stats = [
    { label: 'Total Donors', value: '1,284', icon: Users, color: 'blue', trend: '+124' },
    { label: 'Total Hospitals', value: '42', icon: Building2, color: 'amber', trend: '+3' },
    { label: 'Active Requests', value: '18', icon: Activity, color: 'red', trend: '-2' },
    { label: 'Lives Saved', value: '4,102', icon: Heart, color: 'green', trend: '+218' },
  ]

  const services = [
    { name: 'Auth Service', status: 'healthy', lastChecked: '30s ago' },
    { name: 'Donor Service', status: 'healthy', lastChecked: '30s ago' },
    { name: 'Hospital Service', status: 'healthy', lastChecked: '30s ago' },
    { name: 'Request Service', status: 'healthy', lastChecked: '30s ago' },
    { name: 'Location Service', status: 'healthy', lastChecked: '30s ago' },
    { name: 'Notification Svc', status: 'healthy', lastChecked: '30s ago' },
  ]

  const verifications = [
    { name: 'City Heights Clinic', city: 'Los Angeles', date: '2h ago' },
    { name: 'St. Mary\'s Hospital', city: 'San Diego', date: '5h ago' },
    { name: 'Valley General', city: 'San Jose', date: 'Yesterday' },
  ]

  return (
    <DashboardLayout>
      <header className="mb-8">
        <h1 className="text-3xl lg:text-4xl mb-1">Platform Overview</h1>
        <p className="text-gray-500">Global system monitoring and administration</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Analytics Placeholder */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card h-80">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">Requests per Day</h3>
                <TrendingUp size={18} className="text-success" />
              </div>
              <div className="flex items-end justify-between h-48 gap-2">
                {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                  <div key={i} className="flex-1 bg-primary-light rounded-t-lg group relative cursor-pointer hover:bg-primary-red transition-colors" style={{ height: `${h}%` }}>
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {h} requests
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest px-2">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
            </div>

            <div className="card h-80 flex flex-col">
              <h3 className="text-lg font-bold mb-6">Blood Type Distribution</h3>
              <div className="flex-1 flex items-center justify-center relative">
                <div className="w-40 h-40 rounded-full border-[12px] border-primary-red relative">
                  <div className="absolute inset-0 border-[12px] border-info rounded-full rotate-45 border-t-transparent border-r-transparent" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold">O+</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Leading</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                  <div className="w-3 h-3 rounded bg-primary-red" /> O+ (42%)
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                  <div className="w-3 h-3 rounded bg-info" /> A+ (28%)
                </div>
              </div>
            </div>
          </div>

          {/* System Health */}
          <div>
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
        </div>

        {/* Verifications & Activity */}
        <div className="space-y-8">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Pending Verifications</h3>
              <span className="badge bg-amber-100 text-amber-700">{verifications.length}</span>
            </div>
            <div className="space-y-2">
              {verifications.map((hospital, i) => (
                <PendingVerification key={i} hospital={hospital} />
              ))}
            </div>
            <button className="w-full mt-6 py-3 text-sm font-bold text-primary-red hover:bg-primary-light rounded-xl transition-all">
              View All Pending
            </button>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold mb-6">Recent Activity</h3>
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-3 relative">
                  {i !== 3 && <div className="absolute left-4 top-8 bottom-0 w-px bg-gray-100" />}
                  <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 z-10">
                    <TrendingUp size={14} className="text-gray-400" />
                  </div>
                  <div className="pb-6">
                    <p className="text-xs text-gray-900 leading-tight">
                      New donor registration: <span className="font-bold">Michael Ross</span> from NYC
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">20 minutes ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AdminDashboard
