import Navbar from "./Navbar";
import { Outlet } from "react-router";
import styles from './Layout.module.css'

function Layout() {
  return (
    <div className={styles.container}>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout