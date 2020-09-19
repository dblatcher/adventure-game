<template>
    <span></span>
</template>

<script>
var Emitter = require ('tiny-emitter');
export default {

    props: ['delay','timerIsStopped'],

    data: function () {
        const emitter = new Emitter();
        return {
            count: 0,
            currentDelay: this.delay || 100,
            timer: null,
            emitter
        }
    },

    methods: {
        beat: function () {
            if (this.timerIsStopped) {return false}
            this.count++;
            this.emitter.emit('beat',{count:this.count, time: new Date, delay:this.currentDelay})
            this.$emit('beat',{count:this.count, time: new Date, delay:this.currentDelay})
            if (this.delay !== this.currentDelay) {
                clearInterval(this.timer);
                this.currentDelay = this.delay;
                var that = this;
                this.timer = setInterval (function(){that.beat()},that.delay);
            }
        },
    },

    watch: {
        timerIsStopped: function (value) {
            this.emitter.emit(value ? 'timer-stop': 'timer-start', {})
            this.$emit(value ? 'timer-stop': 'timer-start', {})
        }
    },

    mounted : function() {        
        var that = this;
        this.timer = setInterval (function(){that.beat()},that.delay);
    },
    
    beforeDestroy: function() {
        clearInterval(this.timer);    
    }

}
</script>