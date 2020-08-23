<template>
    <main class="room"
    @click="clickHandler($event)"
    @dblclick="doubleClickHandler($event)"
    @contextmenu="rightClickHandler($event)"
    v-bind:style="styleObject">
        <slot></slot>
        <aside v-for="(fg,index) in foregroundStyles" :key="index" v-bind:style="fg"></aside>
        <CanvasOverlay v-bind:room="room" ref="canvas"/>
    </main>
</template>

<script>
import CanvasOverlay from "./CanvasOverlay";

export default {
    name:'Room',
    props: ['room','measure'],
    components: {CanvasOverlay},

    data() {
        return {
            shouldBeCentered: undefined
        }
    },

    methods : {
        clickHandler : function (event) {
            this.$emit('clicked-room', event);
        },
        rightClickHandler : function (event) {
            event.preventDefault();
            this.$emit('right-clicked-room', event);
        },
        doubleClickHandler : function (event) {
            this.$emit('double-click', event);
        },
        resize : function () {
            let widthRatio  = this.$el.parentElement.clientWidth  / this.$el.offsetWidth;
            let heightRatio = this.$el.parentElement.clientHeight / this.$el.offsetHeight;
            this.$emit('scale-change', Math.min(widthRatio * this.room.screenScrollX, heightRatio))

            this.$nextTick(function(){
                if (this.$el.offsetWidth < this.$el.parentElement.clientWidth) {
                    this.shouldBeCentered = true
                } else {
                    this.shouldBeCentered = false
                }
            })
        }
    },
    computed: {
        ident: function() {
            return this.room.id;
        },
        name: function() {
            return this.room.name;
        },
        styleObject : function() {
            return {
                width:  (this.room.width  * this.measure.scale) + this.measure.unit,
                height: (this.room.height * this.measure.scale) + this.measure.unit,
                backgroundSize: '100% 100%',
                backgroundImage: `url(${this.room.url})`,
                alignSelf: this.shouldBeCentered ? 'center' : 'unset',
                filter: this.room.filterString,
            }
        },
        foregroundStyles : function() {
            const {room, measure} = this
            return room.foregrounds.map(foreground => {return foreground.getStyleObject(measure)})
        },
    },

    created() {
        window.addEventListener("resize", this.resize);
    },
    destroyed() {
        window.removeEventListener("resize", this.resize);
    },
    mounted() {
        this.resize();
    },
}
</script>

<style lang="scss">

.room {
    position:relative;
    overflow: hidden;
    flex-shrink:0;
}

</style>





