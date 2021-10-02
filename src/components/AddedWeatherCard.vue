<template>
  <div class="wrapper">
    <div class="component-wrapper">
      <div class="city-name">{{ weather.name }}</div>
      <div class="country-name">{{ country }}</div>
      <div class="weather">
        <div class="weather__data">
          <div class="weather__data__name">Weather</div>
          <div class="weather__data__weather__value">
            {{ weather_forecast }}
          </div>
        </div>
        <hr class="weather__bottom-line" />
        <div class="weather__data">
          <div class="weather__data__name">Temperature</div>
          <div class="weather__data__value">{{ temperature }} &#8451;</div>
        </div>
        <hr class="weather__bottom-line" />
        <div class="weather__data">
          <div class="weather__data__name">Humidity</div>
          <div class="weather__data__value">{{ humidity }} %</div>
        </div>
        <hr class="weather__bottom-line" />
        <div class="weather__last-update-time">{{ checkTimeAgo }}</div>
      </div>
      <div class="actions">
        <div class="actions__remove button" @click="remove">remove</div>
        <div class="actions__reload button" @click="reload">reload</div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import countries from 'alpha2-countries'
import moment from 'moment'

export default {
  props: ['cityName', 'geoLocation'],
  data () {
    return {
      weather: {},
      weatherUrl: 'https://api.openweathermap.org/data/2.5/',
      country: null,
      weather_forecast: null,
      temperature: null,
      humidity: null,
      checkTime: null,
      checkTimeAgo: ''
    }
  },
  watch: {
    weather (newWeather) {
      if (newWeather) {
        this.country = countries.resolveName(newWeather.sys.country)
        this.weather_forecast = newWeather.weather[0].description
        this.temperature = Math.round(newWeather.main.temp)
        this.humidity = newWeather.main.humidity
      }
    },
    checkTime () {
      if (this.counter) {
        clearInterval(this.counter)
      }
      this.counter = setInterval(() => {
        this.checkTimeAgo = this.checkTime.fromNow()
      }, 1000 * 60)
    }
  },
  created () {
    this.fetchWeather()
  },
  unmounted () {
    if (this.counter) {
      clearInterval(this.counter)
    }
  },
  computed: {
    endPoint () {
      let query = 'q=' + this.cityName
      if (this.geoLocation) {
        query = `lat=${this.geoLocation.coords.latitude}&lon=${this.geoLocation.coords.longitude}`
      }

      return `${this.weatherUrl}weather?${query}&units=metric&APPID=${process.env.VUE_APP_WEATHER_KEY}`
    }
  },
  methods: {
    fetchWeather () {
      if (this.cityName || this.geoLocation) {
        axios
          .get(this.endPoint)
          .then(response => {
            this.weather = response.data
            this.checkTime = moment()
            this.checkTimeAgo = this.checkTime.fromNow()
          })
          .catch(error => {
            console.log(error)
            this.remove()
          })
      }
    },
    remove () {
      this.$emit('remove', this.cityName)
    },
    reload () {
      this.fetchWeather()
    }
  }
}
</script>

<style lang="scss">
.wrapper {
  width: 100%;
  height: 393px;
  box-shadow: 0px 1px 7px 6px rgba(229, 229, 229, 0.81);
  border-radius: 6px;
  max-width: 350px;
  min-width: 350px;
}

.component-wrapper {
  position: relative;
  margin: 24px;
}

.city-name {
  font-size: 32px;
  line-height: 38px;
  font-weight: 700;
  padding-top: 24px;
}

.country-name {
  font-size: 18px;
  line-height: 24px;
  padding-top: 15px;
}

.weather {
  padding-top: 40px;

  .weather__bottom-line {
    margin: 12px 0 0 0;
  }

  .weather__data {
    display: flex;
    justify-content: space-between;
    padding-top: 16px;
  }

  .weather__last-update-time {
    display: flex;
    justify-content: flex-end;
    font-size: 16px;
    line-height: 24px;
    color: #a8a8a8;
    padding-top: 8px;
  }
}

.actions {
  display: flex;
  justify-content: space-between;
  position: absolute;
  width: 100%;
  padding-top: 32px;

  .button {
    font-size: 16px;
    line-height: 24px;
    font-weight: 700;
    color: #9b51e0;
    text-transform: uppercase;
    cursor: pointer;
  }
}
</style>
