const sizeOf = require('image-size')

module.exports = (req, res, variables, buffer) => {
  let type = variables.mime.split('/')[0]
  let url = false

  let data = {}

  if (type === 'image') {
    let size = sizeOf(buffer)
    if (size) {
      data = {
        format: size.type,
        type: 'image',
        mimeType: variables.mime,
        width: size.width,
        height: size.height
      }
    }
  }

	res.json({
    filename: variables.fileName,
    url: variables.url,
    mime: variables.mime,
    type,
    size: buffer.byteLength,
    data
  })
}