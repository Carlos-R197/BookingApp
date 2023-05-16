const express = require("express")
const router = express.Router()
const multer = require("multer")
const imageDownloader = require("image-downloader")
const fs = require("fs")

router.post("/upload-by-link", (req, res) => {
  const { link } = req.body
  const newName = Date.now() + ".jpg"
  imageDownloader.image({ url: link, dest: __dirname + "\\uploads\\" + newName })
    .then(({ filename }) => {
      console.log("Saved to ", filename)
      res.json(newName)
    })
    .catch(err => {
      console.error(err)
      res.status(400).json()
    })
})

const photoMiddleware = multer({dest: "uploads"})
router.post("/upload", photoMiddleware.array("photos", 10), (req, res) => {
  console.log(req.files)
  const uploadedFiles = []
  req.files.forEach(({ path, originalname }) => {
    const parts = originalname.split(".")
    const ext = parts[parts.length - 1] 
    newPath = path + "." + ext
    console.log(newPath)
    fs.renameSync(path, newPath)
    uploadedFiles.push(newPath.replace("uploads\\", ""))
  })
  res.json(uploadedFiles)
})

//TODO: implement
router.delete("/upload/:id", async (req, res) => {
  //res.status(501).json()
  const { id } = req.params.id
  console.log(id)
  // fs.unlink(`${__dirname}\\uploads\\${id}`, err => {
  //   if (err) throw err

  //   res.json("Deleted image successfully")
  // })
})

module.exports = router