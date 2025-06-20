import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function ToneRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the Willpower Warrior game since tone was part of the old AI prompting focus
    router.replace('/games/willpower')
  }, [router])

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontFamily: 'system-ui'
    }}>
      <p>Redirecting to Willpower Warrior...</p>
    </div>
  )
}
