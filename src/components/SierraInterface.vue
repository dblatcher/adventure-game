<template>

<aside class="sierra">  

    <div class="sierra__menu-wrapper"
    v-bind:class="{
        disabled:(gameStatus !== 'LIVE'),
    }">

        <VerbTile v-bind:currentVerb='currentVerb'
        v-on:tile-click="changeToNextVerb"/>

        <ItemTile v-bind:currentItem='currentItem'
        v-on:tile-click="$emit('item-clicked',$event)"/>

        <InventoryMenu 
        v-on:item-clicked="$emit('item-clicked',$event)"
        v-on:item-right-clicked="$emit('item-right-clicked',$event)"
        v-on:hover-event="$emit('hover-event', $event)"
        v-bind:items="items" 
        v-bind:subject="subject"/>

    </div>

</aside>

</template>

<script>

import VerbTile from "./VerbTile";
import ItemTile from "./ItemTile";
import InventoryMenu from "./InventoryMenu";



export default {
    name: 'SierraInterface',
    components: {InventoryMenu, VerbTile, ItemTile},
    props: ['gameStatus', 'currentVerb','verbList', 'items', 'subject','object','thingHoveredOn','needObject', 'lastCommand', 'conversation','recommendedVerb'],
    
    data : function () {
        return {
            currentItem: this.items[0],
        }
    },

    methods :{
        changeToNextVerb() {
            const {currentVerb, verbList} = this;
            let indexOfNextVerb = verbList.indexOf(currentVerb) + 1
            if (indexOfNextVerb >= verbList.length) {indexOfNextVerb = 0}
            this.$emit('verb-picked', verbList[indexOfNextVerb].id)
        }
    }
}
</script>

<style lang="scss">

    .sierra {


        &__menu-wrapper {
            display: flex;	
            justify-content:center;
            align-items: flex-start;

        }
    }

</style>