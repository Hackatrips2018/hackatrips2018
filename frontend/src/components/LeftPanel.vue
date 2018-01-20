<template>
  <div id="left-panel">
    <SearchBar />
    <SearchResults />
  </div>
</template>

<script>
import SearchBar from '@/components/SearchBar'
import SearchResults from '@/components/SearchResults'
export default {
  name: 'hLeftPanel',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  components: {
    SearchBar,
    SearchResults
  },
  computed: {
  },
  methods: {
  }
}
</script>

<style>

#left-panel {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 999;

  background: #fff;
  padding: 5px;

  border-radius: 4px;
  box-shadow: 0px 2px 10px 1px rgba(0, 0, 0, .3);
}

.leaflet-control-zoom {
  display: none;
}

.leaflet-control-zoom-in {

}

.leaflet-control-zoom-out {

}

</style>
