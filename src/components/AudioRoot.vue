<template>

<div>
  <AudioTrack v-for="sound in sounds" v-bind:Key="sound.id"
  v-bind:sound="sound" 
  v-bind:audioContext="audioContext"
  v-bind:panner="panner"
  />
<p>pan: {{panValue}}</p>
</div>

</template>

<script>
import AudioTrack from './AudioTrack'



export default {
    name: "AudioRoot",
    components: {AudioTrack},
    props: ['sounds', 'panValue'],

    data () {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioContext = new AudioContext();

        const panner = audioContext.createStereoPanner()
        return {
            audioContext: audioContext,
            panner: panner,
        }
    },

    methods: {
        play(soundId) {
            let index = this.sounds.map(s=>s.id).indexOf(soundId)
            this.$children[index].play()
        }
    },

    watch: {
        panValue: function (val) {
            this.panner.pan.value = val
        }

    },

    mounted()  {
        console.log(this.panValue)
        this.panner.pan.value = this.panValue
    }
    

}
</script>

<style>

</style>