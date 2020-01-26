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
    props: ['orders','audioContext', 'audioContextStatusEmitter'],

    data () {
        return {
            gainNode: this.audioContext.createGain(),
            audioElementsToResumeWhenGameUnpause:[],
            track: undefined,
            currentlyPlaying: false,
            currentlyPaused: false,
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

        play() {
            this.currentlyPlaying = true
            this.fading = false
            const {audioElement} = this.$refs
            const {audioContext, gainNode, track, orders} = this

            gainNode.gain.setValueAtTime(orders.volume, audioContext.currentTime)

            track
            .connect(gainNode)
            .connect(audioContext.destination)

            audioElement.play()
        },

        stop() {
            this.currentlyPlaying = false
            this.fading = false
            this.$refs.audioElement.pause()
            this.$refs.audioElement.currentTime = 0
        },

        pause() {
            this.currentlyPaused = true
            this.$refs.audioElement.pause()
        },

        unpause() {
            this.currentlyPaused = false
            if (this.orders.playing && ! this.fading) {
                this.play()
            }
        },

        fadeOut(fadeTime = 2) {
            this.currentlyPlaying = false
            this.fading = true
            const {audioElement} = this.$refs
            const {audioContext,gainNode,stop} = this

            gainNode.gain.linearRampToValueAtTime(0.0, audioContext.currentTime + fadeTime)

            const that = this;
            setTimeout(function() {
                if (!that.currentlyPlaying) {that.stop}
            }, fadeTime*1000)

        }

    },

    watch: {
        orders: function (newOrders) {
            const {audioContext,gainNode} = this
            const {playing, volume, noFade, song, pause} = newOrders

            if (!this.fading) {
                gainNode.gain.setValueAtTime(this.orders.volume, audioContext.currentTime)
            }

            if (playing !== this.currentlyPlaying) {
                if (playing) {this.play()}
                else if (noFade) {this.stop()}
                else {this.fadeOut()}
            }

            if (song !== this.currentSong) {
                let wasPlayingBeforeChange = this.currentlyPlaying
                this.stop()
                this.currentSong = song || null
                this.$forceUpdate()
                if (wasPlayingBeforeChange) {
                    setTimeout(this.play, 500)
                }
            }

            if (pause) {
                this.pause()
            } else {
                this.unpause()
            }

        }

    },

    mounted()  {
        this.track = this.audioContext.createMediaElementSource(this.$refs.audioElement);
        
        if (this.audioContextStatusEmitter) {
            this.audioContextStatusEmitter.$on('audio-enabled', this.handleAudioContextEnabled)
        }

        if (this.audioContext.state !== 'suspended' && this.orders.playing) {
            this.play()
        }
    },

    beforeDestroy() {
        if (this.audioContextStatusEmitter) {
            this.audioContextStatusEmitter.$off('audio-enabled', this.handleAudioContextEnabled)
        }
    }
}
</script>
