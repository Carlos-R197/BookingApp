const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const UserModel = require("../models/User.js")
const { body, validationResult, matchedData, cookie } = require("express-validator")
const { getDataFromJWT } = require("./commons.js")

const bcryptSalt = bcrypt.genSaltSync(10)

const nameRegex = /^[a-zA-Z\s'-]{2,50}$/
const emailValidation = () => body("email").isEmail().withMessage("Email isn't valid")
const passwordValidation = () => body("password").isStrongPassword().withMessage("Password isn't valid, must be between 8 and 50 chars, have one uppercase letter and one digit.")

router.post(
  "/register",
  body("username").matches(nameRegex).withMessage("Name must be between 2 and 50 characters and use only alphanumerics, whitespace and hyphens"),
  emailValidation(),
  passwordValidation(),
  async (req, res) => {
    const result = validationResult(req)
    if (!result.isEmpty()) {
      return res.status(422).json(result.array())
    }

    const { username, email, password } = matchedData(req)
    try {
      const user = await UserModel.create({ 
        username, 
        email, 
        password: await bcrypt.hash(password, bcryptSalt)
      })
      return res.status(201).json(user)
    } catch (err) {
      if (err.name === "MongoServerError" && err.code == 11000) {
        return res.status(422).json("Email is alredy in usage")
      }
    }
  }
)

router.post(
  "/login",
  emailValidation(),
  passwordValidation(),
  async (req, res) => {
    const result = validationResult(req)
    if (!result.isEmpty()) {
      return res.status(422).json(result.array())
    }

    const { email, password } = matchedData(req)
    const user = await UserModel.findOne({ email })
    if (user) {
      const passOk = bcrypt.compareSync(password, user.password) 
      if (passOk) {
        jwt.sign({ email: user.email, id: user._id }, jwtSecret, {}, (err, token) => {
          if (err) throw err
          return res.cookie("token", token).json(user)
        })
      } else {
        return res.status(422).json([{ msg: "Incorrect password" }])
      }
    } else {
      return res.status(404).json()
    }
  }
)

router.post(
  "/logout",
  cookie("token").isJWT(),
  (req, res) => {
    const result = validationResult(req)
    if (!result.isEmpty()) {
      return res.status(422).json({ errors: result.array() })
    }

    return res.cookie("token", "").json(true)
  }
)

router.get(
  "/profile", 
  async (req, res) => {
    const { token } = req.cookies
    if (token) {
      const cookiesData = await getDataFromJWT(token)
      const userDoc = await UserModel.findById({ _id: cookiesData.id })
      const { username, email, _id } = userDoc
      return res.json({ username, email, _id })
    } else {
      return res.json(null)
    }
  }
)

module.exports = router