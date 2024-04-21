<script>
import { API_URL } from '../variables'
const API_SET_SPEED = API_URL + `speed/`;

export default {
    data: function () {
        return {
            speed: 0,
        }
    },
    props: {
        data: {
            type: Object,
            required: false
        }
    },
    methods: {

        inputChanged: function (e) {
            console.log('input changed')
            let int = e.target.value.slice(0, e.target.value.length - 1);

            if (int.includes('%')) {
                e.target.value = '%';
                e.target.setSelectionRange(0, 0);
            // } else if (int.length >= 3 && int.length <= 4 && !int.includes('.')) {
            //     e.target.value = int.slice(0, 2) + '.' + int.slice(2, 3) + '%';
            //     e.target.setSelectionRange(4, 4);
            // } else if (int.length >= 5 & int.length <= 6) {
            //     let whole = int.slice(0, 2);
            //     let fraction = int.slice(3, 5);
            //     e.target.value = whole + '.' + fraction + '%';
            } else {
                e.target.value = int + '%';
                e.target.setSelectionRange(e.target.value.length - 1, e.target.value.length - 1);
            }
            if (this.getInt(e.target.value) > 100) {
                e.target.value = '100%';
            } else if (this.getInt(e.target.value) < 0) {
                e.target.value = '0%';
            }

            
            if (this.getInt(e.target.value)  % 1 === 0) {
                this.speed = this.getInt(e.target.value);
            }

            if (e.target.selectionStart == e.target.value.length+1) {
                e.target.setSelectionRange(e.target.value.length - 1, e.target.value.length - 1);
            }

            console.log('For robots: ' + this.getInt(e.target.value));
        },

        getInt: function (val) {
            let v = parseFloat(val);
            if (v % 1 === 0) {
                return v;
            } else {
                let n = v.toString().split('.').join('');
                return parseInt(n);
            }
        },

        loadSpeed: function () {
            this.speed = this.data.current_speed;
            this.$refs.input.value = this.speed + '%';
            this.$refs.input.setSelectionRange(this.$refs.input.value.length - 1, this.$refs.input.value.length - 1);
            
        },

        saveSpeed: function () {
            this.data.current_speed = "?";
            const response = fetch(API_SET_SPEED + this.speed, { method: "PUT" });
            // response.json().then(data => {
            //     this.response = data
            //     this.data.sp = data.data.processing
            // })
            this.close();
        },
         
        close: function () {
            this.$emit('hide')
            
        }
    }
}



</script>
<template>
    <div class="card">
        <div @click="close" class="back-button"></div>
        <p> ZMIEŃ PRĘDKOŚĆ</p>
        <div class="graph">
            <div class="button">
                <div>
                    <p><input class="speed" type="text" ref="input" maxlength="4" v-on:input="inputChanged" pattern="\d*"></p>
                    <p class="description">Tap to edit</p>
                </div>
                <svg class="power-off">
                    <use xlink:href="#circle1" class="circle" />
                </svg>
                <svg class="power-on">
                    <use xlink:href="#circle1" class="circle" :style="{ 'stroke-dashoffset': 220-(speed/100*160) }"/>
                </svg>
            </div>
        </div>

        <!-- <router-link to="/speed" v-slot="{ navigate }"> -->
            <button @click="saveSpeed">
                <p>Zapisz</p>
            </button>
        <!-- </router-link> -->


        
    
        <!-- SVG -->
        <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
        <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 150" id="circle1">
            <circle cx="75" cy="80" r="35"/>
        </symbol>
        </svg>
    </div>
</template>

<style scoped lang="scss">
p {
    font-weight: bold;
    font-size: 15px;
}
.card {
    padding: 45px 15px;
    margin: 10px;
}
input.speed {
    text-align: center;
    font-weight: bold;
    font-size: 27px;
    color: var(--green);
    background-color: transparent;
    border: none;
    outline: none;
    z-index: 2;
    font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    // margin-top: 10px;
    background-color: #3f3f3f;
    padding: 5px;
    width: 90px;
    border-radius: 10px;
}

.back-button {
    position: absolute;
    left: 0;
    top: 0;
    padding-left: 15px;
    font-size: 30px;
    z-index: 2;
}
.back-button:after{
    content: "\00d7"; /* This will render the 'X' */
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
      --width: 300px;    
      --height: 300px;
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
        div {
            margin-top: 20px;
            p {
                font-size: 10px;
                color: var(--color-text-mute);
            }
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
          stroke-width: 12px;
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