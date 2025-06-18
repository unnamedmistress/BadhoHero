import { useState } from 'react'
import ModernGameLayout from '../../components/layout/ModernGameLayout'
import WhyCard from '../../components/layout/WhyCard'
import confetti from 'canvas-confetti'
import styles from '../../styles/GoalTimeGames.module.css'

interface Orb {
  id: number
  label: string
  category: 'short' | 'medium' | 'long'
}

const ORBS: Orb[] = [
  { id: 1, label: "Finish today's homework", category: 'short' },
  { id: 2, label: 'Read a book this month', category: 'medium' },
  { id: 3, label: 'Help family with chores', category: 'short' },
  { id: 4, label: 'Save 500 rupees', category: 'medium' },
  { id: 5, label: 'Start a hobby', category: 'medium' },
  { id: 6, label: 'Win the sports match', category: 'short' },
  { id: 7, label: 'Score high in exams this year', category: 'long' },
  { id: 8, label: 'Improve at math', category: 'long' },
]

export default function GoalSortGame() {
  const [remaining, setRemaining] = useState(ORBS)
  const [placed, setPlaced] = useState({
    short: [] as Orb[],
    medium: [] as Orb[],
    long: [] as Orb[],
  })
  const [score, setScore] = useState(0)
  const [message, setMessage] = useState('')

  function onDragStart(e: React.DragEvent<HTMLDivElement>, id: number) {
    e.dataTransfer.setData('text/plain', String(id))
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>, cat: 'short'|'medium'|'long') {
    e.preventDefault()
    const id = Number(e.dataTransfer.getData('text/plain'))
    const orb = remaining.find(o => o.id === id)
    if (!orb) return
    if (placed[cat].length >= 2) {
      setScore(s => s - 10)
      setMessage('That portal is full!')
      return
    }
    setRemaining(rem => rem.filter(o => o.id !== id))
    setPlaced(p => ({ ...p, [cat]: [...p[cat], orb] }))
    if (orb.category === cat) {
      setScore(s => s + 15)
    } else {
      setScore(s => s - 10)
      setMessage('Oops, wrong portal!')
    }
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
  }

  const allDone = remaining.length === 0
  if (allDone) {
    confetti({ particleCount: 80, spread: 70 })
  }

  return (
    <ModernGameLayout
      gameTitle="Goal-Orb Discovery"
      gameIcon="https://raw.githubusercontent.com/unnamedmistress/images/main/goal-orb.png"
      whyCard={
        <WhyCard
          title="Why Sort Goals?"
          explanation="When you know what matters most, you progress faster. Too many goals in one place get stuck!"
        />
      }
    >
      <div className={styles.goalGame}>
        <p>Drag each goal orb into the correct time portal.</p>
        <div className={styles.orbList}>
          {remaining.map(o => (
            <div
              key={o.id}
              className={styles.orb}
              draggable
              onDragStart={e => onDragStart(e, o.id)}
            >
              {o.label}
            </div>
          ))}
        </div>
        <div className={styles.portals}>
          {(['short','medium','long'] as const).map(cat => (
            <div
              key={cat}
              className={`${styles.portal} ${placed[cat].length>=2 ? styles.portalFull:''}`}
              onDrop={e => handleDrop(e, cat)}
              onDragOver={handleDragOver}
            >
              <strong>{cat === 'short' ? 'Short-Term' : cat === 'medium' ? 'Medium-Term' : 'Long-Term'}</strong>
              <div>
                {placed[cat].map(o => (
                  <div key={o.id}>{o.label}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {message && <p>{message}</p>}
        {allDone && <p>You scored {score} points!</p>}
      </div>
    </ModernGameLayout>
  )
}

export function Head() {
  return (
    <>
      <title>Goal-Orb Discovery | StrawberryTech</title>
      <meta name="description" content="Sort your goals to advance" />
    </>
  )
}

export const getStaticProps = async () => ({ props: {} })
