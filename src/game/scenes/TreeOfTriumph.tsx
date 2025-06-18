import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import './confidence-tree-scenes.css'

interface Badge {
  id: string
  label: string
}

const BADGES: Badge[] = [
  { id: 'origin', label: 'Origin' },
  { id: 'willpower', label: 'Will' },
  { id: 'goal', label: 'Goal' },
  { id: 'timekeeper', label: 'Time' },
  { id: 'confidence', label: 'Conf' },
  { id: 'triumph', label: 'Triumph' }
]

export default function TreeOfTriumph() {
  const [planted, setPlanted] = useState<Badge[]>([])
  const [watering, setWatering] = useState(0)
  const [height, setHeight] = useState(40)
  const [fruits, setFruits] = useState<{ x: number; y: number }[]>([])

  useEffect(() => {
    if (planted.length === BADGES.length) {
      confetti({ particleCount: 200, spread: 100 })
    }
  }, [planted])

  function handleDrop(badge: Badge) {
    if (planted.find((b) => b.id === badge.id)) return
    setPlanted((b) => [...b, badge])
    setWatering(0)
  }

  function water() {
    const next = watering + 1
    setWatering(next)
    if (next >= 5) {
      setHeight((h) => h + 30)
      setWatering(0)
      // add fruit using golden angle
      const angle = fruits.length * 137.5
      const radius = 40 + fruits.length * 4
      setFruits((f) => [
        ...f,
        {
          x: radius * Math.cos((angle * Math.PI) / 180),
          y: radius * Math.sin((angle * Math.PI) / 180)
        }
      ])
    }
  }

  return (
    <div className="tree-of-triumph">
      <h2>Tree of Triumph</h2>
      <div className="badge-row">
        {BADGES.map((b) => (
          <div
            key={b.id}
            className="badge"
            draggable
            onDragStart={(e) => e.dataTransfer.setData('id', b.id)}
          >
            {b.label}
          </div>
        ))}
      </div>
      <div
        className="soil"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          const id = e.dataTransfer.getData('id')
          const badge = BADGES.find((b) => b.id === id)
          if (badge) handleDrop(badge)
        }}
      >
        <motion.div
          className="tree"
          style={{ height: `${height}px` }}
          animate={{ height }}
        >
          {fruits.map((f, i) => (
            <div
              key={i}
              className="fruit"
              style={{
                left: `${50 + f.x}px`,
                bottom: `${height + f.y}px`
              }}
            />
          ))}
        </motion.div>
      </div>
      {planted.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <button onClick={water}>Water ({watering}/5)</button>
        </div>
      )}
    </div>
  )
}
