<template>
    <div class="stats">
      <h1>Stats</h1>
      <div class="filters">
        <label for="sensorSelect">Select Sensor:</label>
        <select id="sensorSelect" v-model="selectedSensor">
          <option v-for="sensor in sensors" :key="sensor.id" :value="sensor.id">
            {{ sensor.name }}
          </option>
        </select>
      </div>
      <div class="charts">
        <canvas id="temperatureChart"></canvas>
        <canvas id="humidityChart"></canvas>
        <canvas id="airQualityChart"></canvas>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import Chart from 'chart.js/auto';
  
  export default {
    data() {
      return {
        sensors: [],
        selectedSensor: null,
        temperatureData: [],
        humidityData: [],
        airQualityData: []
      };
    },
    async mounted() {
      this.fetchSensors();
      this.initializeCharts();
    },
    watch: {
      selectedSensor(newSensorId) {
        if (newSensorId) {
          this.fetchSensorData(newSensorId);
        }
      }
    },
    methods: {
      async fetchSensors() {
        const token = localStorage.getItem('token');
        try {
          const response = await axios.get('http://localhost:5000/api/sensors', {
            headers: { Authorization: `Bearer ${token}` }
          });
          this.sensors = response.data;
        } catch (error) {
          console.error('Error fetching sensors:', error);
        }
      },
      async fetchSensorData(sensorId) {
        try {
          const response = await axios.get(`http://localhost:5000/api/sensors/${sensorId}/data`);
          this.temperatureData = response.data.temperature;
          this.humidityData = response.data.humidity;
          this.airQualityData = response.data.airQuality;
          this.updateCharts();
        } catch (error) {
          console.error('Error fetching sensor data:', error);
        }
      },
      initializeCharts() {
        this.temperatureChart = new Chart(document.getElementById('temperatureChart'), {
          type: 'line',
          data: {
            labels: [],
            datasets: [{
              label: 'Temperature',
              data: [],
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              x: {
                type: 'time',
                time: {
                  unit: 'day'
                }
              }
            }
          }
        });
  
        this.humidityChart = new Chart(document.getElementById('humidityChart'), {
          type: 'line',
          data: {
            labels: [],
            datasets: [{
              label: 'Humidity',
              data: [],
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              x: {
                type: 'time',
                time: {
                  unit: 'day'
                }
              }
            }
          }
        });
  
        this.airQualityChart = new Chart(document.getElementById('airQualityChart'), {
          type: 'line',
          data: {
            labels: [],
            datasets: [{
              label: 'Air Quality',
              data: [],
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              x: {
                type: 'time',
                time: {
                  unit: 'day'
                }
              }
            }
          }
        });
      },
      updateCharts() {
        this.temperatureChart.data.labels = this.temperatureData.map(d => d.date);
        this.temperatureChart.data.datasets[0].data = this.temperatureData.map(d => d.value);
        this.temperatureChart.update();
  
        this.humidityChart.data.labels = this.humidityData.map(d => d.date);
        this.humidityChart.data.datasets[0].data = this.humidityData.map(d => d.value);
        this.humidityChart.update();
  
        this.airQualityChart.data.labels = this.airQualityData.map(d => d.date);
        this.airQualityChart.data.datasets[0].data = this.airQualityData.map(d => d.value);
        this.airQualityChart.update();
      }
    }
  }
  </script>
  
  <style scoped>
  .stats {
    max-width: 800px;
    margin: 50px auto;
    text-align: center;
  }
  
  .filters {
    margin-bottom: 20px;
  }
  
  .filters label {
    margin-right: 10px;
  }
  
  .charts {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  canvas {
    width: 100% !important;
    height: 400px !important;
  }
  </style>
  