import type { NextApiRequest, NextApiResponse } from 'next'
import { views } from './helpers'
import { mockDb, isFirebaseAvailable } from '../../utils/mockDatabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      if (isFirebaseAvailable() && views) {
        const snap = await views.get()
        const list: any[] = []
        snap.forEach((doc: any) => list.push({ id: doc.id, ...doc.data() }))
        res.status(200).json(list)
      } else {
        // Mock response for local development
        res.status(200).json([])
      }
      return
    }

    if (req.method === 'POST') {
      console.log('POST /api/views - Starting request processing')
      
      // Test with minimal data first
      const view = {
        path: req.body?.path || '/test',
        ip: 'unknown',
        start: new Date().toISOString(),
      }
      
      console.log('Minimal view object:', view)
      
      if (isFirebaseAvailable() && views) {
        try {
          const ref = await views.add(view)
          console.log('Successfully saved view with ID:', ref.id)
          res.status(201).json({ id: ref.id, ...view })
          return
        } catch (firestoreError) {
          console.error('Firestore save error:', firestoreError)
          // Fall through to mock database
        }
      }
        // Use mock database for local development or if Firebase fails
      const mockView = mockDb.addView(view)
      console.log('Saved to mock database with ID:', mockView.id)
      res.status(201).json(mockView)
      return
    }

    res.setHeader('Allow', 'GET, POST')
    res.status(405).end('Method Not Allowed')
  } catch (error) {
    console.error('Views API Error:', error)
    res.status(500).json({
      error: 'Internal server error', 
      details: (error as Error).message,
      timestamp: new Date().toISOString()
    })
  }
}
