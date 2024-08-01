<template>
  <v-container class="sensor-data-container">
    <v-row>
      <v-col cols="12" class="text-center">
        <v-btn @click="fetchData" color="primary">Refresh Data</v-btn>
      </v-col>
      <v-col cols="12">
        <v-card>
          <v-card-title>Sensor Data</v-card-title>
          <v-card-text>
            <v-alert v-if="errorMessage" type="error">{{ errorMessage }}</v-alert>
            <div id="map" class="map-container"></div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'
import L from 'leaflet'

export default {
  data() {
    return {
      sensorData: [],
      errorMessage: null
    }
  },
  async mounted() {
    await this.fetchData()
  },
  methods: {
    async fetchData() {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          this.errorMessage = 'No token found'
          return
        }

        this.errorMessage = null

        const dataResponse = await axios.get('https://api.openenvcloud.com/api/sensors/latest', {
          headers: { Authorization: `Bearer ${token}` },
        })

        this.sensorData = dataResponse.data
        this.$nextTick(() => {
          this.initMap()
        })
      } catch (error) {
        this.errorMessage = error.response ? error.response.data.message : error.message
      }
    },
    initMap() {
      const map = L.map('map').setView([50.0647, 19.9486], 13)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map)

      const defaultIcon = L.icon({
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      })

      this.sensorData.forEach(item => {
        const sensor = item.sensor
        const sensorData = item.sensorData

        const match = sensor.location.match(/POINT\(([^ ]+) ([^ ]+)\)/)
        if (match) {
          const lat = parseFloat(match[1])
          const lng = parseFloat(match[2])

          const marker = L.marker([lat, lng], { icon: defaultIcon }).addTo(map)

          const temperature = sensorData ? sensorData.temperature : 'N/A'
          const humidity = sensorData ? sensorData.humidity : 'N/A'
          const airQuality = sensorData ? sensorData.airQuality : 'N/A'
          const updatedAt = sensorData ? new Date(sensorData.createdAt).toLocaleString() : 'N/A'
          const user = sensor.User ? sensor.User.username : 'Unknown'

          marker.bindPopup(
            `<b>Sensor:</b> ${sensor.name}<br/>
             <b>Temperature:</b> ${temperature}°C<br/>
             <b>Humidity:</b> ${humidity}%<br/>
             <b>Air Quality:</b> ${airQuality}<br/>
             <b>Updated:</b> ${updatedAt}<br/>
             <b>User:</b> ${user}`
          )
        }
      })
    },
  },
}
</script>

<style>
.sensor-data-container {
  padding: 20px;
}

.map-container {
  height: 400px;
  width: 100%;
  position: relative;
}
</style>
