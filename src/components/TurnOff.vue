<script>
export default {
    props: {
        turnOff: {
            type: Function,
            required: true
        }
    }
}
</script>

<template>
    <div class="card">
        <p class="title">Czy jesteś pewnien,<br>że chcesz zatrzymać proces?</p>
        <button @click="this.$emit('hide')">
            <p>Anuluj</p>
        </button>
        <button class="destructive" @click="turnOff">
            <p>Zatrzymaj</p>
        </button>
    </div>
</template>

<style scoped lang="scss">
.title {
    margin-bottom: 10px;
    color: #adadad;
    font-size: 16px;
}
.card {
    padding: 30px 15px;
    margin: 10px;
}
button {
    padding: 5px 15px;
    background-color: var(--color-background-mute);
    border: none;
    border-radius: 50px;
    margin: 5px;
    filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.25));
    p {
        font-weight: normal;
        font-size: 15px;
        color: var(--blue);
    }
}

button.destructive {
    background-color: var(--red);
    p {
        color: var(--color-background-mute);
    }
}
</style>