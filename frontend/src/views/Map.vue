<template>
    <div class="map-container">
      <div id="map"></div>
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
      initMap() {
        const map = L.map('map').setView([50.0647, 19.9486], 13);
  
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
        }).addTo(map);
  
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
  
            const marker = L.marker([lng, lat], { icon: defaultIcon }).addTo(map);
  
            const temperature = sensorData ? sensorData.temperature : 'N/A';
            const humidity = sensorData ? sensorData.humidity : 'N/A';
            const airQuality = sensorData ? sensorData.airQuality : 'N/A';
            const updatedAt = sensorData ? moment(sensorData.createdAt).fromNow() : 'N/A';
            const user = sensor.User ? sensor.User.username : 'Unknown';
  
            marker.bindPopup(
              `<b>Sensor:</b> ${sensor.name}<br/>
               <b>Temperature:</b> ${temperature}°C<br/>
               <b>Humidity:</b> ${humidity}%<br/>
               <b>Air Quality:</b> ${airQuality}<br/>
               <b>Updated:</b> ${updatedAt}<br/>
               <b>User:</b> ${user}`
            );
          }
        });
      },
    },
  };
  </script>
  
  <style scoped>
  .map-container {
    height: calc(100vh - 160px); /* Adjust this value based on the combined height of header and footer */
    width: 100%;
  }
  
  #map {
    height: 100%;
    width: 100%;
  }
  </style>
  