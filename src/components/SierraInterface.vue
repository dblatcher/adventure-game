<template>

<aside class="Sierra">  

    <div class="Sierra__menu-wrapper"
    v-bind:class="{
        disabled:(gameStatus !== 'LIVE'),
    }">

        <VerbTile v-bind:currentVerb='currentVerb'
        v-on:tile-click="changeToNextVerb"/>

        <VerbMenu 
        v-on:verb-picked="$emit('verb-picked',$event)"
        v-bind:verb-list='verbList'
        v-bind:thingHoveredOn='thingHoveredOn'
        v-bind:picked='currentVerb'
        v-bind:recommendedVerb="recommendedVerb"/>

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
import VerbMenu from "./VerbMenu";
import VerbTile from "./VerbTile";
import InventoryMenu from "./InventoryMenu";



export default {
    name: 'SierraInterface',
    components: {VerbMenu, InventoryMenu, VerbTile},
    props: ['gameStatus', 'currentVerb','verbList', 'items', 'subject','object','thingHoveredOn','needObject', 'lastCommand', 'conversation','recommendedVerb'],
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

    .Sierra {
        display: flex;
        justify-content: center;
        flex-direction: column;
        flex-shrink: 0;
        margin-top: .25rem;

        &__menu-wrapper {
            display: flex;	
            justify-content:center;
            flex-wrap: nowrap;
            align-items: flex-start;

            @media (orientation: portrait) {
                flex-wrap: wrap;
            }
        }
    }

</style>