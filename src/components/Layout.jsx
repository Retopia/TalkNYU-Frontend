import Navbar from "./Navbar";
import { Outlet } from "react-router";

function Layout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  )
}

export default Layout