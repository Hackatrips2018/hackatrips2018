const affiliateId = 187173
const apiKey = '36C1BFD4-233C-48F7-935D-E8F78CB24697'
const endpoint = 'http://sandbox.hotelscombined.com/api/2.0'
const querystring = require('querystring')
const r2 = require('r2')
const fs = require('fs-extra')
const async = require('async')
const ping = `${endpoint}/ping?${querystring.stringify({apiKey})}`
module.exports = main


async function main (lat, lng) {
  const result = await r2(ping).text
  // const hotels = await search()
  // const hotel = await getHotel(hotels.results[0].key)
  // console.log(hotel)
  // const basic = await basicSearch()
  // console.log(basic)
  const allHotels = await getAllHotels(lat, lng)
  console.log(allHotels.length)
  // fs.writeJson('./example-all', allHotels)
  return allHotels
}
// no distance
async function basicSearch () {
  const lat = 41.378737
  const lon = 2.1741
  const search = {
    destination: `latlon:${lat},${lon}`,
    checkin: '2018-11-03',
    checkout: '2018-11-13',
    rooms: ['2'],
    apiKey,
    pageIndex: 0,
    sessionId: '1',
  }
  const url = `${endpoint}/hotels/basic?${querystring.stringify(search)}`
  return r2(url).json
}
async function getAllHotels (lat, lng) {
  const results = []
  let pageIndex = 0
  let isFinished = false
  function * a () {
    while (!isFinished) {
      yield 1
    }
  }
  await new Promise(function (resolve, reject) {
    async.forEachLimit(a(), 20, function (item, callback) {
      pageIndex++
      search(lat, lng, pageIndex)
        .then(function ({results: hotels}){

          if (hotels.length === 0) {
            isFinished = true
          } else {
            results.push(...hotels)
          }
          callback()
        })
    }, function () {
      resolve()
    })
  })
  return results
}
async function search (lat, lng, pageIndex = 0) {
  const search = {
    destination: `latlon:${lat},${lng}`,
    checkin: '2018-08-03',
    checkout: '2018-08-13',
    rooms: '3',
    apiKey,
    pageIndex: pageIndex,
    sessionId: '1',
  }
  const url = `${endpoint}/hotels?${querystring.stringify(search)}`
  return r2(url).json
}

async function getHotel (key) {
  const lat = 41.378737
  const lon = 2.1741
  const search = {
    hotel: key,
    checkin: '2018-11-03',
    checkout: '2018-11-13',
    rooms: 2,
    apiKey,
    pageIndex: 0,
    sessionId: '1',
  }
  const url = `${endpoint}/hotel?${querystring.stringify(search)}`
  return r2(url).text
}
