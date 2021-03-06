<template>
<div>
    <audio :ref="setAudioElementRefs"
    v-for="sound in sounds" 
    v-bind:key="sound.id"
    v-bind:src="sound.path">
    </audio>
</div>
</template>

<script>
export default {
    name: "SfxPlayer",
    props: ['audioPosition'],

    data () {
        const {audioContext} = this.$store.state.audio;
        const gainNode = audioContext.createGain()
        const panner = new StereoPannerNode(audioContext, {pan:0})

        return {
            panner: panner,
            gainNode: gainNode,
            audioElementsToResumeWhenGameUnpause:[],
            tracks: {},
            currentLoopSound: null,
            audioElementRefs: [

            ]
        }
    },

    computed: {
        audioEmitter() {return this.$store.state.audio.emitter},
        audio() { return this.$store.state.audio},
        sounds() { return this.$store.state.gameData.sounds}
    },

    methods: {

        setAudioElementRefs(el) {
            this.audioElementRefs.push(el)
        },

        getSoundsPlaying() {
            if (!this.audioElementRefs) {return false}
            let list = []
            this.audioElementRefs.forEach((audioElement, index) =>{
                if (audioElement.paused === false) {list.push(this.sounds[index].id)}
            })
            return list
        },

        getSoundAndAudioElement(soundId) {
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
                audioElement:this.audioElementRefs[index]
            }
        },

        stop(soundId, options = {}) {
            let soundAndTrack = this.getSoundAndAudioElement(soundId)
            if (!soundAndTrack) {return false}
            const {sound, audioElement} = soundAndTrack;

            if (audioElement.dataSet.waiting) {
                this.$store.commit('debugMessage', `Did not stop ${sound.description} because a sequence is waiting for it to end.`)
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
            if (options.doNotRestart && this.getSoundsPlaying().includes(soundId)) {
                return Promise.resolve({
                    finished:true,
                    message:`${sound.description} was already playing`
                })
            }

            let soundAndTrack = this.getSoundAndAudioElement(soundId)
            if (!soundAndTrack) {return false}
            const {sound, audioElement} = soundAndTrack;

            const play = this.audio.audioContext.state === 'suspended' ?
            null : audioElement.play()

            if (options.waitUntilFinish) {
                audioElement.dataSet.waiting = true

                if(this.audio.audioContext.state === 'suspended') {
                    return new Promise ( (resolve)=>{
                        const confirmEnd = () => {
                            audioElement.dataSet.waiting = false
                            resolve({
                                finished:true,
                                play:play,
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
            if (!this.audioElementRefs) {return false}
            this.audioElementRefs.forEach(element=> { 
                if (element.paused === false) {
                    this.audioElementsToResumeWhenGameUnpause.push(element)
                    element.pause()
                }
            })
        },

        handleGameUnpaused () {
            this.audioElementsToResumeWhenGameUnpause.forEach(element => {
                element.play()
            })
            this.audioElementsToResumeWhenGameUnpause.splice(0, this.audioElementsToResumeWhenGameUnpause.length)
        },

        handleAudioContextEnabled () {
            if (this.audioPosition.loopSound) {

                if (this.$store.state.timerIsStopped) {
                    this.audioElementsToResumeWhenGameUnpause.push( this.getSoundAndAudioElement(this.audioPosition.loopSound).audioElement)
                } else {
                    this.play(this.audioPosition.loopSound, {loop:true})
                    this.currentLoopSound = this.audioPosition.loopSound
                }

            }
        }
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

        if (this.audioElementRefs) {
            this.audioElementRefs.forEach((audioElement, index) =>{
                audioElement.dataSet = {
                    loop: false
                }
                this.tracks[this.sounds[index].id] = this.audio.audioContext.createMediaElementSource(audioElement);
                this.tracks[this.sounds[index].id]
                .connect(this.panner)
                .connect(this.gainNode)
                .connect(this.audio.masterGainNode)
                .connect(this.audio.audioContext.destination)
            })
        }

        this.audioEmitter.on('audio-enabled', this.handleAudioContextEnabled)

        this.$store.state.gameEmitter.on('timer-stop', this.handleGamePaused)
        this.$store.state.gameEmitter.on('timer-start', this.handleGameUnpaused)

        if (this.audioPosition.loopSound) {
            this.play(this.audioPosition.loopSound, {loop:true})
            this.currentLoopSound = this.audioPosition.loopSound
        }
    },

    beforeUnmount() {
        this.audioEmitter.off('audio-enabled', this.handleAudioContextEnabled)
        this.$store.state.gameEmitter.off('timer-stop', this.handleGamePaused)
        this.$store.state.gameEmitter.off('timer-start', this.handleGameUnpaused)
    },

    beforeUpdate() {
        this.audioElementRefs = []
    },
}
</script>
