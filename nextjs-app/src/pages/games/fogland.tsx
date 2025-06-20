import { useState, useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import HeadTag from 'next/head'
import JsonLd from '../../components/seo/JsonLd'
import ModernGameLayout from '../../components/layout/ModernGameLayout'
import WhyCard from '../../components/layout/WhyCard'
import CompletionModal from '../../components/ui/CompletionModal'
import ProgressBar from '../../components/ui/ProgressBar'
import { UserContext } from '../../shared/UserContext'
import type { UserContextType } from '../../shared/types/user'
import { notify } from '../../shared/notify'
import styles from '../../styles/FoglandGame.module.css'

interface FogTile {
  id: number
  question: string
  hint?: string
  answers: string[]
  correctAnswer: number
  whyCard: {
    title: string
    explanation: string
    bookQuote: string
  }
  cleared: boolean
}

const FOG_TILES: FogTile[] = [
  {
    id: 1,
    question: "Which habit does the Resource Book call 'the energizer' to start your day?",
    hint: "'Smile unifies body, mind and soul'",
    answers: ["Yawning", "Complaining", "Smiling", "Stretching"],
    correctAnswer: 2,
    whyCard: {
      title: "Smile the Energizer",
      explanation: "Your smile is the secret weapon against laziness. It transforms your entire being from the inside out.",
      bookQuote: "Smile the Energizer: Smile unifies body, mind and soul; Smile improves health and gives happiness."
    },
    cleared: false
  },
  {
    id: 2,
    question: "What does the book call 'the secret behind success'?",
    answers: ["Having talent", "Failing to plan is planning to fail", "Working harder", "Being lucky"],
    correctAnswer: 1,
    whyCard: {
      title: "Planning Power",
      explanation: "Without a plan, you're just wandering in the fog. Planning lights your path to victory.",
      bookQuote: "Failing to plan is planning to fail."
    },
    cleared: false
  },
  {
    id: 3,
    question: "When your mind is strong, a situation becomes...",
    answers: ["A problem", "An opportunity", "A burden", "Confusing"],
    correctAnswer: 1,
    whyCard: {
      title: "Mind Strength",
      explanation: "Your mental strength transforms every challenge into a stepping stone to greatness.",
      bookQuote: "When MIND is strong, situation is an OPPORTUNITY."
    },
    cleared: false
  },
  {
    id: 4,
    question: "What daily action does the book recommend to build discipline?",
    answers: ["Watch motivational videos", "Write a diary and plan for tomorrow", "Exercise for hours", "Read success stories"],
    correctAnswer: 1,
    whyCard: {
      title: "Daily Discipline Builder",
      explanation: "Writing and planning each day creates the foundation for unstoppable momentum.",
      bookQuote: "Practise the habit of writing diary on regular basis… Plan further steps to be taken to reach your goal."
    },
    cleared: false
  },
  {
    id: 5,
    question: "Why is goal-setting so important according to the book?",
    answers: ["Goals make you famous", "Life without goal is like a boat without destiny", "Goals impress others", "Goals guarantee success"],
    correctAnswer: 1,
    whyCard: {
      title: "Your Destiny Direction",
      explanation: "Without goals, you drift aimlessly. With clear goals, you sail toward your destiny with purpose.",
      bookQuote: "Life without goal is like a boat without destiny."
    },
    cleared: false
  },
  {
    id: 6,
    question: "How should you handle laziness when work feels boring?",
    answers: ["Wait for motivation", "Act timely and take the first step", "Distract yourself", "Postpone until tomorrow"],
    correctAnswer: 1,
    whyCard: {
      title: "Timely Action",
      explanation: "Timing is everything. The right action at the right moment breaks through any barrier.",
      bookQuote: "Act timely. Action appropriate to the situation can help to overcome obstacles."
    },
    cleared: false
  },
  {
    id: 7,
    question: "What does the book teach about completing tasks?",
    answers: ["Finish when you feel like it", "Complete the work taken up", "Leave some for later", "Work only when perfect"],
    correctAnswer: 1,
    whyCard: {
      title: "Completion Power",
      explanation: "Finishing what you start builds unshakeable confidence and momentum for future victories.",
      bookQuote: "Complete the work taken up. Visualize what's next and plan tomorrow's work as a leader."
    },
    cleared: false
  },
  {
    id: 8,
    question: "What makes a person truly strong according to Lead India?",
    answers: ["Physical power", "Money and status", "Strong mind and character", "Having many friends"],
    correctAnswer: 2,
    whyCard: {
      title: "True Strength",
      explanation: "Real strength comes from within - a disciplined mind and strong character defeat laziness every time.",
      bookQuote: "When MIND is strong, situation is an OPPORTUNITY. Build character, build strength."
    },
    cleared: false
  }
]

export default function FoglandGame() {
  const { user, setPoints, addBadge } = useContext(UserContext) as UserContextType
  const router = useRouter()
  const [tiles, setTiles] = useState<FogTile[]>(FOG_TILES)
  const [currentTile, setCurrentTile] = useState<FogTile | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showWhyCard, setShowWhyCard] = useState(false)
  const [score, setScore] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)
  const [showIntro, setShowIntro] = useState(true)
  const [showInstructions, setShowInstructions] = useState(false)
  const [showMidGameEncouragement, setShowMidGameEncouragement] = useState(false)
  const [showReflection, setShowReflection] = useState(false)
  const [reflection, setReflection] = useState('')
  const [collectedCards, setCollectedCards] = useState<FogTile[]>([])
  const [showIncorrectFeedback, setShowIncorrectFeedback] = useState(false)
  const [incorrectMessage, setIncorrectMessage] = useState('')

  const clearedTiles = tiles.filter(tile => tile.cleared).length
  const totalTiles = tiles.length
  const progress = (clearedTiles / totalTiles) * 100

  // Check for mid-game encouragement
  useEffect(() => {
    if (clearedTiles === Math.floor(totalTiles / 2) && clearedTiles > 0 && !showMidGameEncouragement) {
      setTimeout(() => {
        setShowMidGameEncouragement(true)
      }, 1500)
    }
  }, [clearedTiles, totalTiles, showMidGameEncouragement])

  const handleTileClick = (tile: FogTile) => {
    if (tile.cleared) return
    setCurrentTile(tile)
    setSelectedAnswer(null)
    setShowWhyCard(false)
    setShowIncorrectFeedback(false)
  }

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
    
    if (!currentTile) return

    const isCorrect = answerIndex === currentTile.correctAnswer
    
    if (isCorrect) {
      const newScore = score + 20
      setScore(newScore)
      
      // Update tile as cleared and add to collected cards
      setTiles(prev => prev.map(tile => 
        tile.id === currentTile.id 
          ? { ...tile, cleared: true }
          : tile
      ))
      
      setCollectedCards(prev => [...prev, currentTile])
      
      notify("Excellent! The fog clears and wisdom emerges...")
      
      // Show why card after a brief delay
      setTimeout(() => {
        setShowWhyCard(true)
      }, 1000)
    } else {
      // Show incorrect feedback with book quote encouragement
      setIncorrectMessage("Not quite! Remember: 'Act timely. Action appropriate to the situation can help to overcome obstacles.' Try again!")
      setShowIncorrectFeedback(true)
    }
  }

  const handleIncorrectRetry = () => {
    setShowIncorrectFeedback(false)
    setSelectedAnswer(null)
  }

  const handleContinue = () => {
    setCurrentTile(null)
    setShowWhyCard(false)
    setSelectedAnswer(null)

    // Check if all tiles are cleared
    const newClearedTiles = tiles.filter(tile => tile.cleared).length
    if (newClearedTiles === totalTiles) {
      // Show reflection modal before completion
      setShowReflection(true)
    }
  }

  const handleReflectionSubmit = () => {
    // Save reflection to user's journal (simplified for now)
    if (reflection.trim()) {
      notify('Your reflection has been saved to your Hero Journal!')
    }
      // Update points and award badge
    setPoints('fogland', score)
    if (!user.badges.includes('fog-clearer')) {
      addBadge('fog-clearer')
      notify('🏅 Fog Clearer Badge earned! You\'ve awakened from the laziness fog!')
    }
    
    setShowReflection(false)
    setGameComplete(true)
  }

  // Onboarding Flow
  if (showIntro) {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.introModal}>          <div className={styles.foxAvatar}>
            <span style={{ fontSize: '4rem', lineHeight: 1 }}>🦊</span>
          </div>
          <h2 className={styles.introTitle}>Welcome to Fogland Awakening!</h2>
          <p className={styles.introText}>
            Laziness is like a fog that hides your inner hero. Every time you clear a fog tile, 
            you'll unlock a true lesson from the <strong>Lead India 2020 Resource Book</strong> 
            about planning, habits, action, and positive attitude.
          </p>
          <button 
            className={styles.continueButton}
            onClick={() => {
              setShowIntro(false)
              setShowInstructions(true)
            }}
          >
            Begin Your Awakening →
          </button>
        </div>
      </div>
    )
  }

  if (showInstructions) {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.instructionsModal}>          <div className={styles.foxAvatar}>
            <span style={{ fontSize: '4rem', lineHeight: 1 }}>🦊</span>
          </div>
          <h2 className={styles.instructionsTitle}>How to Clear the Fog</h2>
          <div className={styles.instructionsList}>
            <p>🎯 <strong>Tap any fog tile</strong> to face a challenge question</p>
            <p>💡 <strong>Answer wisely</strong> using Lead India principles</p>
            <p>📜 <strong>Reveal WHY CARDS</strong> with real wisdom from the Resource Book</p>
            <p>🌟 <strong>Clear all tiles</strong> to awaken your inner hero</p>
          </div>
          <button 
            className={styles.continueButton}
            onClick={() => setShowInstructions(false)}
          >
            Start Clearing the Fog! →
          </button>
        </div>
      </div>
    )
  }

  // Mid-game encouragement
  if (showMidGameEncouragement) {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.encouragementModal}>          <div className={styles.foxAvatar}>
            <span style={{ fontSize: '4rem', lineHeight: 1 }}>🦊</span>
          </div>
          <h2 className={styles.encouragementTitle}>You're halfway there!</h2>
          <p className={styles.encouragementText}>
            Remember: <em>"Failing to plan is planning to fail."</em> Every tile cleared is a step to your best self!
          </p>
          <p className={styles.bookCredit}>- Lead India 2020 Resource Book</p>
          <button 
            className={styles.continueButton}
            onClick={() => setShowMidGameEncouragement(false)}
          >
            Continue Clearing →
          </button>
        </div>
      </div>
    )
  }

  // Reflection modal
  if (showReflection) {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.reflectionModal}>          <div className={styles.foxAvatar}>
            <span style={{ fontSize: '4rem', lineHeight: 1 }}>🦊</span>
          </div>
          <h2 className={styles.reflectionTitle}>Congratulations! You have cleared the fog of laziness.</h2>
          <p className={styles.mentorQuote}>
            <em>"Complete the work taken up. Visualize what's next and plan tomorrow's work as a leader."</em>
            <br />- Lead India 2020 Resource Book
          </p>
          
          <div className={styles.collectedCardsSection}>
            <h3>Your Collected WHY CARDS:</h3>
            <div className={styles.cardsGrid}>
              {collectedCards.map((card, index) => (
                <div key={card.id} className={styles.miniCard}>
                  <strong>{card.whyCard.title}</strong>
                  <p>"{card.whyCard.bookQuote}"</p>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.reflectionInput}>
            <label htmlFor="reflection">What's one habit or action from today's WHY CARDS you'll try this week?</label>
            <textarea
              id="reflection"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Share your reflection..."
              rows={3}
              className={styles.reflectionTextarea}
            />
          </div>

          <p className={styles.bookCredit}>All lessons and quotes are from the Lead India 2020 Resource Book.</p>

          <button 
            className={styles.continueButton}
            onClick={handleReflectionSubmit}
          >
            Save to Hero Journal →
          </button>
        </div>
      </div>
    )
  }
  // Game completion
  if (gameComplete) {
    return (      <CompletionModal
        buttonHref="/games/willpower"
        buttonLabel="Continue to Willpower Warrior →"
      >
        <h2>Fog Cleared! 🌟</h2>
        <p>You scored {score} points and awakened your inner hero!</p>
        <button 
          onClick={() => {
            setTiles(FOG_TILES.map(tile => ({ ...tile, cleared: false })))
            setScore(0)
            setGameComplete(false)
            setCollectedCards([])
            setShowIntro(true)
          }}
          style={{ marginRight: '1rem', padding: '0.5rem 1rem' }}
        >
          🔄 Replay
        </button>
      </CompletionModal>
    )
  }

  // Current tile challenge modal
  if (currentTile && !showWhyCard && !showIncorrectFeedback) {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.challengeModal}>
          <h3 className={styles.challengeTitle}>Fog Challenge</h3>
          <p className={styles.questionText}>{currentTile.question}</p>
          {currentTile.hint && (
            <p className={styles.hintText}>💡 Hint: {currentTile.hint}</p>
          )}
          
          <div className={styles.answersGrid}>
            {currentTile.answers.map((answer, index) => (
              <button
                key={index}
                className={`${styles.answerButton} ${selectedAnswer === index ? styles.selected : ''}`}
                onClick={() => handleAnswerSelect(index)}
              >
                {String.fromCharCode(65 + index)}) {answer}
              </button>
            ))}
          </div>

          <button
            className={styles.cancelButton}
            onClick={() => setCurrentTile(null)}
          >
            ← Back to Fog
          </button>
        </div>
      </div>
    )
  }

  // Incorrect feedback modal
  if (showIncorrectFeedback) {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.feedbackModal}>
          <h3 className={styles.feedbackTitle}>Try Again!</h3>
          <p className={styles.feedbackText}>{incorrectMessage}</p>
          <button 
            className={styles.continueButton}
            onClick={handleIncorrectRetry}
          >
            Try Again →
          </button>
        </div>
      </div>
    )
  }

  // Why card modal
  if (showWhyCard && currentTile) {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.whyCardModal}>
          <div className={styles.whyCardContent}>
            <h3 className={styles.whyCardTitle}>{currentTile.whyCard.title}</h3>
            <p className={styles.whyCardExplanation}>{currentTile.whyCard.explanation}</p>
            <blockquote className={styles.bookQuote}>
              "{currentTile.whyCard.bookQuote}"
              <footer>- Lead India 2020 Resource Book</footer>
            </blockquote>
          </div>
          <button 
            className={styles.continueButton}
            onClick={handleContinue}
          >
            Continue Clearing →
          </button>
        </div>
      </div>
    )
  }
  // Main game board
  return (
    <div className={styles.gameContainer}>
      <HeadTag>
        <title>Fogland Awakening | BadhoHero</title>
        <meta name="description" content="Clear the fog of laziness with wisdom from Lead India 2020 Resource Book. Awaken your inner hero through authentic lessons about planning, habits, and action." />
        <link rel="canonical" href="https://badhohero.vercel.app/games/fogland" />
      </HeadTag>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Game",
          "name": "Fogland Awakening",
          "description": "Clear the fog of laziness with wisdom from Lead India 2020 Resource Book",
          "url": "https://badhohero.vercel.app/games/fogland"
        }}
      />

      <div className={styles.gameContainer}>
        <div className={styles.gameHeader}>
          <h1 className={styles.gameTitle}>Fogland Awakening</h1>
          <p className={styles.gameSubtitle}>Clear the fog and awaken your inner hero</p>
          
          <div className={styles.progressSection}>
            <ProgressBar percent={progress} />
            <div className={styles.stats}>
              <span className={styles.score}>Score: {score}</span>
              <span className={styles.cleared}>{clearedTiles}/{totalTiles} cleared</span>
            </div>
          </div>
        </div>        <div className={styles.foxGuide}>
          <span style={{ fontSize: '3rem', lineHeight: 1 }}>🦊</span>
          <div className={styles.foxSpeech}>
            {clearedTiles === 0 && "Tap any fog tile to begin your awakening!"}
            {clearedTiles > 0 && clearedTiles < totalTiles && "Keep going! The fog is clearing..."}
            {clearedTiles === totalTiles && "Amazing! You've cleared all the fog!"}
          </div>
        </div>

        <div className={styles.fogGrid}>
          {tiles.map(tile => (
            <div
              key={tile.id}
              className={`${styles.fogTile} ${tile.cleared ? styles.cleared : ''}`}
              onClick={() => handleTileClick(tile)}
            >
              {tile.cleared ? (
                <div className={styles.clearedTile}>
                  <span className={styles.wisdom}>✨</span>
                  <span className={styles.tileTitle}>{tile.whyCard.title}</span>
                </div>
              ) : (
                <div className={styles.foggyTile}>
                  <span className={styles.fogIcon}>🌫️</span>
                  <span className={styles.tapHint}>Tap to clear</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className={styles.gameFooter}>
          <p className={styles.bookCredit}>
            Powered by wisdom from the <strong>Lead India 2020 Resource Book</strong>
          </p>        </div>
      </div>
    </div>
  )
}
