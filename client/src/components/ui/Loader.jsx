import React from 'react'
import { twMerge } from 'tailwind-merge'

const Loader = ({ size = 'medium', className }) => {
  const sizes = {
    small: 'w-5 h-5 border-2',
    medium: 'w-8 h-8 border-3',
    large: 'w-12 h-12 border-4',
  }

  return (
    <div className={twMerge("flex justify-center items-center", className)}>
      <div
        className={twMerge(
          "animate-spin rounded-full border-primary-light border-t-primary-red",
          sizes[size]
        )}
      />
    </div>
  )
}

export default Loader
