import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export const Card: React.FC<CardProps> = ({ children, className = '', hover = true }) => {
  const hoverStyles = hover ? 'transition-shadow duration-200 hover:shadow-lg' : ''
  
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${hoverStyles} ${className}`}>
      {children}
    </div>
  )
}
