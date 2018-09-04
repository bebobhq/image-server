const {S3_BUCKET, S3_ACCESS_ID, S3_ACCESS_KEY} = process.env
const AWS = require('aws-sdk')
let s3 = new AWS.S3({
  region: 'eu-west-1',
  accessKeyId: S3_ACCESS_ID,
  secretAccessKey: S3_ACCESS_KEY
})

module.exports = fileKey => new Promise((fulfill, reject) => {
  let options = {
    Bucket: S3_BUCKET,
    Key: fileKey
  }

  s3.getObject(options, (err, data) => {
    if (err) 
      return reject(err)

    return fulfill(data.Body)
  })
})
