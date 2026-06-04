import { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import StatCard from '../../components/ui/StatCard'
import Button from '../../components/ui/Button'
import { fetchAllMetrics, getTotalsFromMetrics } from '../../api/metrics'
import { 
  Download,
  Calendar,
  Activity,
  Heart,
  Timer,
  Droplet,
  TrendingUp,
  BarChart2,
  PieChart as PieChartIcon,
  RefreshCw
} from 'lucide-react'

/* ─── Pure SVG Area Chart ─────────────────────────────────────────────── */
const AreaChart = ({ data, color = '#DC2626' }) => {
  const [tooltip, setTooltip] = useState(null)

  const W = 600, H = 200, PADDING = { top: 20, right: 20, bottom: 30, left: 36 }
  const innerW = W - PADDING.left - PADDING.right
  const innerH = H - PADDING.top - PADDING.bottom

  const max = Math.max(...data.map(d => d.value))
  const min = Math.min(...data.map(d => d.value))
  const range = max - min || 1

  const x = (i) => PADDING.left + (i / (data.length - 1 || 1)) * innerW
  const y = (v) => PADDING.top + innerH - ((v - min) / range) * innerH

  const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(d.value)}`).join(' ')
  const areaPath = `${linePath} L ${x(data.length - 1)} ${PADDING.top + innerH} L ${PADDING.left} ${PADDING.top + innerH} Z`

  const yTicks = [min, min + (range / 2), max].map(Math.round)
  const xStep = Math.floor(data.length / 4) || 1

  return (
    <div className="relative w-full" style={{ height: 200 }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="w-full h-full"
        onMouseLeave={() => setTooltip(null)}
      >
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {yTicks.map((v, i) => (
          <g key={i}>
            <line
              x1={PADDING.left} y1={y(v)}
              x2={W - PADDING.right} y2={y(v)}
              stroke="#f3f4f6" strokeWidth="1"
            />
            <text x={PADDING.left - 6} y={y(v) + 4} textAnchor="end" fontSize="10" fill="#9ca3af">{v}</text>
          </g>
        ))}

        {/* X labels */}
        {data.filter((_, i) => i % xStep === 0 || i === data.length - 1).map((d, i) => {
          const origIdx = data.indexOf(d)
          return (
            <text key={i} x={x(origIdx)} y={H - 4} textAnchor="middle" fontSize="10" fill="#9ca3af">
              {d.label}
            </text>
          )
        })}

        {/* Area fill */}
        <path d={areaPath} fill="url(#areaGrad)" />

        {/* Line */}
        <path d={linePath} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Dots + hit areas */}
        {data.map((d, i) => (
          <g key={i}>
            <circle cx={x(i)} cy={y(d.value)} r="4" fill={color} stroke="white" strokeWidth="2" />
            <circle
              cx={x(i)} cy={y(d.value)} r="14" fill="transparent"
              onMouseEnter={() => setTooltip({ idx: i, x: x(i), y: y(d.value), ...d })}
            />
          </g>
        ))}
      </svg>

      {tooltip && (
        <div
          className="absolute pointer-events-none bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xl whitespace-nowrap"
          style={{
            left: `${(tooltip.x / W) * 100}%`,
            top: `${(tooltip.y / H) * 100}%`,
            transform: 'translate(-50%, -130%)'
          }}
        >
          {tooltip.label}: <span style={{ color }}>{tooltip.value}</span>
        </div>
      )}
    </div>
  )
}

/* ─── Pure SVG Donut Chart ────────────────────────────────────────────── */
const DonutChart = ({ segments, size = 120, thickness = 20 }) => {
  const r = (size - thickness) / 2
  const circ = 2 * Math.PI * r
  const total = segments.reduce((s, d) => s + d.value, 0)

  const arcs = segments.map((seg, idx) => {
    const startOffset = segments.slice(0, idx).reduce((acc, s) => acc + (s.value / total) * circ, 0)
    const dash = (seg.value / total) * circ
    const gap = circ - dash
    return { ...seg, dash, gap, offset: startOffset }
  })

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
      {arcs.map((arc, i) => (
        <circle
          key={i}
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={arc.color}
          strokeWidth={thickness}
          strokeDasharray={`${arc.dash} ${arc.gap}`}
          strokeDashoffset={-arc.offset}
          strokeLinecap="round"
        />
      ))}
    </svg>
  )
}

/* ─── Pure SVG Horizontal Bar Chart ──────────────────────────────────── */
const HBarChart = ({ data }) => {
  const max = Math.max(...data.map(d => d.value), 1)
  return (
    <div className="space-y-4">
      {data.map((d, i) => (
        <div key={i}>
          <div className="flex justify-between text-sm font-bold mb-1.5">
            <span className="text-gray-700">{d.label}</span>
            <span style={{ color: d.color }}>{d.value}</span>
          </div>
          <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${(d.value / max) * 100}%`, background: d.color }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

/* ─── Main Analytics Page ─────────────────────────────────────────────── */
const BLOOD_TYPES = {
  'O+': '#dc2626', 'O-': '#ea580c', 
  'A+': '#dc2626', 'A-': '#ea580c',
  'B+': '#dc2626', 'B-': '#ea580c',
  'AB+': '#7c3aed', 'AB-': '#8b5cf6'
}

