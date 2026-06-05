import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  Map as MapIcon, 
  History, 
  User, 
  Bell, 
  LogOut, 
  PlusCircle, 
  ClipboardList, 
  Users, 
  BarChart3, 
  Settings,
  ShieldCheck,
  Activity
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { twMerge } from 'tailwind-merge'

const Sidebar = ({ onOpenNotifications }) => {
  const { user, logout } = useAuth()
  const location = useLocation()
  
  const donorLinks = [
    { name: 'Dashboard', path: '/donor', icon: Home },
    { name: 'Nearby Requests', path: '/donor/requests', icon: MapIcon },
    { name: 'Live Map', path: '/donor/map', icon: MapIcon },
    { name: 'My History', path: '/donor/history', icon: History },
    { name: 'My Profile', path: '/donor/profile', icon: User },
    { name: 'Notifications', action: onOpenNotifications, icon: Bell, badge: 3 },
  ]

  const hospitalLinks = [
    { name: 'Dashboard', path: '/hospital', icon: Home },
    { name: 'Post Request', path: '/hospital/requests/new', icon: PlusCircle, highlight: true },
    { name: 'All Requests', path: '/hospital/requests', icon: ClipboardList },
    { name: 'Nearby Donors', path: '/hospital/donors', icon: Users },
    { name: 'Hospital Profile', path: '/hospital/profile', icon: Activity },
    { name: 'Notifications', action: onOpenNotifications, icon: Bell, badge: 5 },
  ]

  const adminLinks = [
    { name: 'Overview', path: '/admin', icon: BarChart3 },
    { name: 'Manage Donors', path: '/admin/donors', icon: Users },
    { name: 'Manage Hospitals', path: '/admin/hospitals', icon: Activity },
    { name: 'All Requests', path: '/admin/requests', icon: ClipboardList },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ]

  const links = user?.role === 'admin' ? adminLinks : 
                user?.role === 'hospital' ? hospitalLinks : 
                donorLinks

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 h-screen sticky top-0 z-40">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 flex items-center justify-center group-hover:scale-110 transition-transform">
            <img src="./favicon.svg" alt="BloodBridge Logo" className="w-full h-full object-contain drop-shadow-md" />
          </div>
          <span className="text-xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            BloodBridge
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {links.map((link) => {
          const isActive = location.pathname === link.path && !link.action
          const Icon = link.icon
          
          if (link.action) {
            return (
              <button
                key={link.name}
                onClick={link.action}
                className={twMerge(
                  "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} className="group-hover:scale-110 transition-transform" />
                  <span className="font-medium">{link.name}</span>
                </div>
                {link.badge && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-primary-red text-white">
                    {link.badge}
                  </span>
                )}
              </button>
            )
          }

          return (
            <Link
              key={link.path}
              to={link.path}
              className={twMerge(
                "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-primary-red text-white shadow-lg shadow-red-500/20" 
                  : link.highlight 
                    ? "bg-primary-light text-primary-red hover:bg-primary-red hover:text-white"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon size={20} className={twMerge(isActive ? "text-white" : "group-hover:scale-110 transition-transform")} />
                <span className="font-medium">{link.name}</span>
              </div>
              {link.badge && (
                <span className={twMerge(
                  "px-2 py-0.5 text-xs font-bold rounded-full",
                  isActive ? "bg-white text-primary-red" : "bg-primary-red text-white"
                )}>
                  {link.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary-red/10 flex items-center justify-center text-primary-red font-bold text-lg">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || 'User'}</p>
            <div className="flex items-center gap-1">
              <p className="text-xs text-gray-500 truncate">{user?.bloodType || 'O+'}</p>
              {user?.role === 'hospital' && <ShieldCheck size={12} className="text-success" />}
            </div>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 text-gray-500 hover:text-primary-red hover:bg-red-50 rounded-xl transition-all group"
        >
          <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
