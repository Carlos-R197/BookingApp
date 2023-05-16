const express = require("express")
const router = express.Router()
const PlaceModel = require("../models/Place.js")
const jwt = require("jsonwebtoken")
const jwtSecret = "fklfsd45sv4anewkrhk24234aloqjr9"

router.post("/place", (req, res) => {
  const { title, address, addedPhotos,
    description, perks, extraInfo, 
    checkInTime, checkOutTime, maxGuests,
    price
  } = req.body
  const { token } = req.cookies
  jwt.verify(token, jwtSecret, {}, (err, cookiesData) => {
    if (err) throw err

    PlaceModel.create({
      owner: cookiesData.id,
      title, 
      address, 
      photos: addedPhotos, 
      description, 
      perks, 
      extraInfo, 
      checkIn: checkInTime, 
      checkOut: checkOutTime, 
      maxGuests,
      price 
    }).then(place => {
        console.log(place)
        res.status(201).json(place)
      })
      .catch(err => {
        console.log(err)
        res.status(400).json()
      })
  })
})

router.get("/userPlace", (req, res) => {
  const { token } = req.cookies
  jwt.verify(token, jwtSecret, {}, (err, cookiesData) => {
    if (err) throw err

    PlaceModel.find({ owner: cookiesData.id })
      .then(places => {
        res.status(200).json(places)
      })
  })
})

router.get("/place", async (req, res) => {
  const placeDocs = await PlaceModel.find({})
  res.json(placeDocs)
})

router.get("/place/:id", (req, res) => {
  PlaceModel.findById(req.params.id)
    .then(place => {
      if (place === null) {
        res.status(404).json()
      } else {
        res.json(place)
      }
    })
    .catch(err => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(422).json()
      } else {
        throw err
      }
    })
})

router.put("/place/:id", async (req, res) => {
  const { token } = req.cookies
  const { title, address, addedPhotos,
    description, perks, extraInfo, 
    checkInTime, checkOutTime, maxGuests,
    price
  } = req.body
  jwt.verify(token, jwtSecret, {}, async (err, cookiesData) => {
    if (err) throw err

    const placeDoc = await PlaceModel.findById(req.params.id)
    if (placeDoc.owner.toString() !== cookiesData.id) {
      res.status(403).json()
    } else { 
      placeDoc.title = title
      placeDoc.address = address
      placeDoc.photos = addedPhotos
      placeDoc.description = description
      placeDoc.perks = perks
      placeDoc.extraInfo = extraInfo
      placeDoc.checkIn  = checkInTime
      placeDoc.checkOut = checkOutTime
      placeDoc.maxGuests = maxGuests
      placeDoc.price = price
      await placeDoc.save()
      res.json("Saved")
    }
  })
})

module.exports = router