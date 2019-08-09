<template>
    <div>
        <WorldItem v-if="type == 'WorldItem'"
        v-bind:measure="measure"
        v-bind:item="data" />

        <character v-if="type == 'Character'"
        v-bind:measure="measure"
        v-bind:char="data" 
        v-bind:roomWidth="roomWidth"/>
    </div>
</template>

<script>

import WorldItem from "./WorldItem";
import Character from "./Character";

export default {
	name:'ThingInRoom',
	components: { WorldItem, Character },
    props:['data','measure','roomWidth'],

    computed : {
        type : function() {
            return this.data.constructor.name;
        },
    },
}
</script>

<style>

</style>
