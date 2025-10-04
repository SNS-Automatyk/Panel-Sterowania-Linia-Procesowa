<script>
export default {
    props: {
        error: {
            type: Number,
            required: true
        },
        switch_status: {
            type: Number,
            required: true
        },
        green_light: {
            type: Number,
            required: true
        },
        red_light: {
            type: Number,
            required: true
        },
        orange_light: {
            type: Number,
            required: true
        },
        yellow_button_light: {
            type: Number,
            required: true
        },
        white_light: {
            type: Number,
            required: true
        },
        good_count: {
            type: Number,
            required: true
        },
        bad_count: {
            type: Number,
            required: true
        }
    }
}
</script>

<template>
    <div class="card_container">
        <div class="card">
            <h1 style="color: var(--green)">{{ good_count }}</h1>
            <p class="p2">Poprawnych itemków</p>
        </div>
        <div class="card">
            <h1 style="color: var(--orange)">{{ bad_count }}</h1>
            <p class="p2">Złych itemków</p>
        </div>
        <div class="card">
            <p class="p1">Status systemu wizyjnego</p>
            <h2 v-if="error" style="color: var(--red)">Błąd</h2>
            <h2 v-else style="color: var(--green)">OK</h2>
        </div>
        <div class="card">
            <p class="p1">Panel</p>
            <div class="lights">
                <div class="light green-light" :class="{ active: green_light }"></div>
                <div class="light red-light" :class="{ active: red_light }"></div>
                <div class="light orange-light" :class="{ active: orange_light }"></div>
                <div class="light yellow-button-light" :class="{ active: yellow_button_light }"></div>
                <div class="light white-light" :class="{ active: white_light }"></div>
                <div class="switch" :class="{ on: switch_status }"></div>
            </div>
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
    margin-top: -6px;
    font-size: 19px;
    font-weight: bold;
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
</style>