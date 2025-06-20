import { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import HeadTag from 'next/head'
import ModernGameLayout from '../../components/layout/ModernGameLayout'
import CompletionModal from '../../components/ui/CompletionModal'
import WhyCard from '../../components/layout/WhyCard'
import { UserContext } from '../../shared/UserContext'
import type { UserContextType } from '../../shared/types/user'
import { notify } from '../../shared/notify'
import styles from '../../styles/ComposeGame.module.css'

interface TweetPrompt {
  id: string
  theme: string
  prompt: string
  tips: string[]
  targetLength: number
}

const TWEET_PROMPTS: TweetPrompt[] = [
  {
    id: 'morning',
    theme: 'Morning Motivation',
    prompt: 'Compose a tweet about starting your day with purpose and energy',
    tips: ['Use action words', 'Include a specific morning habit', 'Keep it motivational'],
    targetLength: 280
  },
  {
    id: 'procrastination',
    theme: 'Beat Procrastination',
    prompt: 'Write a tweet about overcoming the urge to postpone important tasks',
    tips: ['Share a practical tip', 'Use relatable language', 'Include an emoji'],
    targetLength: 280
  },
  {
    id: 'small-wins',
    theme: 'Small Wins',
    prompt: 'Celebrate a small victory that builds momentum for bigger goals',
    tips: ['Be specific about the win', 'Show the connection to larger goals', 'Use positive energy'],
    targetLength: 280
  },
  {
    id: 'mindset',
    theme: 'Growth Mindset',
    prompt: 'Share how changing your mindset helped you take action',
    tips: ['Include before/after thinking', 'Use personal language', 'Inspire others'],
    targetLength: 280
  },
  {
    id: 'habits',
    theme: 'Building Habits',
    prompt: 'Tweet about a simple habit that transformed your productivity',
    tips: ['Explain the habit clearly', 'Mention the time commitment', 'Show the impact'],
    targetLength: 280
  }
]

export default function ComposeTweetGame() {
  const router = useRouter()
  const { user } = useContext(UserContext) as UserContextType
  
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0)
  const [tweetText, setTweetText] = useState('')
  const [completedTweets, setCompletedTweets] = useState<string[]>([])
  const [isComplete, setIsComplete] = useState(false)
  const [score, setScore] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)

  const currentPrompt = TWEET_PROMPTS[currentPromptIndex]
  const charactersLeft = currentPrompt.targetLength - tweetText.length
  const progressPercentage = (completedTweets.length / TWEET_PROMPTS.length) * 100

  const handleStartGame = () => {
    setGameStarted(true)
    setCurrentPromptIndex(0)
    setTweetText('')
    setCompletedTweets([])
    setScore(0)
    setIsComplete(false)
    notify('🐦 Time to compose some inspiring tweets!')
  }

  const handleSubmitTweet = () => {
    if (tweetText.trim().length < 50) {
      notify('❌ Tweet too short! Try to be more descriptive.')
      return
    }
    
    if (tweetText.length > currentPrompt.targetLength) {
      notify('❌ Tweet too long! Twitter has character limits.')
      return
    }

    // Calculate score based on quality factors
    let tweetScore = 50 // Base score
    
    // Bonus for good length (between 100-250 chars)
    if (tweetText.length >= 100 && tweetText.length <= 250) {
      tweetScore += 20
    }
    
    // Bonus for including emojis
    if (/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F700}-\u{1F77F}]|[\u{1F780}-\u{1F7FF}]|[\u{1F800}-\u{1F8FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(tweetText)) {
      tweetScore += 15
    }
    
    // Bonus for action words
    const actionWords = ['start', 'begin', 'take', 'do', 'create', 'build', 'achieve', 'complete', 'finish', 'overcome', 'beat', 'conquer']
    if (actionWords.some(word => tweetText.toLowerCase().includes(word))) {
      tweetScore += 15
    }

    setScore(prev => prev + tweetScore)
    setCompletedTweets(prev => [...prev, tweetText])
    
    notify(`✨ Great tweet! +${tweetScore} points`)
    
    if (currentPromptIndex < TWEET_PROMPTS.length - 1) {
      setCurrentPromptIndex(prev => prev + 1)
      setTweetText('')
    } else {
      // Game complete
      setIsComplete(true)
      // Save score to localStorage or similar
      try {
        const gameStats = JSON.parse(localStorage.getItem('badhoHeroStats') || '{}')
        gameStats.compose = Math.max(gameStats.compose || 0, score + tweetScore)
        localStorage.setItem('badhoHeroStats', JSON.stringify(gameStats))
      } catch (error) {
        console.log('Could not save game stats')
      }
    }
  }

  const handleSkipPrompt = () => {
    if (currentPromptIndex < TWEET_PROMPTS.length - 1) {
      setCurrentPromptIndex(prev => prev + 1)
      setTweetText('')
      notify('⏭️ Skipped to next prompt')
    }
  }

  if (!gameStarted) {
    return (
      <>
        <HeadTag>
          <title>Compose Tweet Game | BadhoHero</title>
          <meta name="description" content="Practice writing inspiring tweets about productivity, motivation, and overcoming laziness. Build your social media skills while spreading positivity!" />
        </HeadTag>
          <ModernGameLayout
          gameTitle="Tweet Composer"
          gameIcon="🐦"
          whyCard={
            <WhyCard
              title="Why Practice Tweet Writing?"
              explanation="Social media is a powerful tool for sharing ideas and inspiring others. Learning to write engaging, concise content helps you communicate effectively and spread positivity."
              quote="Your words have the power to inspire action"
              tip="Tip: Use action words and be authentic to connect with your audience."
            />
          }
        >
          <div className={styles.introScreen}>
            <div className={styles.gameDescription}>
              <h3>🎯 Your Mission</h3>
              <p>
                Compose inspiring tweets about productivity, motivation, and overcoming challenges. 
                Practice turning your thoughts into engaging social media content that can inspire others!
              </p>
              
              <div className={styles.gameFeatures}>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>✍️</span>
                  <span>Write compelling tweets</span>
                </div>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>🎯</span>
                  <span>Follow character limits</span>
                </div>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>⭐</span>
                  <span>Earn points for quality</span>
                </div>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>🚀</span>
                  <span>Build social media skills</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleStartGame}
              className={styles.startButton}
            >
              Start Composing 🐦
            </button>
          </div>
        </ModernGameLayout>
      </>
    )
  }

  return (
    <>
      <HeadTag>
        <title>Tweet Composer - Writing Challenge | BadhoHero</title>
        <meta name="description" content="Compose inspiring tweets about productivity and motivation. Practice your writing skills!" />
      </HeadTag>
        <ModernGameLayout
        gameTitle={`Tweet Composer - ${currentPrompt.theme}`}
        gameIcon="🐦"
        whyCard={
          <WhyCard
            title="Why Practice Tweet Writing?"
            explanation="Social media is a powerful tool for sharing ideas and inspiring others. Learning to write engaging, concise content helps you communicate effectively and spread positivity."
            quote="Your words have the power to inspire action"
            tip="Tip: Use action words and be authentic to connect with your audience."
          />
        }
      >
        <div className={styles.gameContainer}>
          {/* Progress Bar */}
          <div className={styles.progressSection}>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <span className={styles.progressText}>
              {completedTweets.length} / {TWEET_PROMPTS.length} tweets completed
            </span>
          </div>

          {/* Current Prompt */}
          <motion.div 
            key={currentPromptIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.promptSection}
          >
            <h3 className={styles.promptTitle}>{currentPrompt.theme}</h3>
            <p className={styles.promptText}>{currentPrompt.prompt}</p>
            
            <div className={styles.tips}>
              <h4>💡 Writing Tips:</h4>
              <ul>
                {currentPrompt.tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Tweet Composer */}
          <div className={styles.tweetComposer}>
            <div className={styles.tweetBox}>
              <textarea
                value={tweetText}
                onChange={(e) => setTweetText(e.target.value)}
                placeholder="What's happening? Share your thoughts..."
                className={styles.tweetTextarea}
                maxLength={currentPrompt.targetLength + 50} // Allow slight overflow for warning
              />
              
              <div className={styles.tweetFooter}>
                <div className={styles.characterCount}>
                  <span className={charactersLeft < 0 ? styles.overLimit : charactersLeft < 50 ? styles.warning : ''}>
                    {charactersLeft} characters left
                  </span>
                </div>
                
                <div className={styles.tweetActions}>
                  <button 
                    onClick={handleSkipPrompt}
                    className={styles.skipButton}
                    disabled={currentPromptIndex >= TWEET_PROMPTS.length - 1}
                  >
                    Skip ⏭️
                  </button>
                  <button 
                    onClick={handleSubmitTweet}
                    className={styles.tweetButton}
                    disabled={tweetText.trim().length < 10}
                  >
                    Tweet It! 🐦
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Score Display */}
          <div className={styles.scoreSection}>
            <span className={styles.score}>Score: {score}</span>
          </div>

          {/* Completed Tweets Preview */}
          {completedTweets.length > 0 && (
            <div className={styles.completedTweets}>
              <h4>✅ Your Tweets:</h4>
              <div className={styles.tweetsList}>
                {completedTweets.slice(-2).map((tweet, index) => (
                  <div key={index} className={styles.completedTweet}>
                    <span className={styles.tweetIcon}>🐦</span>
                    <p>{tweet}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </ModernGameLayout>      {isComplete && (
        <CompletionModal
          buttonHref="/"
          buttonLabel="Back to Home"
        >
          <h2>🎉 Tweet Master!</h2>
          <p>You've composed {completedTweets.length} inspiring tweets!</p>
          <p>Your final score: <strong>{score} points</strong></p>
          <p>Your words have the power to motivate others and spread positivity. Keep writing and inspiring!</p>
          <div style={{ margin: '1rem 0' }}>
            <strong>Achievements Unlocked:</strong>
            <ul style={{ textAlign: 'left', margin: '0.5rem 0' }}>
              <li>✍️ Social Media Skills</li>
              <li>📝 Creative Writing</li>
              <li>🚀 Motivational Messaging</li>
              <li>📏 Character Management</li>
            </ul>
          </div>
          <button 
            onClick={handleStartGame}
            style={{
              background: 'var(--color-brand, #ee3a57)',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer',
              marginRight: '0.5rem'
            }}
          >
            Play Again 🔄
          </button>
        </CompletionModal>
      )}
    </>
  )
}
