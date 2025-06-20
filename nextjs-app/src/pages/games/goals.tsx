import { useState, useContext } from 'react'
import { useRouter } from 'next/router'
import HeadTag from 'next/head'
import JsonLd from '../../components/seo/JsonLd'
import ModernGameLayout from '../../components/layout/ModernGameLayout'
import WhyCard from '../../components/layout/WhyCard'
import CompletionModal from '../../components/ui/CompletionModal'
import { UserContext } from '../../shared/UserContext'
import type { UserContextType } from '../../shared/types/user'
import { notify } from '../../shared/notify'
import styles from '../../styles/GoalsGame.module.css'

interface Orb {
  id: number
  name: string
  bestPortal: 'short' | 'medium' | 'long'
  assignedPortal: 'short' | 'medium' | 'long' | null
  justification: string
  justificationOptions: string[]
  bestJustification: number
}

interface Portal {
  type: 'short' | 'medium' | 'long'
  name: string
  color: string
  icon: string
  maxOrbs: number
  orbs: Orb[]
}

const SAMPLE_ORBS: Orb[] = [
  {
    id: 1,
    name: "Finish today's homework",
    bestPortal: 'short',
    assignedPortal: null,
    justification: '',
    justificationOptions: [
      "Can finish today",
      "Will take a few months", 
      "It's a dream for next year",
      "Not urgent"
    ],
    bestJustification: 0
  },
  {
    id: 2,
    name: "Save 500 rupees",
    bestPortal: 'medium',
    assignedPortal: null,
    justification: '',
    justificationOptions: [
      "Can do right now",
      "Will take a few months",
      "Long-term ambition",
      "Not important"
    ],
    bestJustification: 1
  },
  {
    id: 3,
    name: "Read a book this month",
    bestPortal: 'medium',
    assignedPortal: null,
    justification: '',
    justificationOptions: [
      "Can finish today",
      "Needs weeks to finish",
      "Will take years",
      "Too difficult"
    ],
    bestJustification: 1
  },
  {
    id: 4,
    name: "Score high in exams",
    bestPortal: 'long',
    assignedPortal: null,
    justification: '',
    justificationOptions: [
      "Can do today",
      "Need to train",
      "Will work for months",
      "Impossible goal"
    ],
    bestJustification: 2
  },
  {
    id: 5,
    name: "Help family with chores",
    bestPortal: 'short',
    assignedPortal: null,
    justification: '',
    justificationOptions: [
      "Can do every day",
      "Will take months",
      "Long-term project",
      "Not my job"
    ],
    bestJustification: 0
  },
  {
    id: 6,
    name: "Win the sports match",
    bestPortal: 'medium',
    assignedPortal: null,
    justification: '',
    justificationOptions: [
      "Can win today",
      "Need to train",
      "Impossible dream",
      "Don't care"
    ],
    bestJustification: 1
  },
  {
    id: 7,
    name: "Start a hobby",
    bestPortal: 'medium',
    assignedPortal: null,
    justification: '',
    justificationOptions: [
      "Can start today",
      "Learn over time",
      "Will take years",
      "Too expensive"
    ],
    bestJustification: 1
  },
  {
    id: 8,
    name: "Improve at math",
    bestPortal: 'long',
    assignedPortal: null,
    justification: '',
    justificationOptions: [
      "Can do today",
      "Need few weeks",
      "Needs steady practice",
      "Too hard"
    ],
    bestJustification: 2
  }
]

const PORTALS: Portal[] = [
  {
    type: 'short',
    name: 'Short-Term',
    color: '#10b981',
    icon: '⚡',
    maxOrbs: 2,
    orbs: []
  },
  {
    type: 'medium',
    name: 'Medium-Term',
    color: '#3b82f6',
    icon: '🎯',
    maxOrbs: 2,
    orbs: []
  },
  {
    type: 'long',
    name: 'Long-Term',
    color: '#8b5cf6',
    icon: '🌟',
    maxOrbs: 2,
    orbs: []
  }
]

