<template>
    <div class="overlay">

        <main class="frame">
            
            <div class="row">
            <h2 class="title">Options</h2>
            <div class="close-button" @click="$emit('close',null)"><img src="../icons/window-close.svg"/></div>

            </div>
            <form>

                <p class="label">Text time: {{options.textDelay}}%</p>
                <div class="slidecontainer">
                    <input type="range" min="1" max="300" v-model.number="options.textDelay" class="slider">
                </div>

                <p class="label">SFX volume: {{options.masterVolume*1000}}%</p>
                <div class="slidecontainer">
                    <input type="range" min="0" max="0.2" step="0.001" v-model.number="options.masterVolume" class="slider">
                </div>

            </form>

        </main>

    </div>


</template>

<script>
export default {
    name: "OptionsMenu",
    props: ["options"]
}
</script>

<style lang="scss" scroped>

@import "../modules/_layout.scss";
@import "../modules/_material.scss";

.overlay {
    @include fullscreen();
    background-color: rgba(0,0,0,0.5);
    z-index: 300;
}

.frame {
    @include centerPoint;
    @include placeAbsolute(50%,50%);
    @include font;
    min-width: 12rem;

    padding: .75rem;
    background-color: white;
    box-shadow: $drop-shadow2;

}

.row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.title {
    margin: 0;
}

.label {
    margin: .25rem 0 0 0;
}

.close-button {
    @include btn-solid ($colour-blue);
    @include navButton(false);
    display: inline-flex;
}

.slidecontainer {

    input {
        width: 100%;
    }
}

</style>