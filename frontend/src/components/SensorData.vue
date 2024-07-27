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
  
        const response = await axios.get('http://localhost:5000/api/sensors/latest', {
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
  
        const defaultIcon = L.icon({
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });
  
        this.sensorData.forEach((data) => {
          console.log('Adding marker for data:', data);
          if (data.location) {
            const match = data.location.match(/POINT\(([^ ]+) ([^ ]+)\)/);
            if (match) {
              const lat = parseFloat(match[1]);
              const lng = parseFloat(match[2]);
              const marker = L.marker([lat, lng], { icon: defaultIcon }).addTo(map);
  
              // Pobieranie nazwy użytkownika i czasu aktualizacji
              const user = data.User ? data.User.username : 'Unknown';
              const updatedAt = new Date(data.updatedAt).toLocaleString();
  
              marker.bindPopup(
                `<b>Temperature:</b> ${data.temperature}°C<br/>
                 <b>Humidity:</b> ${data.humidity}%<br/>
                 <b>Air Quality:</b> ${data.airQuality}<br/>
                 <b>Updated:</b> ${updatedAt}<br/>
                 <b>User:</b> ${user}`
              );
            } else {
              console.error('Invalid location format:', data.location);
            }
          } else {
            console.error('No location data:', data.location);
          }
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
  