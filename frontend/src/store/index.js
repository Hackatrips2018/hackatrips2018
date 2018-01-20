import Vue from 'vue'
import Vuex from 'vuex'
// import axios from 'axios'

Vue.use(Vuex)

const state = {
  searchSettings: {
    locationName: null,
    peopleCount: null,
    price: null,
    categories: {}
  },
  availableCategories: [
    {
      id: 0,
      name: 'Gastronomia',
      icon: 'utensils'
    },
    {
      id: 1,
      name: 'Turistico',
      icon: 'camera-retro'
    },
    {
      id: 2,
      name: 'Compras',
      icon: 'shopping-cart'
    },
    {
      id: 3,
      name: 'Naturaleza',
      icon: 'leaf'
    },
    {
      id: 4,
      name: 'Playa',
      icon: 'ship'
    },
    {
      id: 5,
      name: 'Fiesta',
      icon: 'users'
    },
    {
      id: 6,
      name: 'Entretenimiento',
      icon: 'gamepad'
    },
    {
      id: 7,
      name: 'Deportes',
      icon: 'bicycle'
    },
    {
      id: 8,
      name: 'Relax',
      icon: 'coffee'
    }
  ],
  data: []
}

const mutations = {

  UPDATE_SEARCH_SETTINGS (state, { locationName, peopleCount, price, category }) {
    state.searchSettings.locationName = locationName
    state.searchSettings.peopleCount = peopleCount
    state.searchSettings.price = price
    state.searchSettings.category = category
  },

  RECEIVE_CHARACTERS (state, { characters, charactersSearchTerm }) {
    state.data = characters
    state.charactersSearchTerm = charactersSearchTerm
  }
}

const actions = {

  UPDATE_DESIRED_LOCATION_NAME ({ commit }, locationName) {
    commit('UPDATE_SEARCH_SETTINGS', Object.assign({}, state.searchSettings, { locationName }))
  },

  UPDATE_DESIRED_PEOPLE_COUNT ({ commit }, peopleCount) {
    commit('UPDATE_SEARCH_SETTINGS', Object.assign({}, state.searchSettings, { peopleCount }))
  },

  UPDATE_PRICE ({ commit }, price) {
    commit('UPDATE_SEARCH_SETTINGS', Object.assign({}, state.searchSettings, { price }))
  },

  TOGGLE_DESIRED_CATEGORY ({ commit }, categoryIDString) {
    const categoryID = parseInt(categoryIDString)
    const categories = {}
    if (state.searchSettings.categories[categoryID]) {
      categories[categoryID] = null
    } else {
      categories[categoryID] = state.availableCategories.filter(cat => cat.id === categoryID)[0]
    }
    commit('UPDATE_SEARCH_SETTINGS', Object.assign({}, state.searchSettings, { categories }))
  },

  async SEARCH_POIS ({ commit }, location) {
    // console.log()
  },

  async FETCH_CHARACTERS ({ commit }, name) {
    // const url = `https://gateway.marvel.com:443/v1/public/characters?limit=12&nameStartsWith=${name}&apikey=${config.apiKey}`
    // const { data } = await axios.get(url)
    // commit('RECEIVE_CHARACTERS', {
    //   characters: data.data.results,
    //   charactersSearchTerm: name
    // })
  }
}

const getters = {
  searchLocationName: state => state.searchSettings.searchLocationName,
  searchPeopleCount: state => state.searchSettings.peopleCount,
  characters: state => {
    return state.data.map(data => {
      return {
        name: data.name,
        url: data.urls[1] ? data.urls[1].url : data.urls[0].url,
        image: `${data.thumbnail.path}.${data.thumbnail.extension}`,
        description: data.description === '' ? 'No description listed for this character.' : data.description
      }
    })
  }
}

const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})

export default store
