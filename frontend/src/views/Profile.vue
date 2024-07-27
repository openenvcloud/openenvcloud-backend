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
            {{ sensor.name }} - {{ sensor.apiKey }}
          </li>
        </ul>
        <button @click="generateApiKey">Generate New API Key</button>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        username: '',
        password: '',
        points: 0,
        profilePicture: 'https://via.placeholder.com/100',
        sensors: []
      };
    },
    async mounted() {
      this.fetchProfile();
      this.fetchSensors();
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
      async generateApiKey() {
        const token = localStorage.getItem('token');
        try {
          const response = await axios.post('http://localhost:5000/api/sensors/generate-api-key', {}, {
            headers: { Authorization: `Bearer ${token}` }
          });
          this.sensors.push(response.data);
        } catch (error) {
          console.error('Error generating API key:', error);
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
    margin-bottom: 5px;
    padding: 10px;
    border-radius: 5px;
  }
  </style>
  