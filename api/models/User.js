const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  password: String
})

const UserModel = mongoose.model("User", userSchema)

module.exports = UserModel