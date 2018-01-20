module.exports = socketIo
const categories = require('./location/filtered-subcategories.json')
const minube = require('./minube')
const recommendationEngine = require('./recommendation-engine/main')

function socketIo (socket) {
  // Send categories to client
  socket.emit('categories', { categories })

  socket.on('get_clusters', function (params) {
    const clusters = getClusters(params)
    socket.emit('test', {clusters}) // emit an event to the socket
  })

  socket.on('get_hotels', function (params) {
    getHotels(sockets, params)
  })
}

async function getClusters (params) {
  const city = await minube.getNearestCity(params.lat, params.lng, params.city)
  const pois = await minube.getInterestedPois(city, params.categoriesIds)

  console.log('Number of pois ' + pois.length)
  const clusters = minube.clusterPois(pois)
  return clusters
}

/**
 *
 * @params socket
 * @param params
 * @params params.lng
 * @params params.lat
 * @params params.price
 * @params params.
 */
async function getHotels (socket, params) {
  const recommendations = await recommendationEngine(params.lat, params.lng, params.price)
  for (const recommendation of recommendations) {
    await wait(100)
    socket.emit('hotels_recommendation', recommendation)
  }
}

function wait (time) {
  return new Promise(function (resolve, reject) {
    setTimeout(resolve, time)
  })
}
