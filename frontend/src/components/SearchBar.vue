<template>
  <form id="search-form" @submit.prevent="handleSearch">
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
          type="number"
          id="people-count"
          class="form-control"
          placeholder="People"
          :value="desiredPeopleCount"
          @input="updateDesiredPeopleCount"
          required
          autofocus
        >
        <label for="people-count">{{ peopleLabelString }}</label>
      </div>
      <div class="form-label-group price-input-group" v-b-tooltip.hover title="Price per person">
        <input
          type="number"
          id="price"
          class="form-control"
          placeholder="Desired price"
          :value="desiredPrice"
          @input="updateDesiredPrice"
          required
          autofocus
        >
        <label for="price">{{ priceLabelString }}</label>
      </div>
      <div class="form-label-group submit-input-group">
        <input type="submit" class="btn btn-primary" value="Go"/>
      </div>
    </div>
    <div class="categories-list">
      <span>Categories:</span>
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
    },
    peopleLabelString () {
      return this.desiredPeopleCount > 1
        ? `${this.desiredPeopleCount} people`
        : 'one person'
    },
    priceLabelString () {
      if (this.desiredPeopleCount > 0) {
        return this.desiredPrice > 0
          ? `${this.desiredPrice} € × ${this.desiredPeopleCount} = ${this.desiredPrice * this.desiredPeopleCount} €`
          : 'Desired price'
      } else if (this.desiredPrice) {
        return `${this.desiredPrice} €`
      } else {
        return 'Desired price'
      }
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
      this.$store.dispatch('SEARCH_POIS')
    }
  }
}
</script>

<style>

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

#search-form .string-fields .people-input-group {
  width: 130px;
}

#search-form .string-fields .people-input-group input {
  border-radius: 0;
  border-right: 0;
}

#search-form .string-fields .price-input-group {
  width: 140px;
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
  justify-content: space-around;
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

</style>
