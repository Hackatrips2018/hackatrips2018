const fs = require('fs-extra')
const kdbush = require('kdbush')
const geodist = require('geodist')
const N_PEOPLE = 9

main()
process.on('unhandledRejection', function (err) {
  console.error(err)
})
async function main (hotels) {
  const index = kdbush(hotels, p => p.latitude, p => p.longitude)
  const price = 200
  let bestValue = 0
  for (let i = 0; i < hotels.length; i++) {
    const hotel = hotels[i]
    const result = closest(index, hotel.latitude, hotel.longitude)
    const {ranking: value, hotels: triplet} = scoring(hotels, price, result, i)
    if (value > bestValue) {
      bestValue = value
      console.log(triplet.map(h => h.lowestRate))
      console.log(value)
    }
  }
}

function scoring (allHotels, objectivePrice, indices, index) {
  if (indices.length < 3) {
    return 0
  }

  const filtered = indices.filter(v => v !== index)
  const hotels = [allHotels[index], allHotels[filtered[0]], allHotels[filtered[1]]]
  const popularityRanking = 0.2 * 1 / 3 * (popularity(allHotels, index) + popularity(allHotels, filtered[0]) +
   popularity(allHotels, filtered[1]))
  const dRanking = 0.5 * distanceRanking(...hotels)
  const pRanking = 0.3 * objectivePriceRanking(objectivePrice, ...hotels)
  return {ranking: popularityRanking + dRanking + pRanking, hotels}
}

function closest (index, lat, lng) {
  let expectedResults = 3
  let distance = 0.1
  let previousDistance = 0.2
  let iteration = 0
  while (true) {
    const results = index.within(lat, lng, distance)
    if (iteration++ > 200) {
      console.error('200 iterations')
    }
    if (results.length === expectedResults) {
      return results
    } else if (results.length < expectedResults) {
      if (previousDistance > distance) {
        ;[distance, previousDistance] = [(distance + previousDistance) / 2, distance]
      } else {
        ;[distance, previousDistance] = [distance * 2, distance]
      }
    } else {
      if (previousDistance < distance) {
        ;[distance, previousDistance] = [(distance + previousDistance) / 2, distance]
      } else {
        ;[distance, previousDistance] = [distance / 2, distance]
      }
    }
    if (results.length >= expectedResults && Math.abs(previousDistance - distance) < 0.00001) {
      return results
    }
  }
}


function popularity (allHotels, index) {
  return 1 - (index - index % 10) / (allHotels.length - allHotels.length % 10)
}

function distanceRanking (hotel1, hotel2, hotel3) {
  const index = distanceIndex(hotel1, hotel2) + distanceIndex(hotel2, hotel3) + distanceIndex(hotel1, hotel3)
  return index / 3
}

function objectivePriceRanking (objectivePrice, hotel1, hotel2, hotel3) {
  const price = (hotel1.lowestRate + hotel2.lowestRate + hotel3.lowestRate) / N_PEOPLE
  if (price < objectivePrice) {
    return 1
  }
  return (1.15 - Math.min(price / objectivePrice, 1.15)) / 0.15

}
function distanceIndex (hotel1, hotel2) {
  const distance = geodist({lat: hotel1.latitude, lon: hotel1.longitude}, {lat: hotel2.latitude, lon: hotel2.longitude}, {unit: 'meters'})
  return 1 - Math.min(distance, 1000) / 1000
}
