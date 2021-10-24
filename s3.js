require('dotenv').config()
const fs = require('fs')
const S3 = require('aws-sdk/clients/s3')

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey
})

// uploads a file to the S3 bucket
function uploadFile(file) {
  const fileStream = fs.createReadStream(file.path)
  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename
  }
  return s3.upload(uploadParams).promise()
}
exports.uploadFile = uploadFile


// downloads a specific object from the S3 bucket
function getFileStream(fileKey) {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName
  }
  return s3.getObject(downloadParams).createReadStream()
}
exports.getFileStream = getFileStream


//downloads all objects from the S3 bucket
function getAllFilesStream(res) {
  const downloadParams = {
    Bucket: bucketName,
    MaxKeys: 1000,
    ExpectedBucketOwner: "700487665652"
  }
  return s3.listObjects(downloadParams, (err, data) => {
    if (err) console.log(err, err.stack);
    else {
      console.log(data.Contents)
      return res.send(data.Contents)
    }
  })
}
exports.getAllFilesStream = getAllFilesStream