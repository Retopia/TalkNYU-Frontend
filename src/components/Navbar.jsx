import { Link } from "react-router"
import { useNavigate } from "react-router"
import styles from './Navbar.module.css'

function Navbar() {
  const navigate = useNavigate()
  const loggedIn = localStorage.getItem('token') !== null

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <>
      <nav className={styles.navbar}>
        <Link className={styles.navbar_title} to="/">TalkNYU</Link>
        <ul className={styles.navbar_links}>
          {loggedIn ?
            <>
              <li><Link className={styles.navbar_link} to="/feed">Feed</Link></li>
              <li><Link className={styles.navbar_link} to="/post">Post</Link></li>
              <li><button className={styles.navbar_button} onClick={handleLogout}>Logout</button></li>
            </>
            :
            <>
              <li><Link className={styles.navbar_link} to="/login">Login</Link></li>
              <li><Link className={styles.navbar_link} to="/register">Register</Link></li>
            </>}
        </ul>
      </nav>
    </>
  )
}

export default Navbar