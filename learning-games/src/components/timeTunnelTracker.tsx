import { useEffect } from 'react'
import { fetchChallenge, postAction } from '../services/aiService'
import PointsTracker from './PointsTracker'
import BadgesStore from './BadgesStore'

interface Props {
  ageGroup: string
  onComplete: () => void
}

export default function TimeTunnelTracker({ ageGroup, onComplete }: Props) {
  useEffect(() => {
    fetchChallenge('timeTunnelTracker', ageGroup)
  }, [ageGroup])

  function handleAction() {
    PointsTracker.addPoints(10)
    BadgesStore.earn('timekeeper')
    postAction('timeTunnelTracker', { action: 'complete' })
    onComplete()
  }

  return (
    <div>
      <h2>Time Tunnel Tracker</h2>
      <p>Manage tasks against the clock.</p>
      <button className="btn-primary" onClick={handleAction}>Finish</button>
    </div>
  )
}
