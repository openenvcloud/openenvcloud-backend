<template>
    <v-app-bar app color="primary" dark>
      <v-img src="@/assets/logo.png" alt="Logo" contain max-width="40" class="mr-3"></v-img>
      <v-toolbar-title>Open Data Map</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn v-if="!isAuthenticated" text @click="login">Login</v-btn>
      <v-btn v-if="!isAuthenticated" text @click="register">Register</v-btn>
      <v-menu v-else bottom left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn text v-bind="attrs" v-on="on">
            {{ username }}
            <v-icon right>mdi-menu-down</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="logout">
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
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
    mounted() {
      if (this.isAuthenticated) {
        // Fetch the username for the authenticated user
        this.username = 'John Doe'; // Replace this with actual API call if needed
      }
    },
    methods: {
      login() {
        this.$router.push('/login');
      },
      register() {
        this.$router.push('/register');
      },
      logout() {
        localStorage.removeItem('token');
        this.username = '';
        this.$router.push('/login');
      }
    }
  }
  </script>
  
  <style scoped>
  .v-toolbar-title {
    font-weight: bold;
  }
  .v-img {
    border-radius: 50%;
  }
  </style>
  