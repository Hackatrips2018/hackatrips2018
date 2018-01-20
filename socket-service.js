module.exports = socketIo

const categories = require('./location/filtered-subcategories.json')

function socketIo (socket) {

  // Send categories to client
  socket.emit('categories', { categories })

  // io.emit('broadcast', /* */) // emit an event to all connected sockets
  socket.on('reply', function (e) {
    console.log(e)
  })
}
