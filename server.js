const socketIO = require('socket.io')
const express = require('express')
const expressDomain = require('express-domain-middleware')
const http = require('http')

const socketService = require('./socket-service')

const PORT = 8888

const app = express()
app.use(expressDomain)

app.get('/', function (req, res, next) {
  res.sendStatus(200)
})

app.get('/back', function (req, res, next) {
  res.sendStatus(200)
})

const server = http.createServer(app)
const io = socketIO(server)

io.on('connection', socketService)

// Server listen
server.listen(PORT)

// error handling
app.use(function (err, req, res, next) {
  if (err.domain) {
    console.error('CRITICAL', err)
    try {
      // This was an unhandled exception, it is safer to close the cluster.
      const killtimer = setTimeout(function () {
        process.exit(1)
      }, 15000)
      killtimer.unref()
      // We won't receive further requests from this server
      server.close()
    } catch (err) {
      console.error('CRITICAL2, we could not handle the error', err)
    }
  }
  if (err.isHandled !== true) console.error(err, err.stack)

  res.status(err.status || 500).send({
    message: err.domain ? 'Error' : err.message,
    error: err.domain ? new Error('Error') : err.message
  })
})

// Server on error event
server.on('error', function (error) {
  console.error('Unhandled error', error)
  if (error.syscall !== 'listen') {
    console.error('Global error', error)
    throw error
  }

  const bind = typeof PORT === 'string'
    ? 'Pipe ' + PORT
    : 'Port ' + PORT

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      return process.exit(1)
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      return process.exit(1)
    default:
      throw error
  }
})

// Server on listening event
server.on('listening', function () {
  const addr = server.address()
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port
  console.info('Listening on ' + bind)
})

process.on('unhandledRejection', function (error, p) {
  console.error('Error: ', error)
  if (error && error.stack) {
    console.error(error.stack)
  }
  console.error('Promise', p)
})

module.exports = server
