import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import BookingWidget from "../components/BookingWidget"

export default function PlacePage() {
  const { id } = useParams()
  const [ place, setPlace] = useState()
  const [ showMorePhotos, setShowMorePhotos ] = useState(false)

  useEffect(() => {
    const fetchPlace = async () => {
      if (!id) return

      const { data } = await axios.get("/place/" + id)
      setPlace(data)
    }

    fetchPlace()
  }, [id])

  if (!place) return "Loading..."
  else if (showMorePhotos) {
    return (
      <div className="absolute inset-0 bg-white min-h-full justify-between">
        <div className="flex justify-center">
          <div className="bg-black p-8 grid gap-4 max-w-4xl relative">
            <div>
              <h2 className="text-3xl text-white">Photos of {place.title}</h2>
              <button className="absolute right-8 top-8 flex gap-1 py-2 px-4 rounded-2xl shadow shadow-black"
                onClick={() => setShowMorePhotos(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Close button
              </button>
            </div>
            {place.photos.length > 0 && place.photos.map((photo, index) => (
              <div className="flex items-center justify-center ">
                <img src={"http://localhost:4000/uploads/" + photo} key={index}/>
              </div>
            ))}
          </div>
        </div>
      </div>
    ) 
  }
  else {
    return (
      <div className="bg-gray-100 p-8 mt-4 -mx-8">
        <h1 className="text-2xl font-semibold">{place.title}</h1>
        <a className="flex gap-1 my-1 underline font-semibold mt-2" target="_blank" href={"http://maps.google.com/?q=" + place.address}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          {place.address}
        </a>
        <div className="relative">
          <div className="grid grid-cols-[2fr_1fr] gap-x-3 mt-6 rounded-2xl overflow-hidden">
            <div>
              <img className="aspect-square object-cover h-full" src={"http://localhost:4000/uploads/" + place.photos[0]}/>
            </div>
            <div>
              <img className="aspect-square object-cover" src={"http://localhost:4000/uploads/" + place.photos[1]}/>
              <div className="overflow-hidden">
                <img className="aspect-square object-cover relative top-2" src={"http://localhost:4000/uploads/" + place.photos[1]}/>
              </div>
            </div>
            <button className="flex gap-1 absolute right-2 bottom-2 py-1 px-3 rounded-xl 
            shadow-md shadow-gray-400 border border-black bg-white" onClick={() => setShowMorePhotos(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
              </svg>
              Show more photos
            </button>
          </div>
        </div>
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