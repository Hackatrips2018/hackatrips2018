<template>
  <div id="map">
    <LeftPanel />
    <v-map :zoom="zoom" :center="center">
      <v-tilelayer :url="url" :attribution="attribution"></v-tilelayer>
      <v-icondefault image-path="https://unpkg.com/leaflet@1.3.1/dist/images/"></v-icondefault>
      <v-circle
        v-if="showPoiClusters && highlightedPoiCluster"
        :lat-lng="highlightedPoiCluster.coordinates"
        :radius="highlightedPoiCluster.poiCluster.radius"
      />
      <v-marker
        v-if="showPoiClusters"
        v-for="marker in poiClusters"
        :key="marker.id"
        :lat-lng="marker.coordinates"
        :icon="clusterIcon"
        v-on:l-mouseover="highlightPoiCluster($event, marker.poiCluster)"
        v-on:l-mouseleave="unhighlightPoiCluster($event, marker.poiCluster)"
      />
      <v-marker
        v-if="showPoiClusters"
        v-for="marker in poisInHighlightedCluster"
        :key="marker.id"
        :lat-lng="marker.coordinates"
        :icon="highlightedClusterPoisIcon"
      >
        <v-popup :content="getPlaceMarkerContent(marker)"></v-popup>
      </v-marker>
      <v-geojson-layer
        v-if="showHotelCombinations && highlightedHotelCombination"
        :geojson="highlightedHotelCombination.geojson"
        :options="highlightedHotelCombinationOptions"
      />
      <v-marker
        v-if="showHotelCombinations && highlightedHotelCombination"
        v-for="hotel in highlightedHotels"
        :key="hotel.id"
        :lat-lng="getHotelLatLng(hotel)"
        :icon="hotelIcon"
      >
        <v-popup :content="getHotelMarkerContent(hotel)"></v-popup>
      </v-marker>
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
      url: 'https://api.mapbox.com/styles/v1/mapbox/streets-v8/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic3Vtb2xhcmkiLCJhIjoiY2pjbmdpZDdlMHNwODJxcGc1azVlZ3ZnNiJ9.TXbnXB1ubggQ6Qy-jBvyDA',
      attribution: 'Imagery © <a href="http://mapbox.com">Mapbox</a>',
      // url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      // attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      marker: [40.415363, -3.707398]
    }
  },
  computed: {
    center () {
      return [this.$store.state.lat, this.$store.state.lng]
    },
    showPoiClusters () {
      return this.$store.state.step === POSSIBLE_STEPS.poiSelection
    },
    showHotelCombinations () {
      return this.$store.state.step === POSSIBLE_STEPS.hotelSelection
    },
    poiClusters () {
      if (this.$store.state.highlightedPoiCluster) {
        return this.$store.state.poiClusters.map(cluster => {
          return {
            coordinates: L.latLng(...cluster.centroid),
            poiCluster: cluster
          }
        })
      } else if (this.$store.state.poiClusters) {
        return this.$store.state.poiClusters.map(cluster => {
          return {
            coordinates: L.latLng(...cluster.centroid),
            poiCluster: cluster
          }
        })
      } else {
        return []
      }
    },
    highlightedPoiCluster () {
      if (this.$store.state.highlightedPoiCluster) {
        return {
          coordinates: L.latLng(...this.$store.state.highlightedPoiCluster.centroid),
          poiCluster: this.$store.state.highlightedPoiCluster
        }
      } else {
        return null
      }
    },
    poisInHighlightedCluster () {
      return this.$store.state.highlightedPoiCluster
        ? this.$store.state.highlightedPoiCluster.elements.map(poi => {
          return {
            poi: poi,
            coordinates: L.latLng(poi.latitude, poi.longitude)
          }
        })
        : []
    },
    clusterIcon () {
      return L.icon({
        iconUrl: require('../assets/marker-circle-icon-2x.png'),
        iconSize: [25, 25],
        iconAnchor: [12.5, 12.5]
      })
    },
    highlightedClusterPoisIcon () {
      return L.icon({
        iconUrl: require('../assets/marker-icon-2x.png'),
        iconSize: [25, 41],
        iconAnchor: [12.5, 20]
      })
    },
    hotelIcon () {
      return L.icon({
        iconUrl: require('../assets/marker-hotel-icon-2x.png'),
        iconSize: [25, 25],
        iconAnchor: [12.5, 12.5]
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
    highlightedHotelCombination () {
      return this.$store.state.highlightedHotelCombination
    },
    highlightedHotels () {
      if (this.$store.state.highlightedHotelCombination) {
        return this.$store.state.highlightedHotelCombination.hotels
      } else {
        return []
      }
    },
    highlightedHotelCombinationOptions () {
      return {
        style: function () {
          return {
            weight: 2,
            color: '#007bff',
            opacity: 1,
            fillColor: '#007bff',
            fillOpacity: 0.3
          }
        }
      }
    },
    poisNearHighlightedHotelCombination () {
      return this.hotelCombinations.map(hCombination => {
        return []
      })
    }
  },
  methods: {
    highlightPoiCluster (event, poiCluster) {
      this.$store.dispatch('HIGHLIGHT_POI_CLUSTER', poiCluster)
    },
    unhighlightPoiCluster (event, poiCluster) {
      this.$store.dispatch('UNHIGHLIGHT_POI_CLUSTER', poiCluster)
    },
    getHotelLatLng (hotel) {
      return L.latLng(hotel.latitude, hotel.longitude)
    },
    getPlaceMarkerContent (marker) {
      return `
        <div class="place-marker-popup-content">
          <div class="place-marker-popup-content__thumbnail" style="background: url(${marker.poi.picture_url})"></div>
          <strong class="place-marker-popup-content__title">${marker.poi.name}</strong>
        </div>
      `
    },
    getHotelMarkerContent (hotel) {
      let htmlForStars = ``
      for (let i = 0; i < hotel.starRating; i++) {
        htmlForStars += `<svg aria-hidden="true" data-fa-processed="" data-prefix="fas" data-icon="star" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="star svg-inline--fa fa-star fa-w-18 fa-fw fa-sm"><path fill="currentColor" d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z" class=""></path></svg>`
      }

      return `
        <div class="place-hotel-popup-content">
          <strong class="place-hotel-popup-content__title">${hotel.name}</strong>
          <br />
          ${htmlForStars} <em class="place-hotel-popup-content__title">${hotel.lowestRate} €</em>
        </div>
      `
    }
  }
}
</script>

<style>

#map {
  width: 100vw;
  height: 100vh;
}

.place-marker-popup-content {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.place-marker-popup-content__thumbnail {
  width: 50px;
  height: 50px;
  background-size: cover;
  display: block;
}

.place-marker-popup-content__title {
  margin-left: 10px;
}

</style>
