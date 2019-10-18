<template>
    <span></span>
</template>

<script>
export default {

    props: ['delay','isPaused'],

    data: function () {
        return {
            count: 0,
            currentDelay: this.delay || 100,
            timer: null
        }
    },

    methods: {
        beat: function () {
            if (this.isPaused) {return false}
            this.count++;
            this.$emit('beat',{count:this.count, time: new Date})
            if (this.delay !== this.currentDelay) {
                clearInterval(this.timer);
                this.currentDelay = this.delay;
                var that = this;
                this.timer = setInterval (function(){that.beat()},that.delay);
            }
        },
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