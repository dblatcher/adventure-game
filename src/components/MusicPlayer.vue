<template>
<div>
    <audio ref="audioElement" loop="true"
    v-bind:src="currentSong ? currentSong.path : ''">
    </audio>
</div>
</template>

<script>
export default {
    name: "MusicPlayer",
    props: ['orders','audioContext','timer', 'audioContextStatusEmitter'],

    data () {
        return {
            gainNode: this.audioContext.createGain(),
            audioElementsToResumeWhenGameUnpause:[],
            track: undefined,
            shouldBePlaying: false,
            currentSong: this.orders.song,
            fading: false,
        }
    },

    methods: {
        handleAudioContextEnabled() {
            if (this.orders.playing) {
                this.play()
            }
        },

        handleGamePaused() {

        },
        handleGameUnpaused() {

        },

        play() {
            this.shouldBePlaying = true
            this.fading = false
            const {audioElement} = this.$refs
            const {audioContext, gainNode, track, orders} = this

            gainNode.gain.setValueAtTime(orders.volume, audioContext.currentTime)
            audioElement.currentTime = 0

            track
            .connect(gainNode)
            .connect(audioContext.destination)

            audioElement.play()
        },

        stop() {
            this.shouldBePlaying = false
            this.fading = false
            this.$refs.audioElement.pause()
        },

        fadeOut(fadeTime = 2) {
            this.shouldBePlaying = false
            this.fading = true
            const {audioElement} = this.$refs
            const {audioContext,gainNode,stop} = this

            gainNode.gain.linearRampToValueAtTime(0.0, audioContext.currentTime + fadeTime)

            const that = this;
            setTimeout(function() {
                if (!that.shouldBePlaying) {that.stop}
            }, fadeTime*1000)

        }

    },

    watch: {
        orders: function (newOrders) {
            const {audioContext,gainNode} = this
            const {playing, volume, noFade, song} = newOrders

            if (playing !== this.shouldBePlaying) {
                if (playing) {this.play()}
                else if (noFade) {this.stop()}
                else {this.fadeOut()}
            }

            if (!this.fading) {
                gainNode.gain.setValueAtTime(this.orders.volume, audioContext.currentTime)
            }

            if (song !== this.currentSong) {
                if (!song) {
                    this.stop()
                    this.currentSong = null
                    this.$forceUpdate()
                } else if (this.shouldBePlaying) {
                    this.stop()
                    this.currentSong = song
                    this.$forceUpdate()
                    setTimeout(this.play, 500)
                } else {
                    this.currentSong = song
                    this.$forceUpdate()
                }
            } 
        }

    },

    mounted()  {
        this.track = this.audioContext.createMediaElementSource(this.$refs.audioElement);
        
        if (this.audioContextStatusEmitter) {
            this.audioContextStatusEmitter.$on('audio-enabled', this.handleAudioContextEnabled)
        }

        if (this.timer) {
            this.timer.$on('timer-stop', this.handleGamePaused)
            this.timer.$on('timer-start', this.handleGameUnpaused)
        }

        if (this.audioContext.state !== 'suspended' && this.orders.playing) {
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
