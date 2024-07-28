<template>
  <div class="container">
    <div class="search-container">
      <input
        v-model="searchQuery"
        @input="searchSensors"
        type="text"
        placeholder="Search sensor by name"
      />
      <ul v-if="searchResults.length" class="search-results">
        <li
          v-for="sensor in searchResults"
          :key="sensor.id"
          @click="selectSensor(sensor)"
        >
          {{ sensor.name }}
        </li>
      </ul>
    </div>
    <div v-if="selectedSensor" class="sensor-details">
      <h2>{{ selectedSensor.name }}</h2>
      <button @click="fetchSensorData" class="action-button">Fetch Data</button>
      <button @click="downloadRawData" class="action-button">Download Raw Data</button>
      <div v-if="sensorData.length" class="data-container">
        <h3>Historical Data</h3>
        <ul>
          <li v-for="(data, index) in sensorData" :key="index">
            {{ data.createdAt }} - Temperature: {{ data.temperature }}°C,
            Humidity: {{ data.humidity }}%, Air Quality: {{ data.airQuality }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      searchQuery: '',
      searchResults: [],
      selectedSensor: null,
      sensorData: [],
      errorMessage: null
    };
  },
  methods: {
    async searchSensors() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.errorMessage = 'No token found';
          return;
        }

        if (this.searchQuery.length < 3) {
          this.searchResults = [];
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/sensors/search?query=${this.searchQuery}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        this.searchResults = response.data;
      } catch (error) {
        this.errorMessage = error.response ? error.response.data.message : error.message;
      }
    },
    selectSensor(sensor) {
      this.selectedSensor = sensor;
      this.searchQuery = sensor.name;
      this.searchResults = [];
    },
    async fetchSensorData() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.errorMessage = 'No token found';
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/sensors/${this.selectedSensor.id}/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        this.sensorData = response.data.map(entry => ({
          createdAt: new Date(entry.createdAt).toLocaleString(),
          temperature: entry.temperature,
          humidity: entry.humidity,
          airQuality: entry.airQuality
        }));
      } catch (error) {
        this.errorMessage = error.response ? error.response.data.message : error.message;
      }
    },
    downloadRawData() {
      const csvContent = [
        ['Date', 'Temperature', 'Humidity', 'Air Quality'],
        ...this.sensorData.map(row => [row.createdAt, row.temperature, row.humidity, row.airQuality])
      ]
        .map(e => e.join(','))
        .join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${this.selectedSensor.name}_data.csv`);
      link.click();
    }
  }
};
</script>

<style scoped>
.container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.search-container {
  position: relative;
  margin-bottom: 20px;
}

.search-container input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.search-results li {
  padding: 10px;
  cursor: pointer;
}

.search-results li:hover {
  background: #f0f0f0;
}

.sensor-details {
  margin-top: 20px;
}

.sensor-details h2 {
  margin-bottom: 20px;
  font-size: 24px;
}

.action-button {
  padding: 10px 20px;
  margin-right: 10px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.action-button:hover {
  background: #0056b3;
}

.data-container {
  margin-top: 20px;
}

.data-container h3 {
  margin-bottom: 10px;
}

.data-container ul {
  list-style-type: none;
  padding: 0;
}

.data-container li {
  padding: 10px;
  border-bottom: 1px solid #ccc;
}
</style>
