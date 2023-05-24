import { Link } from "react-router-dom";
import AccountNav from "../components/AccountNav";
import { useEffect, useState } from "react";
import axios from "axios";
import { IMAGES_URL } from "../settings";

export default function PlacesPage() {
  const [ places, setPlaces ] = useState([])

  useEffect(() => {
    axios.get("/userPlace")
      .then(({ data }) => {
        setPlaces(data)
      })
  }, [])
  
  if (!places) {
    return "You have no places"
  }

  return (
    <div>
      <AccountNav />
      <div className="text-center">
        <Link className="inline-flex text-white bg-primary rounded-full gap-1 py-1 px-4" to="/account/places/new">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add new place
        </Link>
      </div>
      <div className="mt-4">
        {places.length > 0 && places.map((place, index) => ( 
          <Link className="flex cursor-pointer bg-gray-100 rounded-2xl p-4 gap-4 mt-4 shadow-md" key={index} to={"/account/places/" + place._id}>
            <div className="flex w-48 h-48">
              {place.photos.length > 0 && (
                <img className="rounded-2xl" src={IMAGES_URL + place.photos[0]} alt=""/>
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{place.title}</h2>
              <p className="text-sm mt-2">{place.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}