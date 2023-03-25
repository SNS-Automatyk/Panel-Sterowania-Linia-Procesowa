<script>
const API_URL = `http://146.59.44.4:8000/`
const API_STATUS = API_URL + `status/`;
const API_TURN_ON = API_URL+`turnOn/`;
const API_TURN_OFF = API_URL+`turnOff/`;

export default {
  data() {
    return {
      response: '',
      processing: false,
      active: false,
      status_message: '?',
      speed: 10.0
    }
  },
  methods: {
    async loadData() {
      console.log("button")
      this.response = "Loading..."
      const response = await fetch(API_STATUS)
      response.json().then(data => {
        this.response = data
        this.processing = data.data.processing
        this.active = data.data.active
        this.status_message = data.data.status_message
        // this.speed = data.data.speed
      })
    },
    async processingChange(event) {
      this.processing = event.target.checked
      if (this.processing) {
        const response = await fetch(API_TURN_ON, {method: "POST"});
        response.json().then(data => {
          this.response = data
          this.processing = data.data.processing
        })
      } else {
        const response = await fetch(API_TURN_OFF, {method: "POST"});
        response.json().then(data => {
          this.response = data
          this.processing = data.data.processing
        })
      }
    }
  },
  mounted() {
    this.loadData()
  }
}

</script>


<script setup>
import PowerButton from './components/PowerButton.vue'
import PowerStatus from './components/PowerStatus.vue'
import Speed from './components/Speed.vue'
</script>


<template>
  <PowerStatus :active="active"/>
  <PowerButton :processing="processing" :processingChange="processingChange"/>
  <p class="status">Status: <span>{{status_message}}</span></p>
  <Speed :speed="speed"/>
    <span @click="loadData" class="button center">Odśwież</span>

    <p class="mt-2">{{response}}</p>
  <!-- <div class="container">
    <h1>1. Input API URL:</h1>
    <input v-model="url">
    <h1>2. Press the button:</h1>
  </div> -->
</template>

<style scoped lang="scss">
.card {
  background-color: var(--color-background-soft);
  border-radius: 10px;
  margin: 10px;
  text-align: center;
  color: #707070;
}
.status {
  font-size: 17pt;
  font-weight:500;
  color: #707070;
  margin-top: 20px;
  text-align: center;
  span {
    font-size: 20pt;
    font-weight: bold;
    color: #59A8AD;
  }
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;
}

.mt-2 {
  margin-top: 10px;
}

.button {
 background-color: rgb(222, 66, 49);
 color: var(--color-heading-reversed);
 font-weight: 600;
 padding: 10px 60px;
 border-radius: 10px;
}

.button:hover {
 background-color: rgb(181, 46, 31);
}

input {
  font-size: 15pt;
  max-width: 100%;
  width: 500px;

  color: var(--color-text);
  background: var(--color-background-soft);
}


</style>
