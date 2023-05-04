import './App.css'
import { Routes, Route } from "react-router-dom"
import IndexPage from "./pages/IndexPage"
import LoginPage from "./pages/LoginPage"

function App() {
  return (
		<Routes>
			<Route index Component={IndexPage}></Route>
			<Route Component={LoginPage}></Route>
		</Routes>
  )
}

export default App
