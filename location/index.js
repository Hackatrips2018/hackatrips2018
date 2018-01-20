const minube = require('./minube')

const _ = require('lodash')

try {
  main()
} catch (e) {
  console.error(e)
}

async function main () {
  // const countries = await minube.getCountries()
  // const spain = _.find(countries, {country_name: 'España'})
  // const zones = await minube.getZones(spain)
  // const madridZone = _.find(zones, {zone_name: 'Madrid'})
  // const cities = await minube.getCities(madridZone)
  // const madrid = _.find(cities, {city_name: 'Madrid'})

  const madrid = await minube.getNearestCity(40.415363, -3.707398, 'Madrid')
  const ownCategories = await minube.getOwnCategories()

  const pois = await minube.getInterestedPois(madrid, _.map(ownCategories[0].ids, 'id'))

  console.log('Number of pois ' + pois.length)
  const clusters = minube.clusterPois(pois)
  console.log('Number of clusters ' + clusters.length)
  console.log(clusters)
}

