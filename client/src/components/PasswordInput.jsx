import { useState } from "react"
import isStrongPassword from "validator/lib/isStrongPassword"

export default function PasswordInput({ value, setValue }) {
  const [ errorMessage, setErrorMessage ] = useState("")
  const [ isShowingPassword, setIsShowingPassword ] = useState(false)

  function onInputBlur(value) {
    if (isStrongPassword(value)) {
      setErrorMessage("")
    } else {
      setErrorMessage("Password must be atleast 8 characters long and have 1 capitar letter and 1 number")
    }
  }

  function onShowPasswordClicked(ev) {
    ev.preventDefault()
    setIsShowingPassword(!isShowingPassword)
  }

  return (
    <>
      <div className="relative">
        <input 
          type={isShowingPassword ? "text" : "password"} 
          placeholder="Password#98" 
          value={value} 
          required
          maxLength={50} 
          onChange={ev => setValue(ev.target.value)}
          onBlur={ev => onInputBlur(ev.target.value)} 
        />
        <button className="absolute right-3 top-3 bg-white" onClick={onShowPasswordClicked}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
      <span className="text-red-500">{errorMessage}</span>
    </>
  )
}