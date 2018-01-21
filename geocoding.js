const r2 = require('r2')
const querystring = require('querystring')
module.exports = geolocate
async function geolocate (address) {
  const url = 'http://apipcs1733gm-hackatripteam00-20djdbhx.srv.ravcloud.com:8001/GoogleGeoPosition'
  const params = querystring.stringify({
    address: address + ' España'
  })
  const result = await r2(`${url}?${params}`).json

  var latlng
  var bbox
  // due error with geocoding api
  if (result.status === 'OVER_QUERY_LIMIT' || !result.results.length) {
    if (address.toLowerCase().indexOf('barcelona') !== -1) {
      latlng = {lat: 41.390205, lng: 2.154007}
    } else {
      // madrid
      latlng = {lat: 40.415363, lng: -3.707398}
    }
  } else {
    const geometry = result.results[0].geometry
    bbox = geometry.bounds
    latlng = geometry.location
  }

  return { latlng, bbox }
}
