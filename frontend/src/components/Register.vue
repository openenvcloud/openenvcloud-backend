<template>
  <v-container class="register-container">
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Register</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="register">
              <v-text-field v-model="username" label="Username" required></v-text-field>
              <v-text-field v-model="password" label="Password" type="password" required></v-text-field>
              <v-btn type="submit" color="primary" class="mt-4">Register</v-btn>
            </v-form>
            <v-alert v-if="errorMessage" type="error" class="mt-4">{{ errorMessage }}</v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      password: '',
      errorMessage: null
    };
  },
  methods: {
    async register() {
      try {
        await axios.post('http://localhost:5000/api/auth/register', {
          username: this.username,
          password: this.password
        });
        this.$router.push('/login');
      } catch (error) {
        this.errorMessage = error.response ? error.response.data.message : error.message;
      }
    }
  }
}
</script>

<style scoped>
.register-container {
  margin-top: 50px;
}

.v-card {
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.v-card-title {
  font-size: 24px;
  font-weight: 500;
  text-align: center;
}

.v-btn {
  font-weight: bold;
}

.v-alert {
  margin-top: 20px;
}
</style>
