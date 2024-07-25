<template>
    <div>
      <h2>Profile</h2>
      <p>Username: {{ username }}</p>
      <button @click="generateApiKey">Generate API Key</button>
      <p>API Key: {{ apiKey }}</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        username: '', // Pobrane z tokenu JWT
        apiKey: '',
      };
    },
    methods: {
      async generateApiKey() {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.post('http://localhost:5000/api/users/api-key', {}, {
            headers: { Authorization: `Bearer ${token}` },
          });
          this.apiKey = response.data.apiKey;
        } catch (error) {
          console.error('Error generating API key:', error);
        }
      },
    },
    mounted() {
      // Pobieranie nazwy użytkownika z tokenu JWT
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        this.username = decoded.username;
      }
    },
  };
  </script>
  