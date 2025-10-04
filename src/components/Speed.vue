<script>
import SetSpeed from './SetSpeed.vue'
import Overlay from './Overlay.vue'

export default {
    props: {
        data: {
            type: Object,
            required: false
        }
    },
    methods: {
        showSpeed: function () {
            this.$refs.setSpeedOverlay.show();
            this.$refs.setSpeed.loadSpeed();
        }
    },
    components: {
        SetSpeed,
        Overlay
    }
}
</script>



<template>
    <div>
        <div class="card">
            <p> AKTUALNA PRĘDKOŚĆ</p>
            <div class="graph">
                <div class="button">
                    <p>{{ data.speed }}%</p>
                    <svg class="power-off">
                        <use xlink:href="#circle1" class="circle" />
                    </svg>
                    <svg class="power-on">
                        <use xlink:href="#circle1" class="circle"
                            :style="{ 'stroke-dashoffset': 220 - (data.speed /100*160) }" />
                    </svg>
                </div>
            </div>

            <!-- <router-link :to="'speed/' + speed"> -->
            <button v-on:click="showSpeed">
                <p>Zmień prędkość</p>
            </button>
            <!-- </router-link> -->




            <!-- SVG -->
            <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
                <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 150" id="circle1">
                    <circle cx="75" cy="80" r="35" />
                </symbol>
            </svg>
        </div>

        <Overlay ref="setSpeedOverlay">
            <SetSpeed @hide="$refs.setSpeedOverlay.hide()" ref="setSpeed" :data="data" />
        </Overlay>
    </div>

</template>

<style scoped lang="scss">
.card {
    padding: 15px;
}
p {
    font-weight: bold;
    font-size: 15px;
    // margin-top: 20px;
}
button {
    padding: 5px 15px;
    background-color: var(--color-background-mute);
    border: none;
    border-radius: 50px;
    filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.25));
    p {
        font-weight: normal;
        font-size: 15px;
        color: var(--blue);
    }
}


.graph {
    --color-fill: var(--green);
      --width: 250px;    
      --height: 200px;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      width: var(--width);
      height: var(--height);
      margin: -35px auto;
      .button {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        transform: translateY(-3px);
        p {
          margin-top: 9px;
          font-weight: bold;
          font-size: 20px;
          color: var(--color-fill);
        }
        &:after {
          content: "";
          width: 100%;
          height: 100%;
          position: absolute;
          filter: blur(20px);
          opacity: 0;
          transition: opacity 1s ease, transform 1s ease;
          transform: perspective(1px) translateZ(0);
          backface-visibility: hidden;
        }
        .power-on,
        .power-off {
          height: 100%;
          width: 100%;
          position: absolute;
          z-index: 1;
          fill: none;
          stroke: var(--color-fill);
          stroke-width: 15px;
          stroke-linecap: round;
          stroke-linejoin: round;
          .circle {
            opacity: .2;
            transform: rotate(138deg);
            transform-origin: center calc(80% - calc(0.267 * var(--height)));
            stroke-dasharray: 220;
            stroke-dashoffset: 60;
          }
        }
        .power-on {
          .circle {
            opacity: 1;
            transition: transform 0s ease, stroke-dashoffset 1s ease 0s;
          }
          
        }
      }
    }

</style>