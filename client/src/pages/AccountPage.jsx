import { useContext } from "react"
import { UserContext } from "../context/UserContext"
import { Link, Navigate, useNavigate, useParams } from "react-router-dom"
import axios from "axios"

export default function AccountPage() {
  const { ready, user, setUser } = useContext(UserContext)
  const navigate = useNavigate()
  let { subpage } = useParams()
  if (subpage === undefined) {
    subpage = "profile"
  }

  function linkClasses(type) {
    if (type === subpage) {
      return "py-2 px-6 bg-primary text-white rounded-full"  
    } else {
      return "py-2 px-6"
    } 
  }

  async function logout() {
    await axios.post("/logout")
    setUser(null)
    navigate("/")
  }

  if (!ready) {
    return "Loading . . . "
  }
  else if (ready && !user) {
    return <Navigate to="/login"/>
  }
  else {
    return (
      <div>
        <nav className="flex w-full justify-center gap-2 mt-4 mb-8">
          <Link className={linkClasses("profile")} to="/account">My profile</Link>
          <Link className={linkClasses("bookings")} to="/account/bookings">My bookings</Link>
          <Link className={linkClasses("places")} to="/account/places">My accomodations</Link>
        </nav>
        {subpage === "profile" && (
          <div className="max-w-lg mx-auto text-center">
            Logged in as {user.username} ({user.email})
            <button className="primary max-w-sm mt-2" onClick={logout}>Logout</button>
          </div>
        )}
      </div>
    )
  }
}