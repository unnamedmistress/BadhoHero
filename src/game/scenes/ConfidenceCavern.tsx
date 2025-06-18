import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import './confidence-tree-scenes.css'

interface Challenge {
  id: number
  prompt: string
}

const CHALLENGES: Challenge[] = [
  { id: 1, prompt: 'Share how you will finish your homework today.' },
  { id: 2, prompt: 'Describe one new thing you will try this week.' },
  { id: 3, prompt: 'Write a sentence encouraging yourself before a test.' },
  { id: 4, prompt: 'How will you help a friend feel better?' },
  { id: 5, prompt: 'Name a small step toward a big goal.' },
  { id: 6, prompt: 'Write something brave you can do tomorrow.' },
  { id: 7, prompt: 'Encourage yourself to talk to someone new.' },
  { id: 8, prompt: 'Finish with your best confidence statement!' }
]

function evaluate(text: string) {
  const lower = text.toLowerCase()
  const negativeWords = ['no', "don't", "can't", 'never', 'not']
  const hasNegative = negativeWords.some((w) => lower.includes(w))
  if (hasNegative || lower.trim().length === 0) {
    return { points: 0, message: 'Try again without negative words.' }
  }
  const strongWords = ['will', 'can', 'am', 'do', 'going']
  const strong = strongWords.some((w) => lower.includes(w)) && lower.length > 20
  if (strong) {
    return { points: 15, message: 'Great affirmation!' }
  }
  return { points: 7, message: 'Good, make it even stronger next time.' }
}

export default function ConfidenceCavern() {
  const [index, setIndex] = useState(0)
  const [input, setInput] = useState('')
  const [score, setScore] = useState(0)
  const [foxMsg, setFoxMsg] = useState('')

  const brightness = 0.1 + index * 0.1

  useEffect(() => {
    if (index === CHALLENGES.length) {
      confetti({ particleCount: 150, spread: 90 })
    }
  }, [index])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const { points, message } = evaluate(input)
    setFoxMsg(message)
    if (points > 0) {
      setScore((s) => s + points)
      setIndex((i) => i + 1)
      setInput('')
    }
  }

  if (index >= CHALLENGES.length) {
    return (
      <div className="confidence-cavern" style={{ filter: `brightness(1)` }}>
        <h2>Confidence Cavern Complete!</h2>
        <p>Total Score: {score}</p>
      </div>
    )
  }

  const challenge = CHALLENGES[index]

  return (
    <div
      className="confidence-cavern"
      style={{ filter: `brightness(${brightness})` }}
    >
      <h2>Confidence Cavern</h2>
      <AnimatePresence mode="wait">
        <motion.div
          key={challenge.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <p>{challenge.prompt}</p>
          <form onSubmit={handleSubmit}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ width: '80%', padding: '0.5rem' }}
            />
            <div style={{ marginTop: '0.5rem' }}>
              <button type="submit">Submit</button>
            </div>
          </form>
        </motion.div>
      </AnimatePresence>
      <div className="cavern-fox">{foxMsg}</div>
      <div className="torch-grid">
        {CHALLENGES.map((t, i) => (
          <div key={t.id} className={`torch ${i < index ? 'lit' : ''}`} />
        ))}
      </div>
    </div>
  )
}
