import React, { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import BloodTypeBadge from '../../components/ui/BloodTypeBadge'
import Button from '../../components/ui/Button'
import { ArrowLeft, RefreshCw, AlertTriangle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { hospitalAPI } from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

const BloodTypeRow = ({ bloodType, units, reserved, lastUpdated }) => (
  <div className="flex items-center justify-between p-4 border-b border-gray-50 last:border-0">
    <BloodTypeBadge type={bloodType} />
    <div className="flex items-center gap-8">
      <div className="text-right">
        <p className="text-xs text-gray-400 uppercase tracking-wider">Available</p>
        <p className="text-lg font-bold text-gray-900">{units}</p>
      </div>
      <div className="text-right">
        <p className="text-xs text-gray-400 uppercase tracking-wider">Reserved</p>
        <p className="text-lg font-bold text-amber-600">{reserved}</p>
      </div>
      <div className="text-right">
        <p className="text-xs text-gray-400 uppercase tracking-wider">Updated</p>
        <p className="text-sm font-medium text-gray-700">
          {lastUpdated ? new Date(lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
        </p>
      </div>
    </div>
  </div>
)

const HospitalInventory = () => {
  const { user } = useAuth()
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const meRes = await hospitalAPI.get('/hospitals/me')
        const hospitalId = meRes.data.hospital?.id
        if (!hospitalId) {
          setError('Hospital profile not found')
          setLoading(false)
          return
        }
        const response = await hospitalAPI.get(`/hospitals/${hospitalId}/inventory`)
        setInventory(response.data.inventory || [])
      } catch (err) {
        setError('Failed to load inventory')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchInventory()
  }, [])

  const totalUnits = inventory.reduce((sum, item) => sum + (item.units_available || 0), 0)
  const criticalTypes = inventory.filter(item => (item.units_available || 0) === 0)

  return (
    <DashboardLayout>
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link to="/hospital" className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl lg:text-4xl mb-1">Blood Inventory</h1>
            <p className="text-gray-500">{user?.name || 'Hospital'} • Real-time stock levels</p>
          </div>
        </div>
        <Button className="btn-secondary gap-2">
          <RefreshCw size={18} /> Refresh
        </Button>
      </header>

      {error && (
        <div className="card border-critical-light bg-critical/5 text-critical mb-6">
          {error}
        </div>
      )}

      {criticalTypes.length > 0 && (
        <div className="card border-warning-light bg-warning/5 mb-6">
          <div className="flex items-center gap-2 text-warning mb-1">
            <AlertTriangle size={18} />
            <p className="font-bold">Low stock alert</p>
          </div>
          <p className="text-sm text-gray-700">
            Out of stock: {criticalTypes.map(t => t.blood_type).join(', ')}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="card text-center py-12 text-gray-500">Loading inventory...</div>
        ) : inventory.length === 0 ? (
          <div className="card text-center py-12 text-gray-500">No inventory records found.</div>
        ) : (
          <div className="card overflow-hidden p-0">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Blood Types</p>
                <p className="text-sm font-bold text-gray-900">Total Units: {totalUnits}</p>
              </div>
            </div>
            {inventory.map(item => (
              <BloodTypeRow
                key={item.id || item.blood_type}
                bloodType={item.blood_type}
                units={item.units_available ?? 0}
                reserved={item.units_reserved ?? 0}
                lastUpdated={item.last_updated}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default HospitalInventory
