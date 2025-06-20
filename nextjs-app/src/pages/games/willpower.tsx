import React, { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import { UserContext } from '../../shared/UserContext'
import type { UserContextType } from '../../shared/types/user'
import CompletionModal from '../../components/ui/CompletionModal'
import { notify } from '../../shared/notify'
import styles from '../../styles/WillpowerGame.module.css'

interface GameAction {
  id: string
  name: string
  timeRequired: number
  energyChange: number
  feedback: string
  bookQuote?: string
  isEssential?: boolean
  category: 'productive' | 'neutral' | 'tempting'
  used: boolean
}

interface Scenario {
  id: string
  title: string
  description: string
  choices: {
    text: string
    timeChange: number
    energyChange: number
    feedback: string
  }[]
}

interface GameState {
  timeLeft: number
  energy: number
  maxEnergy: number
  actionsTaken: GameAction[]
  hasEaten: boolean
  hasPackedBag: boolean
  roundComplete: boolean
  score: number
}

const INITIAL_ACTIONS: GameAction[] = [
  {
    id: 'make-bed',
    name: 'Make Bed',
    timeRequired: 3,
    energyChange: 1,
    feedback: 'Quick wins wake up your mind!',
    bookQuote: 'Practise good habits every day.',
    category: 'productive',
    used: false
  },
  {
    id: 'brush-teeth',
    name: 'Brush Teeth',
    timeRequired: 4,
    energyChange: 1,
    feedback: 'Clean start, clean mind!',
    category: 'productive',
    used: false
  },
  {
    id: 'drink-water',
    name: 'Drink Water',
    timeRequired: 2,
    energyChange: 1,
    feedback: 'Hydration energizes your body and mind!',
    bookQuote: 'Smile the Energizer: Smile unifies body, mind and soul.',
    category: 'productive',
    used: false
  },
  {
    id: 'yoga-stretch',
    name: 'Yoga/Stretch',
    timeRequired: 7,
    energyChange: 3,
    feedback: 'Movement awakens your inner strength!',
    bookQuote: 'Do exercises regularly! Build strong body.',
    category: 'productive',
    used: false
  },
  {
    id: 'eat-fruit',
    name: 'Eat Fruit',
    timeRequired: 5,
    energyChange: 2,
    feedback: 'Natural energy for a hero\'s morning!',
    bookQuote: 'Good food habits lead to good physical health and ultimately to a sound mind.',
    isEssential: true,
    category: 'productive',
    used: false
  },
  {
    id: 'eat-donut',
    name: 'Eat Donut',
    timeRequired: 5,
    energyChange: 1,
    feedback: 'Tasty now, but sugar crashes come later...',
    isEssential: true,
    category: 'tempting',
    used: false
  },
  {
    id: 'big-breakfast',
    name: 'Eat Big Breakfast',
    timeRequired: 10,
    energyChange: 3,
    feedback: 'Filling and energizing, but watch the clock!',
    isEssential: true,
    category: 'neutral',
    used: false
  },
  {
    id: 'news-headlines',
    name: 'Read News Headlines',
    timeRequired: 6,
    energyChange: 0,
    feedback: 'Stay informed, but don\'t lose your morning to news!',
    category: 'neutral',
    used: false
  },
  {
    id: 'news-full',
    name: 'Read Full Newspaper',
    timeRequired: 12,
    energyChange: -1,
    feedback: 'Interesting, but now you might be late!',
    category: 'tempting',
    used: false
  },
  {
    id: 'social-media-quick',
    name: 'Check Social Media (5 min)',
    timeRequired: 5,
    energyChange: -1,
    feedback: 'Time slips away quickly on the phone.',
    category: 'tempting',
    used: false
  },
  {
    id: 'social-media-long',
    name: 'Scroll Social Media "a bit more"',
    timeRequired: 12,
    energyChange: -3,
    feedback: 'Social media can drain your energy. Heroes notice these traps!',
    category: 'tempting',
    used: false
  },
  {
    id: 'lay-in-bed',
    name: 'Lay Around In Bed',
    timeRequired: 8,
    energyChange: -2,
    feedback: 'Feels comfy, but costs you precious time.',
    category: 'tempting',
    used: false
  },
  {
    id: 'snooze-alarm',
    name: 'Hit Snooze "Just 5 More Minutes"',
    timeRequired: 6,
    energyChange: -1,
    feedback: 'Easy now, harder later!',
    bookQuote: 'Act timely. Action appropriate to the situation can help to overcome obstacles.',
    category: 'tempting',
    used: false
  },
  {
    id: 'pack-bag',
    name: 'Pack Bag for School',
    timeRequired: 5,
    energyChange: 2,
    feedback: 'Preparation is the key to success!',
    bookQuote: 'Failing to plan is planning to fail.',
    isEssential: true,
    category: 'productive',
    used: false
  },
  {
    id: 'review-homework',
    name: 'Review Today\'s Homework',
    timeRequired: 6,
    energyChange: 2,
    feedback: 'Knowledge is power when you\'re prepared!',
    bookQuote: 'Complete the work taken up. Visualize what\'s next.',
    category: 'productive',
    used: false
  }
]

const SCENARIOS: Scenario[] = [
  {
    id: 'hungry-dilemma',
    title: 'Morning Hunger Strike!',
    description: 'You\'re hungry, but only 10 minutes left. What do you do?',
    choices: [
      {
        text: 'Eat Fruit (Quick & Healthy)',
        timeChange: -5,
        energyChange: 2,
        feedback: 'Smart choice! Quick nutrition for sustained energy.'
      },
      {
        text: 'Make Big Breakfast (Filling but Time-Consuming)',
        timeChange: -10,
        energyChange: 3,
        feedback: 'Delicious, but you might be cutting it close!'
      },
      {
        text: 'Skip Food (Save Time)',
        timeChange: 0,
        energyChange: -1,
        feedback: 'You saved time, but your energy will suffer later.'
      }
    ]
  },
  {
    id: 'phone-distraction',
    title: 'Phone Ping Alert!',
    description: 'Your phone pings while packing your bag. What do you do?',
    choices: [
      {
        text: 'Check Messages Quickly',
        timeChange: -5,
        energyChange: -1,
        feedback: 'Checking messages delayed you—heroes act timely!'
      },
      {
        text: 'Ignore and Finish Packing',
        timeChange: 0,
        energyChange: 2,
        feedback: 'Excellent focus! You stayed on track like a true warrior.'
      },
      {
        text: 'Reply to All Messages',
        timeChange: -8,
        energyChange: -2,
        feedback: 'Communication is important, but timing matters more.'
      }
    ]
  },
  {
    id: 'alarm-decision',
    title: 'First Alarm Ring!',
    description: 'Your alarm rings at 6:30. What\'s your first move?',
    choices: [
      {
        text: 'Jump Up Immediately',
        timeChange: 0,
        energyChange: 2,
        feedback: 'Warrior energy! Starting strong sets the tone for the day.'
      },
      {
        text: 'Stretch in Bed First',
        timeChange: -3,
        energyChange: 1,
        feedback: 'Good movement, but you used some precious time.'
      },
      {
        text: 'Hit Snooze Button',
        timeChange: -6,
        energyChange: -1,
        feedback: 'Tempting, but procrastination is the enemy of heroes.'
      }
    ]
  }
]

export default function WillpowerWarrior() {
  const { user, setPoints, addBadge } = useContext(UserContext) as UserContextType
  const router = useRouter()
  
  const [gameState, setGameState] = useState<GameState>({
    timeLeft: 40,
    energy: 5,
    maxEnergy: 10,
    actionsTaken: [],
    hasEaten: false,
    hasPackedBag: false,
    roundComplete: false,
    score: 0
  })
  
  const [actions, setActions] = useState<GameAction[]>(INITIAL_ACTIONS)
  const [showInstructions, setShowInstructions] = useState(true)
  const [currentAction, setCurrentAction] = useState<GameAction | null>(null)
  const [showActionFeedback, setShowActionFeedback] = useState(false)
  const [showScenario, setShowScenario] = useState(false)
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null)
  const [showScenarioFeedback, setShowScenarioFeedback] = useState(false)
  const [scenarioChoice, setScenarioChoice] = useState<any>(null)
  const [showSummary, setShowSummary] = useState(false)
  const [showWhyCard, setShowWhyCard] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)

  // Shuffle actions on component mount for variety
  useEffect(() => {
    const shuffledActions = [...INITIAL_ACTIONS].sort(() => Math.random() - 0.5)
    setActions(shuffledActions)
  }, [])

  // Check for scenario triggers
  useEffect(() => {
    if (gameState.actionsTaken.length > 0 && gameState.actionsTaken.length % 3 === 0 && !showScenario) {
      const randomScenario = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)]
      setCurrentScenario(randomScenario)
      setShowScenario(true)
    }
  }, [gameState.actionsTaken.length, showScenario])

  const handleActionSelect = (action: GameAction) => {
    if (action.used || gameState.timeLeft < action.timeRequired) return
    
    setCurrentAction(action)
    setShowActionFeedback(true)
    
    // Update game state
    setGameState(prev => ({
      ...prev,
      timeLeft: Math.max(0, prev.timeLeft - action.timeRequired),
      energy: Math.min(prev.maxEnergy, Math.max(0, prev.energy + action.energyChange)),
      actionsTaken: [...prev.actionsTaken, action],
      hasEaten: prev.hasEaten || !!action.isEssential && action.id.includes('eat'),
      hasPackedBag: prev.hasPackedBag || action.id === 'pack-bag',
      score: prev.score + (action.category === 'productive' ? 15 : action.category === 'neutral' ? 5 : -5)
    }))
    
    // Mark action as used
    setActions(prev => prev.map(a => 
      a.id === action.id ? { ...a, used: true } : a
    ))
  }

  const handleActionContinue = () => {
    setShowActionFeedback(false)
    setCurrentAction(null)
    
    // Check if round should end
    if (gameState.timeLeft <= 0 || actions.filter(a => !a.used).length === 0) {
      endRound()
    }
  }

  const handleScenarioChoice = (choice: any) => {
    setScenarioChoice(choice)
    setShowScenarioFeedback(true)
    
    // Apply scenario effects
    setGameState(prev => ({
      ...prev,
      timeLeft: Math.max(0, prev.timeLeft + choice.timeChange),
      energy: Math.min(prev.maxEnergy, Math.max(0, prev.energy + choice.energyChange)),
      score: prev.score + (choice.energyChange > 0 ? 10 : choice.energyChange < 0 ? -10 : 0)
    }))
  }

  const handleScenarioContinue = () => {
    setShowScenario(false)
    setShowScenarioFeedback(false)
    setCurrentScenario(null)
    setScenarioChoice(null)
  }

  const endRound = () => {
    setShowSummary(true)
  }

  const handleFinishAndGo = () => {
    if (gameState.hasEaten && gameState.hasPackedBag) {
      endRound()
    } else {
      notify('You need to eat something and pack your bag before leaving!')
    }
  }

  const handleSummaryContinue = () => {
    setShowSummary(false)
    setShowWhyCard(true)
  }

  const handleWhyCardContinue = () => {
    // Award points and badge
    setPoints('willpower', gameState.score)
    if (!user.badges.includes('morning-warrior')) {
      addBadge('morning-warrior')
      notify('🏅 Morning Warrior Badge earned! You\'ve mastered the art of productive mornings!')
    }
    
    setShowWhyCard(false)
    setGameComplete(true)
  }

  const playAgain = () => {
    setGameState({
      timeLeft: 40,
      energy: 5,
      maxEnergy: 10,
      actionsTaken: [],
      hasEaten: false,
      hasPackedBag: false,
      roundComplete: false,
      score: 0
    })
    setActions(INITIAL_ACTIONS.map(a => ({ ...a, used: false })).sort(() => Math.random() - 0.5))
    setShowInstructions(true)
    setGameComplete(false)
  }

  const getOutcome = () => {
    const { timeLeft, energy, hasEaten, hasPackedBag } = gameState
    
    if (!hasEaten && !hasPackedBag) {
      return { 
        type: 'disaster', 
        message: 'Oh no! You forgot to eat AND pack your bag!',
        foxMood: 'panic'
      }
    } else if (!hasEaten) {
      return { 
        type: 'hungry', 
        message: 'You made it, but you\'ll be hungry all day!',
        foxMood: 'worried'
      }
    } else if (!hasPackedBag) {
      return { 
        type: 'unprepared', 
        message: 'You forgot your homework and supplies!',
        foxMood: 'stressed'
      }
    } else if (timeLeft <= 0) {
      return { 
        type: 'late', 
        message: 'You\'re running late but at least you\'re prepared!',
        foxMood: 'rushing'
      }
    } else if (energy <= 2) {
      return { 
        type: 'tired', 
        message: 'You made it on time but feeling drained...',
        foxMood: 'sleepy'
      }
    } else {
      return { 
        type: 'success', 
        message: 'Perfect! You\'re on time, energized, and ready!',
        foxMood: 'confident'
      }
    }
  }

  const availableActions = actions.filter(action => !action.used && gameState.timeLeft >= action.timeRequired)

  // Instructions Modal
  if (showInstructions) {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.instructionsModal}>          <div className={styles.foxAvatar}>
            <span style={{ fontSize: '4rem', lineHeight: 1 }}>🦊</span>
          </div>
          <h2 className={styles.instructionsTitle}>Willpower Warrior: The Real Morning Dilemma</h2>
          <p className={styles.instructionsText}>
            You have <strong>40 minutes</strong> to get ready for school. Every action has a cost or benefit. 
            Some are tempting! See if you can arrive at school on time, alert, and ready.
          </p>
          <div className={styles.instructionsList}>
            <p>⏰ <strong>Watch the clock</strong> - Time is limited</p>
            <p>⚡ <strong>Manage your energy</strong> - Some actions drain you</p>
            <p>🎯 <strong>Make smart choices</strong> - Not all actions are obvious</p>
            <p>🦊 <strong>Listen to your mentor</strong> - Fox wisdom guides you</p>
          </div>
          <button 
            className={styles.continueButton}
            onClick={() => setShowInstructions(false)}
          >
            Start My Morning →
          </button>
        </div>
      </div>
    )
  }

  // Action Feedback Modal
  if (showActionFeedback && currentAction) {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.feedbackModal}>
          <h3 className={styles.feedbackTitle}>{currentAction.name}</h3>
          <div className={styles.impactDisplay}>
            <span className={styles.timeImpact}>
              Time: -{currentAction.timeRequired} min
            </span>
            <span className={`${styles.energyImpact} ${currentAction.energyChange >= 0 ? styles.positive : styles.negative}`}>
              Energy: {currentAction.energyChange >= 0 ? '+' : ''}{currentAction.energyChange}
            </span>
          </div>
          <p className={styles.feedbackText}>{currentAction.feedback}</p>
          {currentAction.bookQuote && (
            <blockquote className={styles.bookQuote}>
              "{currentAction.bookQuote}"
              <footer>- Lead India 2020 Resource Book</footer>
            </blockquote>
          )}
          <button 
            className={styles.continueButton}
            onClick={handleActionContinue}
          >
            Continue →
          </button>
        </div>
      </div>
    )
  }

  // Scenario Modal
  if (showScenario && currentScenario && !showScenarioFeedback) {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.scenarioModal}>
          <h3 className={styles.scenarioTitle}>{currentScenario.title}</h3>
          <p className={styles.scenarioDescription}>{currentScenario.description}</p>
          <div className={styles.choicesGrid}>
            {currentScenario.choices.map((choice, index) => (
              <button
                key={index}
                className={styles.choiceButton}
                onClick={() => handleScenarioChoice(choice)}
              >
                {choice.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Scenario Feedback Modal
  if (showScenarioFeedback && scenarioChoice) {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.feedbackModal}>
          <h3 className={styles.feedbackTitle}>Decision Result</h3>
          <div className={styles.impactDisplay}>
            {scenarioChoice.timeChange !== 0 && (
              <span className={styles.timeImpact}>
                Time: {scenarioChoice.timeChange > 0 ? '+' : ''}{scenarioChoice.timeChange} min
              </span>
            )}
            {scenarioChoice.energyChange !== 0 && (
              <span className={`${styles.energyImpact} ${scenarioChoice.energyChange >= 0 ? styles.positive : styles.negative}`}>
                Energy: {scenarioChoice.energyChange >= 0 ? '+' : ''}{scenarioChoice.energyChange}
              </span>
            )}
          </div>
          <p className={styles.feedbackText}>{scenarioChoice.feedback}</p>
          <button 
            className={styles.continueButton}
            onClick={handleScenarioContinue}
          >
            Continue →
          </button>
        </div>
      </div>
    )
  }

  // Summary Modal
  if (showSummary) {
    const outcome = getOutcome()
    
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.summaryModal}>          <div className={`${styles.foxAvatar} ${styles[outcome.foxMood]}`}>
            <span style={{ fontSize: '4rem', lineHeight: 1 }}>🦊</span>
          </div>
          <h2 className={styles.summaryTitle}>Here's how your morning went!</h2>
          <p className={`${styles.outcomeMessage} ${styles[outcome.type]}`}>
            {outcome.message}
          </p>
          
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Time Left:</span>
              <span className={styles.statValue}>{gameState.timeLeft} min</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Final Energy:</span>
              <span className={styles.statValue}>{gameState.energy}/10</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Actions Taken:</span>
              <span className={styles.statValue}>{gameState.actionsTaken.length}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Score:</span>
              <span className={styles.statValue}>{gameState.score}</span>
            </div>
          </div>

          <div className={styles.actionsSummary}>
            <h4>Actions You Took:</h4>
            <div className={styles.actionsList}>
              {gameState.actionsTaken.map((action, index) => (
                <div key={index} className={`${styles.actionSummaryItem} ${styles[action.category]}`}>
                  <span className={styles.actionName}>{action.name}</span>
                  <span className={styles.actionCost}>-{action.timeRequired}min, {action.energyChange >= 0 ? '+' : ''}{action.energyChange} energy</span>
                </div>
              ))}
            </div>
          </div>

          <button 
            className={styles.continueButton}
            onClick={handleSummaryContinue}
          >
            View WHY CARD →
          </button>
        </div>
      </div>
    )
  }

  // WHY CARD Modal
  if (showWhyCard) {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.whyCardModal}>
          <h2 className={styles.whyCardTitle}>Willpower Warrior Wisdom</h2>
          <div className={styles.whyCardContent}>
            <h3>Being a hero means noticing sneaky time-traps and making smart swaps!</h3>
            <p className={styles.whyCardExplanation}>
              Every morning is a battlefield between your goals and distractions. 
              Heroes recognize the difference between actions that serve their future 
              and those that steal their time and energy.
            </p>
            <blockquote className={styles.bookQuote}>
              "Too much rest is not good for health. Act timely."
              <footer>- Lead India 2020 Resource Book</footer>
            </blockquote>
          </div>
          <div className={styles.whyCardButtons}>
            <button 
              className={styles.playAgainButton}
              onClick={playAgain}
            >
              🔄 Try Another Morning
            </button>
            <button 
              className={styles.continueButton}
              onClick={handleWhyCardContinue}
            >
              Continue Journey →
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Game Complete
  if (gameComplete) {
    return (      <CompletionModal
        buttonHref="/games/goals"
        buttonLabel="Continue to Goal-Orb Discovery →"
      >
        <h2>Morning Warrior Achieved! 🌅</h2>
        <p>You scored {gameState.score} points and learned the art of intentional mornings!</p>
        <button 
          onClick={playAgain}
          style={{ marginRight: '1rem', padding: '0.5rem 1rem' }}
        >
          🔄 Try Another Morning
        </button>
      </CompletionModal>
    )
  }

  // Main Game Board
  return (
    <div className={styles.gameContainer}>
      <title>Willpower Warrior: The Real Morning Dilemma | BadhoHero</title>
      <meta name="description" content="Master your morning routine with limited time and energy. Make smart choices to arrive at school prepared, energized, and on time using Lead India wisdom." />

      <div className={styles.gameHeader}>
        <h1 className={styles.gameTitle}>Willpower Warrior</h1>
        <p className={styles.gameSubtitle}>The Real Morning Dilemma</p>
      </div>

      <div className={styles.statusBar}>
        <div className={styles.timeDisplay}>
          <span className={styles.timeLabel}>Time Left:</span>
          <span className={`${styles.timeValue} ${gameState.timeLeft <= 10 ? styles.timeWarning : ''}`}>
            {gameState.timeLeft} min
          </span>
        </div>
        
        <div className={styles.energyMeter}>
          <span className={styles.energyLabel}>Energy:</span>
          <div className={styles.energyBar}>
            <div 
              className={styles.energyFill}
              style={{ width: `${(gameState.energy / gameState.maxEnergy) * 100}%` }}
            />
          </div>
          <span className={styles.energyValue}>{gameState.energy}/10</span>
        </div>

        <div className={styles.scoreDisplay}>
          <span className={styles.scoreLabel}>Score:</span>
          <span className={styles.scoreValue}>{gameState.score}</span>
        </div>
      </div>      <div className={styles.foxGuide}>
        <span style={{ fontSize: '3rem', lineHeight: 1 }}>🦊</span>
        <div className={styles.foxSpeech}>
          {gameState.timeLeft > 30 && "Good morning, warrior! Choose your actions wisely."}
          {gameState.timeLeft <= 30 && gameState.timeLeft > 15 && "Time is ticking! Focus on what matters most."}
          {gameState.timeLeft <= 15 && gameState.timeLeft > 5 && "Hurry up! Make quick, smart decisions!"}
          {gameState.timeLeft <= 5 && "Almost out of time! Are you ready?"}
        </div>
      </div>

      <div className={styles.actionsGrid}>
        {availableActions.map(action => (
          <button
            key={action.id}
            className={`${styles.actionButton} ${styles[action.category]} ${gameState.timeLeft < action.timeRequired ? styles.tooSlow : ''}`}
            onClick={() => handleActionSelect(action)}
            disabled={gameState.timeLeft < action.timeRequired}
          >
            <div className={styles.actionName}>{action.name}</div>
            <div className={styles.actionCost}>
              <span className={styles.timeCost}>{action.timeRequired}min</span>
              <span className={`${styles.energyCost} ${action.energyChange >= 0 ? styles.positive : styles.negative}`}>
                {action.energyChange >= 0 ? '+' : ''}{action.energyChange} energy
              </span>
            </div>
            {action.isEssential && <span className={styles.essentialBadge}>Essential</span>}
          </button>
        ))}
      </div>

      <div className={styles.gameFooter}>
        <button 
          className={`${styles.finishButton} ${(!gameState.hasEaten || !gameState.hasPackedBag) ? styles.finishDisabled : ''}`}
          onClick={handleFinishAndGo}
          disabled={!gameState.hasEaten || !gameState.hasPackedBag}
        >
          🎒 Finish & Go to School
        </button>
        
        <div className={styles.essentialChecks}>
          <div className={`${styles.checkItem} ${gameState.hasEaten ? styles.completed : ''}`}>
            <span className={styles.checkIcon}>{gameState.hasEaten ? '✅' : '❌'}</span>
            <span>Ate Something</span>
          </div>
          <div className={`${styles.checkItem} ${gameState.hasPackedBag ? styles.completed : ''}`}>
            <span className={styles.checkIcon}>{gameState.hasPackedBag ? '✅' : '❌'}</span>
            <span>Packed Bag</span>
          </div>
        </div>

        <p className={styles.bookCredit}>
          Wisdom from the <strong>Lead India 2020 Resource Book</strong>
        </p>
      </div>
    </div>
  )
}
