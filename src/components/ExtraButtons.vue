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
      const response = await fetch("http://" + API_URL + "/api", {
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
        transition: all 0.1s ease-in-out;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        border: rgba(0, 0, 0, 0.4) solid 4px;
        &:active {
            transform: scale(0.9);
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        }
    }
    .red-button {
        background-color: var(--red);
    }
    .yellow-button {
        background-color: var(--orange);
    }
}
</style>