import React from 'react'
import { twMerge } from 'tailwind-merge'

const StatCard = ({ label, value, icon: Icon, trend, color = 'red', className }) => {
  const colors = {
    red: 'text-primary-red bg-primary-light',
    green: 'text-success bg-success-light',
    amber: 'text-warning bg-warning-light',
    blue: 'text-info bg-info-light',
  }

  return (
    <div className={twMerge("card flex items-center justify-between group overflow-hidden relative", className)}>
      <div className="relative z-10">
        <p className="text-sm font-semibold text-gray-500 mb-1">{label}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        {trend && (
          <p className={twMerge(
            "text-xs font-bold mt-1",
            trend.startsWith('+') ? "text-success" : "text-primary-red"
          )}>
            {trend} <span className="text-gray-400 font-normal ml-1">this month</span>
          </p>
        )}
      </div>
      <div className={twMerge(
        "p-3 rounded-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6",
        colors[color]
      )}>
        <Icon size={24} />
      </div>
      
      {/* Background Glow */}
      <div className={twMerge(
        "absolute -right-4 -bottom-4 w-24 h-24 blur-3xl opacity-10 rounded-full",
        color === 'red' ? 'bg-primary-red' : 
        color === 'green' ? 'bg-success' : 
        color === 'amber' ? 'bg-warning' : 'bg-info'
      )} />
    </div>
  )
}

export default StatCard
