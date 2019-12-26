<template>

<audio/>
<!-- <div>
    <p>{{$parent.ident}} pan: {{this.panner.pan.value}},gain:{{this.gainNode.gain.value}}</p>
</div> -->

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
            const sound = this.sounds.filter( i=> (i.id===soundId) )[0];
            if (!sound) {return false}          
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
            const audioElement = document.createElement('audio')
            audioElement.setAttribute('src', sound.path)
            const track = this.audioContext.createMediaElementSource(audioElement);
            track
            .connect(this.masterGainNode)
            .connect(this.gainNode)
            .connect(this.panner)
            .connect(this.audioContext.destination)
            audioElement.play()

            if (options.waitUntilFinish) {
                return new Promise ( (resolve, reject)=>{
                    const confirmEnd = () => {
                        console.log(`${sound.description} finished`)
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
    }
    

}
</script>

<style>

</style>