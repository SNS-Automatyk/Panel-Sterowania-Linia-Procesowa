<script>
import { API_URL } from '../variables'
export default {
    expose: ['show', 'hide'],
    data() {
        return {
            cameraSrc: '',
        }
    },
    beforeUnmount() {
        // Ensure the stream is stopped when component is destroyed
        this.cameraSrc = ''
    },
    methods: {
        hide: function () {
            // Hide and explicitly clear src to stop the stream immediately
            this.cameraSrc = '';
            this.$emit('hide');
        },
        show: function () {
            this.cameraSrc = `http://${API_URL}/camera`;
        }
    }
}
</script>

<template>
    <div class="camera_card">
        <div @click="hide" class="back-button"></div>
        <img :src="cameraSrc" alt="camera stream" />
    </div>
</template>

<style scoped lang="scss">
.title {
    margin-bottom: 10px;
    color: #adadad;
    font-size: 16px;
}

img {
    width: 100%;
    border-radius: 10px;
    margin-top: 48px;
}

.camera_card {
    padding: 30px 15px;
    background-color: var(--color-background-soft);
    border-radius: 10px;
    margin: 10px;
    margin-bottom: 0px;
    text-align: center;
    color: #707070;
    padding: 5px 15px;
}
.back-button {
    position: absolute;
    left: 0;
    top: 0;
    padding-left: 15px;
    font-size: 30px;
    z-index: 2;
}

.back-button:after {
    content: "\00d7";
    /* This will render the 'X' */
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

    transition: transform 0.1s ease-in-out;

    &:active {
        transform: scale(0.95);
    }
}

button.destructive {
    background-color: var(--red);

    p {
        color: var(--color-background-mute);
    }
}
</style>