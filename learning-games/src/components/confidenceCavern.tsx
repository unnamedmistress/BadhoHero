import { useEffect } from 'react'
import { fetchChallenge, postAction } from '../services/aiService'
import PointsTracker from './PointsTracker'
import BadgesStore from './BadgesStore'
import './MiniGameBackgrounds.css'
import { ConfidenceTorch } from './icons'

interface Props {
  ageGroup: string
  onComplete: () => void
}

export default function ConfidenceCavern({ ageGroup, onComplete }: Props) {
  useEffect(() => {
    fetchChallenge('confidenceCavern', ageGroup)
  }, [ageGroup])

  function handleAction() {
    PointsTracker.addPoints(10)
    BadgesStore.earn('confidence')
    postAction('confidenceCavern', { action: 'complete' })
    onComplete()
  }

  return (
    <div className="confidence-bg">
      <ConfidenceTorch />
      <h2>Confidence Cavern</h2>
      <p>Face challenges to boost confidence.</p>
      <button className="btn-primary" onClick={handleAction}>Finish</button>
    </div>
  )
}
