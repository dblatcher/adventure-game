<template>
<div>
    <audio ref="audioElement" loop="true"
    v-bind:src="dataSong ? dataSong.path : ''">
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
            dataSong: this.song
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

            this.fader.gain.setValueAtTime(this.audioPosition.volume, audioContext.currentTime)
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

        fadeOut(fadeTime = 2) {
            this.shouldBePlaying = false
            const {audioElement} = this.$refs
            const {audioContext} = this.contextSource
            const {fader,stop} = this

            fader.gain.linearRampToValueAtTime(0.0, audioContext.currentTime + fadeTime)

            const that = this;
            setTimeout(function() {
                if (!that.shouldBePlaying) {that.stop}
            }, fadeTime*1000)

        }

    },

    watch: {
        audioPosition: function (newAudioPosition) {
            if (newAudioPosition.playing !== this.shouldBePlaying) {
                if (newAudioPosition.playing) {this.play()}
                else if (newAudioPosition.noFade) {this.stop()}
                else {this.fadeOut()}
            }
        },

        song: function (newSong) {

            if (newSong !== this.dataSong) {

                if (!newSong) {
                    this.stop()
                    this.dataSong = null
                    this.$forceUpdate()
                } else if (this.shouldBePlaying) {
                    this.stop()
                    this.dataSong = newSong
                    this.$forceUpdate()
                    setTimeout(this.play, 500)
                } else {
                    this.dataSong = newSong
                    this.$forceUpdate()
                }


            } 

        }
    },

    mounted()  {
        this.track = this.contextSource.audioContext.createMediaElementSource(this.$refs.audioElement);
        
        if (this.audioContextStatusEmitter) {
            this.audioContextStatusEmitter.$on('audio-enabled', this.handleAudioContextEnabled)
        }

        if (this.timer) {
            this.timer.$on('timer-stop', this.handleGamePaused)
            this.timer.$on('timer-start', this.handleGameUnpaused)
        }

        if (this.contextSource.audioContext.state !== 'suspended' && this.audioPosition.playing) {
            this.play()
        }
    },

    beforeDestroy() {
        if (this.audioContextStatusEmitter) {
            this.audioContextStatusEmitter.$off('audio-enabled', this.handleAudioContextEnabled)
        }
        if (this.timer) {
            this.timer.$off('timer-stop', this.handleGamePaused)
            this.timer.$off('timer-start', this.handleGameUnpaused)
        }
    }
}
</script>
