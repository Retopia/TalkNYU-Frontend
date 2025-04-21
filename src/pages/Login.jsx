import { useState, useEffect } from "react"
import { useNavigate } from "react-router"

const apiUrl = import.meta.env.VITE_API_URL

function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      navigate('/feed')
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!username || !password) {
      setError('Please fill in all fields')
    }

    try {
      const res = await fetch(apiUrl + '/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      if (!res.ok) {
        throw new Error('Login failed')
      }

      const data = await res.json()
      console.log(data)
      localStorage.setItem('token', data.token)
      navigate('/feed')
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        {error && <p>{error}</p>}

        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </>
  )
}

export default Login