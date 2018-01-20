// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueSocketio from 'vue-socket.io'
import App from './App'
import router from './router'
import store from './store'
import Vue2Leaflet from 'vue2-leaflet'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import '@fortawesome/fontawesome-free-solid'
import '@/assets/floating-labels.css'

Vue.use(VueSocketio, 'http://localhost:8888', store)

Vue.component('v-map', Vue2Leaflet.Map)
Vue.component('v-tilelayer', Vue2Leaflet.TileLayer)
Vue.component('v-marker', Vue2Leaflet.Marker)
Vue.component('fa-icon', FontAwesomeIcon)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  sockets: {
    connect: function () {
      store.dispatch('SET_SOCKET', this.$socket)
      console.log('Connected to Socket.io 😃')
    },
    categories: function ({ categories }) {
      store.dispatch('UPDATE_AVAILABLE_CATEGORIES', categories)
    },
    poi_clusters: function ({ clusters, pois }) {
      store.dispatch('MOVE_TO_POI_SELECTION_STEP', {pois: clusters})
      store.dispatch('STOP_LOADING')
    }
  },
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
