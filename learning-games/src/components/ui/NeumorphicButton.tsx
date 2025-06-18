import React from 'react'
import './NeumorphicButton.css'

export interface NeumorphicButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export default function NeumorphicButton({ children, className = '', ...props }: NeumorphicButtonProps) {
  return (
    <button className={`neumorphic-btn ${className}`} {...props}>
      {children}
    </button>
  )
}
