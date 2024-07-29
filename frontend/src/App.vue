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
  flex: 1;
  margin-top: 48px;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
