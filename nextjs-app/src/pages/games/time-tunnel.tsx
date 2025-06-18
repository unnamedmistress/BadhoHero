import { useEffect, useState } from 'react'
import ModernGameLayout from '../../components/layout/ModernGameLayout'
import WhyCard from '../../components/layout/WhyCard'
import confetti from 'canvas-confetti'
import styles from '../../styles/GoalTimeGames.module.css'

interface Task { id: number; label: string }

const TASKS: Task[] = [
  { id: 1, label: 'Find your bag' },
  { id: 2, label: 'Gather textbooks' },
  { id: 3, label: 'Collect stationery' },
  { id: 4, label: 'Pack homework' },
  { id: 5, label: 'Add lunch' },
  { id: 6, label: 'Pack water bottle' },
  { id: 7, label: 'Put in school ID' },
  { id: 8, label: 'Scroll phone' },
]

export default function TimeTunnelGame() {
  const [order, setOrder] = useState(() => TASKS.sort(() => 0.5 - Math.random()))
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [message, setMessage] = useState('')
  const [timeLeft, setTimeLeft] = useState(60)

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(t => t - 1), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (timeLeft <= 0) setMessage('Time up!')
  }, [timeLeft])

  function choose(task: Task) {
    if (timeLeft <= 0) return
    if (index >= TASKS.length) return
    const correct = TASKS[index]
    if (task.id === correct.id) {
      setScore(s => s + 12)
      setIndex(i => i + 1)
      if (index + 1 === TASKS.length) {
        confetti({ particleCount: 80, spread: 70 })
        if (score + 12 === TASKS.length * 12) setScore(s => s + 25)
        setMessage('All done!')
      }
    } else {
      setScore(s => s - 10)
      setMessage('Wrong step!')
    }
  }

  return (
    <ModernGameLayout
      gameTitle="Time Tunnel Trials"
      gameIcon="https://raw.githubusercontent.com/unnamedmistress/images/main/time-tunnel.png"
      whyCard={
        <WhyCard
          title="Why Sequence Matters"
          explanation="Doing things in order saves time and makes you feel ready. Laziness is doing the easy stuff first." />
      }
    >
      <div className={styles.timeGame}>
        <p>Time left: {timeLeft}s</p>
        <div className={styles.tasks}>
          {order.map(t => (
            <button
              key={t.id}
              className={`${styles.task} ${index > order.indexOf(t) ? styles.completed : ''}`}
              onClick={() => choose(t)}
              disabled={index > order.indexOf(t) || timeLeft <= 0}
            >
              {t.label}
            </button>
          ))}
        </div>
        {message && <p>{message} Score: {score}</p>}
      </div>
    </ModernGameLayout>
  )
}

export function Head() {
  return (
    <>
      <title>Time Tunnel Trials | StrawberryTech</title>
      <meta name="description" content="Pack your bag efficiently" />
    </>
  )
}

export const getStaticProps = async () => ({ props: {} })
