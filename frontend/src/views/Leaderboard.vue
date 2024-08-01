<template>
    <div class="leaderboard">
      <h1>Leaderboard</h1>
      <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
      <table v-if="leaderboard.length">
        <thead>
          <tr>
            <th>Username</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in leaderboard" :key="user.username">
            <td>{{ user.username }}</td>
            <td>{{ user.points }}</td>
          </tr>
        </tbody>
      </table>
      <div v-else class="no-data">No data available</div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        leaderboard: [],
        errorMessage: null
      };
    },
    async mounted() {
      this.fetchLeaderboard();
    },
    methods: {
      async fetchLeaderboard() {
        try {
          const response = await axios.get('https://api.openenvcloud.com/api/users/leaderboard');
          this.leaderboard = response.data;
        } catch (error) {
          this.errorMessage = error.response ? error.response.data.message : error.message;
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .leaderboard {
    max-width: 800px;
    margin: 50px auto;
    text-align: center;
  }
  
  .leaderboard h1 {
    font-size: 32px;
    margin-bottom: 20px;
  }
  
  .leaderboard table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .leaderboard th, .leaderboard td {
    border: 1px solid #ddd;
    padding: 8px;
  }
  
  .leaderboard th {
    background-color: #1976D2;
    color: white;
  }
  
  .leaderboard td {
    text-align: center;
  }
  
  .error {
    color: red;
    margin-top: 20px;
  }
  
  .no-data {
    margin-top: 20px;
  }
  </style>
  