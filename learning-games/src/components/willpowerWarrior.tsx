import { useEffect } from 'react'
import { fetchChallenge, postAction } from '../services/aiService'
import PointsTracker from './PointsTracker'
import BadgesStore from './BadgesStore'
import './MiniGameBackgrounds.css'
import GlassCard from './ui/GlassCard'
import NeumorphicButton from './ui/NeumorphicButton'
import AnimatedAvatar from './ui/AnimatedAvatar'
import MoodLighting from './ui/MoodLighting'
import ParticleSystem from './ui/ParticleSystem'

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
    ParticleSystem.burst()
    onComplete()
  }

  return (
    <div className="willpower-bg" style={{ position: 'relative', padding: '2rem' }}>
      <MoodLighting />
      <GlassCard>
        <AnimatedAvatar />
        <h2>Willpower Warrior</h2>
        <p>Overcome distractions to earn points.</p>
        <NeumorphicButton onClick={handleAction}>Finish</NeumorphicButton>
      </GlassCard>
    </div>
  )
}
