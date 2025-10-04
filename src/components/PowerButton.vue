<script>
import Overlay from './Overlay.vue'
import TurnOff from './TurnOff.vue'

import { API_URL } from '../variables'

export default {
  props: {
    data: {
      type: Object,
      required: true
    },
  },
  components: {
    Overlay,
    TurnOff
  },
  methods: {
    showTurnOff() {
      this.$refs.overlay.show();
    },
    hideTurnOff() {
      this.$refs.overlay.hide();
    },

    turnOff() {
      this.hideTurnOff()
      this.processingChange()
    },

    async processingChange() {
      await fetch("http://" + API_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: { on_off: 1 } })
      });
      // response.json().then(data => {
      //   this.data.green_light = data.data.green_light
      // })
    },

    buttonClick: function() {
      if (this.data.green_light) {
        this.showTurnOff()
        return
      }
      this.data.green_light = 1
      this.processingChange()
    }
  }
}
</script>


<template>
  <div>
    <!-- <p>Status: {{ processing }}</p> -->
    <div v-on:click="buttonClick" class="power-switch">
      <!-- <input type="checkbox" :checked="data.green_light" v-on:change="processingChange" /> -->
      <div class="button" :class="{ active: data.green_light }">
        <svg class="power-off">
          <use xlink:href="#line" class="line" />
          <use xlink:href="#circle" class="circle" />
        </svg>
        <svg class="power-on">
          <use xlink:href="#line" class="line" />
          <use xlink:href="#circle" class="circle" />
        </svg>
      </div>
    </div>

    <!-- SVG -->
    <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
      <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 150" id="line">
        <line x1="75" y1="34" x2="75" y2="78" />
      </symbol>
      <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 150" id="circle">
        <circle cx="75" cy="80" r="45" />
      </symbol>
    </svg>

    <Overlay ref="overlay">
      <TurnOff @hide="$refs.overlay.hide()" ref="turnOff" :turnOff="turnOff" />
    </Overlay>
  </div>
</template>
    
<style scoped lang="scss">
.power-switch {
  --color-fill: var(--green);
  --width: 150px;
  --height: 150px;
  position: relative;
  // display: flex;
  justify-content: center;
  align-items: center;
  width: var(--width);
  height: var(--height);
  margin: 0 auto;
  margin-top: 15px;
  box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.5);
  border-radius: 50%;

  .button {
    width: 100%;
    height: 100%;
    // display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    transform: translateY(-5px);

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

      .line {
        opacity: .2;
      }

      .circle {
        opacity: .2;
        transform: rotate(-40deg);
        transform-origin: center calc(80% - calc(0.267 * var(--height)));
        stroke-dasharray: 290;
        stroke-dashoffset: 90;
      }
    }

    .power-on {
      .line {
        opacity: 0;
        transition: opacity .3s ease 1s;
      }

      .circle {
        opacity: 1;
        stroke-dashoffset: 290;
        transition: transform 0s ease, stroke-dashoffset 1s ease 0s;
      }
    }
  }

  .active {
      &:after {
        opacity: 0.15;
        transform: scale(2) perspective(1px) translateZ(0);
        backface-visibility: hidden;
        transition: opacity .5s ease, transform .5s ease;
      }

      .power-on,
      .power-off {
        animation: click-animation .3s ease forwards;
        transform: scale(1);

        .line {
          animation: line-animation .8s ease-in forwards;
        }

        .circle {
          transform: rotate(320deg);
          transition: transform .4s ease .2s, stroke-dashoffset .4s ease .2s;
        }
      }

      .power-on {
        .line {
          opacity: 1;
          transition: opacity .05s ease-in .55s;
        }

        .circle {
          transform: rotate(320deg);
          stroke-dashoffset: 90;
          transition: transform .4s ease .2s, stroke-dashoffset .4s ease .2s;
        }
      }
    
  }
}


@keyframes line-animation {
  0% {
    transform: translateY(0);
  }

  10% {
    transform: translateY(calc(var(--height) * 0.067));
  }

  40% {
    transform: translateY(calc(var(--height) * -0.167));
  }

  60% {
    transform: translateY(calc(var(--height) * -0.167));
  }

  85% {
    transform: translateY(calc(var(--height) * 0.067));
  }

  100% {
    transform: translateY(0px);
  }
}

@keyframes click-animation {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(.9);
  }

  100% {
    transform: scale(1);
  }
}

//--- ## BASIC #############
// body {
//   background: #1B1A23;
//   height: 100vh;
//   font: 400 16px 'Poppins', sans-serif;
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
//   .socials {
//     position: fixed;
//     display: block;
//     left: 20px;
//     bottom: 20px;
//     > a {
//       display: block;
//       width: 30px;
//       opacity: .2;
//       transform: scale(var(--scale, .8));
//       transition: transform .3s cubic-bezier(0.38,-0.12, 0.24, 1.91);
//       &:hover {
//         --scale: 1;
//       }
//     }
//   }
// }</style>