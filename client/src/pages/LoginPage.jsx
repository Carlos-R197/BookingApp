import { Link } from "react-router-dom"

export default function LoginPage() {
  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-32">
        <h1 className="text-4xl text-center mb-4">Login</h1>
        <form className="max-w-lg">
          <input type="email" placeholder="email@gmail.com" />
          <input type="password" placeholder="your_password" />
          <button className="primary">Login</button>
          <div className="text-center text-gray-500">
            Don't have an account yet? <Link className="text-black underline" to={"/register"}>Register now</Link> 
          </div>
        </form>
      </div>
    </div>
  )
}