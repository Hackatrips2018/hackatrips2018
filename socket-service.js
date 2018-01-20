module.exports = socketIo

function socketIo (socket) {
  socket.emit('test', {text: 'test'}) // emit an event to the socket
  // io.emit('broadcast', /* */) // emit an event to all connected sockets
  socket.on('reply', function (e) {
    console.log(e)
  })
}
