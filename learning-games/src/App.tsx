import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { badhoTheme } from '../../src/theme/theme.config'
import Home from './pages/Home'
import AgeInputForm from './pages/AgeInputForm'
import SplashPage from './pages/SplashPage'
import GameOrchestrator from './components/GameOrchestrator'

import LeaderboardPage from './pages/LeaderboardPage'
import BadgesPage from './pages/BadgesPage'
import CommunityPage from './components/CommunityPage'
import CommunityPlaylistPage from './pages/CommunityPlaylistPage'
import ProfilePage from './pages/ProfilePage'
import HelpPage from './pages/HelpPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import ContactPage from './pages/ContactPage'
import StatsPage from './pages/StatsPage'
import NavBar from './components/layout/NavBar'
import Footer from './components/layout/Footer'
import AnalyticsTracker from './components/AnalyticsTracker'
import ScrollToTop from './components/ScrollToTop'
import SkipLink from './components/SkipLink'
import './App.css'

function App() {
  return (
    <ThemeProvider theme={badhoTheme}>
      <Router>
      <ScrollToTop />
      <SkipLink />
      <NavBar />
      <AnalyticsTracker />
      <Routes>
        <Route path="/age" element={<AgeInputForm />} />
        <Route path="/welcome" element={<SplashPage />} />
        <Route path="/" element={<Home />} />
        <Route path="/games" element={<GameOrchestrator />} />

        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/badges" element={<BadgesPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/playlist" element={<CommunityPlaylistPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/stats" element={<StatsPage />} />
      </Routes>
      {/* Verification comment: routes render correctly with context */}
        <Footer />
      </Router>
    </ThemeProvider>
  )
}

export default App
