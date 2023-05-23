import { useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import validator from "validator"
import PasswordInput from "../components/PasswordInput"
import EmailInput from "../components/EmailInput"

export default function RegisterPage() {
  const [ username, setUsername ] = useState("")
  const [ usernameError, setUsernameError ] = useState("")
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
    } catch (err) {
      console.log(err)
      if (err.response.status == 422) {
        const errors =  err.response.data
        let msg = ""
        errors.forEach(error => {
          msg += error.msg + "\n"
        })
        msg.trimEnd()
        alert(msg)
      } else {
        alert("Registration failed. Try again later")
      }
    }
  }

  function onUsernameInputBlur() {
    if (!validator.matches(username, /^[a-z\s'-]{2,50}$/i)) {
      setUsernameError("Username isn't valid.")
    } else {
      setUsernameError("")
    }
  }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-32">
        <h1 className="text-4xl text-center mb-4">Register</h1>
        <form className="w-96" onSubmit={registerUser}>
          <input type="text" placeholder="John Doe" value={username} required
            onChange={ev => setUsername(ev.target.value)} onBlur={onUsernameInputBlur}/>
          <span className="text-red-500">{usernameError}</span>
          <EmailInput value={email} setValue={setEmail}/>
          <PasswordInput value={password} setValue={setPassword}/>
          <button className="primary mt-5" type="submit">Finish registration</button>
          <div className="text-center text-gray-500 mt-1">
            <Link className="text-blue-500 underline" to={"/login"}>Return</Link> 
          </div>
        </form>
      </div>
    </div>
  )
}