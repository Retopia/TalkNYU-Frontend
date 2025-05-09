import { useState } from "react"
import { useNavigate } from "react-router"
import styles from "./CreatePost.module.css"

const apiUrl = import.meta.env.VITE_API_URL

function CreatePost() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const maxTitleLength = 70
  const maxContentLength = 300

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

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
    <div className={styles.container}>
      <form className={styles.create_form} onSubmit={handleSubmit}>
        {error && <p>{error}</p>}

        <p className={styles['form-title']}>Create a Post</p>

        <label>Title:</label>
        <input
          type="text"
          name="title"
          maxLength={maxTitleLength}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>Body:</label>
        <textarea
          type="text"
          name="body"
          value={body}
          maxLength={maxContentLength}
          onChange={(e) => setBody(e.target.value)}
          required
        />

        <p className={styles['character-counter']}>{maxContentLength - body.length} characters remaining</p>

        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create'}
        </button>
      </form>
    </div>
  )
}

export default CreatePost