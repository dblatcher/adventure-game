<template>
<div>
    <audio ref="track"
    v-for="sound in sounds" 
    v-bind:key="sound.id"
    v-bind:src="sound.path">
    </audio>
</div>
</template>

<script>
export default {
    name: "SfxPlayer",
    props: ['sounds', 'audioPosition','timer'],

    data () {
        const appAudioContext = this.$root.$children[0].audio.appAudioContext
        const masterGainNode = this.$root.$children[0].audio.masterGainNode
        const gainNode = appAudioContext.createGain()
        const panner = new StereoPannerNode(appAudioContext, {pan:0})

        return {
            audioContext: appAudioContext,
            panner: panner,
            gainNode: gainNode,
            masterGainNode,
            tracksToResumeWhenGameUnpause:[],
        }
    },

    methods: {

        getSoundAndTrack(soundId) {
            let i, index, sound
            for (i=0; i<this.sounds.length; i++) {
                if (this.sounds[i].id === soundId) {
                    index = i
                    sound = this.sounds[i]
                    break
                }
            }
            if (!sound) {return false}          
            
            return {
                sound:sound,
                audioElement:this.$refs.track[index]
            }
        },

        stop(soundId, options = {}) {
            let soundAndTrack = this.getSoundAndTrack(soundId)
            if (!soundAndTrack) {return false}
            const {sound, audioElement} = soundAndTrack;

            if (audioElement.dataSet.waiting) {
                console.warn(`did not stop ${sound.description} because a sequence is waiting for it to end.`)
                return false
            }

            if (options.now) {
                audioElement.pause()
            }
            audioElement.removeAttribute('loop')
            audioElement.dataSet.loop = false
            audioElement.currentTime = 0
            return Promise.resolve({
                finished:true,
                message:`${sound.description} stopped`
            })  
        },

        play(soundId, options = {}) {       
            let soundAndTrack = this.getSoundAndTrack(soundId)
            if (!soundAndTrack) {return false}
            const {sound, audioElement} = soundAndTrack;

            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
            
            const play = audioElement.play()

            if (options.waitUntilFinish) {
                audioElement.dataSet.waiting = true
                return new Promise ( (resolve, reject)=>{
                    const confirmEnd = () => {
                        audioElement.dataSet.waiting = false
                        audioElement.removeEventListener('ended', confirmEnd)
                        resolve({
                            finished:true,
                            play:play,
                            message:`${sound.description} finished`
                        })
                    }
                    audioElement.addEventListener('ended', confirmEnd)
                })
            }

            if (options.loop) {
                audioElement.dataSet.loop = true
                audioElement.setAttribute('loop','true')
            }

            return Promise.resolve({
                finished:true,
                play:play,
                message:`${sound.description} played`
            })  

        },

        handleGamePaused () {
            this.$refs.track.forEach(element=> { 
                if (element.paused === false) {
                    this.tracksToResumeWhenGameUnpause.push(element)
                    element.pause()
                }
            })
        },

        handleGameUnpaused () {
            this.tracksToResumeWhenGameUnpause.forEach(element => {
                element.play()
            })
            this.tracksToResumeWhenGameUnpause.splice(0, this.tracksToResumeWhenGameUnpause.length)
        },
    },

    watch: {
        audioPosition: function (val) {
            this.panner.pan.value = val.pan
            this.gainNode.gain.value = val.gain
        }
    },

    mounted()  { //TO DO - work out if I need to disconnect on unMount 
        this.panner.pan.value = this.audioPosition.pan
        this.gainNode.value = this.audioPosition.gain

        this.$refs.track.forEach(audioElement =>{
            audioElement.dataSet = {
                loop: false
            }
            const track = this.audioContext.createMediaElementSource(audioElement);
            track
            .connect(this.masterGainNode)
            .connect(this.gainNode)
            .connect(this.panner)
            .connect(this.audioContext.destination)
        })

        this.timer.$on('timer-stop', this.handleGamePaused)
        this.timer.$on('timer-start', this.handleGameUnpaused)

    }
}
</script>
