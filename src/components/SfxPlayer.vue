<template>
<div>
    <audio ref="audio"
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
        const appAudio = this.$root.$children[0].audio
        const {appAudioContext} = appAudio
        const gainNode = appAudioContext.createGain()
        const panner = new StereoPannerNode(appAudioContext, {pan:0})

        return {
            appAudio,
            panner: panner,
            gainNode: gainNode,
            tracksToResumeWhenGameUnpause:[],
            tracks: {},
            currentLoopSound: null,
        }
    },

    methods: {
        getTracksPlaying() {
            let list = []
            this.$refs.audio.forEach((audioElement, index) =>{
                if (audioElement.paused === false) {list.push(this.sounds[index].id)}
            })
            return list
        },

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
                audioElement:this.$refs.audio[index]
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
            if (options.doNotRestart && this.getTracksPlaying().includes(soundId)) {
                return Promise.resolve({
                    finished:true,
                    message:`${sound.description} was already playing`
                })
            }

            let soundAndTrack = this.getSoundAndTrack(soundId)
            if (!soundAndTrack) {return false}
            const {sound, audioElement} = soundAndTrack;


            this.tracks[soundId]
            .connect(this.appAudio.masterGainNode)
            .connect(this.gainNode)
            .connect(this.panner)
            .connect(this.appAudio.appAudioContext.destination)

            const play = audioElement.play()

            if (options.waitUntilFinish) {
                audioElement.dataSet.waiting = true

                if(this.appAudio.appAudioContext.state === 'suspended') {
                    return new Promise ( (resolve)=>{
                        const confirmEnd = () => {
                            audioElement.dataSet.waiting = false
                            resolve({
                                finished:true,
                                message:`delay representing ${sound.description} finished`
                            })
                        }
                        setTimeout(confirmEnd, audioElement.duration*1000)
                    })
                }

                return new Promise ( (resolve)=>{
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
            this.$refs.audio.forEach(element=> { 
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
        audioPosition: function (newAudioPosition) {
            this.panner.pan.value = newAudioPosition.pan
            this.gainNode.gain.value = newAudioPosition.gain

            if (newAudioPosition.loopSound !== this.currentLoopSound) {
                if (this.currentLoopSound) {this.stop(this.currentLoopSound, {now:true})}
                if (newAudioPosition.loopSound) {this.play(newAudioPosition.loopSound, {loop:true})}
                this.currentLoopSound = newAudioPosition.loopSound
            }

        }
    },

    mounted()  { //TO DO - work out if I need to disconnect on unMount 
        this.panner.pan.value = this.audioPosition.pan
        this.gainNode.value = this.audioPosition.gain

        this.$refs.audio.forEach((audioElement, index) =>{
            audioElement.dataSet = {
                loop: false
            }
            this.tracks[this.sounds[index].id] = this.appAudio.appAudioContext.createMediaElementSource(audioElement);
        })

        this.timer.$on('timer-stop', this.handleGamePaused)
        this.timer.$on('timer-start', this.handleGameUnpaused)

        if (this.audioPosition.loopSound) {
            this.play(this.audioPosition.loopSound, {loop:true})
            this.currentLoopSound = this.audioPosition.loopSound
        }
    }
}
</script>
