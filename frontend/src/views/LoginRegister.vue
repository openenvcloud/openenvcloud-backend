<template>
    <div class="login-register-container">
      <div class="form-container">
        <div class="tabs">
          <button @click="tab = 'login'" :class="{ active: tab === 'login' }">Login</button>
          <button @click="tab = 'register'" :class="{ active: tab === 'register' }">Register</button>
        </div>
        <div v-if="tab === 'login'">
          <form @submit.prevent="login">
            <div class="form-group">
              <label for="loginUsername">Username</label>
              <input type="text" id="loginUsername" v-model="loginUsername" required>
            </div>
            <div class="form-group">
              <label for="loginPassword">Password</label>
              <input type="password" id="loginPassword" v-model="loginPassword" required>
            </div>
            <button type="submit">Login</button>
          </form>
          <div v-if="loginErrorMessage" class="error">{{ loginErrorMessage }}</div>
        </div>
        <div v-if="tab === 'register'">
          <form @submit.prevent="register">
            <div class="form-group">
              <label for="registerUsername">Username</label>
              <input type="text" id="registerUsername" v-model="registerUsername" required>
            </div>
            <div class="form-group">
              <label for="registerPassword">Password</label>
              <input type="password" id="registerPassword" v-model="registerPassword" required>
            </div>
            <button type="submit">Register</button>
          </form>
          <div v-if="registerErrorMessage" class="error">{{ registerErrorMessage }}</div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        tab: 'login',
        loginUsername: '',
        loginPassword: '',
        registerUsername: '',
        registerPassword: '',
        loginErrorMessage: null,
        registerErrorMessage: null,
      };
    },
    methods: {
      async login() {
        try {
          const response = await axios.post('http://localhost:5000/api/auth/login', {
            username: this.loginUsername,
            password: this.loginPassword
          });
          localStorage.setItem('token', response.data.token);
          this.$router.push('/');
        } catch (error) {
          this.loginErrorMessage = error.response ? error.response.data.message : error.message;
        }
      },
      async register() {
        try {
          await axios.post('http://localhost:5000/api/auth/register', {
            username: this.registerUsername,
            password: this.registerPassword
          });
          this.$router.push('/login-register');
        } catch (error) {
          this.registerErrorMessage = error.response ? error.response.data.message : error.message;
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .login-register-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
  }
  
  .form-container {
    background: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .tabs {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
  }
  
  .tabs button {
    background: none;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    font-size: 16px;
  }
  
  .tabs .active {
    font-weight: bold;
    border-bottom: 2px solid #1976D2;
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
    width: 100%;
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
  
  .error {
    color: red;
    margin-top: 10px;
  }
  </style>
  