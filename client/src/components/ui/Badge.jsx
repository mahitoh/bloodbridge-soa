import React from 'react'
import { twMerge } from 'tailwind-merge'

const Badge = ({ children, className, variant = 'default' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
    primary: 'bg-primary-light text-primary-red',
  }

  return (
    <span
      className={twMerge(
        "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}

export default Badge
