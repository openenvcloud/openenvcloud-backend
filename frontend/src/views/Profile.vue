<template>
  <div class="profile-container">
    <div class="profile-column">
      <h2>Profile</h2>
      <div class="profile-info">
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Username:</strong> {{ user.username }}</p>
        <p><strong>Points:</strong> {{ user.points }}</p>
      </div>
      <button @click="openSettings" class="settings-button">Settings</button>
    </div>
    <div class="sensors-column">
      <h2>You have {{ sensors.length }} sensors</h2>
      <p>Below is the list of your registered sensors. You can add a new sensor, download the API key or delete the selected sensor.</p>
      <div class="sensors-list">
        <div v-for="sensor in sensors" :key="sensor.id" class="sensor-item">
          <h4>{{ sensor.name }}</h4>
          <div class="api-key-container">
            <label><strong>API Key:</strong></label>
            <input type="text" :value="sensor.apiKey" readonly />
            <button @click="copyApiKey(sensor.apiKey)">Copy API Key</button>
          </div>
          <button @click="removeApiKey(sensor.id)" class="remove-api-key">Remove API Key</button>
        </div>
      </div>
      <button @click="openAddSensorPopup" class="add-sensor-button">+ Add new sensor</button>
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

    <!-- Settings Modal -->
    <div v-if="showSettings" class="settings-modal">
      <div class="settings-content">
        <h3>Settings</h3>
        <button @click="closeSettings" class="close-button">X</button>
        <form @submit.prevent="updateProfile">
          <div class="form-group">
            <label for="newUsername">New Username</label>
            <input type="text" id="newUsername" v-model="newUsername" />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" v-model="password" required />
          </div>
          <div class="form-group">
            <button type="submit">Update Username</button>
          </div>
        </form>
        <form @submit.prevent="updatePassword">
          <div class="form-group">
            <label for="oldPassword">Old Password</label>
            <input type="password" id="oldPassword" v-model="oldPassword" required />
          </div>
          <div class="form-group">
            <label for="newPassword">New Password</label>
            <input type="password" id="newPassword" v-model="newPassword" required />
          </div>
          <div class="form-group">
            <button type="submit">Update Password</button>
          </div>
        </form>
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
      user: {
        email: '',
        username: '',
        points: 0,
      },
      sensors: [],
      showSettings: false,
      newUsername: '',
      password: '',
      oldPassword: '',
      newPassword: '',
      showAddSensorPopup: false,
      newSensorName: '',
      map: null,
      marker: null,
      selectedLocation: null,
    };
  },
  async created() {
    await this.fetchUserData();
    await this.fetchSensors();
  },
  methods: {
    async fetchUserData() {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      this.user = response.data;
    },
    async fetchSensors() {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/sensors', {
        headers: { Authorization: `Bearer ${token}` },
      });
      this.sensors = response.data;
    },
    copyApiKey(apiKey) {
      navigator.clipboard.writeText(apiKey);
      alert('API Key copied to clipboard');
    },
    async removeApiKey(sensorId) {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/sensors/${sensorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      this.fetchSensors();
    },
    openSettings() {
      this.showSettings = true;
    },
    closeSettings() {
      this.showSettings = false;
    },
    async updateProfile() {
      const token = localStorage.getItem('token');
      await axios.patch('http://localhost:5000/api/auth/update-username', {
        username: this.newUsername,
        password: this.password,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      this.fetchUserData();
      this.closeSettings();
    },
    async updatePassword() {
      const token = localStorage.getItem('token');
      await axios.patch('http://localhost:5000/api/auth/update-password', {
        oldPassword: this.oldPassword,
        newPassword: this.newPassword,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      this.closeSettings();
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
};
</script>

<style scoped>
.profile-container {
  display: flex;
  justify-content: space-between;
  padding: 20px;
}

.profile-column,
.sensors-column {
  border: 1px solid #ccc;
  padding: 20px;
  width: 48%;
}

.profile-info {
  margin-bottom: 20px;
}

.settings-button {
  background-color: #1976D2;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
}

.sensors-list {
  margin-top: 20px;
}

.sensor-item {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
}

.api-key-container {
  display: flex;
  align-items: center;
}

.api-key-container input {
  flex: 1;
  padding: 5px;
  margin-right: 10px;
}

.remove-api-key {
  background: none;
  border: none;
  color: red;
  cursor: pointer;
  padding: 5px 0;
}

.add-sensor-button {
  background-color: #1976D2;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
}

.settings-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.settings-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 300px;
  position: relative;
}

.close-button {
  background-color: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
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
  padding: 10px 20px;
  background-color: #1976D2;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #005bb5;
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
