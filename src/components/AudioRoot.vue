<template>

<div>
    <p>{{$parent.ident}} pan: {{audioPosition.pan}},gain:{{audioPosition.gain}}</p>
</div>

</template>

<script>


export default {
    name: "AudioRoot",
    props: ['sounds', 'audioPosition'],

    data () {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioContext = new AudioContext();
        const gainNode = audioContext.createGain()
        const panner = new StereoPannerNode(audioContext, {pan:0})

        return {
            audioContext: audioContext,
            panner: panner,
            gainNode: gainNode,
        }
    },

    methods: {

        play(soundId) {
            const sound = this.sounds.filter( i=> (i.id===soundId) )[0];
            if (!sound) {return false}

            const audioElement = document.createElement('audio')
            audioElement.setAttribute('src', sound.path)

            const track = this.audioContext.createMediaElementSource(audioElement);
            
            track.connect(this.gainNode).connect(this.panner).connect(this.audioContext.destination)

            audioElement.play()
        }
    },

    watch: {
        audioPosition: function (val) {
            this.panner.pan.value = val.pan
            this.gainNode.value = val.gain
        }

    },

    mounted()  {
        console.log(this.audioPosition)
        this.panner.pan.value = this.audioPosition.pan
        this.gainNode.value = this.audioPosition.gain
    }
    

}
</script>

<style>

</style>