const r2 = require('r2')
const querystring = require('querystring')
module.exports = geolocate
async function geolocate (address) {
  const url ='http://apipcs1733gm-hackatripteam00-20djdbhx.srv.ravcloud.com:8001/GoogleGeoPosition'
  const params = querystring.stringify({
    address: address  + ' España'
  })
  const result = await r2(`${url}?${params}`).json
  return result.results[0].geometry.bounds
}
