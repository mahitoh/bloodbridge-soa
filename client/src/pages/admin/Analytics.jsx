import React, { useState, useRef, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import StatCard from '../../components/ui/StatCard'
import Button from '../../components/ui/Button'
import { 
  Download,
  Calendar,
  Activity,
  Heart,
  Timer,
  Droplet,
  MapPin,
  TrendingUp,
  BarChart2,
  PieChart as PieChartIcon
} from 'lucide-react'

/* ─── Pure SVG Area Chart ─────────────────────────────────────────────── */
const AreaChart = ({ data, color = '#DC2626', fillColor = '#DC262620' }) => {
  const [tooltip, setTooltip] = useState(null)
  const svgRef = useRef(null)

  const W = 600, H = 200, PADDING = { top: 20, right: 20, bottom: 30, left: 36 }
  const innerW = W - PADDING.left - PADDING.right
  const innerH = H - PADDING.top - PADDING.bottom

  const max = Math.max(...data.map(d => d.value))
  const min = Math.min(...data.map(d => d.value))
  const range = max - min || 1

  const x = (i) => PADDING.left + (i / (data.length - 1)) * innerW
  const y = (v) => PADDING.top + innerH - ((v - min) / range) * innerH

  const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(d.value)}`).join(' ')
  const areaPath = `${linePath} L ${x(data.length - 1)} ${PADDING.top + innerH} L ${PADDING.left} ${PADDING.top + innerH} Z`

  const yTicks = [min, min + (range / 2), max].map(Math.round)
  const xStep = Math.floor(data.length / 4)

  return (
    <div className="relative w-full" style={{ height: 200 }}>
      <svg
        ref={svgRef}
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
        {data.filter((_, i) => i % xStep === 0 || i === data.length - 1).map((d, i, arr) => {
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

  let offset = 0
  const arcs = segments.map(seg => {
    const dash = (seg.value / total) * circ
    const gap = circ - dash
    const arc = { ...seg, dash, gap, offset }
    offset += dash
    return arc
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
  const max = Math.max(...data.map(d => d.value))
  return (
    <div className="space-y-4">
      {data.map((d, i) => (
        <div key={i}>
          <div className="flex justify-between text-sm font-bold mb-1.5">
            <span className="text-gray-700">{d.label}</span>
            <span style={{ color: d.color }}>{d.value}%</span>
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
const AdminAnalytics = () => {
  const [dateRange, setDateRange] = useState('Last 30 Days')

  const metrics = [
    { label: 'Total Requests', value: '428', icon: Activity, color: 'red', trend: '+12%' },
    { label: 'Fulfilled', value: '385', icon: Heart, color: 'green', trend: '+15%' },
    { label: 'Avg Response Time', value: '14m', icon: Timer, color: 'amber', trend: '-2m' },
    { label: 'Most Requested', value: 'O+', icon: Droplet, color: 'blue' },
  ]

  const topHospitals = [
    { name: 'General Hospital', city: 'San Francisco', requests: 142, fulfillment: '98%' },
    { name: 'Valley Medical Center', city: 'San Jose', requests: 89, fulfillment: '94%' },
    { name: 'City Memorial', city: 'Los Angeles', requests: 76, fulfillment: '92%' },
    { name: 'St. Jude Hospital', city: 'San Diego', requests: 54, fulfillment: '88%' },
  ]

  const requestsData = [
    { label: 'Oct 1', value: 45 }, { label: 'Oct 5', value: 60 },
    { label: 'Oct 10', value: 35 }, { label: 'Oct 15', value: 80 },
    { label: 'Oct 20', value: 50 }, { label: 'Oct 25', value: 90 },
    { label: 'Oct 30', value: 70 },
  ]

  const urgencyData = [
    { label: 'Critical', value: 45, color: '#ef4444' },
    { label: 'Urgent', value: 35, color: '#f59e0b' },
    { label: 'Standard', value: 20, color: '#3b82f6' },
  ]

  const fulfillmentSegments = [
    { value: 92, color: '#16a34a' },
    { value: 8, color: '#f3f4f6' },
  ]

  return (
    <DashboardLayout>
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold mb-1">Analytics & Reports</h1>
          <p className="text-gray-500">Deep dive into platform performance metrics.</p>
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
              <TrendingUp size={20} className="text-primary-red" /> Requests Over Time
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
              <BarChart2 size={16} /> By Urgency
            </h3>
            <HBarChart data={urgencyData} />
            <div className="grid grid-cols-3 gap-2 text-center border-t border-gray-100 pt-4 mt-6">
              {urgencyData.map((d, i) => (
                <div key={i}>
                  <div className="text-lg font-bold" style={{ color: d.color }}>{d.value}%</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{d.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Donut */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col items-center justify-between">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 w-full text-left flex items-center gap-2">
              <PieChartIcon size={16} /> Fulfillment
            </h3>
            <div className="relative flex items-center justify-center flex-1 py-4">
              <DonutChart segments={fulfillmentSegments} size={140} thickness={22} />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-display font-bold text-success">92%</span>
                <span className="text-xs text-gray-500 font-medium">Fulfilled</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 text-center font-medium bg-gray-50 px-3 py-1.5 rounded-full mt-2">
              Across all urgency levels
            </p>
          </div>
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-3 font-display text-lg">
              <Activity size={20} className="text-primary-red" /> Top Performing Hospitals
            </h3>
            <button className="text-sm font-bold text-blue-600 hover:text-blue-700">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 text-xs text-gray-400 uppercase tracking-widest">
                  <th className="px-6 py-4 font-bold">Hospital</th>
                  <th className="px-6 py-4 font-bold">Requests</th>
                  <th className="px-6 py-4 font-bold text-right">Fulfillment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {topHospitals.map((h, i) => (
                  <tr key={i} className="hover:bg-red-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900 group-hover:text-primary-red transition-colors">{h.name}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><MapPin size={10} /> {h.city}</p>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-700">{h.requests}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-success/10 text-success font-bold text-xs">
                        {h.fulfillment}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-3 font-display text-lg">
              <Heart size={20} className="text-primary-red" /> Top Donors (Last 30 Days)
            </h3>
            <button className="text-sm font-bold text-blue-600 hover:text-blue-700">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 text-xs text-gray-400 uppercase tracking-widest">
                  <th className="px-6 py-4 font-bold">Donor</th>
                  <th className="px-6 py-4 font-bold">Blood Type</th>
                  <th className="px-6 py-4 font-bold text-right">Donations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {['James Wilson', 'Sarah Jenkins', 'Michael Ross', 'Emily White'].map((name, i) => (
                  <tr key={i} className="hover:bg-red-50/30 transition-colors group">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-red-100 text-primary-red flex items-center justify-center font-bold text-xs shrink-0">
                        {name.charAt(0)}
                      </div>
                      <span className="font-bold text-gray-900 group-hover:text-primary-red transition-colors">{name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-primary-red border border-red-200 px-2.5 py-1 rounded-full">O+</span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-gray-700">{4 - i}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AdminAnalytics
