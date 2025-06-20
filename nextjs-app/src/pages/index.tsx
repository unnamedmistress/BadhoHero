import { useContext } from 'react'
import HeadTag from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { UserContext } from '../shared/UserContext'
import type { UserContextType } from '../shared/types/user'
import { getTotalPoints } from '../utils/user'
import styles from '../styles/Home.module.css'

/**
 * Clean and Simple Home Page
 * Focused on clear call-to-action and easy game access
 */
export default function Home() {
  const { user } = useContext(UserContext) as UserContextType
  const router = useRouter()
  const totalPoints = getTotalPoints(user.points)  // Core games that build momentum and defeat laziness through engaging challenges
  const games = [
    {
      id: 'fogland',
      title: 'Fogland Awakening',
      description: 'Meet your fox avatar and begin your journey by clearing the fog of laziness',
      icon: '🌫️',
      path: '/games/fogland'
    },
    {
      id: 'willpower',
      title: 'Willpower Warrior',
      description: 'Master morning routines and avoid sneaky lazy traps to build hero strength',
      icon: '🏆',
      path: '/games/willpower'
    },
    {
      id: 'goals',
      title: 'Goal-Orb Discovery',
      description: 'Sort goals by priority and timeline to help your fox reach new lands',
      icon: '🎯',
      path: '/games/goals'
    },
    {
      id: 'time',
      title: 'Time Tunnel Trials',
      description: 'Pack efficiently and manage tasks in the right order to beat the fog',
      icon: '⏰',
      path: '/games/time'
    },
    {
      id: 'confidence',
      title: 'Confidence Cavern',
      description: 'Light torches with your own positive affirmations and build inner strength',
      icon: '💡',
      path: '/games/confidence'
    },
    {
      id: 'triumph',
      title: 'Tree of Triumph',
      description: 'Plant your earned badges and watch your efforts grow into a victory tree',
      icon: '🌳',
      path: '/games/triumph'
    }
  ]
  return (
    <>
      <HeadTag>        <title>BadhoHero - Overcome Laziness Through Action</title>
        <meta property="og:title" content="BadhoHero - Overcome Laziness Through Action" />
        <meta
          property="og:description"
          content="Transform your life with BadhoHero's engaging games designed to defeat laziness and build unstoppable momentum."
        />        <meta
          property="og:image"
          content="https://raw.githubusercontent.com/unnamedmistress/images/main/ChatGPT%20Image%20Jun%2018%2C%202025%2C%2002_49_45%20PM.png"
        /><meta
          property="og:url"
          content="https://badhohero.vercel.app/"
        />
        <meta name="twitter:card" content="summary_large_image" />        <meta name="twitter:title" content="BadhoHero - Overcome Laziness Through Action" />
        <meta
          name="twitter:description"
          content="Transform your life with BadhoHero's engaging games designed to defeat laziness and build unstoppable momentum."
        />        <meta
          name="twitter:image"
          content="https://raw.githubusercontent.com/unnamedmistress/images/main/ChatGPT%20Image%20Jun%2018%2C%202025%2C%2002_49_45%20PM.png"
        /><meta
          name="twitter:url"
          content="https://badhohero.vercel.app/"
        />
      </HeadTag>
      
      <div id="main-content" className={styles.home}>        {/* Modern Hero Section */}
        <header className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.heroText}>              <h1 className={styles.title}>BadhoHero</h1>
              <p className={styles.subtitle}>
                Defeat laziness and unlock your potential through action-driven challenges
              </p>
              <p className={styles.description}>
                Break free from procrastination with our scientifically-designed mini-games. 
                Each challenge builds momentum, creates positive habits, 
                and transforms lazy habits into unstoppable action.
              </p>
              
              {/* Call to Action */}
              <div className={styles.ctaContainer}>                <button
                  className={styles.ctaButton}                  onClick={() => router.push('/games/fogland')}
                >
                  Start Your Transformation
                </button>
                <p className={styles.ctaHint}>Begin with Fogland Awakening</p>
              </div>
            </div>
            
            <div className={styles.heroVisual}>              <img
                src="https://raw.githubusercontent.com/unnamedmistress/images/main/ChatGPT%20Image%20Jun%2018%2C%202025%2C%2002_49_45%20PM.png"
                alt="BadhoHero fox avatar in festive orange attire, ready to begin the journey"
                className={styles.logo}
                width="140"
                height="140"
              />
            </div>
          </div>
        </header>        {/* Games Section */}
        <section className={styles.gamesSection}>
          <div className={styles.sectionHeader}>            <h2 className={styles.sectionTitle}>BadhoHero Journey</h2>
            <p className={styles.sectionSubtitle}>
              Six engaging games that teach you to defeat laziness and build unstoppable momentum through your fox avatar's adventure
            </p>
          </div>
          
          <div className={styles.gamesGrid}>
            {games.map((game, index) => (
              <button
                key={game.id}
                className={styles.gameCard}
                onClick={() => router.push(game.path)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={styles.gameIcon}>{game.icon}</div>
                <h3 className={styles.gameTitle}>{game.title}</h3>
                <p className={styles.gameDescription}>{game.description}</p>
                <div className={styles.gameArrow}>→</div>
              </button>
            ))}
          </div>
        </section>        {/* Refined Progress Section */}
        {totalPoints > 0 && (
          <section className={styles.progressSection}>
            <div className={styles.progressCard}>
              <div className={styles.progressContent}>
                <span className={styles.progressIcon}>🏆</span>
                <div className={styles.progressInfo}>
                  <div className={styles.progressPoints}>{totalPoints}</div>
                  <div className={styles.progressLabel}>Points Earned</div>
                </div>
              </div>
              <div className={styles.progressMessage}>
                You're making excellent progress!
              </div>
            </div>
          </section>
        )}

        {/* Elegant Footer Navigation */}
        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <div className={styles.quickLinks}>
              <Link href="/community" className={styles.link}>
                <span className={styles.linkIcon}>👥</span>
                <span className={styles.linkLabel}>Community</span>
              </Link>
              <Link href="/badges" className={styles.link}>
                <span className={styles.linkIcon}>🏅</span>
                <span className={styles.linkLabel}>Achievements</span>
              </Link>
              <Link href="/prompt-library" className={styles.link}>
                <span className={styles.linkIcon}>📚</span>
                <span className={styles.linkLabel}>Resources</span>
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

export function Head() {
  return (
    <>
      <title>BadhoHero Games</title>      <meta
        name="description"
        content="Transform laziness into action with BadhoHero's engaging momentum-building games."
      />
      <link rel="canonical" href="https://badhohero.vercel.app/" />
    </>
  )
}

export const getStaticProps = async () => ({ props: {} });
