<script>
const API_URL = `https://jsonplaceholder.typicode.com/todos/1`

export default {
  data() {
    return {
      url: API_URL,
      response: ''
    }
  },
  methods: {
    async buttonClicked() {
      console.log("button")
      this.response = "Loading..."
      this.response= await (await fetch(this.url)).text()
    }
  }
}
</script>

<template>
  <div class="container">
    <h1>1. Input API URL:</h1>
    <input v-model="url">
    <h1>2. Press the button:</h1>
    <span @click="buttonClicked" class="button center">Button</span>

    <p class="mt-2">{{response}}</p>
  </div>
</template>

<style scoped>

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
