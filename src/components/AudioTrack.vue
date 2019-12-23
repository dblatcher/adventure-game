<template>
    <div>
        <button @click="play" >{{sound.description}}{{$parent.$parent.ident}}, {{playing ? 'playing': 'not playing'}}</button>
        <audio v-bind:src="sound.path" type="audio/mp3"></audio>
    </div>
</template>

<script>
export default {
    name: "AudioRoot",
    props: ['sound', 'audioContext', 'panner'],

    data () {
        return {
            track: null,
            audioElement: null,
            playing:false,
        }
    },

    methods: {
        play() {
            const {sound, audioElement, audioContext, track} = this;
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }


            return audioElement.play()
            .then ( r=> {
                this.playing = true;
                const that = this

                return new Promise ( (resolve, reject)=> {
                    const confirmAbort = () => {
                        resolve(`${sound.description} aborted`)
                        audioElement.removeEventListener('paused', confirmAbort)
                        audioElement.removeEventListener('ended', confirmEnd)
                    }
                    const confirmEnd = () => {
                        resolve(`${sound.description} finished`)
                        audioElement.removeEventListener('paused', confirmAbort)
                        audioElement.removeEventListener('ended', confirmEnd)
                    }
                    audioElement.addEventListener('paused', confirmAbort)
                    audioElement.addEventListener('ended', confirmEnd)
                }).then( (r) =>{
                    console.log(r)
                    that.playing = false
                    return r
                } )

            })
            .catch( error=> {
                return Promise.reject(error)
            });



        }
    },

    mounted () {
        this.audioElement = this.$el.querySelector('audio');
        this.track =  this.audioContext.createMediaElementSource(this.audioElement);
        this.track.connect(this.panner).connect(this.audioContext.destination)
    }
}



</script>

<style>

</style>