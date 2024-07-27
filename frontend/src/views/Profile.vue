<template>
    <div class="profile">
      <h1>Profile</h1>
      <div class="profile-info">
        <div class="profile-picture">
          <img :src="profilePicture" alt="Profile Picture">
          <button @click="uploadPicture">Change Picture</button>
        </div>
        <div class="profile-details">
          <div class="form-group">
            <label for="username">Username</label>
            <input type="text" id="username" v-model="username">
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" v-model="password">
          </div>
          <button @click="updateProfile">Update Profile</button>
          <div class="points">
            <h2>Points: {{ points }}</h2>
          </div>
        </div>
      </div>
      <div class="sensors">
        <h2>Sensors</h2>
        <ul>
          <li v-for="sensor in sensors" :key="sensor.id">
            <h3>{{ sensor.name }}</h3> <span>(id: {{sensor.id}})</span>
            <div class="form-group">
              <label>API Key</label>
              <div class="api-key-container">
                <input type="text" :value="sensor.apiKey" readonly>
                <button @click="copyApiKey(sensor.apiKey)">Copy API Key</button>
              </div>
            </div>
            <span class="delete-btn" @click="deleteApiKey(sensor.id)">Remove API Key</span>
          </li>
        </ul>
        <button @click="openAddSensorPopup">+ Add new sensor</button>
      </div>
  
      <!-- Popup do dodawania sensora -->
      <div v-if="showAddSensorPopup" class="popup">
        <div class="popup-content">
          <h2>Add New Sensor</h2>
          <div class="form-group">
            <label for="sensorName">Sensor Name</label>
            <input type="text" id="sensorName" v-model="newSensorName" required>
          </div>
          <div id="popup-map" class="map"></div>
          <button @click="addSensor">Add Sensor</button>
          <button @click="closeAddSensorPopup">Cancel</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  
  export default {
    data() {
      return {
        username: '',
        password: '',
        points: 0,
        profilePicture: 'https://via.placeholder.com/100',
        sensors: [],
        showAddSensorPopup: false,
        newSensorName: '',
        map: null,
        marker: null,
        selectedLocation: null
      };
    },
    async mounted() {
      await this.fetchProfile();
      await this.fetchSensors();
    },
    methods: {
      async fetchProfile() {
        const token = localStorage.getItem('token');
        try {
          const response = await axios.get('http://localhost:5000/api/auth/profile', {
            headers: { Authorization: `Bearer ${token}` }
          });
          this.username = response.data.username;
          this.points = response.data.points;
          this.profilePicture = response.data.profilePicture || this.profilePicture;
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      },
      async fetchSensors() {
        const token = localStorage.getItem('token');
        try {
          const response = await axios.get('http://localhost:5000/api/sensors', {
            headers: { Authorization: `Bearer ${token}` }
          });
          this.sensors = response.data;
        } catch (error) {
          console.error('Error fetching sensors:', error);
        }
      },
      async uploadPicture() {
        // Upload profile picture logic
        console.log('Upload picture clicked');
      },
      async updateProfile() {
        const token = localStorage.getItem('token');
        try {
          await axios.put('http://localhost:5000/api/auth/update-profile', {
            username: this.username,
            password: this.password
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          alert('Profile updated successfully');
        } catch (error) {
          console.error('Error updating profile:', error);
        }
      },
      async deleteApiKey(sensorId) {
        const token = localStorage.getItem('token');
        try {
          await axios.delete(`http://localhost:5000/api/sensors/${sensorId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          this.sensors = this.sensors.filter(sensor => sensor.id !== sensorId);
        } catch (error) {
          console.error('Error deleting API key:', error);
        }
      },
      copyApiKey(apiKey) {
        navigator.clipboard.writeText(apiKey).then(() => {
          alert('API key copied to clipboard');
        }).catch(err => {
          console.error('Failed to copy API key: ', err);
        });
      },
      openAddSensorPopup() {
        this.showAddSensorPopup = true;
        this.$nextTick(() => {
          this.initMap();
        });
      },
      closeAddSensorPopup() {
        this.showAddSensorPopup = false;
        this.map = null; // Reset map
        this.marker = null;
        this.selectedLocation = null;
        this.newSensorName = ''; // Reset sensor name
      },
      initMap() {
        this.map = L.map('popup-map').setView([50.0647, 19.9486], 13);
  
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
  
        this.map.on('click', (e) => {
          if (this.marker) {
            this.map.removeLayer(this.marker);
          }
          this.marker = L.marker([e.latlng.lat, e.latlng.lng], { icon: defaultIcon }).addTo(this.map);
          this.selectedLocation = `POINT(${e.latlng.lng} ${e.latlng.lat})`;
        });
      },
      async addSensor() {
        if (!this.newSensorName || !this.selectedLocation) {
          alert('Please provide both a name and location for the sensor.');
          return;
        }
  
        const token = localStorage.getItem('token');
        try {
          const response = await axios.post('http://localhost:5000/api/sensors/create', {
            name: this.newSensorName,
            location: this.selectedLocation
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          this.sensors.push(response.data);
          this.closeAddSensorPopup();
        } catch (error) {
          console.error('Error adding sensor:', error);
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .profile {
    max-width: 800px;
    margin: 50px auto;
    text-align: center;
  }
  
  .profile-info {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .profile-picture {
    text-align: center;
  }
  
  .profile-picture img {
    border-radius: 50%;
    margin-bottom: 10px;
  }
  
  .profile-picture button {
    margin-top: 10px;
  }
  
  .profile-details {
    text-align: left;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 5px;
  }
  
  .form-group input {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
  }
  
  button {
    padding: 10px;
    background: #1976D2;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
  }
  
  button:hover {
    background: #1565C0;
  }
  
  .points {
    margin-top: 20px;
  }
  
  .sensors {
    margin-top: 30px;
    text-align: left;
  }
  
  .sensors h2 {
    margin-bottom: 10px;
  }
  
  .sensors ul {
    list-style: none;
    padding: 0;
  }
  
  .sensors li {
    background: #f5f5f5;
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 5px;
  }
  
  .sensors h3 {
    margin: 0 0 10px;
    font-size: 20px;
  }
  
  .api-key-container {
    display: flex;
    gap: 10px;
  }
  
  .api-key-container input[readonly] {
    background: #e0e0e0;
    cursor: not-allowed;
    flex: 1;
  }
  
  .delete-btn {
    color: red;
    cursor: pointer;
    margin-top: 5px;
    font-size: 12px;
  }
  
  .delete-btn:hover {
    text-decoration: underline;
  }
  
  .popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .popup-content {
    background: white;
    padding: 20px;
    border-radius: 5px;
    text-align: left;
    max-width: 500px;
    width: 100%;
  }
  
  .popup-content h2 {
    margin-top: 0;
  }
  
  .popup-content .form-group {
    margin-bottom: 15px;
  }
  
  .popup-content .form-group label {
    display: block;
    margin-bottom: 5px;
  }
  
  .popup-content .form-group input {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
  }
  
  .popup-content .map {
    height: 300px;
    margin-bottom: 15px;
  }
  
  .popup-content button {
    margin-right: 10px;
  }
  
  .popup-content button:last-child {
    margin-right: 0;
  }
  </style>
  