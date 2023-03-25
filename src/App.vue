<script>
const API_URL = `http://146.59.44.4:8000/`
const API_STATUS = API_URL + `status/`;
const API_TURN_ON = API_URL+`turnOn/`;
const API_TURN_OFF = API_URL+`turnOff/`;

export default {
  data() {
    return {
      response: '',
      data: {
        processing: false,
        active: false,
        status_message: '?',
        current_speed: 0.0,

        count_ok: 0,
        count_nok: 0,
        manual_mode: false,
        warn_active: false,
        alarm_active: false,
        safety_active: false
      }
    }
  },
  methods: {
    async loadData() {
      console.log("button")
      this.response = "Loading..."
      const response = await fetch(API_STATUS)
      response.json().then(data => {
        this.response = data
        this.data = data.data
        // this.processing = data.data.processing
        // this.active = data.data.active
        // this.status_message = data.data.status_message
        // this.current_speed = data.data.current_speed

        // this.count_ok = data.data.count_ok
        // this.count_nok = data.data.count_nok
        // this.manual_mode = data.data.manual_mode
        // this.warn_active = data.data.warn_active
        // this.alarm_active = data.data.alarm_active
        // this.safety_active = data.data.safety_active

      })
    },
    async processingChange(event) {
      this.processing = event.target.checked
      if (this.processing) {
        const response = await fetch(API_TURN_ON, {method: "POST"});
        response.json().then(data => {
          this.response = data
          this.data.processing = data.data.processing
        })
      } else {
        const response = await fetch(API_TURN_OFF, {method: "POST"});
        response.json().then(data => {
          this.response = data
          this.data.processing = data.data.processing
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
import Cards from './components/Cards.vue'
</script>


<template>
  <PowerStatus :active="data.active"/>
  <PowerButton :processing="data.processing" :processingChange="processingChange"/>
  <p class="status">Status: <span>{{data.status_message}}</span></p>
  <Speed :speed="data.current_speed"/>
  <Cards v-bind="data"/>

  <span @click="loadData" class="button center">Odśwież</span>

  <p class="mt-2">{{response}}</p>
  <!-- <div class="container">
    <h1>1. Input API URL:</h1>
    <input v-model="url">
    <h1>2. Press the button:</h1>
  </div> -->
</template>

<style lang="scss">

.card {
  background-color: var(--color-background-soft);
  border-radius: 10px;
  margin: 10px 0;
  margin-bottom: 0px;
  text-align: center;
  color: #707070;
  padding: 5px 15px;
}

.status {
  font-size: 17px;
  font-weight:500;
  color: #707070;
  margin-top: 20px;
  text-align: center;
  span {
    font-size: 20px;
    font-weight: bold;
    color: var(--blue);
  }
}


</style>
