import { useEffect } from 'react'
import { fetchChallenge, postAction } from '../services/aiService'
import PointsTracker from './PointsTracker'
import BadgesStore from './BadgesStore'

interface Props {
  ageGroup: string
  onComplete: () => void
}

export default function GoalOrbQuest({ ageGroup, onComplete }: Props) {
  useEffect(() => {
    fetchChallenge('goalOrbQuest', ageGroup)
  }, [ageGroup])

  function handleAction() {
    PointsTracker.addPoints(10)
    BadgesStore.earn('goal')
    postAction('goalOrbQuest', { action: 'complete' })
    onComplete()
  }

  return (
    <div>
      <h2>Goal Orb Quest</h2>
      <p>Collect orbs by setting clear goals.</p>
      <button className="btn-primary" onClick={handleAction}>Finish</button>
    </div>
  )
}
