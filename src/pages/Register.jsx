import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import styles from './Register.module.css'

const apiUrl = import.meta.env.VITE_API_URL

function Register() {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirmation, setPasswordConfirmation] = useState("")
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

    if (!username || !password || !email || !passwordConfirmation) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)

    try {
      const res = await fetch(apiUrl + '/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, password_confirmation: passwordConfirmation }),
      })

      if (!res.ok) {
        throw new Error('Register failed')
      }

      const data = await res.json()
      console.log(data)
      localStorage.setItem('token', data.token)
      navigate('/feed')
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <form className={styles['register-form']} onSubmit={handleSubmit}>
        <p className={styles['title-text']}>Register</p>
        {error && <p className={styles['error-text']}>{error}</p>}

        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label>Email:</label>
        <input
          type="text"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label>Password Confirmation:</label>
        <input
          type="password"
          name="passwordConfirmation"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  )
}

export default Register