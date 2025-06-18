import { useEffect } from 'react'
import { fetchChallenge, postAction } from '../services/aiService'
import PointsTracker from './PointsTracker'
import BadgesStore from './BadgesStore'
import './MiniGameBackgrounds.css'
import { WillpowerBadge } from './icons'

interface Props {
  ageGroup: string
  onComplete: () => void
}

export default function WillpowerWarrior({ ageGroup, onComplete }: Props) {
  useEffect(() => {
    fetchChallenge('willpowerWarrior', ageGroup)
  }, [ageGroup])

  function handleAction() {
    PointsTracker.addPoints(10)
    BadgesStore.earn('willpower')
    postAction('willpowerWarrior', { action: 'complete' })
    onComplete()
  }

  return (
    <div className="willpower-bg">
      <WillpowerBadge />
      <h2>Willpower Warrior</h2>
      <p>Overcome distractions to earn points.</p>
      <button className="btn-primary" onClick={handleAction}>Finish</button>
    </div>
  )
}
