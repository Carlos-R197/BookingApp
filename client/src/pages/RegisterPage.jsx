import { useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

export default function RegisterPage() {
  const [ username, setUsername ] = useState("")
  const [ email, setEmail ] = useState("")
  const [ password, setPassword ] = useState("")

  async function registerUser(ev) {
    ev.preventDefault()
    try {
      await axios.post("/register", {
        username: username,
        email: email,
        password: password
      })
      alert("Registration successful. Now you can log in")
    } catch (e) {
      if (e.response.status == 422) {
        alert("Email is alredy in usage")
      }
      else {
        alert("Registration failed. Try again later")
      }
    }
  }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-32">
        <h1 className="text-4xl text-center mb-4">Register</h1>
        <form className="max-w-lg" onSubmit={registerUser}>
          <input type="text" placeholder="John Doe" value={username} onChange={ev => setUsername(ev.target.value)}/>
          <input type="email" placeholder="email@gmail.com" value={email} onChange={ev => setEmail(ev.target.value)}/>
          <input type="password" placeholder="your_password" value={password} onChange={ev => setPassword(ev.target.value)}/>
          <button className="primary">Finish registration</button>
          <div className="text-center text-gray-500">
            Don't have an account yet? <Link className="text-blue-500 underline" to={"/register"}>Register now</Link> 
          </div>
        </form>
      </div>
    </div>
  )
}