<template>
    <header class="header">
      <div class="container">
        <div class="logo">
          <router-link to="/">Open Data Map</router-link>
        </div>
        <nav class="nav">
          <ul>
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/map">Map</router-link></li>
            <li><router-link to="/stats">Stats</router-link></li>
            <li><router-link to="/leaderboard">Leaderboard</router-link></li>
            <li v-if="!isAuthenticated"><router-link to="/login-register">Login</router-link></li>
            <li v-else><router-link to="/profile">Profile</router-link></li>
            <li v-if="!isAuthenticated"><router-link to="/login-register">Register</router-link></li>
            <li v-else><a href="#" @click.prevent="logout">Logout</a></li>
          </ul>
        </nav>
      </div>
    </header>
  </template>
  
  <script>
  export default {
    data() {
      return {
        username: ''
      };
    },
    computed: {
      isAuthenticated() {
        return !!localStorage.getItem('token');
      }
    },
    methods: {
      logout() {
        localStorage.removeItem('token');
        this.username = '';
        this.$router.push('/');
      }
    }
  }
  </script>
  
  <style scoped>
  .header {
    background-color: #1976D2;
    color: white;
    padding: 10px 0;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1000;
  }
  
  .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  .logo a {
    color: white;
    text-decoration: none;
    font-size: 24px;
    font-weight: bold;
  }
  
  .nav ul {
    list-style: none;
    display: flex;
    gap: 20px;
  }
  
  .nav a {
    color: white;
    text-decoration: none;
  }
  
  .nav a:hover {
    text-decoration: underline;
  }
  </style>
  