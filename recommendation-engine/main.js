const hotelsService = require('./hotels')
const recommendation = require('./recomendation')
module.exports = main

async function main (lat, lng, price) {
  const hotels = hotelsService(lat, lng)
  const recommendations = recommendation(hotels, price)
  return recommendations
}
