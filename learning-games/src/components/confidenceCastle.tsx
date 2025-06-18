import { useEffect, useState } from 'react'
import { fetchChallenge, postAction } from '../services/aiService'
import PointsTracker from './PointsTracker'
import BadgesStore from './BadgesStore'
import NeumorphicButton from './ui/NeumorphicButton'
import './MiniGameBackgrounds.css'
import './ConfidenceCastle.css'

interface Props {
  ageGroup: string
  onComplete: () => void
}

export default function ConfidenceCastle({ ageGroup, onComplete }: Props) {
  const [started, setStarted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(5)
  const [done, setDone] = useState(false)

  useEffect(() => {
    fetchChallenge('confidenceCastle', ageGroup)
  }, [ageGroup])

  useEffect(() => {
    if (!started || done) return
    if (timeLeft <= 0) {
      setDone(true)
      return
    }
    const t = setTimeout(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearTimeout(t)
  }, [started, timeLeft, done])

  function startPose() {
    setStarted(true)
    setTimeLeft(5)
  }

  function finish() {
    PointsTracker.addPoints(10)
    BadgesStore.earn('confidence')
    postAction('confidenceCastle', { action: 'complete' })
    onComplete()
  }

  return (
    <div className="confidence-bg confidence-castle">
      <h2>Confidence Castle</h2>
      {!started && (
        <NeumorphicButton onClick={startPose}>Start Power Pose</NeumorphicButton>
      )}
      {started && !done && <p>Hold it... {timeLeft}</p>}
      {done && (
        <NeumorphicButton onClick={finish} style={{ marginTop: '1rem' }}>
          Finish
        </NeumorphicButton>
      )}
    </div>
  )
}
