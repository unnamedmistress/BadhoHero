import type { AppProps } from 'next/app'
import Head from 'next/head'
import { UserProvider } from '../shared/UserProvider'
import { NotificationProvider } from '../contexts/NotificationContext'
import { ErrorBoundary } from '../shared/ErrorBoundary'
import { ThemeProvider } from 'styled-components'
import { badhoTheme } from '../theme/theme.config'
import ModernNavBar from '../components/layout/ModernNavBar'
import SkipLink from '../components/layout/SkipLink'
import Footer from '../components/layout/Footer'
import AnalyticsTracker from '../components/AnalyticsTracker'
import { Analytics } from '@vercel/analytics/next'
import ScrollToTop from '../components/ScrollToTop'
import '../styles/index.css'
import '../styles/App.css'
import '../styles/GlobalResponsive.css'
import '../styles/globals.css'

export default function MyApp({ Component, pageProps }: AppProps) {  const description =
    'Transform laziness into action with BadhoHero\'s momentum-building games and Lead India program support.'
  return (
    <>
      <Head>
        <title>BadhoHero - Overcome Laziness Through Action</title>
        <meta name="description" content={description} />        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ee3a57" />
        
        {/* Comprehensive favicon setup for maximum browser compatibility */}
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
        
        {/* Apple touch icons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180x180.png" />
        
        {/* Android icons */}
        <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />
        
        {/* SVG favicon for modern browsers */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        
        {/* Fallback for legacy browsers */}
        <link rel="shortcut icon" href="/favicon-32x32.png" />
        
        {/* Web App Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Safari pinned tab */}
        <link rel="mask-icon" href="/favicon.svg" color="#ee3a57" />        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />        <meta property="og:title" content="BadhoHero - Overcome Laziness Through Action" />
        <meta property="og:description" content={description} />
        <meta property="og:site_name" content="BadhoHero" /><meta property="og:image" content="https://raw.githubusercontent.com/unnamedmistress/images/main/ChatGPT%20Image%20Jun%206%2C%202025%2C%2011_20_14%20AM.png" />
        <meta property="og:image:width" content="1024" />
        <meta property="og:image:height" content="1024" />        <meta property="og:image:alt" content="BadhoHero - Transform Laziness Into Action" />
        <meta property="og:url" content="https://badhohero.vercel.app/" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />        <meta name="twitter:site" content="@badhohero" />
        <meta name="twitter:creator" content="@badhohero" />
        <meta name="twitter:title" content="BadhoHero - Overcome Laziness Through Action" />
        <meta name="twitter:description" content={description} />        <meta name="twitter:image" content="https://raw.githubusercontent.com/unnamedmistress/images/main/ChatGPT%20Image%20Jun%206%2C%202025%2C%2011_20_14%20AM.png" />        <meta name="twitter:image:alt" content="BadhoHero - Transform Laziness Into Action" />
        
        {/* Additional meta tags for better social sharing */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="BadhoHero" />
        <meta name="keywords" content="overcome laziness, motivation, personal development, habit building, procrastination help, Lead India, action games, momentum building" /></Head>
      <ThemeProvider theme={badhoTheme}>
        <NotificationProvider>
          <UserProvider>
            <ErrorBoundary>
              <ScrollToTop />
              <SkipLink />
              <ModernNavBar />
              <AnalyticsTracker />
              <Component {...pageProps} />
              <Footer />
              <Analytics />
            </ErrorBoundary>
          </UserProvider>
        </NotificationProvider>
      </ThemeProvider>
    </>
  )
}
