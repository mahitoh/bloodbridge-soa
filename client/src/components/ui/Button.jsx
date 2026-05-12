import React from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

const Button = ({ children, className, variant = 'primary', ...props }) => {
  const baseStyles = 'rounded-lg px-4 py-2 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variants = {
    primary: 'bg-primary-red hover:bg-primary-dark text-white focus:ring-primary-red',
    secondary: 'bg-primary-light hover:bg-red-200 text-primary-red focus:ring-primary-red',
    outline: 'border-2 border-primary-red text-primary-red hover:bg-primary-light focus:ring-primary-red',
    ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-400',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
  }

  return (
    <button
      className={twMerge(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
