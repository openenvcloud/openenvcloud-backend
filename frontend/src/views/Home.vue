<template>
  <div class="home">
    <div class="hero">
      <h1>Open Data Cloud</h1>
      <p>Collaborate, Share & Understand.</p>
    </div>
    <div class="content">
      <div v-if="isAuthenticated">
        <p>Welcome, {{ username }}.</p>
        <p>Thank you for being a part of our community. Feel free to explore the features of our platform.</p>
      </div>
      <div v-else>
        <p>Please <router-link to="/login-register">log in</router-link> or <router-link to="/login-register">register</router-link> to use the full features of the application.</p>
      </div>
      <div class="info">
        <h2>About Open Data Cloud</h2>
        <p>
          Open Data Cloud is an open-source platform that collects data from smart sensors. It allows users to share and visualize data such as air quality, temperature, and humidity on an interactive map.
        </p>
        <h2>Our Mission</h2>
        <p>
          We believe that data transparency and accessibility can drive better understanding and solutions for global challenges. By leveraging data from various locations, we can gain insights into environmental changes, climate dynamics, and urban development.
        </p>
        <p>
          Our mission is to provide a collaborative environment where users can contribute and access valuable data to improve our understanding of the environment and enhance our quality of life.
        </p>
        <h2>Our Vision</h2>
        <p>
          We envision a world where data is freely accessible to everyone. A world where citizens, researchers, and organizations can work together to create a comprehensive understanding of our planet's systems.
        </p>
        <p>
          Through Open Data Cloud, we aim to:
        </p>
        <ul>
          <li>Empower individuals and communities with data</li>
          <li>Support independent research and innovation</li>
          <li>Foster collaboration and data sharing</li>
          <li>Promote transparency and accountability</li>
        </ul>
        <h2 style="margin-top: 20px;">Features</h2>
        <ul>
          <li>Collect data from various sensors</li>
          <li>Visualize data on an interactive map</li>
          <li>Access historical data and statistics</li>
          <li>Contribute to the community and earn points</li>
          <li>Completely open-source and free to use</li>
        </ul>
        <h2 style="margin-top: 20px;">A special thanks to all contributors to the project</h2>
        <div class="contributors">
          <div v-for="contributor in contributors" :key="contributor.id" class="contributor">
            <img :src="contributor.avatar_url" :alt="contributor.login">
            <p>{{ contributor.login }}</p>
          </div>
        </div>
        <h2>Join Us on GitHub</h2>
        <p>
          Open Data Cloud is an open-source project, and we welcome contributions from the community. Visit our <a href="https://github.com/ozeppo/OpenDataCloud" target="_blank">GitHub repository</a> to explore the code, report issues, and contribute to the project.
        </p>
        <div class="github-widget">
          <img src="https://myreadme.vercel.app/api/embed/ozeppo?panels=userstatistics,toprepositories,toplanguages,commitgraph" alt="reimaginedreadme" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      isAuthenticated: false,
      contributors: []
    };
  },
  async created() {
    const token = localStorage.getItem('token');
    if (token) {
      this.isAuthenticated = true;
      await this.fetchProfile();
    }
    await this.fetchContributors();
  },
  methods: {
    async fetchProfile() {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('https://api.openenvcloud.com/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.username = response.data.username;
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    },
    async fetchContributors() {
      try {
        const response = await axios.get('https://api.github.com/repos/ozeppo/OpenDataCloud/contributors');
        this.contributors = response.data;
      } catch (error) {
        console.error('Error fetching contributors:', error);
      }
    }
  }
};
</script>

<style scoped>
.home {
  text-align: center;
  margin-top: 50px;
  padding: 20px;
}

.hero {
  padding: 50px 20px;
  margin-bottom: 40px;
}

.hero h1 {
  font-size: 48px;
  margin-bottom: 10px;
}

.hero p {
  font-size: 24px;
}

.content {
  max-width: 70%;
  margin: 0 auto;
  text-align: left;
}

.home h1 {
  font-size: 36px;
  margin-bottom: 20px;
  text-align: center;
}

.home p {
  font-size: 18px;
  color: #555;
}

.info {
  margin-top: 40px;
}

.info h2 {
  font-size: 28px;
  margin-bottom: 15px;
}

.info p {
  font-size: 16px;
  color: #555;
  margin-bottom: 20px;
}

.info ul {
  list-style: none;
  padding: 0;
}

.info ul li {
  font-size: 16px;
  color: #555;
  margin-bottom: 10px;
  padding-left: 20px;
  position: relative;
}

.info ul li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #1976D2;
  font-size: 24px;
}

.info a {
  color: #1976D2;
  text-decoration: none;
}

.info a:hover {
  text-decoration: underline;
}

.github-widget {
  margin-top: 40px;
  text-align: center;
  margin-bottom: 70px;
}

.contributors {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 30px;
}

.contributor {
  margin: 10px;
  text-align: center;
  margin-bottom: 40px;
}

.contributor img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.contributor p {
  margin-top: 5px;
  font-size: 14px;
}
</style>
