const affiliateId = 187173
const apiKey = '36C1BFD4-233C-48F7-935D-E8F78CB24697'
const endpoint = 'http://sandbox.hotelscombined.com/api/2.0'
const querystring = require('querystring')
const r2 = require('r2')
const ping = `${endpoint}/ping?${querystring.stringify({apiKey})}`

main()

async function main () {
  const result = await r2(ping).text
  console.log(result)
  const hotels = await search()
  console.log(hotels)
}


async function search () {
  const lat = 41.378737
  const lon = 2.1741
  const search = {
    destination: `latlon:${lat},${lon}`,
    // checkin: '2018-11-03',
    // checkout: '2018-11-13',
    rooms: 2,
    apiKey,
    sessionId: '1',
  }
  const url = `${endpoint}/hotels?${querystring.stringify(search)}`
  return r2(url).json

}
