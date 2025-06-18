export function getApiBase(): string {
  if (typeof window === 'undefined') {
    // Server-side: use environment variable or default
    return process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000'
  }
  
  // Client-side: use current origin for API calls
  return window.location.origin
}
