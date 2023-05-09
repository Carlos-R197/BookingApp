import { Link } from "react-router-dom";
import AccountNav from "../components/AccountNav";
import { useEffect, useState } from "react";
import axios from "axios";

export default function PlacesPage() {
  const [ places, setPlaces ] = useState([])

  useEffect(() => {
    axios.get("/place")
      .then(({ data }) => {
        setPlaces(data)
      })
  }, [])

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
        {places.map((place, index) => {
          <div key={index}>
            
          </div>
        })}
      </div>
    </div>
  )
}