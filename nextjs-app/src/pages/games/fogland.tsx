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
    question: "Which habit is 'the energizer' to start your day?",
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
    question: "What is'the secret behind success'?",
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
  }
]

export default function FoglandGame() {
  const { user, setPoints, addBadge } = useContext(UserContext) as UserContextType
  const router = useRouter()
  const [tiles, setTiles] = useState<FogTile[]>(FOG_TILES)
  const [currentTile, setCurrentTile] = useState<FogTile | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isSelectedAnswerCorrect, setIsSelectedAnswerCorrect] = useState<boolean | null>(null)
  const [showWhyCard, setShowWhyCard] = useState(false)
  const [score, setScore] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)
  const [showIntro, setShowIntro] = useState(true)
  const [showInstructions, setShowInstructions] = useState(false)
  const [collectedCards, setCollectedCards] = useState<FogTile[]>([])
  const [showIncorrectFeedback, setShowIncorrectFeedback] = useState(false)
  const [incorrectMessage, setIncorrectMessage] = useState('')
  const clearedTiles = tiles.filter(tile => tile.cleared).length
  const totalTiles = tiles.length
  const progress = (clearedTiles / totalTiles) * 100

  const handleTileClick = (tile: FogTile) => {
    if (tile.cleared) return
    setCurrentTile(tile)
    setSelectedAnswer(null)
    setIsSelectedAnswerCorrect(null)
    setShowWhyCard(false)
    setShowIncorrectFeedback(false)
  }
  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
    
    if (!currentTile) return

    const isCorrect = answerIndex === currentTile.correctAnswer
    setIsSelectedAnswerCorrect(isCorrect)
    
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
    setIsSelectedAnswerCorrect(null)
  }

  const handleContinue = () => {
    setCurrentTile(null)
    setShowWhyCard(false)
    setSelectedAnswer(null)
    setIsSelectedAnswerCorrect(null)

    // Check if all tiles are cleared
    const newClearedTiles = tiles.filter(tile => tile.cleared).length
    if (newClearedTiles === totalTiles) {
      // Award badge and points directly, skip reflection
      setPoints('fogland', score)
      if (!user.badges.includes('fog-clearer')) {
        addBadge('fog-clearer')
      }
      setGameComplete(true)    }
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
            you'll unlock a true lesson about planning, habits, action, and positive attitude.
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
            <p>🌟 <strong>Clear all tiles</strong> to awaken your inner hero</p>
          </div>
          <button 
            className={styles.continueButton}
            onClick={() => setShowInstructions(false)}
          >
            Start Clearing the Fog! →
          </button>
        </div>
      </div>    )
  }

  // Game completion
  if (gameComplete) {
    return (
      <div className={styles.modalOverlay}>        <div className={styles.completionModal}>
          <div className={styles.foxAvatar}>
            <span style={{ fontSize: '4rem', lineHeight: 1 }}>🦊</span>
          </div>
          
          <div className={styles.badgeSection}>
            <span className={styles.badge}>🏆</span>
            <p className={styles.badgeText}>Fog Clearer Badge Earned!</p>
          </div>
          
          <h2 className={styles.completionTitle}>You've Awakened Your Inner Hero!</h2>
          
          <blockquote className={styles.mainQuote}>
            "Complete the work taken up. Visualize what's next and plan tomorrow's work as a leader."
            <footer>- Lead India 2020 Resource Book</footer>
          </blockquote>

          <div className={styles.lessonRecap}>
            <h3>Key Lessons:</h3>
            <ul className={styles.recapList}>
              <li>• Planning is your secret weapon against failure</li>
              <li>• Your mind's strength turns obstacles into opportunities</li>
              <li>• Small daily actions build the habits of heroes</li>
            </ul>
          </div>         

          <p className={styles.bookCredit}>
            All lessons and quotes are from the <strong>Lead India 2020 Resource Book</strong>.
          </p>

          <div className={styles.completionActions}>
            
            <button 
              className={styles.continueButton}
              onClick={() => window.location.href = '/games/willpower'}
            >
              Continue to Willpower Warrior →
            </button>
            
            <button 
              onClick={() => {
                setTiles(FOG_TILES.map(tile => ({ ...tile, cleared: false })))
                setScore(0)
                setGameComplete(false)
                setCollectedCards([])
                setShowIntro(true)
              }}
              className={styles.replayButton}
            >
              🔄 Replay
            </button>
          </div>
        </div>
      </div>
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
            {currentTile.answers.map((answer, index) => {
              let buttonClass = styles.answerButton;
              if (selectedAnswer === index) {
                buttonClass += ` ${styles.selected}`;
                if (isSelectedAnswerCorrect === true) {
                  buttonClass += ` ${styles.correct}`;
                } else if (isSelectedAnswerCorrect === false) {
                  buttonClass += ` ${styles.incorrect}`;
                }
              }
              
              return (
                <button
                  key={index}
                  className={buttonClass}
                  onClick={() => handleAnswerSelect(index)}
                >
                  {String.fromCharCode(65 + index)}) {answer}
                </button>
              );
            })}
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
