import { useState } from "react"
import isEmail from "validator/lib/isEmail"

export default function EmailInput({ value, setValue }) {
  const [ errorMessage, setErrorMessage ] = useState("")

  function onInputBlur(value) {
    if (isEmail(value)) {
      setErrorMessage("")
    } else {
      setErrorMessage("Not a valid email")
    }
  }

  return (
    <>
      <input 
        type="email" 
        placeholder="Email address" 
        value={value} 
        required 
        maxLength={50}
        autoComplete="on"
        onChange={ev => setValue(ev.target.value)}
        onBlur={ev => onInputBlur(ev.target.value)}
        />
      <span className="text-red-500">{errorMessage}</span>
    </>
  )
}