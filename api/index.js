const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
require("dotenv").config()
require("./config/db.js")
const app = express()
const userRouter = require("./routes/user.js")
const uploadRouter = require("./routes/upload.js")
const placeRouter = require("./routes/place.js")
const bookingRouter = require("./routes/booking.js")

app.use(express.json())
app.use(cookieParser())
app.use("/uploads", express.static(__dirname + "\\uploads"))
app.use(cors({
  credentials: true,
  origin: "http://127.0.0.1:5173"
}))

app.use("/", userRouter)
app.use("/", uploadRouter)
app.use("/", placeRouter)
app.use("/", bookingRouter)

app.listen(4000)