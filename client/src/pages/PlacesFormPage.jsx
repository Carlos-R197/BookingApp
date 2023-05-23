import AccountNav from "../components/AccountNav";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { IMAGES_URL } from "../settings";

export default function PlacesFormPage() {
  const { id } = useParams()
  const [ title, setTitle ] = useState("")
  const [ address, setAddress ] = useState("")
  const [ addedPhotos, setAddedPhotos ] = useState([])
  const [ photoLink, setPhotoLink ] = useState("")
  const [ description, setDescription ] = useState("")
  const [ perks, setPerks ] = useState([])
  const [ extraInfo, setExtraInfo ] = useState("")
  const [ checkInTime, setCheckInTime ] = useState("")
  const [ checkOutTime, setCheckOutTime ] = useState("")
  const [ maxGuests, setMaxGuests ] = useState(1)
  const [ price, setPrice ] = useState(5) 
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchPlace() {
      if (id) {
        const { data } = await axios.get("/place/" + id)
        setTitle(data.title)
        setAddress(data.address)
        setAddedPhotos(data.photos)
        setDescription(data.description)
        setPerks(data.perks)
        setExtraInfo(data.extraInfo)
        setCheckInTime(data.checkIn)
        setCheckOutTime(data.checkOut)
        setMaxGuests(data.maxGuests)
        setPrice(data.price)
      }
    }

    fetchPlace()
  }, [id])

  async function savePlace(ev) {
    ev.preventDefault()
    const placeData = { title, address, addedPhotos, 
      description, perks, extraInfo, 
      checkInTime, checkOutTime, maxGuests,
      price
    }
    // If id has a value it is editing, not creating.
    try {
      if (id) {
        const res = await axios.put("/place/" + id, placeData)
        alert("Modification has been saved")
        navigate("/account/places")
      } else {
        const res = await axios.post("/place", placeData)
        alert("Place has been successfully added")
        navigate("/account/places")
      }
    } catch (err) {
      if (err.response.status == 422) {
        const errors = err.response.data
        let msg = ""
        errors.forEach(error => {
          msg += error.msg + "\n"
        })
        alert(msg)
      }
    }
  }

  function uploadByLink(ev) {
    ev.preventDefault()
    axios.post("/upload-by-link", { link: photoLink })
      .then(({ data }) => {
        console.log(data)
        setAddedPhotos([...addedPhotos, data])
        setPhotoLink("")
      })
  }

  function removePhoto(photoName) {
    const arr = addedPhotos.filter(photo => photo !== photoName)
    setAddedPhotos(arr)
  }

  function selectAsMainPhoto(photoName) {
    const arr = addedPhotos.filter(photo => photo !== photoName)
    setAddedPhotos([photoName, ...arr])
  }

  function uploadPhoto(ev) {
    const files = ev.target.files
    const data = new FormData()
    for (let i = 0; i < files.length; i++) {
      data.append("photos", files[i])
    }
    axios.post("/upload", data, {
      headers: { "Content-Type": "multipart/form-data"}
    }).then(({ data: imageNames }) => {
      setAddedPhotos([...addedPhotos, ...imageNames])
    })
  }

  function handlePerksCheckbox(ev) {
    const { checked, name } = ev.target
    if (checked) {
      setPerks([...perks, name])
    } else {
      const newPerks = perks.filter(p => p != name)
      setPerks(newPerks)
    }
  }

  return (
    <div>
      <AccountNav />
      <div>
        <form onSubmit={savePlace}>
          <h2 className="text-xl mt-4 font-semibold">Title</h2>
          <input type="text" placeholder="My lovely apartment" value={title} onChange={ev => setTitle(ev.target.value)}/>
          <h2 className="text-xl mt-4 font-semibold">Address</h2>
          <input type="text" placeholder="My address" value={address} onChange={ev => setAddress(ev.target.value)}/>
          <h2 className="text-xl mt-4 font-semibold">Photos</h2>
          <div className="flex gap-2">
            <input type="text" placeholder="Add using a link . . ." value={photoLink} onChange={ev => setPhotoLink(ev.target.value)}/>
            <button onClick={uploadByLink} className="rounded-2xl px-3 bg-gray-200">Save&nbsp;photo</button>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 mt-2 gap-2">
            {addedPhotos.length > 0 && addedPhotos.map(photoName => (
              <div className="flex h-32 relative" key={photoName}>
                <img className="rounded-2xl w-full object-cover" src={IMAGES_URL + photoName}/>
                <button className="absolute bottom-1 right-1 cursor-pointer bg-black text-white bg-opacity-60 p-1 rounded-2xl"
                  onClick={() => removePhoto(photoName)} type="button">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
                <button className="absolute bottom-1 left-1 cursor-pointer bg-black text-white bg-opacity-60 p-1 rounded-2xl"
                  onClick={() => selectAsMainPhoto(photoName)} type="button">
                  {addedPhotos[0] === photoName ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                  )}
                </button>
              </div>
            ))}
            <label className="cursor-pointer items-center flex justify-center gap-1 border bg-transparent rounded-2xl p-8 text-gray-600 text-2xl">
              <input type="file" className="hidden" multiple onChange={uploadPhoto}/>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15" />
              </svg>
              Upload
            </label>
          </div>
          <h2 className="text-2xl mt-4 font-semibold">Description</h2>
          <textarea className="h-36" value={description} onChange={ev => setDescription(ev.target.value)}/>
          <h2 className="text-2xl mt-4 font-semibold">Perks</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mt-2">
            <label className="flex gap-1 items-center border rounded-md p-2 cursor-pointer">
              <input type="checkbox" name="wifi" onChange={handlePerksCheckbox} checked={perks.includes("wifi")}/>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
              </svg>
              <span>Wifi</span>
            </label>
            <label className="flex gap-1 items-center border rounded-md p-2 cursor-pointer">
              <input type="checkbox" name="parking" onChange={handlePerksCheckbox} checked={perks.includes("parking")}/>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
              <span>Free parking spot</span>
            </label>
            <label className="flex gap-1 items-center border rounded-md p-2 cursor-pointer">
              <input type="checkbox" name="location" onChange={handlePerksCheckbox} checked={perks.includes("location")}/>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              <span>Good location</span>
            </label>
            <label className="flex gap-1 items-center border rounded-md p-2 cursor-pointer">
              <input type="checkbox" name="tv" onChange={handlePerksCheckbox} checked={perks.includes("tv")}/>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z" />
              </svg>
              <span>TV</span>
            </label>
            <label className="flex gap-1 items-center border rounded-md p-2 cursor-pointer">
              <input type="checkbox" name="view" onChange={handlePerksCheckbox} checked={perks.includes("view")}/>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Great View</span>
            </label>
            <label className="flex gap-1 items-center border rounded-md p-2 cursor-pointer">
              <input type="checkbox" name="pets" onChange={handlePerksCheckbox} checked={perks.includes("pets")}/>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
              </svg>
              <span>Pets</span>
            </label>
          </div>
          <h2 className="text-2xl mt-4 font-semibold">Extra info</h2>
          <span className="text-sm text-gray-500">house rules, etc.</span>
          <textarea value={extraInfo} onChange={ev => setExtraInfo(ev.target.value)}/>
          <h2 className="text-2xl mt-4 font-semibold">Check in & check out times</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            <div className="mt-2 mb-1">
              <h3>Check in time</h3>
              <input type="text" placeholder="14" value={checkInTime} 
                onChange={ev => setCheckInTime(ev.target.value)} min={0} max={24} />
            </div>
            <div className="mt-2 mb-1">
              <h3>Check out time</h3>
              <input type="text" placeholder="11" value={checkOutTime} 
                onChange={ev => setCheckOutTime(ev.target.value)} min={0} max={24} />
            </div>
            <div className="mt-2 mb-1">
              <h3>Max number of guests</h3>
              <input type="number" value={maxGuests} 
                onChange={ev => setMaxGuests(ev.target.value)} min={1} max={20} />
            </div>
            <div className="mt-2 mb-1">
              <h3>Price per night</h3>
              <input type="number" value={price} onChange={ev => setPrice(ev.target.value)} min={0}/>
            </div>
          </div>
          <button className="primary my-3" type="submit">Save</button>
        </form>
      </div>
    </div>
  )
}