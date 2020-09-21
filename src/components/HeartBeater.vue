<template>
    <span></span>
</template>

<script>
export default {

    props: ['delay','timerIsStopped'],

    data: function () {
        return {
            count: 0,
            currentDelay: this.delay || 100,
            timer: null,
        }
    },

    methods: {
        beat: function () {
            if (this.timerIsStopped) {return false}
            this.count++;
            this.$store.state.gameEmitter.emit('beat',{count:this.count, time: new Date, delay:this.currentDelay})
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
            this.$store.commit('setTimerStopped',value);
            this.$store.state.gameEmitter.emit(value ? 'timer-stop': 'timer-start', {})
        }
    },

    mounted : function() {
        var that = this;
        this.timer = setInterval (function(){that.beat()},that.delay);
    },

    beforeUnmount: function() {
        clearInterval(this.timer);
    }
}
</script>