import React from 'react'
import './GlassCard.css'

export interface GlassCardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  variant?: 'light' | 'dark'
  blur?: number
}

export default function GlassCard({
  children,
  className = '',
  onClick,
  variant = 'light',
  blur = 10,
}: GlassCardProps) {
  return (
    <div
      className={`glass-card ${variant} ${className}`.trim()}
      style={{ backdropFilter: `blur(${blur}px)` }}
      onClick={onClick}
      data-testid="glass-card"
    >
      {children}
    </div>
  )
}
