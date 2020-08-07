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
    props: ['orders'],

    data () {
        const {audioContext} = this.$store.state.audio;
        return {
            gainNode: audioContext.createGain(),
            audioElementsToResumeWhenGameUnpause:[],
            track: undefined,
            currentlyPlaying: false,
            currentlyPaused: false,
            currentSong: this.orders.song,
            fading: false,
        }
    },

    computed: {
        audioContextStatusEmitter() {return this.$root.$children[0]},
        audioContext() {return this.$store.state.audio.audioContext}
    },

    methods: {
        handleAudioContextEnabled() {
            if (this.orders.playing) {
               this.play()
            }
        },

        play() {
            this.currentlyPlaying = true
            const {audioElement} = this.$refs
            const {audioContext, gainNode, orders} = this

            gainNode.gain.setValueAtTime(orders.volume, audioContext.currentTime)
            const playAudioCall = audioElement.play()
            if (playAudioCall.catch) {playAudioCall.catch(error=>{})}
        },

        stop() {
            this.currentlyPlaying = false
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
            return new Promise ((resolve)=>{
                setTimeout(function() {
                    this.fading = false
                    resolve(true)
                }, fadeTime*1000)
            })
        },

        changeSong(newSong, wasPlayingBeforeChange) {
            const {audioElement} = this.$refs
            this.stop()
            this.currentSong = newSong || null

            if (wasPlayingBeforeChange) {
                audioElement.addEventListener('canplay',this.play, {once:true})
            }
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
                else {this.fadeOut().then( ()=>{ this.stop() })}
            }

            if (song !== this.currentSong) {
                let wasPlayingBeforeChange = this.currentlyPlaying
                
                if (noFade || !this.currentSong) {
                    this.changeSong(song, wasPlayingBeforeChange)
                } else {
                    this.fadeOut()
                    .then( ()=>{
                        this.changeSong(song, wasPlayingBeforeChange)
                    } )
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
        this.track
            .connect(this.gainNode)
            .connect(this.audioContext.destination)

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
