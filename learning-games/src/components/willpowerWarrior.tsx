import { useEffect, useState } from 'react'
import { fetchChallenge, postAction } from '../services/aiService'
import PointsTracker from './PointsTracker'
import BadgesStore from './BadgesStore'
import Card from './ui/card'
import ProgressBar from './ui/ProgressBar'
import NeumorphicButton from './ui/NeumorphicButton'
import './MiniGameBackgrounds.css'
import './WillpowerWarrior.css'

interface RoutineTile {
  id: number
  emoji: string
  label: string
  healthy: boolean
  selected?: boolean
}

interface Props {
  ageGroup: string
  onComplete: () => void
}

const BASE_TILES: RoutineTile[] = [
  { id: 1, emoji: '🛏️', label: 'Make Bed', healthy: true },
  { id: 2, emoji: '🪥', label: 'Brush Teeth', healthy: true },
  { id: 3, emoji: '📚', label: 'Open Textbook', healthy: true },
  { id: 4, emoji: '📺', label: 'Watch TV News', healthy: false },
  { id: 5, emoji: '📱', label: 'Scroll Social Media', healthy: false },
  { id: 6, emoji: '🥛', label: 'Drink Water', healthy: true },
  { id: 7, emoji: '🍞', label: 'Eat Breakfast', healthy: true },
  { id: 8, emoji: '📰', label: 'Read Newspaper', healthy: false },
  { id: 9, emoji: '⏰', label: 'Set 5 more alarms', healthy: false },
  { id: 10, emoji: '💤', label: 'Snooze', healthy: false },
]

const ROUND_TIMES = [30, 25, 20]

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export default function WillpowerWarrior({ ageGroup, onComplete }: Props) {
  const [round, setRound] = useState(0)
  const [tiles, setTiles] = useState<RoutineTile[]>([])
  const [timeLeft, setTimeLeft] = useState(ROUND_TIMES[0])
  const [score, setScore] = useState(0)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    fetchChallenge('willpowerWarrior', ageGroup)
    startRound(0)
  }, [ageGroup])

  useEffect(() => {
    if (!running) return
    if (timeLeft <= 0) {
      endRound()
      return
    }
    const t = setTimeout(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearTimeout(t)
  }, [timeLeft, running])

  function startRound(n: number) {
    setRound(n + 1)
    setTiles(shuffle(BASE_TILES))
    setTimeLeft(ROUND_TIMES[n])
    setRunning(true)
  }

  function endRound() {
    setRunning(false)
    const bonus = tiles.every((t) => !t.healthy || t.selected) ? 20 : 0
    setScore((s) => s + bonus)
    if (round >= 3) {
      const finalScore = score + bonus
      PointsTracker.addPoints(finalScore)
      BadgesStore.earn('willpower')
      postAction('willpowerWarrior', { score: finalScore })
      onComplete()
    }
  }

  function handleTile(id: number) {
    if (!running) return
    const tile = tiles.find((t) => t.id === id)
    if (!tile || tile.selected) return
    setTiles((ts) => ts.map((t) => (t.id === id ? { ...t, selected: true } : t)))
    setScore((s) => s + (tile.healthy ? 10 : -7))
    const allClear = tiles.every((t) => !t.healthy || t.selected || t.id === id)
    if (allClear) endRound()
  }

  function nextRound() {
    startRound(round)
  }

  const roundComplete = !running && round < 3

  return (
    <div className="willpower-bg willpower-warrior">
      <h2>Willpower Warrior</h2>
      <p>
        Round {round} / 3 &nbsp; Score: {score} &nbsp; Time: {timeLeft}s
      </p>
      <ProgressBar percent={(timeLeft / ROUND_TIMES[round - 1]) * 100} />
      <div className="routine-grid">
        {tiles.map((tile) => (
          <Card
            key={tile.id}
            className={`routine-tile ${tile.selected ? 'selected' : ''}`}
            onClick={() => handleTile(tile.id)}
          >
            <span style={{ fontSize: '1.5rem' }} role="img" aria-label={tile.label}>
              {tile.emoji}
            </span>
            <div>{tile.label}</div>
          </Card>
        ))}
      </div>
      {roundComplete && (
        <NeumorphicButton onClick={nextRound} style={{ marginTop: '1rem' }}>
          Next Round
        </NeumorphicButton>
      )}
    </div>
  )
}
