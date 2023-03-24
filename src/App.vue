<script>
const API_URL = `http://146.59.44.4:8000/`
const API_STATUS = API_URL + `status/`;
const API_TURN_ON = API_URL+`turnOn/`;
const API_TURN_OFF = API_URL+`turnOff/`;

export default {
  data() {
    return {
      response: '',
      processing: false
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
      })
    },
    processingChange(event) {
      this.processing = event.target.checked
      if (this.processing) {
        fetch(API_TURN_ON, {method: "POST"})
      } else {
        fetch(API_TURN_OFF, {method: "POST"})
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
</script>


<template>
  <PowerButton :processing="processing" :processingChange="processingChange"/>
    <span @click="loadData" class="button center">Odśwież</span>

    <p class="mt-2">{{response}}</p>
  <!-- <div class="container">
    <h1>1. Input API URL:</h1>
    <input v-model="url">
    <h1>2. Press the button:</h1>
  </div> -->
</template>

<style scoped>

PowerButton {
  margin: 0 auto;
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
