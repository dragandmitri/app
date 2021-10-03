import axios from 'axios'

const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/'

export function callWeather (query, location) {
  let reqQuery = 'q=' + query

  if (location) {
    reqQuery = `lat=${location.coords.latitude}&lon=${location.coords.longitude}`
  }

  return new Promise((resolve, reject) => {
    axios
      .get(
        `${WEATHER_URL}weather?${reqQuery}&units=metric&APPID=${process.env.VUE_APP_WEATHER_KEY}`
      )
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
