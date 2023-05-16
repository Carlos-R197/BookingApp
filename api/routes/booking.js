const express = require("express")
const router = express.Router()
const BookingModel = require("../models/Booking.js")
const jwt = require("jsonwebtoken")
const jwtSecret = "fklfsd45sv4anewkrhk24234aloqjr9"

router.post("/booking", async (req, res) => {
  const { placeId, checkIn, checkOut, maxGuests, fullname, phoneNumber, price } = req.body
  jwt.verify(req.cookies.token, jwtSecret, {}, async (err, cookiesData) => {
    if (err) throw err

    const userId = cookiesData.id
    const bookingDoc = await BookingModel.create({
      place: placeId, user: userId, checkIn, checkOut, amountGuests: maxGuests, fullname, phoneNumber, price 
    })
    res.status(201).json(bookingDoc)
  })
})

router.get("/booking", async (req, res) => {
  jwt.verify(req.cookies.token, jwtSecret, {}, async (err, cookiesData) => {
    if (err) throw err

    const bookings = await BookingModel.find({ user: cookiesData.id }).populate("place")
    res.json(bookings)
  })
})

router.get("/booking/:id", async (req, res) => {
  const bookingDoc = await BookingModel.findById(req.params.id).populate("place")
  if (bookingDoc) {
    res.json(bookingDoc)
  } else {
    res.status(404).json()
  }
})

module.exports = router