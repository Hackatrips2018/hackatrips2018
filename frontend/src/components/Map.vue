<template>
  <div id="map">
    <LeftPanel />
    <v-map :zoom="zoom" :center="center">
      <v-tilelayer :url="url" :attribution="attribution"></v-tilelayer>
      <v-marker :lat-lng="marker"></v-marker>
    </v-map>
  </div>
</template>

<script>
import 'leaflet/dist/leaflet.css'
import LeftPanel from '@/components/LeftPanel'

export default {
  name: 'hMap',
  components: { LeftPanel },
  data () {
    return {
      zoom: 13,
      center: [47.413220, -1.219482],
      url: 'https://api.mapbox.com/styles/v1/mapbox/streets-v8/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic3Vtb2xhcmkiLCJhIjoiY2pjbmdpZDdlMHNwODJxcGc1azVlZ3ZnNiJ9.TXbnXB1ubggQ6Qy-jBvyDA',
      attribution: 'Imagery © <a href="http://mapbox.com">Mapbox</a>',
      // url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      // attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      marker: [47.413220, -1.219482]
    }
  }
}
</script>

<style>
#map {
  width: 100vw;
  height: 100vh;
}
</style>
