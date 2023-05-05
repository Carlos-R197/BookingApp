const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const User = require("./models/User.js")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const app = express()

const bcryptSalt = bcrypt.genSaltSync(10)
const jwtSecret = "fklfsd45sv4anewkrhk24234aloqjr9"

app.use(express.json())
app.use(cors({
  credentials: true,
  origin: "http://127.0.0.1:5173"
}))

console.log(process.env.MONGO_URL)
mongoose.connect(process.env.MONGO_URL)

app.get("/test", (req, res) => {
  res.json("test ok")
})

app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body
    const user = await User.create({ 
      username, 
      email, 
      password: await bcrypt.hash(password, bcryptSalt)
    })
    res.status(201).json(user)
  } catch (e) {
    if (e.code == 11000) {
      console.log("Duplicate key: ", e.keyValue)
      res.status(422).json(e)
    }
    //console.log(e.constructor.name)
  }
})

app.post("/login", async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
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

app.listen(4000)