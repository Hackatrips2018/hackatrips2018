module.exports = socketIo

const minube = require('./minube')

function socketIo (socket) {
  socket.on('get_clusters', function (params) {
    const clusters = getClusters(params)
    socket.emit('test', {clusters}) // emit an event to the socket
  })
}

async function getClusters (params) {
  const city = await minube.getNearestCity(params.lat, params.lng, params.city)
  const pois = await minube.getInterestedPois(city, params.categoriesIds)

  console.log('Number of pois ' + pois.length)
  const clusters = minube.clusterPois(pois)
  return clusters
}
