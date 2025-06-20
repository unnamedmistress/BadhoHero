import { useState, useEffect } from 'react'
import Link from 'next/link'
import Tooltip from '../ui/Tooltip'

export default function NavBar() {
  const [open, setOpen] = useState(false)
  const [gamesOpen, setGamesOpen] = useState(false)
  const [progressOpen, setProgressOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [communityOpen, setCommunityOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0)
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close submenus when hamburger menu closes
  useEffect(() => {
    if (!open) {
      setGamesOpen(false)
      setProgressOpen(false)
      setAccountOpen(false)
      setCommunityOpen(false)
    }
  }, [open])

  return (
    <nav
      className={`navbar${scrolled ? ' scrolled' : ''}`}
      aria-label="Main navigation"
    >      <div className="brand">
        <span style={{ fontSize: '1.5rem', lineHeight: 1, marginRight: '0.5rem' }}>🦊</span>
        BadhoHero
      </div>
      <button
        className="menu-toggle"
        aria-label="Toggle navigation"
        onClick={() => setOpen(o => !o)}
      >
        ☰
      </button>
      <ul className={open ? 'open' : undefined}>
        <li>
          <Tooltip message="Hover here for a surprise!">
            <Link href="/" onClick={() => setOpen(false)}>
              Home
            </Link>
          </Tooltip>
        </li>
        <li className="submenu">
          <button
            className="submenu-toggle"
            aria-expanded={gamesOpen}
            aria-controls="games-submenu"
            onClick={e => {
              e.stopPropagation()
              setGamesOpen(o => !o)
            }}
          >
            Games
          </button>          <ul id="games-submenu" className={gamesOpen ? 'open' : undefined}>
            <li>
              <Tooltip message="Clear the fog of laziness!">
                <Link href="/games/fogland" onClick={() => setOpen(false)}>
                  Fogland Awakening
                </Link>
              </Tooltip>
            </li>
            <li>
              <Tooltip message="Master your morning routine!">
                <Link href="/games/willpower" onClick={() => setOpen(false)}>
                  Willpower Warrior
                </Link>
              </Tooltip>
            </li>
            <li>
              <Tooltip message="Discover your true goals!">
                <Link href="/games/goals" onClick={() => setOpen(false)}>
                  Goal-Orb Discovery
                </Link>
              </Tooltip>            </li>
            <li>
              <Tooltip message="Master time management!">
                <Link href="/games/time" onClick={() => setOpen(false)}>
                  Time Tunnel Trials
                </Link>
              </Tooltip>
            </li>
            <li>
              <Tooltip message="Build unshakeable confidence!">
                <Link href="/games/confidence" onClick={() => setOpen(false)}>
                  Confidence Cavern
                </Link>
              </Tooltip>
            </li>
            <li>
              <Tooltip message="Celebrate your heroic journey!">
                <Link href="/games/triumph" onClick={() => setOpen(false)}>
                  Tree of Triumph
                </Link>
              </Tooltip>
            </li>
          </ul>
        </li>
        <li className="submenu">
          <button
            className="submenu-toggle"
            aria-expanded={progressOpen}
            aria-controls="progress-submenu"
            onClick={e => {
              e.stopPropagation()
              setProgressOpen(o => !o)
            }}
          >
            Progress
          </button>
          <ul id="progress-submenu" className={progressOpen ? 'open' : undefined}>            <li>
              <Tooltip message="Hover here for a surprise!">
                <Link href="/community" onClick={() => setOpen(false)}>
                  Community & Progress
                </Link>
              </Tooltip>
            </li>
            <li>
              <Tooltip message="Hover here for a surprise!">
                <Link href="/badges" onClick={() => setOpen(false)}>
                  Badges
                </Link>
              </Tooltip>
            </li>
          </ul>
        </li>
        <li className="submenu">
          <button
            className="submenu-toggle"
            aria-expanded={accountOpen}
            aria-controls="account-submenu"
            onClick={e => {
              e.stopPropagation()
              setAccountOpen(o => !o)
            }}
          >
            Account &amp; Help
          </button>
          <ul id="account-submenu" className={accountOpen ? 'open' : undefined}>
            <li>
              <Tooltip message="Hover here for a surprise!">
                <Link href="/profile" onClick={() => setOpen(false)}>
                  Profile
                </Link>
              </Tooltip>
            </li>
            <li>
              <Tooltip message="Hover here for a surprise!">
                <Link href="/help" onClick={() => setOpen(false)}>
                  Help
                </Link>
              </Tooltip>
            </li>
          </ul>
        </li>
        <li className="submenu">
          <button
            className="submenu-toggle"
            aria-expanded={communityOpen}
            aria-controls="community-submenu"
            onClick={e => {
              e.stopPropagation()
              setCommunityOpen(o => !o)
            }}
          >
            Community
          </button>
          <ul id="community-submenu" className={communityOpen ? 'open' : undefined}>
            <li>
              <Tooltip message="Hover here for a surprise!">
                <Link href="/community" onClick={() => setOpen(false)}>
                  Community Home
                </Link>
              </Tooltip>
            </li>
            <li>
              <Tooltip message="Hover here for a surprise!">
                <Link href="/prompt-library" onClick={() => setOpen(false)}>
                  Prompt Library
                </Link>
              </Tooltip>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  )
}
