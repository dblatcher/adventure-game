<template>
    <div>
        <WorldItem v-if="type == 'W'"
        v-bind:measure="measure"
        v-bind:item="data"
        v-bind:highlight="highlight"
        @clicked-thing="$emit('clicked-thing',$event)"
        @hover-event="$emit('hover-event',$event)"
        />

        <character v-if="type == 'C'"
        v-bind:measure="measure"
        v-bind:char="data" 
        v-bind:roomWidth="roomWidth"
        v-bind:highlight="highlight"
        @clicked-thing="$emit('clicked-thing',$event)"
        @hover-event="$emit('hover-event',$event)"
        />
    </div>
</template>

<script>

import WorldItem from "./Worlditem/WorldItem";
import Character from "./character/Character";

export default {
    name:'ThingInRoom',
    components: { WorldItem, Character },
    props:['data','measure','roomWidth','highlight'],

    methods : {
        onBeat(data) {this.$children[0].onBeat(data) }
    },

    computed : {
        type : function() {
            let id = this.data.id
            if (id === 'pc') {return 'C'}
            return id.substr(id.length-1, id.length);
        },
    },
}
</script>

<style>

</style>
