const express = require('express')
var cors = require('cors')

const fs = require('fs')
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)

const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

const { uploadFile, getFileStream, getAllFilesStream } = require('./s3')

const app = express()

//get a specific image
app.get('/image/:key', cors({ origin: "*" }), (req, res) => {
  const key = req.params.key
  const readStream = getFileStream(key)
  readStream.pipe(res)
})

//get all images
app.get('/images/all', cors({ origin: "*" }), (req, res) => {
  getAllFilesStream(res)
})

//post an image
app.post('/image', upload.single('image'), cors({ origin: "*" }), async (req, res) => {
  const file = req.file
  console.log(file)
  const result = await uploadFile(file)
  await unlinkFile(file.path)
  console.log(result)
  const description = req.body.description
  console.log("description: ", description);
  res.send(result.Key)
})

app.listen(3535, () => console.log("listening on port 3535"))