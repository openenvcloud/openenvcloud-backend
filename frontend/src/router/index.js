// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import LoginRegister from '../views/LoginRegister.vue';
import Profile from '../views/Profile.vue';
import Map from '../views/Map.vue';
import Stats from '../views/Stats.vue';
import Leaderboard from '../views/Leaderboard.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login-register',
    name: 'LoginRegister',
    component: LoginRegister
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/map',
    name: 'Map',
    component: Map
  },
  {
    path: '/stats',
    name: 'Stats',
    component: Stats
  },
  {
    path: '/leaderboard',
    name: 'Leaderboard',
    component: Leaderboard
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
