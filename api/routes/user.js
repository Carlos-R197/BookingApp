const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const jwtSecret = "fklfsd45sv4anewkrhk24234aloqjr9"
const bcrypt = require("bcryptjs")
const UserModel = require("../models/User.js")

const bcryptSalt = bcrypt.genSaltSync(10)

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body
    const user = await UserModel.create({ 
      username, 
      email, 
      password: await bcrypt.hash(password, bcryptSalt)
    })
    res.status(201).json(user)
  } catch (err) {
    if (err.code == 11000) {
      console.log("Duplicate key: ", err.keyValue)
      res.status(422).json(err)
    }
    //console.log(e.constructor.name)
  }
})

router.post("/login", async (req, res) => {
  const { email, password } = req.body
  const user = await UserModel.findOne({ email })
  if (user) {
    const passOk = bcrypt.compareSync(password, user.password) 
    if (passOk) {
      jwt.sign({ email: user.email, id: user._id }, jwtSecret, {}, (err, token) => {
        if (err) throw err
        res.cookie("token", token).json(user)
      })
    } else {
      res.status(422).json("Incorrect password")
    }
  } else {
    res.status(404).json("Not found")
  }
})

router.post("/logout", (req, res) => {
  res.cookie("token", "").json(true)
})

router.get("/profile", (req, res) => {
  const { token } = req.cookies
  if (token) {
    jwt.verify(token, jwtSecret, {}, (err, cookieData) => {
      if (err) throw err
      UserModel.findById({ _id: cookieData.id })
        .then(user => {
          const { username, email, _id } = user
          res.json({ username, email, _id })
        })
    })
  } else {
    res.json(null)
  }
})

router.get("/test", (req, res) => {
  res.json("test ok")
})

module.exports = router