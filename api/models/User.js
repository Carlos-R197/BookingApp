const mongoose = require("mongoose")

const UserSchema = mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  password: String
})

const UserModel = mongoose.model("User", UserSchema)

module.exports = UserModel