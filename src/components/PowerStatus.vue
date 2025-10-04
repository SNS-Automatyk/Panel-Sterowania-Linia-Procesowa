<script>
export default {
    props: {
        is_connected: {
            type: Boolean,
            required: true
        },
        rpi_connected: {
            type: Boolean,
            required: false,
            default: true
        }
    }
}
</script>

<template>
    <div class="powerstatus-container">
        <div class="powerstatus" :active="is_connected">
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAACVUlEQVR4nO2bT2pTURSHf3SQDjuvjgU3IHQJiluIbsHaJSilIKgDS6FLUNyC4ApKOy/tJHTQ4kwnikcevkIIL+n7c+7J7X3fB2dW3iFfLoF8vZEAAAAAYDmbkt5L+iFpJulA0mTF30NPPkqyhalkgyOPJP1uEH3luQSkrw2SbweceCLpL6LT822FZE60E8/vkIxoBzYknSA6PS9bSOZED6T6InKO6PTstZTMiR7AlqQbRKdnv4NkTnRPtiX9RHR6jjtK5kQ7hiNEB4Yj40THhCNDdEw4MkTHhCNDdEw4MkTHhCNDdEw4MkTHhCNDdEw4MkTHhCNDdEw4MkTHhCNDdEw4MkTHhCNDdEw4MkTHhCNDdEw4MkS3C0enCUV3nWIvsb/IQK6Vfol94hSOUkxRl9hfZyB02VyrELYcw1GKOVQh7Gcgc9n8kvRABbDtHI68540K4VMGMld9Nlcfa0Vwk4HQZbOrgphlILRpLupf4BbDQQZSm2aqwpjUsnM62ad1DoCaVKKf3i6A/6SQ/L1+NszhLbn6Z8PO/AJII/pz/VxYwFPyH0mPFxeAv+ij+pnQgGc4eti0AHxFFxOOUmEOU1Q4yln0q3W/iPuADZzL0sJRrqKn634B9wUbMGeEoxjRhKMO9JVMOAoSTTjqSB/JX7ouAXWWTDgKEk046kkXyYSjINFvhywaO9ZyCEdBond93tfxYi2GcBQkeuqxaOzYHUM4ChL9zGvR2LEVQzgKEr3juWjsGOEohhnhaH2X2D8E7R4Vk7lL7NXX7Hcl/m4bAAAAQG78A1FjSyx1UurYAAAAAElFTkSuQmCC"
                class="lightning">

            <p>{{ is_connected ? "Linia online" : "Linia offline" }}</p>
        </div>
        <div v-if="!rpi_connected" style="color: orange; font-weight: 600; margin-top: 5px;">
            Raspberry Pi offline!
        </div>
    </div>
</template>

<style scoped lang="scss">
.powerstatus-container {
    display: flex;
    flex-direction: row;
    gap: 10px;
}

.powerstatus {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: row;
    border-radius: 10px;
    padding: 5px;
    width: max-content;
    .lightning {
        filter: invert(85%) sepia(8%) saturate(3161%) hue-rotate(93deg) brightness(92%) contrast(78%);
        height: 26px;
    }
    p {
        font-size: 14px;
        font-weight: 600;
        color: var(--green);
        margin: 0 6px;
    }
}
.powerstatus:not([active="true"]) {
    background-color: var(--red);
    .lightning {
        filter: none;
    }
    p {
        color: #000;
    }
}

</style>