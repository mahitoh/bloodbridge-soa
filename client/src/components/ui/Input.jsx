import React from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

const Input = ({ label, error, className, ...props }) => {
  return (
    <div className="w-full space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        className={twMerge(
          "bg-gray-100 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-primary-red transition-all duration-200 border-none",
          error && "ring-2 ring-red-500",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

export default Input
