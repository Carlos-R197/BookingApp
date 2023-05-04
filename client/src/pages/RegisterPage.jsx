import { useState } from "react"
import { Link } from "react-router-dom"

export default function RegisterPage() {
  const [ username, setUsername ] = useState("")
  const [ email, setEmail ] = useState("")
  const [ password, setPassword ] = useState("")

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-32">
        <h1 className="text-4xl text-center mb-4">Register</h1>
        <form className="max-w-lg">
          <input type="text" placeholder="John Doe" value={username} />
          <input type="email" placeholder="email@gmail.com" value={email} />
          <input type="password" placeholder="your_password" value={password} />
          <button className="primary">Finish registration</button>
          <div className="text-center text-gray-500">
            Don't have an account yet? <Link className="text-blue-500 underline" to={"/register"}>Register now</Link> 
          </div>
        </form>
      </div>
    </div>
  )
}