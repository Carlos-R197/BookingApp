import { useContext, useEffect, useState } from "react"
import { differenceInCalendarDays, parse, format, addDays } from "date-fns"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../context/UserContext"

export default function BookingWidget({ place }) {
  const [ checkIn, setCheckIn ] = useState(format(new Date(), "yyyy-MM-dd"))
  const [ checkOut, setCheckOut ] = useState(format(addDays(new Date(), 1), "yyyy-MM-dd"))
  const [ maxGuests, setMaxGuests ] = useState(1)
  const [ fullname, setFullname ] = useState("")
  const [ phoneNumber, setPhoneNumber ] = useState("")
  const { user } = useContext(UserContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      setFullname(user.username)
    }
  }, [user])

  const diffDays = differenceInCalendarDays(new Date(checkOut), new Date(checkIn))

  async function bookPlace() {
    if (!user) {
      alert("You need to be logged in in order to book a place.")
      return
    }

    const data = { placeId: place._id, checkIn, checkOut,
      maxGuests, fullname, phoneNumber, price: diffDays * place.price 
    }
    try {
      const res = await axios.post("/booking", data)
      if (res.status === 201) {
        alert("Your booking has been processed successfully")
        navigate("/account/bookings/" + res.data._id)
      }
    } catch (err) {
      if (err.response.status == 422) {
        let msg = ""
        err.response.data.forEach(error => {
          msg += error.msg + "\n"
        })
        alert(msg)
      }
    }
  }

  return (
    <div>
      <div className="bg-white shadow p-4 rounded-2xl">
        <div className="text-2xl text-center">
          Price: ${place.price} / night
        </div>
        <div className="border rounded-2xl mt-2">
          <div className="flex  justify-center">
            <div className="p-2 px-4">
              <label htmlFor="check-in-picker">Check-in: </label>
              <input id="check-in-picker" type="date" value={checkIn} onChange={ev => setCheckIn(ev.target.value)}
                min={1} max={24}/>
            </div>
            <div className="p-2 px-4 border-l-2">
              <label htmlFor="check-out-picker">Check-out: </label>
              <input id="check-out-picker" type="date" value={checkOut} onChange={ev => setCheckOut(ev.target.value)}
                min={1} max={24}/>
            </div>
          </div>
          <div className="p-2 px-4 border-t-2">
              <label htmlFor="number-guests">Max number of guests: </label>
              <input id="number-guests" type="number" value={maxGuests} 
                onChange={ev => setMaxGuests(ev.target.value)} min={1} max={20}/>
          </div>
          {diffDays > 0 && (
            <div>
              <div className="mb-2 px-4">
                <label htmlFor="fullname-input">Full name: </label>
                <input id="fullname-input" type="text" value={fullname} 
                  onChange={ev => setFullname(ev.target.value)} maxLength={50}/>
              </div>
              <div className="mb-2 px-4">
                  <label htmlFor="phone-number-input">Phone number: </label>
                  <input id="phone-number-input" type="tel" value={phoneNumber} onChange={ev => setPhoneNumber(ev.target.value)}/>
              </div>
            </div>
          )}
        </div>
        <button className="primary mt-4" onClick={bookPlace}>Book this place</button>
        {diffDays > 0 && (
          <div className="font-semibold text-center">
            ${diffDays * place.price} total
          </div>
        )}
      </div>
    </div>
  )
}