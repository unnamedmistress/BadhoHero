import type { NextApiRequest, NextApiResponse } from 'next'
import { scores } from '../helpers'
import { mockDb, isFirebaseAvailable } from '../../../utils/mockDatabase'

interface ScoreEntry {
  name: string
  score: number
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST')
      res.status(405).end('Method Not Allowed')
      return
    }

    const { game } = req.query
    const entry: ScoreEntry = {
      name: req.body?.name || 'Anonymous',
      score: Number(req.body?.score) || 0,
    }

    if (isFirebaseAvailable() && scores) {
      const docRef = scores.doc(String(game))
      const snap = await docRef.get()
      let entries: ScoreEntry[] = snap.exists ? (snap.data()?.entries || []) : []
      
      entries.push(entry)
      entries.sort((a: ScoreEntry, b: ScoreEntry) => b.score - a.score)
      entries = entries.slice(0, 10)
      
      await docRef.set({ entries })
      res.status(200).json({ entries })
    } else {
      // Use mock database for local development
      mockDb.addScore({
        name: entry.name,
        score: entry.score,
        game: String(game)
      })
      
      const gameScores = mockDb.getScores(String(game))
        .map(s => ({ name: s.name, score: s.score }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)
      
      res.status(200).json({ entries: gameScores })
    }
  } catch (error) {
    console.error('Scores API error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
