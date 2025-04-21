import { useState } from "react"
import { useNavigate } from "react-router"

const apiUrl = import.meta.env.VITE_API_URL

function CreatePost() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title || !body) {
      setError('Please fill in all fields')
    }

    const token = localStorage.getItem('token')

    try {
      const res = await fetch(apiUrl + '/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, body }),
      })

      if (!res.ok) {
        throw new Error('Post creation failed')
      }

      const data = await res.json()
      console.log(data)
      navigate('/feed')
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        {error && <p>{error}</p>}

        <label>Title:</label>
        <input
          type="text"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>Body:</label>
        <textarea
          type="text"
          name="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create'}
        </button>
      </form>
    </>
  )
}

export default CreatePost