<template>

<aside class="sierra">  

    <div class="sierra__menu-wrapper"
    v-bind:class="{
        disabled:(gameStatus !== 'LIVE'),
    }">

        <Tile v-bind:icon='verbIcon'
        v-bind:background="verbBackground"
        v-on:tile-click="changeToNextVerb"/>

        <Tile v-bind:icon='boxIcon'
        v-on:tile-click="toggleInventory"/>


        <InventoryMenu 
        v-show="inventoryIsOpen"
        v-on:item-clicked="$emit('item-clicked',$event)"
        v-on:item-right-clicked="$emit('item-right-clicked',$event)"
        v-on:hover-event="$emit('hover-event', $event)"
        v-bind:items="items" 
        v-bind:subject="subject"/>

        <p>{{currentVerb.description}} {{subject ? subject.id : '-'}} {{object ? object.id : '-'}}</p>

    </div>

</aside>

</template>

<script>


import Tile from './Tile'
import InventoryMenu from "../InventoryMenu";
import boxIcon from "../../icons/box-open.svg"

console.log(boxIcon)

export default {
    name: 'SierraInterface',
    components: {InventoryMenu, Tile},
    props: ['gameStatus', 'currentVerb','verbList', 'items', 'subject','object','thingHoveredOn','needObject', 'lastCommand', 'conversation','recommendedVerb'],
    
    data : function () {
        return {
            currentItem: this.items[0],
            inventoryIsOpen: false,
            boxIcon,
        }
    },

    computed: {
        verbIcon() {
            const {currentVerb, subject, needObject} = this
            if (!currentVerb) return null
            if (subject && subject.dataType == 'InventoryItem' && needObject) {return subject.rightPicture}
            return currentVerb.icon
        },
        verbBackground() {
            const {currentVerb, subject, needObject} = this
            if (subject && subject.dataType == 'InventoryItem' && needObject) {return subject.background}
            return false
        },
    },

    methods :{
        changeToNextVerb() {
            const {currentVerb, verbList} = this;
            let indexOfNextVerb = verbList.indexOf(currentVerb) + 1
            if (indexOfNextVerb >= verbList.length) {indexOfNextVerb = 0}
            this.$emit('verb-picked', verbList[indexOfNextVerb].id)
        },
        toggleInventory() {
            this.inventoryIsOpen = !this.inventoryIsOpen;
        }
    }
}
</script>

<style lang="scss">

    .sierra {


        &__menu-wrapper {
            display: flex;	
            align-items: flex-start;

        }
    }

</style>