<template>
<div>
    <audio ref="audioElement" loop="true"
    v-bind:key="song.id"
    v-bind:src="song.path">
    </audio>
</div>
</template>

<script>
export default {
    name: "MusicPlayer",
    props: ['song','audioPosition','contextSource','timer', 'audioContextStatusEmitter'],

    data () {
        const {audioContext} = this.contextSource
        const fader = audioContext.createGain()

        return {
            fader: fader,
            audioElementsToResumeWhenGameUnpause:[],
            track: undefined,
            shouldBePlaying: false,
        }
    },

    methods: {
        handleAudioContextEnabled() {
            if (this.audioPosition.playing) {
                this.play()
            }
        },
        handleGamePaused() {

        },
        handleGameUnpaused() {

        },

        play() {
            this.shouldBePlaying = true
            const {audioElement} = this.$refs
            const {audioContext} = this.contextSource

            this.fader.gain.setValueAtTime(.25, audioContext.currentTime)
            audioElement.currentTime = 0

            this.track
            .connect(this.fader)
            .connect(audioContext.destination)

            audioElement.play()
        },

        stop() {
            this.shouldBePlaying = false
            this.$refs.audioElement.pause()
        },

        fadeOut() {
            this.shouldBePlaying = false
            const {audioElement} = this.$refs
            const {audioContext} = this.contextSource
            const {fader,stop} = this

            fader.gain.linearRampToValueAtTime(0.0, audioContext.currentTime + 3)

            const that = this;
            setTimeout(function() {
                if (!that.shouldBePlaying) {that.stop}
            }, 3000)

        }

    },

    watch: {
        audioPosition: function (newAudioPosition) {

            if (newAudioPosition.playing !== this.shouldBePlaying) {
                if (newAudioPosition.playing) {this.play()}
                else if (newAudioPosition.noFade) {this.stop()}
                else {this.fadeOut()}
            }

        }
    },

    mounted()  {
        this.track = this.contextSource.audioContext.createMediaElementSource(this.$refs.audioElement);
        this.audioContextStatusEmitter.$on('audio-enabled', this.handleAudioContextEnabled)

        if (this.timer) {
            this.timer.$on('timer-stop', this.handleGamePaused)
            this.timer.$on('timer-start', this.handleGameUnpaused)
        }

        if (this.contextSource.audioContext.state !== 'suspended' && this.audioPosition.playing) {
            this.play()
        }
    },

    beforeDestroy() {
        this.audioContextStatusEmitter.$off('audio-enabled', this.handleAudioContextEnabled)
        if (this.timer) {
            this.timer.$off('timer-stop', this.handleGamePaused)
            this.timer.$off('timer-start', this.handleGameUnpaused)
        }
    }
}
</script>
