<template>
    <div class="sensor-data-container">
      <h2>Sensor Data</h2>
      <div id="map" class="map-container"></div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import L from 'leaflet';
  
  export default {
    data() {
      return {
        sensorData: [],
      };
    },
    async mounted() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }
  
        const response = await axios.get('http://localhost:5000/api/sensors', {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        this.sensorData = response.data;
        console.log('Sensor data:', this.sensorData);
        this.$nextTick(() => {
          this.initMap();
        });
      } catch (error) {
        console.error('Error fetching sensor data:', error);
      }
    },
    methods: {
      initMap() {
        const map = L.map('map').setView([50.0647, 19.9486], 13); // Przykładowa lokalizacja
  
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
        }).addTo(map);
  
        this.sensorData.forEach((data) => {
          const [lat, lng] = data.location.split(','); // Zakładając, że dane lokalizacji są w formacie "lat,lng"
          const marker = L.marker([lat, lng]).addTo(map);
          marker.bindPopup(`<b>Temperature:</b> ${data.temperature}°C<br/><b>Humidity:</b> ${data.humidity}%<br/><b>Air Quality:</b> ${data.airQuality}`);
        });
      },
    },
  };
  </script>
  
  <style>
  .sensor-data-container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .map-container {
    height: 400px;
    width: 100%;
    position: relative;
  }
  </style>
  