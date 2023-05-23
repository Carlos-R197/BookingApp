const express = require("express")
const router = express.Router()
const BookingModel = require("../models/Booking.js")
const jwt = require("jsonwebtoken")
const jwtSecret = "fklfsd45sv4anewkrhk24234aloqjr9"
const { param, validationResult, matchedData, cookie, body } = require("express-validator")

router.post(
  "/booking",
  body("placeId").isLength({ min: 24, max: 24 }),
  body("checkIn").isDate().withMessage("Not a valid check-in date"),
  body("checkOut").isDate().withMessage("Not a valid check-out date"),
  body("maxGuests").isInt({ min: 1, max: 20 }).withMessage("Guest should be between 1 and 20"),
  body("fullname").isString().trim().isLength({ min: 3, max: 50 }).withMessage("Name should be between 3 and 50 characters"),
  body("phoneNumber").isMobilePhone().withMessage("Not a valid phone number"),
  body("price").isCurrency().withMessage("Not a valid amount"),
  cookie("token").isJWT(),   
  async (req, res) => {
    const result = validationResult(req)
    if (!result.isEmpty()) {
      return res.status(422).json(result.array())
    }

    const { placeId, checkIn, checkOut, maxGuests,
      fullname, phoneNumber, price, token 
    } = matchedData(req)
    jwt.verify(token, jwtSecret, {}, async (err, cookiesData) => {
      if (err) throw err

      const userId = cookiesData.id
      const bookingDoc = await BookingModel.create({
        place: placeId, user: userId, checkIn, checkOut, amountGuests: maxGuests, fullname, phoneNumber, price 
      })
      res.status(201).json(bookingDoc)
    })
  }
)

router.get(
  "/booking",
  cookie("token").isJWT(), 
  async (req, res) => {
    const result = validationResult(req)
    if (!result.isEmpty()) {
      return res.status(422).json(result.array())
    }
    const { token } = matchedData(req)
    jwt.verify(token, jwtSecret, {}, async (err, cookiesData) => {
      if (err) throw err

      const bookings = await BookingModel.find({ user: cookiesData.id }).populate("place")
      res.json(bookings)
    })
  }
)

router.get(
  "/booking/:id",
  param("id").isLength({ min: 24, max:24 }), 
  async (req, res) => {
    const result = validationResult(req)
    if (!result.isEmpty()) {
      return res.status(422).json(result.array())
    }

    const { id } = matchedData(req)

    const bookingDoc = await BookingModel.findById(id).populate("place")
    if (bookingDoc) {
      res.json(bookingDoc)
    } else {
      res.status(404).json()
    }
  }
)

module.exports = router