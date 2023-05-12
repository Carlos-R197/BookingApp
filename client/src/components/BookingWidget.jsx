import { useState } from "react"
import { differenceInCalendarDays, parse } from "date-fns"

export default function BookingWidget({ place }) {
  const [ checkIn, setCheckIn ] = useState("2023-05-12")
  const [ checkOut, setCheckOut ] = useState("2023-05-12")
  const [ maxGuests, setMaxGuests ] = useState(1)

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
              <input id="check-in-picker" type="date" value={checkIn} onChange={ev => setCheckIn(ev.target.value)}/>
            </div>
            <div className="p-2 px-4 border-l-2">
              <label htmlFor="check-out-picker">Check-out: </label>
              <input id="check-out-picker" type="date" value={checkOut} onChange={ev => setCheckOut(ev.target.value)}/>
            </div>
          </div>
          <div className="p-2 px-4 border-t-2">
              <label htmlFor="number-guests">Max number of guests </label>
              <input id="number-guests" type="number" value={maxGuests} onChange={ev => setMaxGuests(ev.target.value)}/>
          </div>
        </div>
        <button className="primary mt-4">Book this place</button>
        { differenceInCalendarDays(new Date(checkOut), new Date(checkIn)) > 0 && (
          <div className="font-semibold text-center">
            ${differenceInCalendarDays(new Date(checkOut), new Date(checkIn)) * place.price} total
          </div>
        )}
      </div>
    </div>
  )
}