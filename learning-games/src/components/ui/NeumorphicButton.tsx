import React from 'react'
import './NeumorphicButton.css'

export interface NeumorphicButtonProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  variant?: 'raised' | 'inset'
  disabled?: boolean
}

export default function NeumorphicButton({
  children,
  className = '',
  onClick,
  variant = 'raised',
  disabled = false,
}: NeumorphicButtonProps) {
  return (
    <button
      className={`neumorphic-button ${variant} ${className}`.trim()}
      onClick={onClick}
      disabled={disabled}
      data-testid="neumorphic-button"
      type="button"
    >
      {children}
    </button>
  )
}
