<template>
  <div>
    <AddCityModalWindow
      v-if="addCityModalOpen"
      @cancel="addCityModalOpen = false"
      @add="addCity"
    ></AddCityModalWindow>
    <div>
      <div class="page-title">World Weather</div>
      <div class="page-subtitle">Watch weather in your current location</div>
      <div v-if="currentLocation" class="main-card">
        <AddedWeatherCard :geo-location="currentLocation"></AddedWeatherCard>
      </div>
      <div v-else class="error-message">
        Sorry, we can't get your current geo-location :-(
      </div>
      <div class="add-card-button" @click="this.addCityModalOpen = true"></div>

      <div class="cards">
        <div class="added-cards" v-for="cityName in cities" :key="cityName">
          <AddedWeatherCard
            :city-name="cityName"
            @remove="removeCity"
          ></AddedWeatherCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AddedWeatherCard from './components/AddedWeatherCard.vue'
import AddCityModalWindow from './components/AddCityModalWindow.vue'

export default {
  name: 'App',
  components: {
    AddedWeatherCard,
    AddCityModalWindow
  },
  data () {
    return {
      addCityModalOpen: false,
      cities: localStorage.getItem('cities')
        ? JSON.parse(localStorage.getItem('cities'))
        : [],
      currentLocation: null
    }
  },
  methods: {
    saveStorage () {
      localStorage.setItem('cities', JSON.stringify(this.cities))
    },
    addCity (city) {
      if (this.cities.indexOf(city) === -1) {
        this.cities.push(city)
        this.saveStorage()
      }

      this.addCityModalOpen = false
    },
    removeCity (cityName) {
      this.cities.splice(this.cities.indexOf(cityName), 1)
      this.saveStorage()
    }
  },
  created () {
    // do we support geolocation
    if (!('geolocation' in navigator)) {
      this.errorStr = 'Geolocation is not available.'
      return
    }

    // get position
    navigator.geolocation.getCurrentPosition(
      pos => {
        this.currentLocation = pos
      },
      err => {
        console.log(err.message)
      }
    )
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Lato&display=swap');

#app {
  font-family: Lato;
  position: relative;
  min-width: 360px;
}

.page-title {
  text-align: center;
  font-size: 70px;
  line-height: 80px;
  padding-top: 24px;
  font-weight: 300;
}

.page-subtitle {
  font-size: 24px;
  line-height: 24px;
  font-weight: 400;
  text-align: center;
  padding-top: 32px;
}

.main-card {
  margin-left: auto;
  margin-right: auto;
  margin-top: 20px;
  width: 100%;
  max-width: 824px;
  min-width: 360px;
  height: 393px;
  margin-bottom: 70px;

  @media all and (max-width: 768px) {
    margin-bottom: 0;
  }

  .wrapper {
    max-width: 90%;
    margin: 0;
    margin-right: auto;
    margin-left: auto;
  }

  .city-name {
    padding-top: 24px;
  }

  .actions__remove {
    display: none;
  }

  .actions {
    justify-content: flex-end;
  }
}

.cards {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-left: auto;
  margin-right: auto;
  max-width: 1565px;
  padding: 0 130px 50px 130px;
}

.added-cards {
  margin-top: 12px;
  padding: 0 20px 0 20px;
  width: 350px;

  @media all and (max-width: 768px) {
    margin-top: 0;
  }
}

.add-card-button {
  position: fixed;
  right: 45px;
  top: 92%;
  width: 56px;
  height: 56px;
  background: linear-gradient(#fff, #fff), linear-gradient(#fff, #fff), #9b51e0;
  background-position: center;
  background-size: 25% 2px, 2px 25%;
  background-repeat: no-repeat;
  border-radius: 50%;
  cursor: pointer;

  @media all and (max-width: 768px) {
    position: unset;
    margin-left: auto;
    margin-right: auto;
    margin-top: 25px;
  }
}

.error-message {
  display: flex;
  justify-content: center;
  padding-top: 50px;
  font-size: 40px;
}
</style>