export default function GoalsGame() {
  const { user, setPoints, addBadge } = useContext(UserContext) as UserContextType
  const router = useRouter()
  const [orbs, setOrbs] = useState<Orb[]>(SAMPLE_ORBS)
  const [portals, setPortals] = useState<Portal[]>(PORTALS)
  const [gameStarted, setGameStarted] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)
  const [draggedOrb, setDraggedOrb] = useState<Orb | null>(null)
  const [showJustification, setShowJustification] = useState(false)
  const [currentOrb, setCurrentOrb] = useState<Orb | null>(null)
  const [targetPortal, setTargetPortal] = useState<'short' | 'medium' | 'long' | null>(null)
  const [gamePhase, setGamePhase] = useState<'sorting' | 'checking' | 'feedback' | 'complete'>('sorting')
  const [score, setScore] = useState(0)
  const [foxPosition, setFoxPosition] = useState(0)
  const [feedback, setFeedback] = useState<string[]>([])
  const [showWhyCard, setShowWhyCard] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)

  const startGame = () => {
    setGameStarted(true)
    setShowInstructions(true)
  }

  const handleDragStart = (orb: Orb) => {
    if (orb.assignedPortal) return // Already assigned
    setDraggedOrb(orb)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, portalType: 'short' | 'medium' | 'long') => {
    e.preventDefault()
    if (!draggedOrb) return

    const portal = portals.find(p => p.type === portalType)
    if (!portal) return

    // Check if portal is full
    if (portal.orbs.length >= portal.maxOrbs) {
      notify("This portal is full! Pick another or swap with an existing orb.")
      setDraggedOrb(null)
      return
    }

    // Set up justification modal
    setCurrentOrb(draggedOrb)
    setTargetPortal(portalType)
    setShowJustification(true)
    setDraggedOrb(null)
  }

  const handleJustificationSubmit = (justificationIndex: number) => {
    if (!currentOrb || !targetPortal) return

    const justification = currentOrb.justificationOptions[justificationIndex]
    
    // Update orb
    const updatedOrb = {
      ...currentOrb,
      assignedPortal: targetPortal,
      justification
    }

    // Update orbs state
    setOrbs(prev => prev.map(orb => 
      orb.id === currentOrb.id ? updatedOrb : orb
    ))

    // Update portals state
    setPortals(prev => prev.map(portal => 
      portal.type === targetPortal 
        ? { ...portal, orbs: [...portal.orbs, updatedOrb] }
        : portal
    ))

    // Move fox forward
    setFoxPosition(prev => prev + 1)

    setShowJustification(false)
    setCurrentOrb(null)
    setTargetPortal(null)

    notify("Orb placed! The fox moves forward!")
  }

  const checkPlan = () => {
    const feedbackList: string[] = []
    let correctCount = 0

    orbs.forEach(orb => {
      if (!orb.assignedPortal) return

      const isCorrectPortal = orb.assignedPortal === orb.bestPortal
      const isCorrectJustification = orb.justificationOptions.indexOf(orb.justification) === orb.bestJustification

      if (isCorrectPortal && isCorrectJustification) {
        feedbackList.push(`✅ ${orb.name}: Great! That's a SMARTY goal and perfect reasoning!`)
        correctCount++
      } else if (isCorrectPortal) {
        feedbackList.push(`⚠️ ${orb.name}: Good portal choice, but think about the reasoning. Is there a better fit?`)
      } else {
        feedbackList.push(`❌ ${orb.name}: Think again: is this really a ${orb.assignedPortal}-term goal?`)
      }
    })

    setFeedback(feedbackList)
    setScore(correctCount * 25)
    setGamePhase('feedback')
  }

  const finishGame = () => {
    setPoints('goals', score)
    if (!user.badges.includes('goal-sorter')) {
      addBadge('goal-sorter')
      notify('🏅 Goal Sorter Badge earned! You understand the SMARTY principle!')
    }
    setShowWhyCard(true)
  }

  const handleWhyCardContinue = () => {
    setShowWhyCard(false)
    setGameComplete(true)
  }

  const resetGame = () => {
    setOrbs(SAMPLE_ORBS.map(orb => ({ ...orb, assignedPortal: null, justification: '' })))
    setPortals(PORTALS.map(portal => ({ ...portal, orbs: [] })))
    setGameStarted(false)
    setGamePhase('sorting')
    setScore(0)
    setFoxPosition(0)
    setFeedback([])
    setGameComplete(false)
  }

  // Check if all orbs are placed
  const allOrbsPlaced = orbs.every(orb => orb.assignedPortal !== null)

  if (gameComplete) {
    return (
      <CompletionModal
        imageSrc="https://raw.githubusercontent.com/unnamedmistress/images/main/DALL%C2%B7E%202025-06-18%2011-20-14%20-%20A%20warm%2C%20friendly%20cartoon%20fox%20with%20bright%20orange%20fur%20and%20white%20chest%2C%20wearing%20a%20subtle%20blue%20cape%20or%20small%20medallion.%20The%20fox%20has%20large%2C%20expressive.png"
        buttonHref="/games/time"
        buttonLabel="Continue to Time Tunnel →"
      >
        <h2>Goal Plan Complete! 🎯</h2>
        <p>You scored {score} points and learned the SMARTY principle!</p>
        <button 
          onClick={resetGame}
          style={{ marginRight: '1rem', padding: '0.5rem 1rem' }}
        >
          🔄 Play Again
        </button>
      </CompletionModal>
    )
  }
  if (showWhyCard) {
    return (
      <WhyCard
        title="The SMARTY Principle"
        explanation="Every goal should be Specific, Measurable, Attainable, Realistic, Time-bound, and Your own. This creates clear paths to success."
        quote="Life without goal is like a boat without destiny. Every goal should be Specific, Measurable, Attainable, Realistic, Time-bound, and Your own (SMARTY)."
      >
        <button 
          onClick={handleWhyCardContinue}
          style={{ 
            background: 'linear-gradient(90deg, #ee3a57, #dc2626)',
            color: 'white',
            border: 'none',
            padding: '0.75rem 2rem',
            borderRadius: '12px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            marginTop: '1rem'
          }}
        >
          Continue →
        </button>
      </WhyCard>
    )
  }
  if (!gameStarted) {
    return (
      <ModernGameLayout 
        gameTitle="Goal-Orb Discovery"
        whyCard={null}
      >
        <HeadTag>
          <title>Goal-Orb Discovery | BadhoHero</title>
          <meta name="description" content="Sort goals into the right time portals using the SMARTY principle. Learn effective goal planning with wisdom from Lead India." />
          <link rel="canonical" href="https://badhohero.vercel.app/games/goals" />
        </HeadTag>

        <div className={styles.startScreen}>
          <img 
            src="https://raw.githubusercontent.com/unnamedmistress/images/main/DALL%C2%B7E%202025-06-18%2011-20-14%20-%20A%20warm%2C%20friendly%20cartoon%20fox%20with%20bright%20orange%20fur%20and%20white%20chest%2C%20wearing%20a%20subtle%20blue%20cape%20or%20small%20medallion.%20The%20fox%20has%20large%2C%20expressive.png"
            alt="Fox ready to sort goals"
            className={styles.heroImg}
          />
          <h1>Goal-Orb Discovery</h1>
          <h2>Lakshya Sort</h2>
          <p>Help the fox reach the festival by sorting goals into the right time portals!</p>
          <button 
            onClick={startGame}
            className={styles.startButton}
          >
            Begin Goal Sorting
          </button>
        </div>
      </ModernGameLayout>
    )
  }

  if (showInstructions) {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.instructionsModal}>
          <h2>How to Sort Goal Orbs</h2>
          <div className={styles.instructionsList}>
            <p>🎯 <strong>Drag each goal orb</strong> into the right portal</p>
            <p>⚡ <strong>Each portal</strong> only fits two orbs!</p>
            <p>💭 <strong>After sorting,</strong> explain why you put it there</p>
            <p>📚 <strong>Use book wisdom</strong> and the SMARTY principle</p>
          </div>
          <div className={styles.bookTip}>
            <strong>Book Tip:</strong> "Every goal should be Specific, Measurable, Attainable, Realistic, Time-bound, and Your own (SMARTY)."
            <br />— Lead India 2020 Resource Book
          </div>
          <button 
            onClick={() => setShowInstructions(false)}
            className={styles.continueButton}
          >
            Start Sorting! →
          </button>
        </div>
      </div>
    )
  }

  if (showJustification && currentOrb) {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.justificationModal}>
          <h3>Why did you pick {portals.find(p => p.type === targetPortal)?.name} for:</h3>
          <p className={styles.orbName}>"{currentOrb.name}"</p>
          
          <div className={styles.justificationOptions}>
            {currentOrb.justificationOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => handleJustificationSubmit(index)}
                className={styles.justificationButton}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (gamePhase === 'feedback') {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.feedbackModal}>
          <h2>Your Goal Plan Feedback</h2>
          <div className={styles.feedbackList}>
            {feedback.map((item, index) => (
              <p key={index} className={styles.feedbackItem}>{item}</p>
            ))}
          </div>
          <p className={styles.scoreDisplay}>Final Score: {score} points</p>
          <div className={styles.feedbackButtons}>
            <button 
              onClick={() => setGamePhase('sorting')}
              className={styles.swapButton}
            >
              ↩️ Make Changes
            </button>
            <button 
              onClick={finishGame}
              className={styles.finishButton}
            >
              ✅ Finish Plan
            </button>
          </div>
        </div>
      </div>
    )
  }
  return (
    <ModernGameLayout 
      gameTitle="Goal-Orb Discovery"
      whyCard={null}
    >
      <HeadTag>
        <title>Goal-Orb Discovery | BadhoHero</title>
        <meta name="description" content="Sort goals into the right time portals using the SMARTY principle. Learn effective goal planning with wisdom from Lead India." />
        <link rel="canonical" href="https://badhohero.vercel.app/games/goals" />
      </HeadTag>

      <div className={styles.gameContainer}>
        <div className={styles.gameHeader}>
          <h1>Goal-Orb Discovery</h1>
          <div className={styles.foxPath}>
            <img 
              src="https://raw.githubusercontent.com/unnamedmistress/images/main/DALL%C2%B7E%202025-06-18%2011-20-14%20-%20A%20warm%2C%20friendly%20cartoon%20fox%20with%20bright%20orange%20fur%20and%20white%20chest%2C%20wearing%20a%20subtle%20blue%20cape%20or%20small%20medallion.%20The%20fox%20has%20large%2C%20expressive.png"
              alt="Fox moving along path"
              className={styles.foxAvatar}
              style={{ transform: `translateX(${foxPosition * 30}px)` }}
            />
            <div className={styles.pathLine}></div>
            <div className={styles.festival}>🎪</div>
          </div>
        </div>

        <div className={styles.portalsArea}>
          {portals.map(portal => (
            <div
              key={portal.type}
              className={styles.portal}
              style={{ borderColor: portal.color }}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, portal.type)}
            >
              <div className={styles.portalHeader}>
                <span className={styles.portalIcon}>{portal.icon}</span>
                <h3>{portal.name}</h3>
                <span className={styles.portalCount}>
                  {portal.orbs.length}/{portal.maxOrbs}
                </span>
              </div>
              <div className={styles.portalContent}>
                {portal.orbs.map(orb => (
                  <div key={orb.id} className={styles.placedOrb}>
                    {orb.name}
                  </div>
                ))}
                {portal.orbs.length < portal.maxOrbs && (
                  <div className={styles.emptySlot}>Drop orb here</div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.orbsArea}>
          <h3>Goal Orbs to Sort:</h3>
          <div className={styles.orbsList}>
            {orbs.filter(orb => !orb.assignedPortal).map(orb => (
              <div
                key={orb.id}
                className={styles.orb}
                draggable
                onDragStart={() => handleDragStart(orb)}
              >
                🔮 {orb.name}
              </div>
            ))}
          </div>
        </div>

        {allOrbsPlaced && (
          <div className={styles.checkArea}>
            <button 
              onClick={checkPlan}
              className={styles.checkButton}
            >
              📋 Check My Plan
            </button>
          </div>
        )}
      </div>
    </ModernGameLayout>
  )
}
