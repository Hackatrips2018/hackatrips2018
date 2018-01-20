<template>
  <div id="search-results" v-if="isVisible">
    RESULTS
    <div class="loading" v-if="isLoading">
      Loading...
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
    }
  },
  methods: {
  }
}
</script>

<style>

#search-results {

}

</style>
