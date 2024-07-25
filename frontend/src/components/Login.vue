<template>
    <div>
      <h2>Login</h2>
      <form @submit.prevent="login">
        <div>
          <label for="username">Username:</label>
          <input type="text" v-model="username" required />
        </div>
        <div>
          <label for="password">Password:</label>
          <input type="password" v-model="password" required />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        username: '',
        password: '',
      };
    },
    methods: {
      async login() {
        try {
          const response = await axios.post('http://localhost:5000/api/users/login', {
            username: this.username,
            password: this.password,
          });
          localStorage.setItem('token', response.data.token);
          console.log('User logged in:', response.data);
        } catch (error) {
          console.error('Error logging in user:', error);
        }
      },
    },
  };
  </script>
  