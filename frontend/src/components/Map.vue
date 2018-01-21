<template>
  <div id="map">
    <LeftPanel />
    <v-map :zoom="zoom" :center="center">
      <v-tilelayer :url="url" :attribution="attribution"></v-tilelayer>
      <v-icondefault image-path="https://unpkg.com/leaflet@1.3.1/dist/images/"></v-icondefault>
      <v-circle
        v-if="showPoiClusters && highlightedPoiCluster"
        :key="highlightedPoiCluster.id"
        :lat-lng="highlightedPoiCluster.coordinates"
        :radius="highlightedPoiCluster.radius"
      />
      <v-marker
        v-if="showPoiClusters"
        v-for="marker in poiClusters"
        :key="marker.id"
        :lat-lng="marker.coordinates"
        :icon="clusterIcon"
      />
      <v-marker
        v-if="showPoiClusters"
        v-for="marker in poisInHighlightedCluster"
        :key="marker.id"
        :lat-lng="marker.coordinates"
        :icon="highlightedClusterPoisIcon"
      />
      <!-- <v-marker
        v-if="showHotelCombinations"
        v-for="marker in hotelCombinations"
        :lat-lng="marker.coordinates"
        :icon="hotelIcon"
      /> -->
    </v-map>
  </div>
</template>

<script>
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import LeftPanel from '@/components/LeftPanel'
import { POSSIBLE_STEPS } from '../store'

export default {
  name: 'hMap',
  components: { LeftPanel },
  data () {
    return {
      zoom: 13,
      center: [40.415363, -3.707398],
      url: 'https://api.mapbox.com/styles/v1/mapbox/streets-v8/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic3Vtb2xhcmkiLCJhIjoiY2pjbmdpZDdlMHNwODJxcGc1azVlZ3ZnNiJ9.TXbnXB1ubggQ6Qy-jBvyDA',
      attribution: 'Imagery © <a href="http://mapbox.com">Mapbox</a>',
      // url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      // attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      marker: [40.415363, -3.707398]
    }
  },
  computed: {
    showPoiClusters () {
      return this.$store.state.step === POSSIBLE_STEPS.poiSelection
    },
    showHotelCombinations () {
      return this.$store.state.step === POSSIBLE_STEPS.hotelSelection
    },
    poiClusters () {
      if (this.$store.state.highlightedPoiCluster) {
        return this.$store.state.poiClusters.map(cluster => {
          return { coordinates: L.latLng(...cluster.centroid) }
        })
      } else if (this.$store.state.poiClusters) {
        return this.$store.state.poiClusters.map(cluster => {
          return { coordinates: L.latLng(...cluster.centroid) }
        })
      } else {
        return []
      }
    },
    highlightedPoiCluster () {
      if (this.$store.state.highlightedPoiCluster) {
        return {
          coordinates: L.latLng(...this.$store.state.highlightedPoiCluster.centroid)
        }
      } else {
        return null
      }
    },
    poisInHighlightedCluster () {
      return this.$store.state.highlightedPoiCluster
        ? this.$store.state.highlightedPoiCluster.elements.map(poi => {
          return { coordinates: L.latLng(...poi) }
        })
        : []
    },
    clusterIcon () {
      return L.icon({
        iconUrl: require('../assets/marker-icon-2x.png'),
        iconSize: [25, 41],
        iconAnchor: [20, 20]
      })
    },
    highlightedClusterPoisIcon () {
      return L.icon({
        iconUrl: require('../assets/marker-circle-icon-2x.png'),
        iconSize: [25, 25],
        iconAnchor: [20, 20]
      })
    },
    hotelIcon () {
      return L.icon({
        iconUrl: require('../assets/marker-icon-2x.png'),
        iconSize: [25, 41],
        iconAnchor: [20, 20]
      })
    },
    hotelCombinations () {
      if (this.$store.state.hotelCombinations) {
        console.log(this.$store.state.hotelCombinations)
        return this.$store.state.hotelCombinations.map(hCombination => {
          return {
            coordinates: L.latLng(hCombination.latitude, hCombination.longitude)
          }
        })
      } else {
        return []
      }
    },
    poisNearHighlightedHotelCombination () {
      return this.hotelCombinations.map(hCombination => {
        return []
      })
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
