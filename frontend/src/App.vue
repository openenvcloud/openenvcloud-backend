<template>
  <div id="app">
    <Header />
    <main>
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script>
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';

export default {
  components: {
    Header,
    Footer
  }
}
</script>

<style>
html, body, #app {
  height: 100%;
  margin: 0;
  font-family: 'Roboto', sans-serif;
}

main {
  padding-top: 60px; /* wysokość nagłówka */
  padding-bottom: 60px; /* wysokość stopki */
  flex: 1;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
