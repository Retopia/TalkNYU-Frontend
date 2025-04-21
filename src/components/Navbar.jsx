import { Link } from "react-router"
import { useNavigate } from "react-router"

function Navbar() {
  const navigate = useNavigate()
  const loggedIn = localStorage.getItem('token') !== null

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <>
      <nav>
        <ul>
          <li><Link to="/feed">Feed</Link></li>
          <li><Link to="/post">Post</Link></li>
          {loggedIn ?
            <li><button onClick={handleLogout}>Logout</button></li>
            :
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>}
        </ul>
      </nav>
    </>
  )
}

export default Navbar