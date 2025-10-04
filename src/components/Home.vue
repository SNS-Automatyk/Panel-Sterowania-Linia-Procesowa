<script>
import { API_URL } from '../variables'
const API_STATUS = API_URL;

export default {
    data() {
        return {
            response: '',
            // websocket connection + reconnect timer
            ws: null,
            reconnectTimer: null,
            reconnectDelayMs: 1000, // will backoff up to max
            maxReconnectDelayMs: 5000,
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
                "speed": 0,
                is_connected: false,
            },
            rpi_last_connected: null,
            // deprecated: update_key used for forcing computed updates during polling
        }
    },
    created() {
        // Start live updates over WebSocket instead of periodic fetch
        this.openWebSocket();
    },
    beforeUnmount() {
        // Cleanup ws + any pending reconnects
        try {
            if (this.reconnectTimer) {
                clearTimeout(this.reconnectTimer);
                this.reconnectTimer = null;
            }
            if (this.ws) {
                this.ws.onopen = null;
                this.ws.onmessage = null;
                this.ws.onclose = null;
                this.ws.onerror = null;
                try { this.ws.close(); } catch (e) {}
                this.ws = null;
            }
        } catch (e) {
            // no-op
        }
    },
    computed: {
        rpi_connected() {
            // Consider connected if WS is open, otherwise fallback to last message time window
            if (this.ws && this.ws.readyState === 1) return true;
            if (this.rpi_last_connected === null) return false;
            return (Date.now() - this.rpi_last_connected) <= 2000;
        }
    },
    methods: {
        openWebSocket() {
            try {
                const ws = new WebSocket("ws://" + API_URL);
                this.ws = ws;

                ws.onopen = () => {
                    // Reset reconnect delay on successful connect
                    this.rpi_last_connected = Date.now();
                    this.reconnectDelayMs = 1000;
                    if (this.reconnectTimer) {
                        clearTimeout(this.reconnectTimer);
                        this.reconnectTimer = null;
                    }
                };

                ws.onmessage = (event) => {
                    try {
                        const payload = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
                        this.response = payload;
                        if (payload && payload.data) {
                            this.data = payload.data;
                        }
                    } catch (e) {
                        // Non-JSON or parse error; ignore
                    } finally {
                        this.rpi_last_connected = Date.now();
                    }
                };

                ws.onclose = () => {
                    // Attempt reconnect with backoff
                    this.scheduleReconnect();
                };

                ws.onerror = () => {
                    // Close to trigger onclose and reconnect
                    try { ws.close(); } catch (e) {}
                };
            } catch (e) {
                // Unable to create WS, try again later
                this.scheduleReconnect();
            }
        },
        scheduleReconnect() {
            if (this.reconnectTimer) return; // already scheduled
            const delay = Math.min(this.reconnectDelayMs, this.maxReconnectDelayMs);
            this.reconnectTimer = setTimeout(() => {
                this.reconnectTimer = null;
                this.reconnectDelayMs = Math.min(this.reconnectDelayMs * 2, this.maxReconnectDelayMs);
                this.openWebSocket();
            }, delay);
        },
    },
}

</script>

<script setup>
import PowerButton from './PowerButton.vue'
import PowerStatus from './PowerStatus.vue'
import ExtraButtons from './ExtraButtons.vue'
import Speed from './Speed.vue'
import Cards from './Cards.vue'
</script>


<template>
    <div>
        <PowerStatus :is_connected="data.is_connected" :rpi_connected="rpi_connected" />
        <PowerButton :data="data" />
        <p class="status">Status: <span>{{ data.status }}</span></p>
        <ExtraButtons />
        <Speed :data="data" />
        <Cards :data="data" />


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
