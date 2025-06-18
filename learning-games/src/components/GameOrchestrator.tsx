import { useState, useContext } from 'react'
import FoglandAwakening from './foglandAwakening'
import WillpowerWarrior from './willpowerWarrior'
import GoalOrbQuest from './goalOrbQuest'
import TimeTunnelTracker from './timeTunnelTracker'
import ConfidenceCavern from './confidenceCavern'
import ConfidenceCastle from './confidenceCastle'
import TreeOfTriumph from './treeOfTriumph'
import PointsTracker from './PointsTracker'
import BadgesStore from './BadgesStore'
import { UserContext } from '../shared/UserContext'
import type { UserContextType } from '../../shared/types/user'

const games = [
  FoglandAwakening,
  WillpowerWarrior,
  GoalOrbQuest,
  TimeTunnelTracker,
  ConfidenceCavern,
  ConfidenceCastle,
  TreeOfTriumph,
]

export default function GameOrchestrator() {
  const { ageGroup } = useContext(UserContext) as UserContextType
  const [index, setIndex] = useState(0)
  const Current = games[index]

  function handleComplete() {
    if (index < games.length - 1) {
      setIndex((i) => i + 1)
    }
  }

  return (
    <div>
      <p>Points: {PointsTracker.getPoints()}</p>
      <p>Badges: {BadgesStore.getBadges().join(', ') || 'None'}</p>
      <Current ageGroup={ageGroup} onComplete={handleComplete} />
    </div>
  )
}
