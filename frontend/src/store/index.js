import Vue from 'vue'
import Vuex from 'vuex'
// import axios from 'axios'

const _ = require('lodash')

Vue.use(Vuex)

const POSSIBLE_STEPS = {
  form: 'form',
  poiSelection: 'poiSelection',
  hotelSelection: 'hotelSelection'
}

const state = {
  lat: 40.415363,
  lng: -3.707398,
  searchSettings: {
    locationName: null,
    peopleCount: null,
    price: null,
    startDate: new Date(),
    endDate: new Date(),
    categories: {}
  },
  loading: false,
  step: POSSIBLE_STEPS.form,
  poiClusters: null, // Potential locations and a list of POIs near them
  selectedPoiCluster: null, // The potential location user clicked on
  highlightedPoiCluster: null, // The potential location user highlighted but not clicked yet
  hotelCombinations: null, // Potential hotel combinations
  highlightedHotelCombination: null, // Potential hotel combination user highlighted
  availableCategories: null
}

const mutations = {
  UPDATE_SEARCH_SETTINGS (state, { locationName, peopleCount, price, categories, startDate, endDate }) {
    state.searchSettings.locationName = locationName
    state.searchSettings.peopleCount = peopleCount
    state.searchSettings.price = price
    state.searchSettings.categories = categories
    state.searchSettings.startDate = startDate
    state.searchSettings.endDate = endDate
  },

  UPDATE_AVAILABLE_CATEGORIES (state, { availableCategories }) {
    state.availableCategories = availableCategories
  },

  START_LOADING (state) {
    state.loading = true
  },

  STOP_LOADING (state) {
    state.loading = false
  },

  MOVE_TO_FORM_STEP (state) {
    state.step = POSSIBLE_STEPS.form
  },

  MOVE_TO_POI_SELECTION_STEP (state, { poiClusters }) {
    state.step = POSSIBLE_STEPS.poiSelection
    state.poiClusters = poiClusters
    state.hotelCombinations = null
  },

  MOVE_TO_HOTEL_SELECTION_STEP (state, { hotelCombination }) {
    state.step = POSSIBLE_STEPS.hotelSelection
    state.hotelCombinations = [hotelCombination]
  },

  SET_HIGHLIGHTED_POI_CLUSTER (state, { poiCluster }) {
    state.highlightedPoiCluster = poiCluster
  },

  REMOVE_HIGHLIGHTED_POI_CLUSTER (state) {
    state.highlightedPoiCluster = null
  },

  SET_SELECTED_POI_CLUSTER (state, { poiCluster }) {
    state.selectedPoiCluster = poiCluster
  },

  REMOVE_SELECTED_POI_CLUSTER (state) {
    state.selectedPoiCluster = null
  },

  SET_HIGHLIGHTED_HOTEL_COMBINATION (state, { hotelCombination }) {
    state.highlightedHotelCombination = hotelCombination
  },

  REMOVE_HIGHLIGHTED_HOTEL_COMBINATION (state) {
    state.highlightedHotelCombination = null
  },

  ADD_HOTEL_COMBINATION (state, { hotelCombination }) {
    state.hotelCombinations.push(hotelCombination)
  },

  SET_MAP_CENTER (state, {lat, lng}) {
    state.lat = lat
    state.lng = lng
  }

}

