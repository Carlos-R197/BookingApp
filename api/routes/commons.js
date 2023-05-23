const jwt = require("jsonwebtoken")

function getDataFromJWT(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, cookiesData) => {
      if (err) throw err

      resolve(cookiesData)
    })
  })
}

module.exports = { getDataFromJWT }