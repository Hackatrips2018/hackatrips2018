const hotelsService = require('./hotels')
const recommendation = require('./recomendation')
module.exports = main

async function main (lat, lng, price) {
  const hotels = await hotelsService(lat, lng)
  const recommendations = await recommendation(hotels, price)
  return recommendations
}
