const sizeOf = require('image-size')

module.exports = (req, res, variables, buffer) => {
  let type = variables.mime.split('/')[0]

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
    mime: variables.mime,
    type,
    size: buffer.byteLength,
    data
  })
}