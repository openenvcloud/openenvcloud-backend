<template>
  <div class="container">
    <div class="search-container">
      <input
        v-model="searchQuery"
        @keyup.enter="searchLocation"
        type="text"
        placeholder="Enter address to search"
      />
      <button @click="searchLocation">Search</button>
    </div>
    <div id="map" class="map-container"></div>
    <div v-if="selectedSensor" class="sidebar">
      <button class="close-button" @click="selectedSensor = null">X</button>
      <h2>{{ selectedSensor.sensor.name }}</h2>
      <div class="sensor-detail">
        <div class="sensor-item" @click="toggleDetail('temperature')">
          <div class="sensor-item-header">
            <div>
              <font-awesome-icon icon="thermometer-half" />
              <span>Temperature</span>
            </div>
            <span v-if="details.temperature">▲</span>
            <span v-else>▼</span>
          </div>
          <div class="sensor-item-content">
            <span class="sensor-item-value">{{ selectedSensor.sensorData.temperature }}°C</span>
            <span class="sensor-item-timestamp">{{ moment(selectedSensor.sensorData.createdAt).fromNow() }}</span>
          </div>
          <div v-if="details.temperature" class="data-container">
            <p v-for="(data, index) in sensorHistory.temperature" :key="index">{{ data.createdAt }} - {{ data.value }}°C</p>
          </div>
        </div>

        <div class="sensor-item" @click="toggleDetail('humidity')">
          <div class="sensor-item-header">
            <div>
              <font-awesome-icon icon="tint" />
              <span>Humidity</span>
            </div>
            <span v-if="details.humidity">▲</span>
            <span v-else>▼</span>
          </div>
          <div class="sensor-item-content">
            <span class="sensor-item-value">{{ selectedSensor.sensorData.humidity }}%</span>
            <span class="sensor-item-timestamp">{{ moment(selectedSensor.sensorData.createdAt).fromNow() }}</span>
          </div>
          <div v-if="details.humidity" class="data-container">
            <p v-for="(data, index) in sensorHistory.humidity" :key="index">{{ data.createdAt }} - {{ data.value }}%</p>
          </div>
        </div>

        <div class="sensor-item" @click="toggleDetail('airQuality')">
          <div class="sensor-item-header">
            <div>
              <FontAwesomeIcon :icon="wind" />
              <span>Air Quality</span>
            </div>
            <span v-if="details.airQuality">▲</span>
            <span v-else>▼</span>
          </div>
          <div class="sensor-item-content">
            <span class="sensor-item-value">{{ selectedSensor.sensorData.airQuality }} PM2.5</span>
            <span class="sensor-item-timestamp">{{ moment(selectedSensor.sensorData.createdAt).fromNow() }}</span>
          </div>
          <div v-if="details.airQuality" class="data-container">
            <p v-for="(data, index) in sensorHistory.airQuality" :key="index">{{ data.createdAt }} - {{ data.value }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import moment from 'moment';


export default {
  data() {
    return {
      sensorData: [],
      selectedSensor: null,
      details: {
        temperature: false,
        humidity: false,
        airQuality: false
      },
      sensorHistory: {
        temperature: [],
        humidity: [],
        airQuality: []
      },
      searchQuery: '',
      map: null,
      errorMessage: null
    };
  },
  async mounted() {
    await this.fetchData();
    this.initMap();
  },
  methods: {
    async fetchData() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.errorMessage = 'No token found';
          return;
        }

        this.errorMessage = null;

        const dataResponse = await axios.get('http://localhost:5000/api/sensors/latest', {
          headers: { Authorization: `Bearer ${token}` },
        });

        this.sensorData = dataResponse.data;
      } catch (error) {
        this.errorMessage = error.response ? error.response.data.message : error.message;
      }
    },
    async fetchSensorHistory(sensorId, type) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.errorMessage = 'No token found';
          return;
        }

        this.errorMessage = null;

        const dataResponse = await axios.get(`http://localhost:5000/api/sensors/${sensorId}/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        this.sensorHistory[type] = dataResponse.data.map(entry => ({
          createdAt: new Date(entry.createdAt).toLocaleString(),
          value: entry[type]
        }));
      } catch (error) {
        this.errorMessage = error.response ? error.response.data.message : error.message;
      }
    },
    initMap() {
      this.map = L.map('map').setView([50.0647, 19.9486], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(this.map);

      const defaultIcon = L.icon({
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      this.sensorData.forEach(item => {
        const sensor = item.sensor;
        const sensorData = item.sensorData;

        const match = sensor.location.match(/POINT\(([^ ]+) ([^ ]+)\)/);
        if (match) {
          const lat = parseFloat(match[1]);
          const lng = parseFloat(match[2]);

          const marker = L.marker([lng, lat], { icon: defaultIcon }).addTo(this.map);

          marker.on('click', () => {
            this.selectedSensor = item;
            this.resetDetails();
          });
        }
      });
    },
    async searchLocation() {
      if (!this.searchQuery) {
        return;
      }

      try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${this.searchQuery}`);
        if (response.data && response.data.length > 0) {
          const { lat, lon } = response.data[0];
          this.map.setView([lat, lon], 13);
        }
      } catch (error) {
        console.error('Error searching location:', error);
      }
    },
    toggleDetail(type) {
      this.details[type] = !this.details[type];
      if (this.details[type]) {
        this.fetchSensorHistory(this.selectedSensor.sensor.id, type);
      }
    },
    resetDetails() {
      this.details.temperature = false;
      this.details.humidity = false;
      this.details.airQuality = false;
      this.sensorHistory.temperature = [];
      this.sensorHistory.humidity = [];
      this.sensorHistory.airQuality = [];
    },
    moment
  }
};
</script>

<style scoped>
.container {
  display: flex;
  height: calc(100vh - 160px); /* Adjust this value based on the combined height of header and footer */
}

.search-container {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  background: white;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  margin-top: 60px;
}

.search-container input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 10px;
  width: 300px;
}

.search-container button {
  padding: 8px 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.search-container button:hover {
  background-color: #0056b3;
}

.map-container {
  flex: 1;
  height: 100%;
}

.sidebar {
  position: relative;
  width: 300px;
  padding: 20px;
  overflow-y: auto;
  background: #f0f0f0;
  border-left: 1px solid #ccc;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.sensor-detail {
  margin-top: 20px;
}

.sensor-item {
  background: white;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.sensor-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sensor-item-header div {
  display: flex;
  align-items: center;
}

.sensor-item-header i {
  margin-right: 10px;
}

.sensor-item-content {
  margin-top: 10px;
}

.sensor-item-value {
  display: block;
  font-weight: bold;
  margin-top: 5px;
}

.sensor-item-timestamp {
  display: block;
  color: #888;
  font-size: 12px;
  margin-top: 5px;
}

.data-container {
  margin-top: 10px;
  padding-left: 10px;
  border-left: 2px solid #ccc;
}

.data-container p {
  margin: 5px 0;
}
</style>
