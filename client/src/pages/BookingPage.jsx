import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import AddressLink from "../components/AddressLink"
import PlaceGallery from "../components/PlaceGallery"
import BookingDates from "../components/BookingDates"

export default function BookingPage() {
  const { id } = useParams()
  const [ booking, setBooking ] = useState()

  useEffect(() => {
    if (id) {
      const fetchBooking = async () => {
        const res = await axios.get("/booking/" + id)
        setBooking(res.data)
        console.log(!!booking)
      }
      fetchBooking()
    }
  }, [id])

  if (!booking) {
    return ""
  }

  return (
    <div className="my-8">
      <h1 className="text-3xl">{booking.place.title}</h1>
      <AddressLink place={booking.place}/>
      <div className="flex bg-gray-200 p-6 my-6 rounded-2xl justify-between items-center">
        <div>
          <h2 className="text-xl">Your booking information:</h2>
          <BookingDates className={"text-xl"} booking={booking}/>
        </div>
        <div className="bg-primary p-4 rounded-2xl text-white text-xl text-center">
          Total price <br />
          ${booking.price}
        </div>
      </div>
      <PlaceGallery place={booking.place}/>
    </div>
  )
}