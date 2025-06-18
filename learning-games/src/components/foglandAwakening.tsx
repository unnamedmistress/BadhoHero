import { useState } from 'react'
import PointsTracker from './PointsTracker'
import BadgesStore from './BadgesStore'
import ProgressBar from './ui/ProgressBar'
import Card from './ui/card'
import NeumorphicButton from './ui/NeumorphicButton'
import './MiniGameBackgrounds.css'
import './FoglandAwakening.css'

interface Tile {
  id: number
  question: string
  options: string[]
  answer: number
  lesson: string
  revealed?: boolean
}

interface Props {
  ageGroup: string
  onComplete: () => void
}

const tiles: Tile[] = [
  {
    id: 1,
    question: 'What makes you feel lazy?',
    options: ['No plan', 'Tired', 'Bored', 'All of these'],
    answer: 3,
    lesson: 'Laziness is just a habit. Every action you take makes you stronger.',
  },
  {
    id: 2,
    question: 'What happens if you never start anything?',
    options: ['You get stronger', 'Nothing changes', 'You stay stuck', 'You become a hero'],
    answer: 2,
    lesson: 'The earlier you act, the more you achieve!',
  },
  {
    id: 3,
    question: 'What does a hero do when things seem tough?',
    options: ['Wait for others', 'Give up', 'Take a small step', 'Hide'],
    answer: 2,
    lesson: 'Your country needs heroes—start with a small win every day.',
  },
  {
    id: 4,
    question: 'What\'s the first small thing you could do tomorrow morning to be a hero?',
    options: ['Sleep more', 'Check phone', 'Make the bed', 'Skip breakfast'],
    answer: 2,
    lesson: 'Each small victory builds your willpower.',
  },
  {
    id: 5,
    question: 'Which habit helps you defeat laziness?',
    options: ['Procrastinate', 'Excuses', 'Consistent action', 'None'],
    answer: 2,
    lesson: 'Good planning turns energy into success.',
  },
  {
    id: 6,
    question: 'Why should you care about beating laziness?',
    options: ['Your country needs heroes', 'It\'s fun to do nothing', 'Because others say so', 'Not important'],
    answer: 0,
    lesson: 'Focus on what matters, not on excuses.',
  },
]

export default function FoglandAwakening({ onComplete }: Props) {
  const [state, setState] = useState<Tile[]>(tiles)
  const [active, setActive] = useState<Tile | null>(null)
  const revealedCount = state.filter((t) => t.revealed).length
  const allDone = revealedCount === state.length

  function handleTileClick(id: number) {
    const tile = state.find((t) => t.id === id)
    if (tile && !tile.revealed) setActive(tile)
  }

  function handleAnswer(index: number) {
    if (!active) return
    const updated = state.map((t) =>
      t.id === active.id ? { ...t, revealed: index === t.answer } : t
    )
    setState(updated)
    setActive(null)
  }

  function finish() {
    PointsTracker.addPoints(10)
    BadgesStore.earn('origin')
    onComplete()
  }

  return (
    <div className="fogland-bg">
      <h2>Fogland Awakening</h2>
      <ProgressBar percent={(revealedCount / state.length) * 100} />
      <div className="fog-grid">
        {state.map((tile) => (
          <Card
            key={tile.id}
            className={`fog-tile ${tile.revealed ? 'revealed' : ''}`}
            onClick={() => handleTileClick(tile.id)}
          >
            {tile.revealed ? tile.lesson : '❓'}
          </Card>
        ))}
      </div>
      {allDone && (
        <NeumorphicButton onClick={finish} style={{ marginTop: '1rem' }}>
          Continue
        </NeumorphicButton>
      )}
      {active && (
        <div className="question-overlay">
          <div className="question-card">
            <p>{active.question}</p>
            {active.options.map((opt, i) => (
              <NeumorphicButton
                key={i}
                onClick={() => handleAnswer(i)}
                style={{ display: 'block', width: '100%' }}
              >
                {opt}
              </NeumorphicButton>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
