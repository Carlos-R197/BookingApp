const express = require("express")
const router = express.Router()
const PlaceModel = require("../models/Place.js")
const jwt = require("jsonwebtoken")
const jwtSecret = "fklfsd45sv4anewkrhk24234aloqjr9"
const { body, validationResult, matchedData, cookie, param } = require("express-validator")
const mongoose = require("mongoose")

const placeValidationChain = () => [
  body("title").trim().isString().isLength({ min: 3 }).withMessage("Title must be at least 3 characters long"),
  body("address").trim().isString().isLength({ min: 3 }).withMessage("Address must be at least 3 characters long"),
  body("addedPhotos").isArray(),
  body("description").trim().isString().isLength({ min: 3 }).withMessage("Description must be at least 3 characters long"),
  body("perks").isArray(),
  body("extraInfo").trim().isString(),
  body("checkInTime").isNumeric().withMessage("Not a valid hour"),
  body("checkOutTime").isNumeric().withMessage("Not a valid hour"),
  body("maxGuests").isInt({ min: 1, max: 20}).withMessage("Your place must accept between 1 and 20 guests"),
  body("price").isCurrency().withMessage("Not a valid amount"),
  cookie("token").isJWT()
]

const placeIdValidation = () => param("id").isLength({ min: 24, max: 24 })


router.post(
  "/place",
  placeValidationChain(),
  async (req, res) => {
    const result = validationResult(req)
    if (!result.isEmpty()) {
      return res.status(422).json(result.array())
    }
    const { title, address, addedPhotos,
      description, perks, extraInfo, 
      checkInTime, checkOutTime, maxGuests,
      price, token
    } = matchedData(req)
    jwt.verify(token, jwtSecret, {}, async (err, cookiesData) => {
      if (err) throw err
      try {
        const placeDoc = await PlaceModel.create({
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
        })
        return res.status(201).json(placeDoc)
      } catch (err) {
        console.log(err)
        return res.status(400).json()
      }
    })
  }
)

router.get(
  "/userPlace",
  cookie("token").isJWT(), 
  async (req, res) => {
    var result = validationResult(req)
    if (!result.isEmpty()) {
      return res.status(422).json(result.array())
    }

    const { token } = matchedData(req)
    jwt.verify(token, jwtSecret, {}, async (err, cookiesData) => {
      if (err) throw err

      const placeDocs = await PlaceModel.find({ owner: cookiesData.id })
      return res.status(200).json(placeDocs)
    })
  }
)

// Should return all places except the ones owned by the user requesting them
router.get(
  "/place",
  cookie("token"), 
  async (req, res) => {
    const result = validationResult(req)
    if (!result.isEmpty) {
      return res.status(400).json(result.array())
    }

    const { token } = matchedData(req)
    jwt.verify(token, jwtSecret, {}, async (err, cookiesData) => {
      if (err) throw err

      const placeDocs = await PlaceModel.find({ owner: { $ne: cookiesData.id } })
      res.json(placeDocs)
    })
})

router.get(
  "/place/:id",
  placeIdValidation(),
  async (req, res) => {
    var result = validationResult(req)
    if (!result.isEmpty()) {
      return res.status(422).json(result.array())
    }
    const data = matchedData(req)
    try {
      const placeDoc = await PlaceModel.findById(data.id)
      if (placeDoc === null) {
        return res.status(404).json()
      } else {
        return res.json(placeDoc)
      }
    } catch (err) {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(422).json()
      } else {
        throw err
      }
    }
  }
)

router.put(
  "/place/:id",
  placeValidationChain(),
  placeIdValidation(), 
  async (req, res) => {
    const result = validationResult(req)
    if (!result.isEmpty()) {
      return res.status(422).json(result.array())
    }

    const { title, address, addedPhotos,
      description, perks, extraInfo, 
      checkInTime, checkOutTime, maxGuests,
      price, token, id
    } = matchedData(req)
    jwt.verify(token, jwtSecret, {}, async (err, cookiesData) => {
      if (err) throw err

      const placeDoc = await PlaceModel.findById(id)
      if (placeDoc.owner.toString() !== cookiesData.id) {
        return res.status(403).json()
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
  }
)

module.exports = router