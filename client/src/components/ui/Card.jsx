import React from 'react'
import { twMerge } from 'tailwind-merge'

const Card = ({ children, className, ...props }) => {
  return (
    <div
      className={twMerge("bg-white rounded-2xl shadow-sm border border-gray-100 p-6", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card
