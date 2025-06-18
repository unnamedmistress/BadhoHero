export async function fetchChallenge(gameId: string, ageGroup: string) {
  const res = await fetch(`/api/game/${gameId}/challenge?ageGroup=${ageGroup}`)
  if (res.ok) return res.json()
  return null
}

export async function postAction(gameId: string, action: unknown) {
  const res = await fetch(`/api/game/${gameId}/action`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(action),
  })
  if (res.ok) return res.json()
  return null
}
