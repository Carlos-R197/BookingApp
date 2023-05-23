import axios from "axios"
import { useContext, useState } from "react"
import { Link, Navigate } from "react-router-dom"
import { UserContext } from "../context/UserContext"
import EmailInput from "../components/EmailInput"
import PasswordInput from "../components/PasswordInput"

export default function LoginPage() {
  const [ email, setEmail ] = useState("")
  const [ password, setPassword] = useState("")
  const [ redirect, setRedirect ] = useState(false)
  const { setUser } = useContext(UserContext)

  async function handleLoginSubmit(ev) {
    ev.preventDefault()
    try {
      const { data } = await axios.post("/login", { email: email, password: password })
      setUser(data)
      alert("Login successful")
      setRedirect(true)
    } catch (err) {
      if (err.response.status == 422) {
        const errors = err.response.data
        let msg = ""
        errors.forEach(error => {
          msg += error.msg
        })
        alert(msg)
      } else if (err.response.status == 404) {
        alert("Credentials weren't found. Email or password are incorrect.")
      } else {
        alert("Login failed, try again later.")
      }
    }
  }

  if (redirect) {
    return <Navigate to="/"/>
  }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-32">
        <h1 className="text-4xl text-center mb-4">Login</h1>
        <form className="w-96" onSubmit={handleLoginSubmit}>
          <EmailInput value={email} setValue={setEmail}/>
          <PasswordInput value={password} setValue={setPassword}/>
          <button className="primary mt-5" onClick={handleLoginSubmit}>Login</button>
          <div className="text-center text-gray-500 mt-1">
            Don't have an account yet? <Link className="text-black underline" to={"/register"}>Register now</Link> 
          </div>
        </form>
      </div>
    </div>
  )
}