import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import styles from "./Login.module.css"

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
    setLoading(true)

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
        throw new Error('Invalid username or password')
      }

      const data = await res.json()
      console.log(data)
      localStorage.setItem('token', data.token)
      localStorage.setItem('username', data.user.username)
      navigate('/feed')
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <form className={styles['login-form']} onSubmit={handleSubmit}>
        <p className={styles['title-text']}>Login</p>
        {error && <p className={styles['error-text']}>{error}</p>}

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
    </div>
  )
}

export default Login