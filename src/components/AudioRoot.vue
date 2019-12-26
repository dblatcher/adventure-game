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
    name: "AudioRoot",
    props: ['sounds', 'audioPosition'],

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
        }
    },

    methods: {

        play(soundId, options = {}) {
            // const sound = this.sounds.filter( i=> (i.id===soundId) )[0];
            
            let i, index, sound
            for (i=0; i<this.sounds.length; i++) {
                if (this.sounds[i].id === soundId) {
                    index = i
                    sound = this.sounds[i]
                }
            }

            if (!sound) {return false}          
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
            
            const audioElement = this.$refs.track[index]
            audioElement.play()

            if (options.waitUntilFinish) {
                return new Promise ( (resolve, reject)=>{
                    const confirmEnd = () => {
                        resolve({
                            finished:true,
                            message:`${sound.description} finished`
                        })
                        audioElement.removeEventListener('ended', confirmEnd)
                    }
                    audioElement.addEventListener('ended', confirmEnd)
                })
            }
            return Promise.resolve({
                finished:true,
                message:`${sound.description} played`
            })  

        }
    },

    watch: {
        audioPosition: function (val) {
            this.panner.pan.value = val.pan
            this.gainNode.gain.value = val.gain
            //this.$forceUpdate()
        }
    },

    mounted()  {
        this.panner.pan.value = this.audioPosition.pan
        this.gainNode.value = this.audioPosition.gain

        this.$refs.track.forEach(audioElement =>{

            const track = this.audioContext.createMediaElementSource(audioElement);
            track
            .connect(this.masterGainNode)
            .connect(this.gainNode)
            .connect(this.panner)
            .connect(this.audioContext.destination)
        })

    }
}
</script>

<style>

</style>