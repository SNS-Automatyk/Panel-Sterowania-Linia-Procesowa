<script>
export default {
    props: {
        count_ok: {
            type: Number,
            required: true
        },
        count_nok: {
            type: Number,
            required: true
        },
        manual_mode: {
            type: Boolean,
            required: true
        },
        warn_active: {
            type: Boolean,
            required: true
        },
        alarm_active: {
            type: Boolean,
            required: true
        },
        safety_active: {
            type: Boolean,
            required: true
        }
    }
}
</script>

<template>
    <div class="card_container">
        <div class="card">
            <h1 style="color: var(--green)">{{ count_ok }}</h1>
            <p class="p2">Poprawnych itemków</p>
        </div>
        <div class="card">
            <h1 style="color: var(--orange)">{{ count_nok }}</h1>
            <p class="p2">Złych itemków</p>
        </div>
        <div class="card">
            <p class="p1">Tryb</p>
            <h2 v-if="manual_mode" style="color: var(--blue)">Manualny</h2>
            <h2 v-else style="color: var(--green)">Automatyczny</h2>
        </div>
        <div class="card">
            <p class="p1">Warn</p>
            <h2 v-if="warn_active" style="color: var(--red)">Aktywny</h2>
            <h2 v-else style="color: var(--green)">Nieaktywny</h2>
        </div>
        <div class="card">
            <p class="p1">Alarm</p>
            <h2 v-if="alarm_active" style="color: var(--red)">Aktywny</h2>
            <h2 v-else style="color: var(--green)">Nieaktywny</h2>
        </div>
        <div class="card">
            <p class="p1">Safety</p>
            <h2 v-if="safety_active" style="color: var(--red)">Zatrzymanie awaryjne</h2>
            <h2 v-else style="color: var(--green)">OK</h2>
        </div>
    </div>
</template>

<style scoped lang="scss">
.card {
    width: calc(50% - 5px);
    height: 90px;
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

h1 {
    margin-top: -8px;
    font-size: 36px;
    font-weight: bold;
}
h2 {
    margin-top: -6px;
    font-size: 21px;
    font-weight: bold;
}
.p1 {
    font-size: 17px;
    font-weight: normal;
    color: #717171;
}
.p2 {
    margin-top: -8px;
    font-size: 13px;
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
</style>