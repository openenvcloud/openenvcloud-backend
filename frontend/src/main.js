// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import './styles/main.css'

//import { library } from '@fortawesome/fontawesome-svg-core'
//import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

///library.add(...all)

createApp(App)
  //.component('font-awesome-icon', FontAwesomeIcon)
  .use(router)
  .mount('#app');
