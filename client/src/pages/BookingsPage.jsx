import { useEffect, useState } from "react"
import axios from "axios"
import AccountNav from "../components/AccountNav"
import { IMAGES_URL } from "../settings"
import { differenceInCalendarDays, format } from "date-fns"
import { Link } from "react-router-dom"
import BookingDates from "../components/BookingDates"

export default function BookingsPage() {
  const [ bookings, setBookings ] = useState([])

  useEffect(() => {
    const fetchBookings = async () => {
      const res = await axios.get("/booking")
      setBookings(res.data)
    }

    fetchBookings()
  }, [])

  function printDayDiff(booking) {
    const diff = differenceInCalendarDays(new Date(booking.checkOut), new Date(booking.checkIn))
    if (diff === 1) {
      return diff + " night"
    } else {
      return diff + " nights" 
    }
  }
  
  if (!bookings) {
    return "You have no bookings"
  }

  return (
    <div>
      <AccountNav />
      {bookings.length > 0 && bookings.map((booking, index) => (
        <Link className="flex gap-4 bg-gray-200 overflow-hidden rounded-2xl border border-black shadow-md" key={index}
          to={"/account/bookings/" + booking._id}>
          <div className="w-48">
            <img className="object-cover" src={IMAGES_URL + booking.place.photos[0]}/>
          </div>
          <div className="py-3 grow pr-3">
            <h2 className="text-xl font-semibold">{booking.place.title}</h2>
            <BookingDates className="border-t border-gray-300" booking={booking}/>
            <div>
              <div className="flex gap-1 text-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Total price: ${booking.price}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}