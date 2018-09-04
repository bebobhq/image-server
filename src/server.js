const pathJoin = require('path').join

require('dotenv').config({
  path: process.env.DOTENV_PATH || pathJoin(__dirname, '..', '.env')
})

const {
	PORT,
	NODE_ENV
} = process.env

const debug = require('debug')('cdn')
const app = require('express')()
app.use(require('helmet')())
app.use(require('morgan')('combined'))
app.get('/favicon.ico', (req, res) => res.status(404).send({success: false}))
require('./resolve')(app)

// catch 404 and forward to error handler
app.use((req, res, next) => {
	let err = new Error('Not Found')
	err.status = 404
	next(err)
})

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) =>  {
	res.status(err.status || 500)
	res.send({
		success: false,
		message: err.message,
		error: NODE_ENV === 'production' ? {} : err
	})
})

app.listen(PORT, () => console.log('Image server up'))