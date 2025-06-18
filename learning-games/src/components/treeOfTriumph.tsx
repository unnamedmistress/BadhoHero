import { useEffect } from 'react'
import { fetchChallenge, postAction } from '../services/aiService'
import PointsTracker from './PointsTracker'
import BadgesStore from './BadgesStore'
import './MiniGameBackgrounds.css'
import { TriumphTree } from './icons'

interface Props {
  ageGroup: string
  onComplete: () => void
}

export default function TreeOfTriumph({ ageGroup, onComplete }: Props) {
  useEffect(() => {
    fetchChallenge('treeOfTriumph', ageGroup)
  }, [ageGroup])

  function handleAction() {
    PointsTracker.addPoints(10)
    BadgesStore.earn('triumph')
    postAction('treeOfTriumph', { action: 'complete' })
    onComplete()
  }

  return (
    <div className="triumph-bg">
      <TriumphTree />
      <h2>Tree of Triumph</h2>
      <p>Grow your tree with every success.</p>
      <button className="btn-primary" onClick={handleAction}>Finish</button>
    </div>
  )
}
