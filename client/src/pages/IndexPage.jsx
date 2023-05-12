import axios from "axios"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

export default function IndexPage() {
  const [ places, setPlaces ] = useState([])

  useEffect(() => {
    const getPlaces = async () => {
      const res = await axios.get("/place")
      setPlaces([...res.data, ...res.data, ...res.data, ...res.data])
    }
    getPlaces()
  }, [])

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-8 gap-y-8 gap-x-6">
    	{places.length > 0 && places.map((place, index) => (
        <Link key={index} to={"/place/" + place._id}>
          <div className="rounded-2xl mb-2">
            <img className="rounded-2xl aspect-square" src={"http://localhost:4000/uploads/" + place.photos[0]}/>
          </div>
          <h2 className="text-sm truncate">{place.title}</h2>
          <div>
            <h3 className="font-semibold">{place.address}</h3>
          </div>
          <span>
            <span className="font-bold">${place.price}</span>  per night
          </span>
        </Link>
      ))}
    </div>
  )
}