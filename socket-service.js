module.exports = socketIo

const minube = require('./minube')

function socketIo (socket) {
  socket.emit('test', {text: 'test'}) // emit an event to the socket
  socket.on('get_clusters', getClusters)
}

async function getClusters (params) {
  const city = await minube.getNearestCity(params.lat, params.lng, params.city)
  const pois = await minube.getInterestedPois(city, params.categoriesIds)

  console.log('Number of pois ' + pois.length)
  const clusters = minube.clusterPois(pois)
  return clusters
}
