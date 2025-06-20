// Mock data store for local development
interface MockUser {
  name: string | null
  age: number | null
  badges: string[]
  points: Record<string, number>
}

interface MockView {
  id: string
  path: string
  ip: string
  start: string
  end?: string
}

interface MockScore {
  id: string
  name: string
  score: number
  game: string
  timestamp: string
}

class MockDatabase {
  private user: MockUser = {
    name: null,
    age: null,
    badges: [],
    points: { darts: 0 }
  }
  
  private views: MockView[] = []
  private scores: MockScore[] = []

  // User operations
  getUser() {
    return this.user
  }

  setUser(userData: Partial<MockUser>) {
    this.user = { ...this.user, ...userData }
    return this.user
  }

  // Views operations
  addView(view: Omit<MockView, 'id'>) {
    const mockView = {
      ...view,
      id: Math.random().toString(36).substr(2, 9)
    }
    this.views.push(mockView)
    return mockView
  }

  updateView(id: string, updates: Partial<MockView>) {
    const viewIndex = this.views.findIndex(v => v.id === id)
    if (viewIndex !== -1) {
      this.views[viewIndex] = { ...this.views[viewIndex], ...updates }
      return this.views[viewIndex]
    }
    return null
  }

  // Scores operations
  addScore(score: Omit<MockScore, 'id' | 'timestamp'>) {
    const mockScore = {
      ...score,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString()
    }
    this.scores.push(mockScore)
    return mockScore
  }

  getScores(game?: string) {
    return game ? this.scores.filter(s => s.game === game) : this.scores
  }
}

export const mockDb = new MockDatabase()

// Check if we're in a Firebase-enabled environment
export function isFirebaseAvailable(): boolean {
  return !!(process.env.FIREBASE_SERVICE_ACCOUNT || process.env.GOOGLE_APPLICATION_CREDENTIALS)
}
