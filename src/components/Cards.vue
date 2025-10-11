<script>
import { API_URL } from '../variables'
import CameraPreviewModal from '@/components/CameraPreviewModal.vue';
import Overlay from './Overlay.vue';

export default {
    data() {
        return {
            API_URL: API_URL,
        }
    },
    components: {
        CameraPreviewModal,
        Overlay
    },
    props: {
        data: {
            type: Object,
            required: true
        },
    },
    methods: {
        toggleSystemWizyjny() {
            this.data.system_wizyjny_on_off = !this.data.system_wizyjny_on_off;
            fetch("http://" + API_URL + "/api", {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ data: { system_wizyjny_on_off: this.data.system_wizyjny_on_off } })
            });
        },
        analizuj() {
            this.data.analyze = true;
            fetch("http://" + API_URL + "/api", {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ data: { analyze: true } })
            });
        }
    }
}
</script>

<template>
    <div class="card_container">
        <div class="card">
            <h1 style="color: var(--green)">{{ data.good_count }}</h1>
            <p class="p2">Poprawnych itemków</p>
        </div>
        <div class="card">
            <h1 style="color: var(--orange)">{{ data.bad_count }}</h1>
            <p class="p2">Złych itemków</p>
        </div>
        <div class="card">
            <p class="p1">Status systemu wizyjnego</p>
            <div style="display: flex; align-items: center; gap: 10px; margin-top: 0">
                <input type="checkbox" id="system_wizyjny_on_off" class="switch" @change="toggleSystemWizyjny"
                    :checked="data.system_wizyjny_on_off">

                <div>
                    <h2 v-if="data.error" style="color: var(--red)">Błąd</h2>
                    <h2 v-else style="color: var(--green)">OK</h2>
                </div>

                <button @click="analizuj" :disabled="data.analyze"
                    style="margin-left: auto; padding: 6px 12px; background-color: var(--blue); color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Analizuj
                </button>
            </div>
        </div>
        <div class="card">
            <p class="p1">Panel</p>
            <div class="lights">
                <div class="light green-light" :class="{ active: data.green_light }"></div>
                <div class="light red-light" :class="{ active: data.red_light }"></div>
                <div class="light orange-light" :class="{ active: data.orange_light }"></div>
                <div class="light yellow-button-light" :class="{ active: data.yellow_button_light }"></div>
                <div class="light white-light" :class="{ active: data.white_light }"></div>
                <div class="switch" :class="{ on: data.switch_status }"></div>
            </div>
        </div>
        <div class="card">
            <p class="p1">Podgląd kamery</p>
            <button @click="$refs.camera_preview_overlay.show()">
                Otwórz podgląd
            </button>

            <Overlay ref="camera_preview_overlay" @show="$refs.camera_preview_modal.show()">
                <CameraPreviewModal @hide="$refs.camera_preview_overlay.hide()" ref="camera_preview_modal" />
            </Overlay>
        </div>
        <div class="card">
            <p class="p1">Wyniki systemu wizyjnego</p>
            <router-link class="button" to="/images">Zobacz</router-link>
        </div>
    </div>
</template>

<style scoped lang="scss">
.card {
    width: calc(50% - 5px);
    height: 80px;
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

h1 {
    margin-top: -8px;
    font-size: 34px;
    font-weight: bold;
}
h2 {
    font-size: 19px;
    line-height: 19px;
    font-weight: bold;
    text-align: center;
}
.p1 {
    font-size: 16px;
    font-weight: normal;
    color: #717171;
}
.p2 {
    margin-top: -8px;
    font-size: 12px;
    font-weight: normal;
    color: #717171;
}
.card_container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    // margin-top: -10px;
    margin-bottom: 20px;
}
.lights {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 4px;
}
button,.button {
    margin-top: 4px;
    padding: 6px 12px;
    background-color: var(--blue);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 8px 14px;
    font-size: 14px;
    line-height: 14px;
    &:active {
        transform: scale(0.98);
    }
    &:disabled {
        cursor: not-allowed;
        opacity: 0.6;
        pointer-events: none;
    }
}
.light {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #d1d1d1;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    overflow: hidden;

    &::after {
        content: '';
        display: block;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        opacity: 0.75;
        transition: opacity 0.2s;
        background: black;
    }
    &.active::after {
        opacity: 0;
    }
    &.green-light {
        background-color: #4caf50;
    }
    &.red-light {
        background-color: #f44336;
    }
    &.orange-light {
        background-color: #ff9800;
    }
    &.yellow-button-light {
        background-color: #ffeb3b;
    }
    &.white-light {
        background-color: #ffffff;
    }
}
.switch {
    width: 35px;
    height: 20px;
    border-radius: 15px;
    background-color: #535353;
    position: relative;
    transition: background-color 0.2s;
    &.on {
        background-color: #4caf50;
    }
    &::after {
        content: '';
        position: absolute;
        top: 2px;
        left: 2px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background-color: #ffffff;
        transition: left 0.2s;
    }
    &.on::after {
        left: 18px;
        
    }
}   

input.switch {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    width: 35px;
    height: 20px;
    background-color: #535353;
    border-radius: 15px;
    position: relative;
    outline: none;
    cursor: pointer;
    transition: background-color 0.2s;
}
input.switch:checked {
    background-color: #4caf50;
}
input.switch::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: #ffffff;
    transition: left 0.2s;
}
input.switch:checked::after {
    left: 18px;
}
</style>