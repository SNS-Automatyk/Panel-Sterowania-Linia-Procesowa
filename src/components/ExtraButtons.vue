<script>

import { API_URL } from '../variables'

export default {
  methods: {
    redButtonClick() {
      this.sendUpdate("red_button")
    },
    yellowButtonClick() {
      this.sendUpdate("yellow_button")
    },
    async sendUpdate(button) {
      const response = await fetch("http://" + API_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: { [button]: 1 } })
      });
    },

  }
}
</script>


<template>
  <div class="extra-buttons">
    <div class="red-button button" @click="redButtonClick"></div>
    <div class="yellow-button button" @click="yellowButtonClick"></div>
  </div>

  
</template>
    
<style scoped lang="scss">
.extra-buttons {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin: 10px auto;
    .button {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    }
    .red-button {
        background-color: var(--red);
        &.active {
            box-shadow: 0 0 15px rgba(255, 0, 0, 0.7);
            transform: scale(1.1);
        }
    }
    .yellow-button {
        background-color: var(--orange);
    }
}
</style>