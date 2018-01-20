<template>
  <div id="search-bar">
    <form id="search-form">
      <div class="string-fields">
        <div class="form-label-group location-input-group">
          <input
            type="text"
            id="location-name"
            class="form-control"
            placeholder="Place"
            :value="desiredLocation"
            @input="updateDesiredLocation"
            required
            autofocus
          >
          <label for="location-name">Place</label>
        </div>
        <div class="form-label-group people-input-group">
          <input
            type="text"
            id="people-count"
            class="form-control"
            placeholder="People"
            :value="desiredPeopleCount"
            @input="updateDesiredPeopleCount"
            required
            autofocus
          >
          <label for="people-count">{{ desiredPeopleCount > 1 ? `${desiredPeopleCount} people` : 'one person' }}</label>
        </div>
        <div class="form-label-group price-input-group">
          <input
            type="text"
            id="price"
            class="form-control"
            placeholder="Desired price"
            :value="desiredPrice"
            @input="updateDesiredPrice"
            required
            autofocus
          >
          <label for="price">Desired price</label>
        </div>
        <div class="form-label-group submit-input-group">
          <input type="submit" class="btn btn-primary" value="Go"/>
        </div>
      </div>
      <div class="categories-list">
        <label
          v-for="category in availableCategories"
          :key="category.id"
          :for="`category-${category.id}`"
          class="categories-list__item"
          v-b-tooltip.hover
          :title="category.name"
        >
          <input
            :id="`category-${category.id}`"
            type="checkbox"
            :value="category.id"
            :checked="hasChosenCategory(category.id)"
            @click="toggleDesiredCategory"
          />
          <fa-icon :icon="category.icon" fixed-width size="lg" />
        </label>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'hSearchBar',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  computed: {
    desiredLocation () {
      return this.$store.state.searchSettings.locationName
    },
    desiredPeopleCount () {
      return this.$store.state.searchSettings.peopleCount
    },
    desiredPrice () {
      return this.$store.state.searchSettings.price
    },
    desiredCategories () {
      return this.$store.state.searchSettings.categories
    },
    availableCategories () {
      return this.$store.state.availableCategories
    },
    chosenCategories () {
      return Object.values(this.$store.state.searchSettings.categories)
    }
  },
  methods: {
    hasChosenCategory (categoryID) {
      return !!this.$store.state.searchSettings.categories[categoryID]
    },
    updateDesiredLocation (e) {
      this.$store.dispatch('UPDATE_DESIRED_LOCATION_NAME', e.target.value)
    },
    updateDesiredPeopleCount (e) {
      this.$store.dispatch('UPDATE_DESIRED_PEOPLE_COUNT', e.target.value)
    },
    updateDesiredPrice (e) {
      this.$store.dispatch('UPDATE_DESIRED_PRICE', e.target.value)
    },
    toggleDesiredCategory (e) {
      this.$store.dispatch('TOGGLE_DESIRED_CATEGORY', e.target.value)
    },
    handleSearch () {
      this.$store.dispatch('FETCH_CHARACTERS', this.name)
      this.$emit('updateSelected', this.name)
    }
  }
}
</script>

<style>

/* General search bar settings */

#search-bar {
  width: 300px;
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 999;

  background: #fff;
  padding: 5px;

  border-radius: 4px;
  box-shadow: 0px 2px 10px 1px rgba(0, 0, 0, .3);
}

#search-form {
  display: flex;
  flex-direction: column;
}

/* First half - location and people */

#search-form .string-fields {
    display: flex;
    flex-direction: row;
}

#search-form .string-fields .form-label-group {
  margin-bottom: 0;
}

#search-form .string-fields .form-control:focus {
  color: #495057;
  background-color: #fff;
  /*border-color: rgb(206, 212, 218);*/
  border-color: #80bdff;
  outline: 0;
  box-shadow: 0 0 0 0 transparent;
}

#search-form .string-fields .location-input-group input {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-right: 0;
}

#search-form .string-fields .people-input-group input {
  border-radius: 0;
  border-right: 0;
}

#search-form .string-fields .price-input-group input {
  border-radius: 0;
  border-right: 0;
}

#search-form .string-fields .submit-input-group input {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  padding-top: 12px;
  padding-bottom: 12px;
}

/* Second half - categories */

#search-form .categories-list {
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

#search-form .categories-list label.categories-list__item > input { /* HIDE RADIO */
  visibility: hidden; /* Makes input not-clickable */
  position: absolute; /* Remove input from document flow */
}
#search-form .categories-list label.categories-list__item > input + svg { /* IMAGE STYLES */
  cursor: pointer;
}
#search-form .categories-list label.categories-list__item > input:checked + svg { /* (RADIO CHECKED) IMAGE STYLES */
  color: #007bff;
}

/* Hide leaflet zoom */

.leaflet-control-zoom {
  display: none;
}

.leaflet-control-zoom-in {

}

.leaflet-control-zoom-out {

}

</style>
