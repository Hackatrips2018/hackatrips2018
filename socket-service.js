module.exports = socketIo

const categories = require('./location/filtered-subcategories.json')
const minube = require('./location/minube')
const geocoding = require('./geocoding')
const recommendationEngine = require('./recommendation-engine/main')

function socketIo (socket) {
  // Send categories to client
  socket.emit('categories', { categories })

  socket.on('get_clusters', async function (params) {
    const clustersAndBbox = await getClusters(params)
    socket.emit('poi_clusters', clustersAndBbox) // emit an event to the socket
  })

  socket.on('get_hotels', function (params) {
    getHotels(socket, params)
  })
}

/**
 *
 * @param params
 * @params params.city
 * @params params.categoriesIds
 */
async function getClusters (params) {
  const {latlng, bbox} = await geocoding(params.city)
  const city = await minube.getNearestCity(latlng.lat, latlng.lng, params.city)

  const pois = await minube.getInterestedPois(city, params.categoriesIds)

  console.log('Number of pois ' + pois.length)
  const clusters = minube.clusterPois(pois)
  console.log('Number of clusters ' + clusters.length)

  return {clusters, bbox, latlng}
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
  socket.emit('hotels_recommendation_end')
}

function wait (time) {
  return new Promise(function (resolve, reject) {
    setTimeout(resolve, time)
  })
}
