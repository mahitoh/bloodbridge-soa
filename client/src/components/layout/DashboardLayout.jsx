import React, { useState } from 'react'
import Sidebar from './Sidebar'
import NotificationDrawer from './NotificationDrawer'
import { Home, Map as MapIcon, History, User, Bell } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { twMerge } from 'tailwind-merge'

const MobileNav = ({ onOpenNotifications }) => {
  const location = useLocation()
  const { user } = useAuth()
  
  if (!user) return null

  // For donors we show the full bottom nav
  if (user.role === 'donor') {
    const links = [
      { name: 'Home', path: '/donor', icon: Home },
      { name: 'Requests', path: '/donor/requests', icon: MapIcon },
      { name: 'Map', path: '/donor/map', icon: MapIcon },
      { name: 'History', path: '/donor/history', icon: History },
      { name: 'Profile', path: '/donor/profile', icon: User },
    ]

    return (
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        {links.map((link) => {
          const isActive = location.pathname === link.path
          const Icon = link.icon
          
          return (
            <Link
              key={link.path}
              to={link.path}
              className={twMerge(
                "flex flex-col items-center gap-1 transition-all",
                isActive ? "text-primary-red scale-110" : "text-gray-400 hover:text-gray-600"
              )}
            >
              <Icon size={24} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{link.name}</span>
            </Link>
          )
        })}
      </nav>
    )
  }

  // For Hospital/Admin we just show a simple bottom bar with notification access on mobile
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-around items-center z-50 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
       <Link to={`/${user.role}`} className={twMerge("flex flex-col items-center gap-1 transition-all", location.pathname === `/${user.role}` ? "text-primary-red" : "text-gray-400")}>
         <Home size={24} />
         <span className="text-[10px] font-bold uppercase tracking-wider">Home</span>
       </Link>
       <button onClick={onOpenNotifications} className="flex flex-col items-center gap-1 transition-all text-gray-400 hover:text-primary-red relative">
         <Bell size={24} />
         <span className="absolute top-0 right-1 w-2 h-2 bg-primary-red rounded-full" />
         <span className="text-[10px] font-bold uppercase tracking-wider">Alerts</span>
       </button>
    </nav>
  )
}

const DashboardLayout = ({ children }) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar onOpenNotifications={() => setIsNotificationsOpen(true)} />
      <main className="flex-1 pb-24 lg:pb-0">
        <div className="max-w-7xl mx-auto p-4 lg:p-8">
          {children}
        </div>
      </main>
      <MobileNav onOpenNotifications={() => setIsNotificationsOpen(true)} />
      <NotificationDrawer 
        isOpen={isNotificationsOpen} 
        onClose={() => setIsNotificationsOpen(false)} 
      />
    </div>
  )
}

export default DashboardLayout
