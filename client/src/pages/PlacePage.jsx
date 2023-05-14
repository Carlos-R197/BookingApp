import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import BookingWidget from "../components/BookingWidget"
import AddressLink from "../components/AddressLink"
import PlaceGallery from "../components/PlaceGallery"

export default function PlacePage() {
  const { id } = useParams()
  const [ place, setPlace] = useState()

  useEffect(() => {
    const fetchPlace = async () => {
      if (!id) return

      const { data } = await axios.get("/place/" + id)
      setPlace(data)
    }

    fetchPlace()
  }, [id])

  if (!place) return "Loading..."
  else {
    return (
      <div className="bg-gray-100 p-8 mt-4 -mx-8">
        <h1 className="text-2xl font-semibold">{place.title}</h1>
        <AddressLink place={place}/>
        <PlaceGallery place={place}/>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
          <div>
            <div>
              <h2 className="text-2xl font-semibold">Description</h2>
              <p>{place.description}</p>
            </div>
            Check-in: {place.checkIn} <br />
            Check-out: {place.checkOut} <br />
            Max number of guests: {place.maxGuests}
          </div>
          <BookingWidget place={place}/>
          {place.extraInfo && (
            <div>
              <h2>Extra info</h2>
              <p className="mt-2 text-small text-gray-700 leading-4">{place.extraInfo}</p>
            </div>
          )}
        </div>
      </div>
    )
  }
}