const FILTERED_CATEGORIES = require('./filtered-subcategories.json')

const request = require('request')
const _ = require('lodash')
const geocluster = require('geocluster')

const minubeApiKey = 'jSD8an'

module.exports = {
  getCountries,
  getZones,
  getCities,
  getNearestCity,
  getSubcategories,
  getOwnCategories,
  getInterestedPois,
  clusterPois
}

async function getInterestedPois (city, subcategoriesIds) {
  const defaultProperties = {
    order_by: 'score',
    country_id: city.country_id,
    city_id: city.city_id
  }

  const pois = await Promise.all(subcategoriesIds.map(id => {
    return defaultRequest('pois', Object.assign({
      subcategory_id: id
    }, defaultProperties))
  }))

  return _.flatten(pois)
}

function clusterPois (pois) {
  // multiply stdev with this factor, the smaller the more clusters
  const bias = 1.5

  const coordinates = _.map(pois, poi => {
    return [parseFloat(poi.latitude), parseFloat(poi.longitude)]
  })

  const clusters = geocluster(coordinates, bias)

  return clusters.sort((a, b) => {
    return a.elements.length - b.elements.length
  }).reverse().map((cluster, index) => {
    cluster.id = index
    cluster.radius = 1000 // TODO: Put here the radius of this cluster
    return cluster
  })
}

function getOwnCategories () {
  return FILTERED_CATEGORIES
}

function getSubcategories () {
  return defaultRequest('subcategories')
}

async function getNearestCity (lat, lng, stringSearch) {
  const cities = await defaultRequest('cities', {
    // country_id=63
    latitude: lat,
    longitude: lng,
    filter: stringSearch,
    order_by: 'distance'
  })
  return cities[0]
}

function getCities (country, zone) {
  // filter=Madrid
  return defaultRequest('cities', {country_id: country.country_id, filter: zone})
  // return defaultRequest('cities', {zone_id: zone.zone_id, country_id: zone.country_id})
}

function getZones (country) {
  return defaultRequest('zones', {country_id: country.country_id})
}

function getCountries () {
  return defaultRequest('countries')
}

function defaultRequest (operation, extraQS = {}) {
  if (!operation) {
    const merr = new Error(`Need operation`)
    merr.status = 403
    return Promise.reject(merr)
  }

  const url = `http://papi.minube.com/${operation}`

  const options = {
    url: url,
    json: true,
    qs: {
      lang: 'es',
      api_key: minubeApiKey
    },
    timeout: 5000
  }
  Object.assign(options.qs, extraQS)

  return new Promise(function (resolve, reject) {
    const myRequest = request.get(options, function (err, response, body) {
      if (err) {
        return reject(err)
      }
      const statusCode = response.statusCode

      if (statusCode !== 200) {
        const merr = new Error(`Minube - get countries - Wrong status: ${statusCode}`)
        merr.status = statusCode
        return reject(merr)
      }

      return resolve(body)
    })
    myRequest.on('error', function (err) {
      console.error('Minube - get countries error', err)
    })
  })
}
