const mongoose = require("mongoose")

const bookingSchema = mongoose.Schema({
  placeId: { type: mongoose.Schema.Types.ObjectId, ref: "Place", required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  fullname: { type: String, required: true },
  amountGuests: { type: Number, required: true },
  phoneNumber: { type: String, required: true },
  price: { type: Number, required: true }
})

const BookingModel = mongoose.model("Booking", bookingSchema)

module.exports = BookingModel