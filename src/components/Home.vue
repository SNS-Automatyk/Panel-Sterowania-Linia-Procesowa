<script>
import { API_URL } from '../variables'
const API_STATUS = API_URL + `status/`;
const API_TURN_ON = API_URL + `turnOn/`;
const API_TURN_OFF = API_URL + `turnOff/`;

export default {
    data() {
        return {
            response: '',
            timer: '',
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
    created() {
        this.loadData();
        this.timer = setInterval(this.loadData, 500);
    },
    beforeDestroy() {
        clearInterval(this.timer);
    },
    methods: {
        async loadData() {
            console.log("loading...")
            this.response = "Loading..."
            const response = await fetch(API_STATUS)
            response.json().then(data => {
                this.response = data
                this.data = data.data

            })
        },
    },
}

</script>

<script setup>
import PowerButton from './PowerButton.vue'
import PowerStatus from './PowerStatus.vue'
import Speed from './Speed.vue'
import Cards from './Cards.vue'
</script>


<template>
    <PowerStatus :active="data.active" />
    <PowerButton :data="data"  />
    <p class="status">Status: <span>{{ data.status_message }}</span></p>
    <Speed :data="data" />
    <Cards v-bind="data" />
    

    <!-- <span @click="loadData" class="button center">Odśwież</span>

    <p class="mt-2">{{ response }}</p> -->
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
    font-weight: 500;
    color: #707070;
    margin-top: 12px;
    text-align: center;

    span {
        font-size: 20px;
        font-weight: bold;
        color: var(--blue);
    }
}


</style>
