<script>
import { API_URL } from '../variables'

export default {
    data: function () {
        return {
            speed: 0,
            dragging: false,
            // Cached layout for pointer math
            layout: { left: 0, top: 0, width: 0, height: 0 },
            knobVisibilityTimer: null,
            knobVisible: false
        }
    },
    props: {
        data: {
            type: Object,
            required: false
        }
    },
    computed: {
        // Position of the knob along the circle, in px relative to the button container
        knobStyle() {
            const { width, height } = this.layout
            if (!width || !height) return { display: 'none' }

            // Geometry derived from the SVG symbol and CSS
            const cx = width * 0.5
            const cy = height * (75 / 150) // 0.533333...
            const r = height * (37.5 / 150)  // 0.233333...

            // Arc math (matches stroke setup): total circumference units 220, gap 60
            const GAP = 60
            const CIRC = 220
            const GAP_ANGLE = 360 * GAP / CIRC // ~98.18 deg
            const ARC_ANGLE = 360 - GAP_ANGLE  // ~261.82 deg
            const ROTATION_DEG = 138

            const start = 0
            const angleOnArc = start + (this.speed / 100) * ARC_ANGLE
            // Apply the same rotation as the ring uses
            const phi = (angleOnArc + ROTATION_DEG) * (Math.PI / 180)

            const x = cx + r * Math.cos(phi)
            const y = cy + r * Math.sin(phi)


            return {
                left: `${x}px`,
                top: `${y}px`,
            }
        }
    },
    mounted() {
        // Initialize from props if available
        if (this.data && typeof this.data.speed === 'number') {
            this.speed = Math.max(0, Math.min(100, this.data.speed))
        }
        // Sync input field
        this.$nextTick(() => {
            this.updateLayout()
            if (this.$refs.input) {
                this.$refs.input.value = this.speed + '%'
                try {
                    this.$refs.input.setSelectionRange(this.$refs.input.value.length - 1, this.$refs.input.value.length - 1)
                } catch {}
            }
        })

        window.addEventListener('resize', this.updateLayout, { passive: true })
        window.addEventListener('pointermove', this.onPointerMove, { passive: false })
        window.addEventListener('pointerup', this.onPointerUp, { passive: true })
        window.addEventListener('pointercancel', this.onPointerUp, { passive: true })
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.updateLayout)
        window.removeEventListener('pointermove', this.onPointerMove)
        window.removeEventListener('pointerup', this.onPointerUp)
        window.removeEventListener('pointercancel', this.onPointerUp)
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

        updateLayout() {
            if (this.$refs.knob) {
                const rect = this.$refs.knob.getBoundingClientRect()
                this.layout = { left: rect.left, top: rect.top, width: rect.width, height: rect.height }
            }
        },

        // Pointer interactions for dragging the knob along the ring
        onPointerDown(e) {
            this.updateLayout()
            this.dragging = true
            this.updateSpeedFromPointer(e.clientX, e.clientY)
            // prevent scrolling while dragging on touch
            e.preventDefault()
        },
        onPointerMove(e) {
            if (!this.dragging) return
            this.updateSpeedFromPointer(e.clientX, e.clientY)
            e.preventDefault()
        },
        onPointerUp() {
            this.dragging = false
        },
        updateSpeedFromPointer(clientX, clientY) {
            const { left, top, width, height } = this.layout
            if (!width || !height) return


            // Center and radius in px (from symbol geometry)
            const cx = left + width * 0.5
            const cy = top + height * (80 / 150)

            // Arc bounds (avoid the gap)
            const GAP = 60
            const CIRC = 220
            const GAP_ANGLE = 360 * GAP / CIRC
            const ARC_ANGLE = 360 - GAP_ANGLE
            const start = 0
            const end = 360 - start

            const dx = clientX - cx
            const dy = clientY - cy
            let angle = Math.atan2(dy, dx) * (180 / Math.PI) // -180..180, 0 at 3 o'clock
            if (angle < -GAP_ANGLE / 2) angle += 360 // 0..360

            // Adjust for the same rotation applied to the circle
            const ROTATION_DEG = 138
            let a = angle - ROTATION_DEG
            if (a < -GAP_ANGLE / 2) a += 360

            // Clamp into arc range
            let clamped = a
            if (a < start) clamped = start
            if (a > end) clamped = end

            let s = Math.round(((clamped - start) / ARC_ANGLE) * 100)
            if (s < 0) s = 0
            if (s > 100) s = 100
            this.speed = s

            // keep input in sync
            if (this.$refs.input) {
                this.$refs.input.value = this.speed + '%'
            }
            if (this.$refs.powerOnCircle) {
                this.$refs.powerOnCircle.classList.add('no-transition')
            }
            this.knobVisible = true;

            this.knobVisibilityTimer = setTimeout(() => {
                this.knobVisible = false
                if (this.$refs.powerOnCircle) {
                    this.$refs.powerOnCircle.classList.remove('no-transition')
                }
            }, 1000);

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
            this.speed = this.data.speed;
            this.$refs.input.value = this.speed + '%';
            this.$refs.input.setSelectionRange(this.$refs.input.value.length - 1, this.$refs.input.value.length - 1);
            
        },

        saveSpeed: async function () {
            this.data.speed = "?";
            fetch("http://" + API_URL + "/api", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ data: { speed: this.speed } })
            });
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
                    <use xlink:href="#circle1" class="circle" :style="{ 'stroke-dashoffset': 220-(speed/100*160) }" ref="powerOnCircle"/>
                </svg>
                <!-- Drag layer + knob -->
                <div class="knob-layer" ref="knob" @pointerdown="onPointerDown" :style="{ opacity: knobVisible ? '1' : '0' }">
                    <div class="knob" :style="knobStyle"></div>
                </div>
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
    z-index: 4;
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
            &:not(.no-transition) {
                transition: transform 0s ease, stroke-dashoffset 1s ease 0s;
            }
          }
          
        }
                /* Transparent layer to capture pointer events and position the knob */
                .knob-layer {
                    position: absolute;
                    inset: 0;
                    z-index: 3;
                    touch-action: none; /* allow custom pan */
                    transition: opacity 0.3s ease-in;
                }
                .knob {
                    position: absolute;
                    width: 18px;
                    height: 18px;
                    margin-left: -9px; /* center over (left, top) */
                    margin-top: -9px;
                    border-radius: 50%;
                    background: var(--green);
                    box-shadow: 0 0 0 3px rgba(0,0,0,0.25), 0 0 10px rgba(0,0,0,0.35);
                    cursor: grab;
                }
      }
    }

</style>