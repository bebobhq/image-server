const AWS = require('aws-sdk')
const parseRules = require('./parseRules')
const s3 = require('./s3')
const filetype = require('file-type')
const imageProcessor = require('./imageProcessor')
const sendInfo = require('./info')

let imageMimes = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp']

module.exports = app => {

  app.get('*', async (req, res) => {
    // Store all variables we create here so we can pass them to the processors
    let variables = {
      rules: false,
      fileName: false,
      extension: false,
      mime: 'application/octet-stream'
    }

    let {info = false} = req.query

    // Parts will have every part for the s3 get
    let parts = req.path
      .split('/')
      .filter(s => s.trim() !== '')
      .reduce((list, part, key) => {
        part = part.trim()

        // This is first item, check it we have rules
        if (!key) {
          variables.rules = parseRules(part)
          if (!variables.rules)
            list.push(part)
        } else {
          list.push(part)
        }

        return list
      }, [])

    // There are no valid parts in the path, then
    if (!parts.length)
      return res.status(404).send('File not found')

    // Get filename from parts
    variables.fileName = parts[parts.length - 1] || ''

    // Get parts for extension
    let fileNameParts = variables.fileName.split('.')
    variables.extension = fileNameParts[fileNameParts.length - 1].toLowerCase();

    let s3Key = decodeURI(parts.join('/'))

    try {
      let buffer = await s3(s3Key)
      variables.type = filetype(buffer)
      
      if (variables.extension === 'svg') {
        variables.type = variables.type || {}
        variables.type.mime = 'image/svg+xml'
      }

      // Go through all processors and match extension
      if (variables.type && variables.type.mime != null)
        variables.mime = variables.type.mime

      if (imageMimes.indexOf(variables.mime) > -1)
        buffer = await imageProcessor(buffer, variables.rules)

      if (info)
        return sendInfo(req, res, variables, buffer)

      res.contentType(variables.mime)
      res.setHeader('Cache-Control', 'public, max-age=86400')
      res.send(buffer)
    } catch (err) {
      console.log(err.code === 'NoSuchKey' ? `Key not found for ${s3Key}` : err)
      res.send('File not found: /' + s3Key)
    }
  })
}