import { useContext, useEffect, useState, useMemo } from 'react'
import { notify } from '../shared/notify'
import Link from 'next/link'
import Post from '../components/Post'
import type { PostData } from '../components/Post'
import { UserContext } from '../shared/UserContext'
import type { UserContextType } from '../shared/types/user'
import { getTotalPoints } from '../utils/user'
import styles from '../styles/CommunityPage.module.css'
import { getApiBase } from '../utils/api'

const STORAGE_KEY = 'community_posts'
const LEADERBOARD_STORAGE_KEY = 'badhohero_leaderboard'

interface LeaderboardEntry {
  id: string
  name: string
  points: Record<string, number>
  badges: string[]
  totalPoints?: number
}

const initialPosts: PostData[] = [
  {
    id: 1,
    author: 'Admin',
    content: 'Welcome to the community! Share your thoughts with other players.',
    date: '2025-01-01T00:00:00Z',
    sentiment: 1,
    status: 'approved',
  },
]

const gameNames = ['fogland', 'willpower', 'goals', 'time', 'confidence', 'triumph']

export default function CommunityPage() {
  const { user } = useContext(UserContext) as UserContextType
  
  // Community state
  const [posts, setPosts] = useState<PostData[]>(initialPosts)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  
  // Leaderboard state
  const [players, setPlayers] = useState<LeaderboardEntry[]>([])
  const [selectedGame, setSelectedGame] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  
  const totalPoints = useMemo(() => getTotalPoints(user.points), [user.points])
  // Load from localStorage after mount to prevent hydration issues
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        setPosts(JSON.parse(saved) as PostData[])
      } catch {
        setPosts(initialPosts)
      }
    }

    // Load leaderboard data
    const savedLeaderboard = localStorage.getItem(LEADERBOARD_STORAGE_KEY)
    if (savedLeaderboard) {
      try {        const leaderboardData = JSON.parse(savedLeaderboard) as LeaderboardEntry[]
        // Add current user if not in leaderboard
        const currentUserInLeaderboard = leaderboardData.find(p => p.id === user.id)
        if (!currentUserInLeaderboard) {
          const userEntry: LeaderboardEntry = {
            id: user.id,
            name: user.name || 'Anonymous',
            points: user.points,
            badges: user.badges,
            totalPoints: getTotalPoints(user.points)
          }
          leaderboardData.push(userEntry)
        } else {
          // Update current user's data
          currentUserInLeaderboard.points = user.points
          currentUserInLeaderboard.badges = user.badges
          currentUserInLeaderboard.totalPoints = getTotalPoints(user.points)
        }
        setPlayers(leaderboardData)
      } catch {
        // Create initial leaderboard with current user
        const userEntry: LeaderboardEntry = {
          id: user.id,
          name: user.name || 'Anonymous',
          points: user.points,
          badges: user.badges,
          totalPoints: getTotalPoints(user.points)
        }
        setPlayers([userEntry])
      }
    } else {
      // Create initial leaderboard with current user
      const userEntry: LeaderboardEntry = {
        id: user.id,
        name: user.name || 'Anonymous',
        points: user.points,
        badges: user.badges,
        totalPoints: getTotalPoints(user.points)
      }
      setPlayers([userEntry])
    }
  }, [user.id, user.name, user.points, user.badges])

  // Save leaderboard data whenever it changes
  useEffect(() => {
    if (players.length > 0) {
      localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(players))
    }
  }, [players])

  // Filtered and sorted players for display
  const filteredPlayers = useMemo(() => {
    let filtered = players.map(player => ({
      ...player,
      totalPoints: player.totalPoints || getTotalPoints(player.points),
      gamePoints: selectedGame === 'all' 
        ? getTotalPoints(player.points)
        : (player.points[selectedGame] || 0)
    }))

    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return filtered.sort((a, b) => b.gamePoints - a.gamePoints)
  }, [players, selectedGame, searchTerm])

  // Top 5 players for display
  const topPlayers = filteredPlayers.slice(0, 5)


  useEffect(() => {
    if (typeof window !== 'undefined') {
      const base = getApiBase()
      fetch(`${base}/api/posts`)
        .then((res) => (res.ok ? res.json() : []))
        .then((data: PostData[]) => setPosts(data.length ? data : initialPosts))
        .catch(() => {
          setError('Failed to load posts')
          notify('Failed to load posts')
        })
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
  }, [posts])
  function flagPost(id: number | string) {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, flagged: true } : p)))
    if (typeof window !== 'undefined') {
      const base = getApiBase()
      fetch(`${base}/api/posts/${id}/flag`, { method: 'POST' })
        .catch(() => {
          setError('Failed to flag post')
          notify('Failed to flag post')
        })
    }
  }

  async function addPost(e: React.FormEvent) {
    e.preventDefault()
    if (message.trim()) {
      try {
        const base = getApiBase()
        const resp = await fetch(`${base}/api/posts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: message.trim() }),
        })
        const data = await resp.json()
        if (!resp.ok) {
          setError(data.error || 'Your message was filtered, try again.')
          return
        }
        if (data.status === 'approved') {
          setPosts((prev) => [...prev, data])
          setNotice('Thanks for sharing! Your message is now live.')
        } else {
          setNotice('Thanks! Your feedback is awaiting review.')
        }
        setError('')
        setMessage('')
      } catch {
        setError('Failed to post')
      }
    }
  }  return (
    <div id="main-content" className={styles.communityWrapper}>
      <div className={styles.mainContent}>
        <h1 className={styles.pageTitle}>Community & Leaderboard</h1>
        
        {/* Leaderboard Section */}
        <section className={styles.leaderboardSection}>
          <h2 className={styles.sectionTitle}>🏆 Hero Rankings</h2>
          
          <div className={styles.gameTabs}>
            <button
              className={`${styles.gameTab} ${selectedGame === 'all' ? styles.active : ''}`}
              onClick={() => setSelectedGame('all')}
            >
              All Games
            </button>
            {gameNames.map(game => (
              <button
                key={game}
                className={`${styles.gameTab} ${selectedGame === game ? styles.active : ''}`}
                onClick={() => setSelectedGame(game)}
              >
                {game.charAt(0).toUpperCase() + game.slice(1)}
              </button>
            ))}
          </div>

          <div className={styles.leaderboardCard}>
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Search heroes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            <div className={styles.playersGrid}>
              {topPlayers.map((player, index) => {
                const rank = index + 1
                const isCurrentUser = player.id === user.id
                const isTop = rank === 1
                
                return (
                  <div
                    key={player.id}
                    className={`${styles.playerCard} ${isTop ? styles.topPlayer : ''} ${isCurrentUser ? styles.currentUser : ''}`}
                  >
                    <div className={styles.playerRank}>
                      {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank}
                    </div>
                    <div className={styles.playerInfo}>
                      <div className={styles.playerName}>
                        {player.name} {isCurrentUser && '(You)'}
                      </div>
                      <div className={styles.playerStats}>
                        <span className={styles.points}>
                          {player.gamePoints} pts
                          {selectedGame !== 'all' && ` in ${selectedGame}`}
                        </span>
                        <div className={styles.badges}>
                          {player.badges.slice(0, 3).map((badge, i) => (
                            <span key={i} className={styles.badge}>🏅</span>
                          ))}
                          {player.badges.length > 3 && (
                            <span className={styles.badgeCount}>+{player.badges.length - 3}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className={styles.userSummary}>
              <div className={styles.yourStats}>
                <span>Your Rank: #{filteredPlayers.findIndex(p => p.id === user.id) + 1}</span>
                <span>Total Points: {totalPoints}</span>
                <span>Badges: {user.badges.length}</span>
              </div>
            </div>
          </div>
        </section>

        <div className={styles.statsBar}>
          <span className={styles.points}>{totalPoints} pts</span>
          <div className={styles.badges}>{user.badges.map((b) => (
            <span key={b} className={styles.badge}>🏅</span>
          ))}</div>          <button
            type="button"
            className={styles.shareBtn}
            onClick={async () => {              const badgeCount = user.badges.length
              const badgeText = badgeCount > 0 ? ` and earned ${badgeCount} badge${badgeCount > 1 ? 's' : ''}` : ''
              const shareData = {
                title: 'BadhoHero - Overcome Laziness Through Action',
                text: `I scored ${totalPoints} points building momentum on BadhoHero${badgeText}! 🦊 Join me and defeat laziness together!`,
                url: 'https://badhohero.vercel.app/community'
              }
              
              try {
                if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                  await navigator.share(shareData)
                  notify('Thanks for sharing! 🎉')
                } else {
                  // Fallback: copy nicely formatted text to clipboard
                  const shareText = `${shareData.text}\n\n${shareData.url}`
                  await navigator.clipboard.writeText(shareText)
                  notify('Share text copied to clipboard! 📋')
                }
              } catch (error) {
                // If sharing was cancelled or failed, try clipboard as backup
                try {
                  const shareText = `${shareData.text}\n\n${shareData.url}`
                  await navigator.clipboard.writeText(shareText)
                  notify('Share text copied to clipboard! 📋')
                } catch {
                  notify('Unable to share or copy text 😅')
                }
              }            }}
            aria-label={`Share your progress: ${totalPoints} points${user.badges.length > 0 ? ` and ${user.badges.length} badge${user.badges.length > 1 ? 's' : ''}` : ''}`}
          >
            📤 Share Progress
          </button>
        </div>


        {/* Community Feedback Section */}
        <section className={styles.communitySection}>
          <h2 className={styles.sectionTitle}>Community Feedback</h2>
          
          <form onSubmit={addPost} className={styles.feedbackForm}>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share your thoughts about the games..."
              required
              className={styles.feedbackTextarea}
            />
            <div className={styles.formFooter}>
              <span className={styles.formNote}>Posts are reviewed for positivity</span>
              <button type="submit" className={styles.submitBtn}>
                Share Feedback
              </button>
            </div>
          </form>

          {error && (
            <div role="alert" className={styles.errorMessage}>
              {error}
            </div>
          )}
          {notice && (
            <div role="status" className={styles.successMessage}>
              {notice}
            </div>
          )}

          <div className={styles.postsContainer}>
            {posts
              .slice()
              .reverse()
              .map((p) => (
                <div key={p.id} className={styles.postWrapper}>
                  <Post post={p} onFlag={flagPost} />
                </div>
              ))}
          </div>
        </section>

        <div className={styles.navigation}>
          <Link href="/" className={styles.homeLink}>← Return Home</Link>
          <Link href="/profile" className={styles.profileLink}>Edit Profile →</Link>
        </div>
      </div>
      
    </div>
  )
}

export function Head() {
  return (
    <>      <title>Community | BadhoHero</title>      <meta
        name="description"
        content="Join the BadhoHero community! Share your momentum-building progress and connect with others overcoming laziness."
      />
      <link rel="canonical" href="https://badhohero.vercel.app/community" />
        {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />      <meta property="og:url" content="https://badhohero.vercel.app/community" />      <meta property="og:title" content="BadhoHero Community - Defeat Laziness Together" />
      <meta property="og:description" content="Join thousands building momentum and defeating laziness through engaging action games. Share your progress and connect with fellow heroes!" /><meta property="og:image" content="https://raw.githubusercontent.com/unnamedmistress/images/main/ChatGPT%20Image%20Jun%206%2C%202025%2C%2011_20_14%20AM.png" />
      <meta property="og:image:width" content="1024" />
      <meta property="og:image:height" content="1024" />      <meta property="og:image:alt" content="BadhoHero Community - Share your momentum-building progress" />
      <meta property="og:site_name" content="BadhoHero" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />      <meta property="twitter:site" content="@badhohero" />
      <meta property="twitter:creator" content="@badhohero" />
      <meta property="twitter:url" content="https://badhohero.vercel.app/community" />      <meta property="twitter:title" content="BadhoHero Community - Defeat Laziness Together" />
      <meta property="twitter:description" content="Join thousands building momentum and defeating laziness through engaging action games. Share your progress and connect with fellow heroes!" /><meta property="twitter:image" content="https://raw.githubusercontent.com/unnamedmistress/images/main/ChatGPT%20Image%20Jun%206%2C%202025%2C%2011_20_14%20AM.png" />      <meta property="twitter:image:alt" content="BadhoHero Community - Share your momentum-building progress" />
      
      {/* Additional social sharing optimization */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="BadhoHero" />
      <meta name="keywords" content="overcome laziness community, motivation progress, personal development, habit building, procrastination support, Lead India, action games community" />
    </>
  )
}

export const getStaticProps = async () => ({ props: {} })
