import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function IntroRedirect() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to the new Fogland Awakening game
    router.replace('/games/fogland')
  }, [router])

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontFamily: 'Poppins, sans-serif' 
    }}>
      <div style={{ textAlign: 'center' }}>
        <h2>Redirecting to Fogland Awakening...</h2>
        <p>Welcome to the new BadhoHero experience!</p>
      </div>
    </div>
  )
}

export function Head() {
  return (
    <>
      <title>Intro | BadhoHero</title>
      <meta name="description" content="Starting your anti-laziness journey." />
      <link rel="canonical" href="https://badhohero.vercel.app/games/fogland" />
    </>
  )
}

export const getStaticProps = async () => ({ props: {} });
