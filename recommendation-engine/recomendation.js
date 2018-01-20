const fs = require('fs-extra')
const kdbush = require('kdbush')
const geodist = require('geodist')
main()

async function main () {
  const hotels = await fs.readJson('./example-all')
  console.log(hotels[0])
  const index = kdbush(hotels, p => p.latitude, p => p.longitude)
  const result = closest(index, hotels[0].latitude, hotels[0].longitude)
  console.log(result)

}

function closest (index, lat, lng) {
  let expectedResults = 3
  let distance = 0.1
  let previousDistance = 0.2
  let iteration = 0
  while (true) {
    const results = index.within(lat, lng, distance)
    console.log(results.length, iteration++, results)
    if (results.length === expectedResults) {
      return expectedResults
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
    if (results.length >= expectedResults && Math.abs(previousDistance - distance) < 0.000001) {
      return results
    }
  }
}
