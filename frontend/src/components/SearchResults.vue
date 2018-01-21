<template>
  <div id="search-results" v-if="isVisible">
    <div class="separator" />

    <div class="multi-column-container" :class="{'multi-column-container--showing-second-column': showHotelCombinations}">
      <div class="results interesting-places-container">

        <header class="results__header">
          <h2>Interesting places</h2>
        </header>

        <div class="loading" v-if="isLoading">
          <fa-icon icon="spinner" fixed-width size="lg" spin />
        </div>

        <div class="results__list" v-else-if="!showHotelCombinations">

          <div
            v-for="(place, index) in interestingPlaces"
            :key="place.id"
            class="results__list__item"
            @click="selectPlace($event, place)"
            @mouseenter="highlightPlace($event, place)"
            @mouseleave="unhighlightPlace($event, place)"
          >
            <div class="thumbnail" :style="{'background-image': 'url(' + require(`../assets/street-view-${Math.min(index, 4)}.jpg`) + ')'}" />
            <div class="data">
              <!-- <h3>{{ place.name }}</h3> -->
              <p v-if="place.elements.length > 1">
                {{ place.elements.length }} points of interest, including <strong>{{ place.elements[0][0] }}</strong> and <strong>{{ place.elements[1][0] }}</strong>
              </p>
              <p v-else-if="place.elements.length === 1"><strong>{{ place.elements[0][0] }}</strong> is near this location.</p>
              <p v-else>No points of interest in this location.</p>
            </div>
          </div>

        </div>
      </div>

      <div class="results hotel-combinations-container">

        <header class="results__header">
          <a class="results__header__back-button" @click="unselectPlace()">
            <fa-icon icon="chevron-left" size="lg" />
            <span>Back</span>
          </a>
          <h2>Hotel combinations</h2>
        </header>

        <div class="results__list">

          <div
            v-for="hCombination in hotelCombinations"
            :key="hCombination.key"
            class="results__list__item"
            @mouseenter="highlightHotelCombination($event, hCombination)"
            @mouseleave="unhighlightHotelCombination($event, hCombination)"
          >
            <div class="thumbnail" style="background-image: url('http://via.placeholder.com/350x150');" />
            <div class="data">
              <!-- <h3>{{ place.name }}</h3> -->
              <p v-if="hCombination.hotels.length > 1">
                Splitted in {{ hCombination.hotels.length }} hotels: <span v-for="(hotel, index) in hCombination.hotels" :key="hotel.id"><a :href="hotel.href" target="_blank"><strong>{{ hotel.name }}</strong></a><span v-if="index === hCombination.hotels.length - 2"> and </span><span v-else-if="index !== hCombination.hotels.length - 1">, </span></span>.
              </p>
              <p v-else-if="hCombination.hotels.length === 1">Everybody in the same hotel: <strong>{{ hCombination.hotels[0].name }}</strong>.</p>
              <p v-else>No hotels in this combination.</p>
            </div>
          </div>

        </div>

        <div class="loading" v-if="isLoading">
          <fa-icon icon="spinner" fixed-width size="lg" spin />
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import { POSSIBLE_STEPS } from '../store'
export default {
  name: 'hSearchResults',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  computed: {
    isLoading () {
      return this.$store.state.loading
    },
    isVisible () {
      return this.$store.state.step !== POSSIBLE_STEPS.form || this.isLoading
    },
    interestingPlaces () {
      return this.$store.state.poiClusters
    },
    showHotelCombinations () {
      return this.$store.state.step === POSSIBLE_STEPS.hotelSelection || (
        this.$store.state.selectedPoiCluster && this.isLoading
      )
    },
    hotelCombinations () {
      return this.$store.state.hotelCombinations
    }
  },
  methods: {
    highlightPlace (event, place) {
      this.$store.dispatch('HIGHLIGHT_POI_CLUSTER', place)
    },
    unhighlightPlace (event, place) {
      this.$store.dispatch('UNHIGHLIGHT_POI_CLUSTER', place)
    },
    selectPlace (event, place) {
      this.$store.dispatch('SELECT_POI_CLUSTER', place)
    },
    unselectPlace () {
      this.$store.dispatch('UNSELECT_POI_CLUSTER')
    },
    highlightHotelCombination (event, hCombination) {
      this.$store.dispatch('HIGHLIGHT_HOTEL_COMBINATION', hCombination)
    },
    unhighlightHotelCombination (event, hCombination) {
      this.$store.dispatch('UNHIGHLIGHT_HOTEL_COMBINATION', hCombination)
    }
  }
}
</script>

<style>

#search-results {

}

#search-results .separator {
  width: 100%;
  height: 0;
  border-top: 1px dashed #ced4da;
}

#search-results .loading {
  width: 100%;
  margin: 10px 0;
  padding: 5px 0;
  display: flex;
  justify-content: center;
}

.multi-column-container {
  display: flex;
  flex-direction: row;
  width: 1035px;
  justify-content: space-between;
  transition: transform 600ms cubic-bezier(0.190, 1.000, 0.220, 1.000);
}

.multi-column-container--showing-second-column {
  transform: translateX(-525px)
}

.multi-column-container--showing-second-column > *:not(:last-child) {
  margin-right: 15px;
}

.results  {
  width: 510px;
}

.results .results__header {
  position: sticky;
  position: -webkit-sticky;
  background: #fff;
  top: -5px;
  margin: 0 -5px 0 -5px;
  padding: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.results .results__header .results__header__back-button {
  margin-right: 10px;
  color: #007bff;
  cursor: pointer;
}

.results .results__header .results__header__back-button:hover {
  color: #0069d9;
}

.results .results__header h2 {
  margin-bottom: 0;
}

.results__list {
  margin-left: -5px;
  margin-right: -5px;
}

.results__list__item {
  padding: 10px;
  display: flex;
  flex-direction: row;
  border-left: 5px solid transparent;
  border-bottom: 1px dashed transparent;
  border-top: 1px dashed transparent;
  cursor: pointer;
}

.results__list__item:hover {
  background: rgba(0, 123, 255, 0.1);
  border-left-color: #007bff;
  border-bottom-color: rgba(0, 123, 255, 0.3);
  border-top-color: #fff;
}

.results__list__item .thumbnail {
  margin: 0 10px 10px 0;
  width: 50px;
  height: 50px;
  background-color: #ced4da;
  background-size: cover;
  flex-grow: 0;
  flex-shrink: 0;
}

.results__list__item:last-child .thumbnail {
  margin-bottom: 0;
}

.results__list__item .data {
  flex-grow: 1;
  flex-shrink: 1;
}

</style>
