import type { NextApiRequest, NextApiResponse } from 'next'
import { userDoc } from './helpers'
import { mockDb, isFirebaseAvailable } from '../../utils/mockDatabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      if (isFirebaseAvailable() && userDoc) {
        const snap = await userDoc.get()
        res.status(200).json(
          snap.exists ? snap.data() : { name: null, age: null, badges: [], points: { darts: 0 } }
        )
      } else {
        // Use mock database for local development
        res.status(200).json(mockDb.getUser())
      }
      return
    }

    if (req.method === 'POST') {
      if (isFirebaseAvailable() && userDoc) {
        const snap = await userDoc.get()
        const user = { ...(snap.exists ? snap.data() : {}), ...req.body }
        await userDoc.set(user)
        res.status(200).json(user)
      } else {
        // Use mock database for local development
        const user = mockDb.setUser(req.body)
        res.status(200).json(user)
      }
      return
    }

    res.setHeader('Allow', 'GET, POST')
    res.status(405).end('Method Not Allowed')
  } catch (error) {
    console.error('User API error:', error)
    // Fallback to mock database if Firebase fails
    if (req.method === 'GET') {
      res.status(200).json(mockDb.getUser())
    } else if (req.method === 'POST') {
      const user = mockDb.setUser(req.body)
      res.status(200).json(user)
    } else {
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}
