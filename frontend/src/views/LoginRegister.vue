<template>
  <div class="container">
    <div class="form-container">
      <div class="form">
        <h2>Login</h2>
        <form @submit.prevent="login">
          <div class="form-group">
            <label for="loginEmail">Email</label>
            <input type="email" id="loginEmail" v-model="loginForm.email" required />
          </div>
          <div class="form-group">
            <label for="loginPassword">Password</label>
            <input type="password" id="loginPassword" v-model="loginForm.password" required />
          </div>
          <div class="form-group">
            <button type="submit">Login</button>
          </div>
          <p v-if="loginError" class="error">{{ loginError }}</p>
        </form>
      </div>
      <div class="form">
        <h2>Register</h2>
        <form @submit.prevent="register">
          <div v-if="registerSuccess" class="success">{{ registerSuccess }}</div>
          <div class="form-group">
            <label for="registerEmail">Email</label>
            <input type="email" id="registerEmail" v-model="registerForm.email" required />
          </div>
          <div class="form-group">
            <label for="registerUsername">Username</label>
            <input type="text" id="registerUsername" v-model="registerForm.username" required />
          </div>
          <div class="form-group">
            <label for="registerPassword">Password</label>
            <input type="password" id="registerPassword" v-model="registerForm.password" required />
          </div>
          <div class="form-group">
            <button type="submit">Register</button>
          </div>
          <p v-if="registerError" class="error">{{ registerError }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      loginForm: {
        email: '',
        password: '',
      },
      registerForm: {
        email: '',
        username: '',
        password: '',
      },
      loginError: null,
      registerError: null,
      registerSuccess: null,
    };
  },
  methods: {
    async login() {
      try {
        this.loginError = null;
        const response = await axios.post('https://api.openenvcloud.com/api/auth/login', this.loginForm);
        localStorage.setItem('token', response.data.token);
        this.$emit('authChange');
        this.$router.push('/');
      } catch (error) {
        this.loginError = error.response ? error.response.data.message : 'Error logging in';
      }
    },
    async register() {
      try {
        this.registerError = null;
        await axios.post('https://api.openenvcloud.com/api/auth/register', this.registerForm);
        this.registerSuccess = 'Successfully registered your account, now log in';
        this.registerForm.email = '';
        this.registerForm.username = '';
        this.registerForm.password = '';
      } catch (error) {
        if (error.response && error.response.data.message) {
          if (error.response.data.message.includes('Email already taken')) {
            this.registerError = 'Account with this email already exists';
          } else if (error.response.data.message.includes('Username already taken')) {
            this.registerError = 'Username already taken';
          } else {
            this.registerError = error.response.data.message;
          }
        } else {
          this.registerError = 'Error registering';
        }
      }
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.form-container {
  display: flex;
  gap: 50px;
}

.form {
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 5px;
  width: 300px;
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

.button-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.error {
  color: red;
}

.success {
  color: green;
  margin-bottom: 10px;
}
</style>
