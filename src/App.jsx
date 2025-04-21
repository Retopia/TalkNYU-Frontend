import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Feed from './pages/Feed'
import ViewPost from './pages/ViewPost'
import EditPost from './pages/EditPost'
import CreatePost from './pages/CreatePost'
import NotFound from './pages/NotFound'
import RequireAuth from './components/RequireAuth'
import Layout from './components/Layout'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/feed" element={<RequireAuth><Feed /><ViewPost /></RequireAuth>} />
        <Route path="/edit/:id" element={<RequireAuth><EditPost /></RequireAuth>} />
        <Route path="/post" element={<RequireAuth><CreatePost /></RequireAuth>} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App