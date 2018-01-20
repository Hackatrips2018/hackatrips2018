import Vue from 'vue'
import Vuex from 'vuex'
// import axios from 'axios'

Vue.use(Vuex)

const POSSIBLE_STEPS = {
  form: 'form',
  poiSelection: 'poiSelection',
  hotelSelection: 'hotelSelection'
}

const state = {
  searchSettings: {
    locationName: null,
    peopleCount: null,
    price: null,
    categories: {}
  },
  loading: false,
  step: POSSIBLE_STEPS.form,
  availableCategories: null
}

const mutations = {
  UPDATE_SEARCH_SETTINGS (state, { locationName, peopleCount, price, categories }) {
    state.searchSettings.locationName = locationName
    state.searchSettings.peopleCount = peopleCount
    state.searchSettings.price = price
    state.searchSettings.categories = categories
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

  MOVE_TO_POI_SELECTION_STEP (state, { pois }) {
    state.step = POSSIBLE_STEPS.poiSelection
  },

  MOVE_TO_HOTEL_SELECTION_STEP (state) {
    state.step = POSSIBLE_STEPS.hotelSelection
  }
}

const actions = {
  UPDATE_DESIRED_LOCATION_NAME ({ commit }, locationName) {
    commit('UPDATE_SEARCH_SETTINGS', Object.assign({}, state.searchSettings, { locationName }))
  },

  UPDATE_DESIRED_PEOPLE_COUNT ({ commit }, peopleCount) {
    commit('UPDATE_SEARCH_SETTINGS', Object.assign({}, state.searchSettings, { peopleCount }))
  },

  UPDATE_DESIRED_PRICE ({ commit }, price) {
    commit('UPDATE_SEARCH_SETTINGS', Object.assign({}, state.searchSettings, { price }))
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

  async SEARCH_POIS ({ commit }) {
    commit('START_LOADING')

    this.$socket.emit('get_clusters', {
      lat: state.lat,
      lng: state.lng,
      city: state.searchSettings.locationName,
      categoriesIds: state.searchSettings.categories
    })

    setTimeout(() => {
      commit('MOVE_TO_POI_SELECTION_STEP', {pois: []})
      commit('STOP_LOADING')
    }, 2000)
  }
}

const getters = {
  // searchLocationName: state => state.searchSettings.searchLocationName,
  // searchPeopleCount: state => state.searchSettings.peopleCount,
  // characters: state => {
  //   return state.data.map(data => {
  //     return {
  //       name: data.name,
  //       url: data.urls[1] ? data.urls[1].url : data.urls[0].url,
  //       image: `${data.thumbnail.path}.${data.thumbnail.extension}`,
  //       description: data.description === '' ? 'No description listed for this character.' : data.description
  //     }
  //   })
  // }
}

const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})

export default store
export { POSSIBLE_STEPS }
