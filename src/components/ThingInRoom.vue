<template>
    <div>
        <WorldItem v-if="type == 'W'"
        v-bind:measure="measure"
        v-bind:item="data"
        v-bind:highlight="highlight" />

        <character v-if="type == 'C'"
        v-bind:measure="measure"
        v-bind:char="data" 
        v-bind:roomWidth="roomWidth"
        v-bind:highlight="highlight"/>
    </div>
</template>

<script>

import WorldItem from "./WorldItem";
import Character from "./character/Character";

export default {
	name:'ThingInRoom',
	components: { WorldItem, Character },
    props:['data','measure','roomWidth','highlight'],

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
