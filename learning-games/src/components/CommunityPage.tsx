import { useState } from 'react'

interface Post {
  id: number
  author: string
  content: string
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [message, setMessage] = useState('')

  function addPost(e: React.FormEvent) {
    e.preventDefault()
    if (!message.trim()) return
    const newPost = { id: Date.now(), author: 'Anon', content: message.trim() }
    setPosts((p) => [...p, newPost])
    setMessage('')
  }

  return (
    <div>
      <h2>Community Forum</h2>
      <form onSubmit={addPost}>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
        <button className="btn-primary" type="submit">Post</button>
      </form>
      {posts.slice().reverse().map((p) => (
        <p key={p.id}>{p.author}: {p.content}</p>
      ))}
    </div>
  )
}
