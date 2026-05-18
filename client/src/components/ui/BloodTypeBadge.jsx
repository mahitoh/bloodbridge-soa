import React from 'react'
import { twMerge } from 'tailwind-merge'

const BloodTypeBadge = ({ type, className }) => {
  const getColors = (bloodType) => {
    const base = "font-display font-bold shadow-sm"
    if (bloodType?.includes('+')) return `${base} bg-red-100 text-red-700`
    if (bloodType?.includes('-')) return `${base} bg-gray-100 text-gray-700`
    return `${base} bg-blue-100 text-blue-700`
  }

  return (
    <span className={twMerge(
      "inline-flex items-center justify-center w-10 h-10 rounded-lg text-lg",
      getColors(type),
      className
    )}>
      {type}
    </span>
  )
}

export default BloodTypeBadge
