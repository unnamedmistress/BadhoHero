import type { NextApiRequest, NextApiResponse } from 'next'
import { views } from '../../helpers'
import { mockDb } from '../../../../utils/mockDatabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
    return
  }
  
  const { id } = req.query
  const viewId = String(id)
  
  try {
    // Check if Firebase is available
    if (views && views.doc) {
      // Use Firebase
      const ref = views.doc(viewId)
      const snap = await ref.get()
      if (!snap.exists) {
        res.status(404).end()
        return
      }
      const view = snap.data() as any
      const end = new Date().toISOString()
      const duration = Number(view.duration || Date.now() - new Date(view.start).getTime())
      await ref.update({ end, duration })
      res.status(200).json({ id: viewId, ...view, end, duration })
    } else {      // Use mock database
      const end = new Date().toISOString()
      const startTime = Date.now() - 1000; // Fallback if no start time
      const duration = Date.now() - startTime
      
      // Update the view in mock database
      const updatedView = mockDb.updateView(viewId, { end })
      if (!updatedView) {
        res.status(404).end()
        return
      }
      
      res.status(200).json({ ...updatedView, duration })
    }
  } catch (error) {
    console.error('Error ending view:', error)
    res.status(500).json({ error: 'Failed to end view' })
  }
}
