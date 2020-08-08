<template>
    <div class="overlay" v-show="optionsMenuIsOpen">

        <main class="frame">
            
            <div class="row">
                <h2 class="title">Options</h2>
                <div class="close-button" @click="updateOptionsAndClose">
                    <img src="../icons/window-close.svg"/>
                </div>
            </div>

            <div>
                <p class="label">Text time: {{newOptions.textDelay}}%</p>
                <div class="slidecontainer">
                    <input type="range" min="1" max="300" v-model.number="newOptions.textDelay" class="slider">
                </div>


                <label class="row" for="options-menu-sound-toggle">
                    <p>Sound enabled:</p>
                    <input id="options-menu-sound-toggle" type="checkbox" v-model="newOptions.soundEnabled"/>
                </label>


                <p class="label">SFX volume: {{Math.round(newOptions.sfxVolume*100)}}%</p>
                <div class="slidecontainer">
                    <input type="range" min="0" max="2" step=".01" v-model.number="newOptions.sfxVolume" class="slider">
                </div>

                <p class="label">Music volume: {{Math.round(newOptions.musicVolume*500)}}%</p>
                <div class="slidecontainer">
                    <input type="range" min="0" max=".4" step=".01" v-model.number="newOptions.musicVolume" class="slider">
                </div>
            </div>

        </main>

    </div>


</template>

<script>
export default {
    name: "OptionsMenu",
    props: ["optionsMenuIsOpen"],

    data() {
        const storedOptions = this.$store.getters.options
        let newOptions = {}
        Object.keys(storedOptions).forEach (key => {
            newOptions[key] = storedOptions[key]
        })
        return { newOptions: newOptions }
    },
    methods: {
        updateOptionsAndClose() {
            this.$emit('close', this.newOptions)
        },
        refresh() {
            const storedOptions = this.$store.getters.options
            Object.keys(storedOptions).forEach(key => {
                this.newOptions[key] = storedOptions[key]
            })
            this.$forceUpdate()
        }
    },
    watch: {
        optionsMenuIsOpen (newValue) {
            if (newValue === true) {this.refresh()}
        }
    }
}
</script>

<style lang="scss">

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