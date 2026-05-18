import React, { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import { 
  Settings as SettingsIcon, 
  Shield, 
  Bell, 
  Globe, 
  Database,
  Lock,
  Save
} from 'lucide-react'

const AdminSettings = () => {
  return (
    <DashboardLayout>
      <header className="mb-8">
        <h1 className="text-3xl lg:text-4xl mb-1">Platform Settings</h1>
        <p className="text-gray-500">Manage global configurations and security parameters.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Settings Navigation */}
        <div className="lg:col-span-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-primary-red text-white font-bold shadow-md">
            <Globe size={18} /> General System
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 font-medium transition-colors">
            <Shield size={18} /> Security & Access
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 font-medium transition-colors">
            <Database size={18} /> Data Management
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 font-medium transition-colors">
            <Bell size={18} /> Notification Services
          </button>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Globe className="text-primary-red" size={20} /> System Defaults
            </h3>
            
            <div className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Platform Name</label>
                <input type="text" className="input-field" defaultValue="BloodBridge SOA" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Default Search Radius (km)</label>
                  <input type="number" className="input-field" defaultValue="20" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Max Search Radius (km)</label>
                  <input type="number" className="input-field" defaultValue="100" />
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-100">
                <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                  <input type="checkbox" className="w-5 h-5 text-primary-red rounded focus:ring-primary-red" defaultChecked />
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">Auto-suspend inactive donors</p>
                    <p className="text-xs text-gray-500">Suspend accounts inactive for more than 1 year</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                  <input type="checkbox" className="w-5 h-5 text-primary-red rounded focus:ring-primary-red" defaultChecked />
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">Require manual hospital verification</p>
                    <p className="text-xs text-gray-500">New hospital accounts must be approved by an admin</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <Button className="btn-primary gap-2">
                <Save size={18} /> Save Configurations
              </Button>
            </div>
          </div>

          <div className="card border-critical-light bg-critical/5">
            <h3 className="text-lg font-bold text-critical flex items-center gap-2 mb-4">
              <Lock size={20} /> Advanced Danger Zone
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              These actions affect the global platform state and cannot be undone.
            </p>
            <div className="flex gap-4">
               <Button className="btn-secondary text-critical border-critical-light hover:bg-critical-light">
                 Clear Cache
               </Button>
               <Button className="btn-secondary text-critical border-critical-light hover:bg-critical-light">
                 Maintenance Mode
               </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AdminSettings
