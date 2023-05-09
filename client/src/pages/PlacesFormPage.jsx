import AccountNav from "../components/AccountNav";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

export default function PlacesFormPage() {
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
  const navigate = useNavigate()

  function addNewPlace(ev) {
    ev.preventDefault()
    const placeData = { title, address, addedPhotos, 
      description, perks, extraInfo, 
      checkInTime, checkOutTime, maxGuests
    }
    axios.post("/place", placeData)
      .then(() => {
        navigate("/account/places")
      })
  }

  function uploadByLink(ev) {
    ev.preventDefault()
    axios.post("/upload-by-link", { link: photoLink })
      .then(({ data }) => {
        console.log(data)
        setAddedPhotos([...addedPhotos, data])
        setPhotoLink("")
      })
      .catch(err => console.log("Upload by link error"))
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
      setAddedPhotos([...addedPhotos, imageNames])
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
        <form onSubmit={addNewPlace}>
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
              <div className="flex h-32" key={photoName}>
                <img className="rounded-2xl w-full object-cover" src={"http://localhost:4000/uploads/" + photoName}/>
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
              <input type="checkbox" name="wifi" onChange={handlePerksCheckbox}/>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
              </svg>
              <span>Wifi</span>
            </label>
            <label className="flex gap-1 items-center border rounded-md p-2 cursor-pointer">
              <input type="checkbox" name="parking" onChange={handlePerksCheckbox}/>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
              <span>Free parking spot</span>
            </label>
            <label className="flex gap-1 items-center border rounded-md p-2 cursor-pointer">
              <input type="checkbox" name="location" onChange={handlePerksCheckbox}/>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              <span>Good location</span>
            </label>
            <label className="flex gap-1 items-center border rounded-md p-2 cursor-pointer">
              <input type="checkbox" name="tv" onChange={handlePerksCheckbox}/>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z" />
              </svg>
              <span>TV</span>
            </label>
            <label className="flex gap-1 items-center border rounded-md p-2 cursor-pointer">
              <input type="checkbox" name="view" onChange={handlePerksCheckbox}/>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Great View</span>
            </label>
            <label className="flex gap-1 items-center border rounded-md p-2 cursor-pointer">
              <input type="checkbox" name="pets" onChange={handlePerksCheckbox}/>
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
          <div className="grid sm:grid-cols-3 gap-2">
            <div className="mt-2 mb-1">
              <h3>Check in time</h3>
              <input type="text" placeholder="14" value={checkInTime} onChange={ev => setCheckInTime(ev.target.value)}/>
            </div>
            <div className="mt-2 mb-1">
              <h3>Check out time</h3>
              <input type="text" placeholder="11" value={checkOutTime} onChange={ev => setCheckOutTime(ev.target.value)}/>
            </div>
            <div className="mt-2 mb-1">
              <h3>Max number of guests</h3>
              <input type="number" value={maxGuests} onChange={ev => setMaxGuests(ev.target.value)}/>
            </div>
          </div>
          <button className="primary my-3">Save</button>
        </form>
      </div>
    </div>
  )
}