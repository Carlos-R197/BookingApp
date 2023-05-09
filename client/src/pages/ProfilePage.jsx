import { useContext } from "react"
import { UserContext } from "../context/UserContext"
import { Link, Navigate, useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import PlacesPage from "./PlacesPage"
import AccountNav from "../components/AccountNav"

export default function ProfilePage() {
  const { ready, user, setUser } = useContext(UserContext)
  const navigate = useNavigate()

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
        <AccountNav />
        <div className="max-w-lg mx-auto text-center">
          Logged in as {user.username} ({user.email})
          <button className="primary max-w-sm mt-2" onClick={logout}>Logout</button>
        </div>
      </div>
    )
  }
}