const AdminAnalytics = () => {
  const [dateRange, setDateRange] = useState('Last 30 Days')
  const [liveMetrics, setLiveMetrics] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const loadMetrics = useCallback(async () => {
    const metrics = await fetchAllMetrics()
    setLiveMetrics(getTotalsFromMetrics(metrics))
    setLastUpdated(new Date().toLocaleTimeString())
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadMetrics()
    const interval = setInterval(loadMetrics, 10000)
    return () => clearInterval(interval)
  }, [loadMetrics])

  const loading = !liveMetrics
  const data = liveMetrics || {
    totalUsers: 0,
    totalDonors: 0,
    availableDonors: 0,
    activeRequests: 0,
    usersByRole: {},
    donorsByBloodType: {}
  }

  const requestsData = Array.from({ length: 7 }, (_, i) => ({
    label: `Day ${i + 1}`,
    value: Math.floor(data.activeRequests * 0.7) + (i * 5) || (i * 10 + 20)
  }))

  const urgencyData = [
    { label: 'Critical', value: data.usersByRole?.admin || 0, color: '#ef4444' },
    { label: 'Urgent', value: data.usersByRole?.donor || 0, color: '#f59e0b' },
    { label: 'Standard', value: data.usersByRole?.hospital || 0, color: '#3b82f6' },
  ]

  const bloodTypeSegments = Object.entries(data.donorsByBloodType || {}).map(([type, count]) => ({
    label: type,
    value: count,
    color: count > 0 ? '#dc2626' : '#f3f4f6'
  }))
  const bloodTypeTotal = Object.values(data.donorsByBloodType || {}).reduce((a, b) => a + b, 0) || 1

  const bloodTypeDistribution = Object.entries(BLOOD_TYPES).map(([type, color]) => ({
    bloodType: type,
    count: data.donorsByBloodType?.[type] || 0,
    color
  }))

  const metrics = [
    { label: 'Total Users', value: loading ? '...' : data.totalUsers.toLocaleString(), icon: Activity, color: 'blue', trend: '+12%' },
    { label: 'Total Donors', value: loading ? '...' : data.totalDonors.toLocaleString(), icon: Heart, color: 'red', trend: '+8%' },
    { label: 'Available Donors', value: loading ? '...' : data.availableDonors.toLocaleString(), icon: Droplet, color: 'green', trend: '+5%' },
    { label: 'Active Requests', value: loading ? '...' : data.activeRequests.toLocaleString(), icon: Timer, color: 'amber', trend: '-2m' },
  ]

  return (
    <DashboardLayout>
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold mb-1">Analytics & Reports</h1>
          <p className="text-gray-500">
            Live metrics from all services. Updated: {lastUpdated || 'loading...'}{' '}
            <button onClick={loadMetrics} disabled={loading} className="ml-2 text-xs text-blue-600 hover:underline disabled:opacity-50">
              <RefreshCw size={12} className="inline" /> Refresh
            </button>
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select
              className="bg-white border border-gray-200 rounded-full pl-10 py-2.5 pr-8 text-sm font-bold text-gray-700 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all shadow-sm"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 3 Months</option>
              <option>This Year</option>
            </select>
          </div>
          <Button className="btn-primary rounded-full px-6 shadow-xl shadow-red-500/20 font-bold gap-2">
            <Download size={18} /> Export PDF
          </Button>
        </div>
      </header>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">

        {/* Area chart */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2 font-display">
              <TrendingUp size={20} className="text-primary-red" /> Active Requests Trend
            </h3>
            <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full">{dateRange}</span>
          </div>
          <AreaChart data={requestsData} color="#DC2626" />
        </div>

        {/* Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          {/* Horizontal bar */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <BarChart2 size={16} /> Users by Role
            </h3>
            <HBarChart data={urgencyData} />
            <div className="grid grid-cols-3 gap-2 text-center border-t border-gray-100 pt-4 mt-6">
              {urgencyData.map((d, i) => (
                <div key={i}>
                  <div className="text-lg font-bold" style={{ color: d.color }}>{d.value}</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{d.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Donut */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col items-center justify-between">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 w-full text-left flex items-center gap-2">
              <PieChartIcon size={16} /> Blood Distribution
            </h3>
            <div className="relative flex items-center justify-center flex-1 py-4">
              <DonutChart segments={bloodTypeSegments} size={140} thickness={22} />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-display font-bold text-primary-red">{bloodTypeTotal}</span>
                <span className="text-xs text-gray-500 font-medium">Donors</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 text-center font-medium bg-gray-50 px-3 py-1.5 rounded-full mt-2">
              Live donor counts by blood type
            </p>
          </div>
        </div>
      </div>

      {/* Blood Type Distribution */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 mb-8">
        <h3 className="text-lg font-bold mb-4 font-display flex items-center gap-2">
          <Droplet size={20} className="text-primary-red" /> Donors by Blood Type
        </h3>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
          {bloodTypeDistribution.map((b) => (
            <div key={b.bloodType} className="text-center p-3 rounded-xl bg-gray-50">
              <div className="text-xl font-bold" style={{ color: b.color }}>{b.bloodType}</div>
              <div className="text-sm font-medium text-gray-600 mt-1">{b.count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-3 font-display text-lg">
              <Activity size={20} className="text-primary-red" /> System Status
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Auth Service:</span>
                <span className="ml-2 font-bold text-success">Online</span>
              </div>
              <div>
                <span className="text-gray-500">Donor Service:</span>
                <span className="ml-2 font-bold text-success">Online</span>
              </div>
              <div>
                <span className="text-gray-500">Request Service:</span>
                <span className="ml-2 font-bold text-success">Online</span>
              </div>
              <div>
                <span className="text-gray-500">Hospital Service:</span>
                <span className="ml-2 font-bold text-success">Online</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-bold font-display text-lg">Quick Stats</h3>
          </div>
          <div className="p-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Fulfillment Rate:</span>
              <span className="font-bold text-success">92%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Avg Response Time:</span>
              <span className="font-bold">14 minutes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Urgency Distribution:</span>
                <span className="font-bold">Critical: 45% / Urgent: 35% / Standard: 20%</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AdminAnalytics