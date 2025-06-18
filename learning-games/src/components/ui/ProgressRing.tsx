import { useEffect, useState } from 'react'
import './ProgressRing.css'

interface Props {
  progress: number
  size?: number
}

export default function ProgressRing({ progress, size = 80 }: Props) {
  const [offset, setOffset] = useState(0)
  const radius = (size - 8) / 2
  const circumference = 2 * Math.PI * radius

  useEffect(() => {
    const pct = Math.min(Math.max(progress, 0), 100)
    const off = circumference - (pct / 100) * circumference
    setOffset(off)
  }, [progress, circumference])

  return (
    <svg className="progress-ring" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>\
      <circle className="ring-bg" strokeWidth="4" r={radius} cx={size / 2} cy={size / 2} />\
      <circle
        className="ring-progress"
        strokeWidth="4"
        r={radius}
        cx={size / 2}
        cy={size / 2}
        style={{ strokeDasharray: `${circumference} ${circumference}`, strokeDashoffset: offset }}
      />\
    </svg>
  )
}
