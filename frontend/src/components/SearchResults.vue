<template>
  <div id="search-results" v-if="isVisible">
    <div class="separator" />
    <div class="loading" v-if="isLoading">
      <fa-icon icon="spinner" fixed-width size="lg" spin />
    </div>
    <div class="results" v-if="!isLoading">
      <header class="results__header">
        <a class="results__header__back-button">
          <fa-icon icon="chevron-left" size="lg" />
          <span>Back</span>
        </a>
        <h2>Interesting places</h2>
      </header>
      <div class="interesting-places">

        <div
          v-for="place in interestingPlaces"
          :key="place.id"
          class="interesting-places__item"
          @mouseenter="highlightPlace($event, place)"
          @mouseleave="unhighlightPlace($event, place)"
        >
          <div class="thumbnail" style="background-image: url('http://via.placeholder.com/350x150');" />
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
      return this.$store.state.step !== POSSIBLE_STEPS.form || this.$store.state.loading
    },
    interestingPlaces () {
      return this.$store.state.poiClusters
    }
  },
  methods: {
    highlightPlace (event, place) {
      this.$store.dispatch('HIGHLIGHT_POI_CLUSTER', place)
    },
    unhighlightPlace (event, place) {
      this.$store.dispatch('UNHIGHLIGHT_POI_CLUSTER', place)
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
  margin-top: 10px;
  padding: 5px 0;
  display: flex;
  justify-content: center;
}

#search-results .results .results__header {
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

#search-results .results .results__header .results__header__back-button {
  margin-right: 10px;
  color: #007bff;
  cursor: pointer;
}

#search-results .results .results__header .results__header__back-button:hover {
  color: #0069d9;
}

#search-results .results .results__header h2 {
  margin-bottom: 0;
}

.interesting-places {
  margin-left: -5px;
  margin-right: -5px;
}

.interesting-places__item {
  padding: 10px;
  display: flex;
  flex-direction: row;
  /*border-radius: 4px;
  border: 1px solid transparent;*/
  border-left: 5px solid transparent;
  border-bottom: 1px dashed transparent;
  border-top: 1px dashed transparent;
  cursor: pointer;
}

/*.interesting-places__item:hover {
  background: #f8f9fa;
  border-color: #ced4da;
}*/

.interesting-places__item:hover {
  background: rgba(0, 123, 255, 0.1);
  border-left-color: #007bff;
  border-bottom-color: rgba(0, 123, 255, 0.3);
  border-top-color: #fff;
}

.interesting-places__item .thumbnail {
  margin: 0 10px 10px 0;
  width: 50px;
  height: 50px;
  background-color: #ced4da;
  background-size: cover;
  flex-grow: 0;
  flex-shrink: 0;
}

.interesting-places__item:last-child .thumbnail {
  margin-bottom: 0;
}

.interesting-places__item .data {
  flex-grow: 1;
  flex-shrink: 1;
}

</style>
