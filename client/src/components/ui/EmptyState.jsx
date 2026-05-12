import React from 'react'
import { Inbox } from 'lucide-react'

const EmptyState = ({ title, message, icon: Icon = Inbox }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center bg-white rounded-2xl border border-gray-100">
      <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mb-4">
        <Icon size={32} />
      </div>
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      <p className="text-gray-500 max-w-xs mx-auto mt-1">{message}</p>
    </div>
  )
}

export default EmptyState
