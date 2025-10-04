<script>
import { API_URL } from '../variables'
const API_STATUS = API_URL;

export default {
    data() {
        return {
            response: '',
            timer: '',
            data: {
                "analyze": 0,
                "result": 0,
                "finished": 0,
                "error": 0,
                "on_off": 0,
                "red_button": 0,
                "yellow_button": 0,
                "switch_status": 0,
                "green_light": 0,
                "red_light": 0,
                "yellow_button_light": 0,
                "orange_light": 0,
                "white_light": 0,
                "good_count": 0,
                "bad_count": 0,
                "status": 0,
                "speed": 0
            },
            rpi_last_connected: null,
            update_key: 0,
        }
    },
    created() {
        this.loadData();
        this.timer = setInterval(this.loadData, 500);
    },
    beforeDestroy() {
        clearInterval(this.timer);
    },
    computed: {
        rpi_connected() {
            this.update_key;
            if (this.rpi_last_connected === null) {
                return false;
            }
            return (Date.now() - this.rpi_last_connected) <= 2000;
        }
    },
    methods: {
        async loadData() {
            // console.log("loading...")
            this.update_key += 1;
            this.response = "Loading..."
            const response = await fetch(API_STATUS)
            response.json().then(data => {
                this.response = data
                this.data = data.data
                this.rpi_last_connected = Date.now()
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
    <div>
        <PowerStatus :is_connected="data.is_connected" :rpi_connected="rpi_connected" />
        <PowerButton :data="data" />
        <p class="status">Status: <span>{{ data.status }}</span></p>
        <Speed :data="data" />
        <Cards v-bind="data" />


        <!-- <span @click="loadData" class="button center">Odśwież</span>

    <p class="mt-2">{{ response }}</p> -->
        <!-- <div class="container">
        <h1>1. Input API URL:</h1>
        <input v-model="url">
        <h1>2. Press the button:</h1>
      </div> -->
    </div>
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
