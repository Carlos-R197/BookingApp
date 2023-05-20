import { useState } from "react"
import isStrongPassword from "validator/lib/isStrongPassword"

export default function PasswordInput({ value, setValue }) {
  const [ errorMessage, setErrorMessage ] = useState("")

  function onInputBlur(value) {
    if (isStrongPassword(value)) {
      setErrorMessage("")
    } else {
      setErrorMessage("Password must be atleast 8 characters long and have 1 capitar letter and 1 number")
    }
  }

  return (
    <>
      <input 
        type="password" 
        placeholder="Password#98" 
        value={value} 
        required
        maxLength={50} 
        onChange={ev => setValue(ev.target.value)}
        onBlur={ev => onInputBlur(ev.target.value)}
        />
      <span className="text-red-500">{errorMessage}</span>
    </>
  )
}