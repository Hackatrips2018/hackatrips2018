const affiliateId = 187173
const apiKey = '36C1BFD4-233C-48F7-935D-E8F78CB24697'
const endpoint = 'http://sandbox.hotelscombined.com/api/2.0'
const querystring = require('querystring')
const r2 = require('r2')
const ping = `${endpoint}/ping?${querystring.stringify({apiKey})}`
module.exports = main
main()

async function main () {
  const result = await r2(ping).text
  console.log(result)
  // const hotels = await search()
  // console.log(hotels)
  // const hotel = await getHotel(hotels.results[0].key)
  // const basic = await basicSearch()
  // console.log(basic)
  const allHotels = await getAllHotels()
  console.log(allHotels.length)
  return {allHotels}
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
async function getAllHotels () {
  const results = []
  let pageIndex = 1
  while (true) {
    const {results: hotels} = await search(pageIndex)
    if (hotels.length === 0) break
    pageIndex++
    results.push(...hotels)
  }
  return results
}
async function search (pageIndex) {
  const lat = 41.378737
  const lon = 2.1741
  const search = {
    destination: `latlon:${lat},${lon}`,
    checkin: '2018-11-03',
    checkout: '2018-11-13',
    rooms: '2',
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