const actions = {
  SET_SOCKET ({ commit }, socket) {
    store.socket = socket
  },

  UPDATE_DESIRED_LOCATION_NAME ({ commit }, locationName) {
    commit('UPDATE_SEARCH_SETTINGS', Object.assign({}, state.searchSettings, { locationName }))
  },

  UPDATE_DESIRED_PEOPLE_COUNT ({ commit }, peopleCount) {
    commit('UPDATE_SEARCH_SETTINGS', Object.assign({}, state.searchSettings, { peopleCount }))
  },

  UPDATE_DESIRED_PRICE ({ commit }, price) {
    commit('UPDATE_SEARCH_SETTINGS', Object.assign({}, state.searchSettings, { price }))
  },

  UPDATE_DESIRED_START_DATE ({ commit }, startDate) {
    commit('UPDATE_SEARCH_SETTINGS', Object.assign({}, state.searchSettings, { startDate }))
  },

  UPDATE_DESIRED_END_DATE ({ commit }, endDate) {
    commit('UPDATE_SEARCH_SETTINGS', Object.assign({}, state.searchSettings, { endDate }))
  },

  TOGGLE_DESIRED_CATEGORY ({ commit }, categoryIDString) {
    const newSettings = Object.assign({}, state.searchSettings)
    const categoryID = parseInt(categoryIDString)
    newSettings.categories[categoryID] = newSettings.categories[categoryID]
      ? null
      : state.availableCategories.filter(cat => cat.id === categoryID)[0]
    commit('UPDATE_SEARCH_SETTINGS', newSettings)
  },

  UPDATE_AVAILABLE_CATEGORIES ({ commit }, availableCategories) {
    commit('UPDATE_AVAILABLE_CATEGORIES', { availableCategories })
  },

  SEARCH_POIS ({ commit }) {
    commit('START_LOADING')

    const categoriesIds = _.flatten(_.map(state.searchSettings.categories, cat => {
      return _.map(cat.ids, 'id')
    }))

    store.socket.emit('get_clusters', {
      lat: state.lat,
      lng: state.lng,
      city: state.searchSettings.locationName,
      categoriesIds
    })
  },

  SET_MAP_VIEW ({ commit }, {latlng, bbox}) {
    commit('SET_MAP_CENTER', latlng)
  },

  PROCESS_FETCHED_POIS ({ commit }, poiClusters) {
    commit('MOVE_TO_POI_SELECTION_STEP', { poiClusters })
    commit('STOP_LOADING')
  },

  HIGHLIGHT_POI_CLUSTER ({ commit }, poiCluster) {
    commit('SET_HIGHLIGHTED_POI_CLUSTER', { poiCluster })
  },

  UNHIGHLIGHT_POI_CLUSTER ({ commit }, poiCluster) {
    if (store.highlightedPoiCluster === poiCluster) {
      commit('REMOVE_HIGHLIGHTED_POI_CLUSTER')
    }
  },

  SELECT_POI_CLUSTER ({ commit }, poiCluster) {
    commit('SET_SELECTED_POI_CLUSTER', { poiCluster })
    commit('START_LOADING')

    store.socket.emit('get_hotels', {
      lat: state.lat,
      lng: state.lng,
      price: state.searchSettings.price
    })
  },

  PROCESS_FETCHED_HOTEL ({ commit }, hotelCombination) {
    if (state.step !== POSSIBLE_STEPS.hotelSelection) {
      commit('MOVE_TO_HOTEL_SELECTION_STEP', { hotelCombination })
    } else {
      commit('ADD_HOTEL_COMBINATION', { hotelCombination })
    }
  },

  PROCESS_FINISHED_FETCHING_HOTELS ({ commit }) {
    commit('STOP_LOADING')
  },

  UNSELECT_POI_CLUSTER ({ commit }, poiCluster) {
    commit('REMOVE_SELECTED_POI_CLUSTER')
    commit('MOVE_TO_POI_SELECTION_STEP', { poiClusters: state.poiClusters })
  },

  HIGHLIGHT_HOTEL_COMBINATION ({ commit }, hotelCombination) {
    commit('SET_HIGHLIGHTED_HOTEL_COMBINATION', { hotelCombination })
  },

  UNHIGHLIGHT_HOTEL_COMBINATION ({ commit }, hotelCombination) {
    if (store.highlightedHotelCombination === hotelCombination) {
      commit('REMOVE_HIGHLIGHTED_HOTEL_COMBINATION')
    }
  }
}

const getters = { }

const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})

export default store
export { POSSIBLE_STEPS }
