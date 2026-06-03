import React from 'react'
import { X, Bell, CheckCircle2, AlertCircle, Info, Trash2 } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

const NotificationItem = ({ notification, onRead }) => {
  const icons = {
    critical: <div className="p-2 bg-critical-light text-critical rounded-lg"><AlertCircle size={18} /></div>,
    success: <div className="p-2 bg-success-light text-success rounded-lg"><CheckCircle2 size={18} /></div>,
    warning: <div className="p-2 bg-warning-light text-warning rounded-lg"><AlertCircle size={18} /></div>,
    info: <div className="p-2 bg-info-light text-info rounded-lg"><Info size={18} /></div>,
  }

  return (
    <div className={twMerge(
      "p-4 border-b border-gray-50 flex gap-4 transition-all hover:bg-gray-50 cursor-pointer group",
      !notification.read && "bg-blue-50/30 border-l-4 border-l-primary-red"
    )} onClick={() => onRead(notification.id)}>
      <div className="shrink-0">
        {icons[notification.type] || icons.info}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <h4 className={twMerge("text-sm font-bold truncate", !notification.read ? "text-gray-900" : "text-gray-500")}>
            {notification.title}
          </h4>
          <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap ml-2">{notification.timeAgo}</span>
        </div>
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{notification.message}</p>
      </div>
    </div>
  )
}

const NotificationDrawer = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = React.useState([
    { id: 1, type: 'critical', title: 'New Urgent Request', message: 'Hospital Memorial needs O+ blood urgently. You are a match!', timeAgo: '2m ago', read: false },
    { id: 2, type: 'success', title: 'Account Verified', message: 'Your donor profile has been successfully verified by our team.', timeAgo: '1h ago', read: false },
    { id: 3, type: 'info', title: 'System Update', message: 'BloodBridge has been updated to v2.4 with new map features.', timeAgo: '5h ago', read: true },
  ])

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const clearAll = () => {
    setNotifications([])
  }

  const markRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]" onClick={onClose} />
      
      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-[70] animate-in slide-in-from-right duration-300 flex flex-col">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell size={20} className="text-primary-red" />
            <h2 className="text-xl font-bold">Notifications</h2>
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="badge bg-primary-red text-white">
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex gap-2 p-4 bg-gray-50/50">
          <button 
            onClick={markAllRead}
            className="flex-1 text-xs font-bold text-gray-500 hover:text-primary-red py-2 px-3 bg-white rounded-lg border border-gray-100 transition-all shadow-sm"
          >
            Mark all read
          </button>
          <button 
            onClick={clearAll}
            className="flex items-center justify-center p-2 text-gray-400 hover:text-critical bg-white rounded-lg border border-gray-100 transition-all shadow-sm"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {notifications.length > 0 ? (
            notifications.map(n => (
              <NotificationItem key={n.id} notification={n} onRead={markRead} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-12 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Bell className="text-gray-200" size={32} />
              </div>
              <h3 className="font-bold text-gray-900">All caught up!</h3>
              <p className="text-sm text-gray-400 mt-1">No new notifications for you right now.</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-100">
           <button className="w-full btn btn-secondary text-sm">View Notification Settings</button>
        </div>
      </div>
    </>
  )
}

export default NotificationDrawer
