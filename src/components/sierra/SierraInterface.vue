<template>

<aside class="sierra">  

    <div class="sierra__menu-wrapper"
    v-bind:class="{
        disabled:(gameStatus !== 'LIVE'),
    }">

        <Tile v-bind:icon='verbIcon'
        v-bind:background="verbBackground"
        v-bind:static="true"
        v-on:tile-click="changeToNextVerb"/>

        <Tile v-bind:icon='boxIcon'
        v-bind:active="inventoryIsOpen"
        v-on:tile-click="toggleInventory"/>

        <InventoryBox 
        v-show="inventoryIsOpen"

        v-on:verb-clicked="handleInventoryBoxVerbClick($event)"
        v-on:item-clicked="handleInventoryBoxItemClick($event)"
        v-on:close-clicked="toggleInventory()"

        v-bind:currentItem="currentItem"
        v-bind:currentVerb="currentVerb"
        v-bind:actions="inventoryVerbs"
        v-bind:items="items" 
        v-bind:subject="subject"/>


    </div>

</aside>

</template>

<script>


import Tile from './Tile'
import InventoryBox from './InventoryBox'
import InventoryMenu from "../InventoryMenu";
import boxIcon from "../../icons/box-open.svg"

console.log(boxIcon)

export default {
    name: 'SierraInterface',
    components: {InventoryMenu,InventoryBox, Tile},
    props: ['gameStatus', 'currentVerb','verbList', 'items', 'subject','object','thingHoveredOn','needObject', 'lastCommand', 'conversation','recommendedVerb'],
    
    data : function () {
        return {
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
        inventoryVerbs(){
            return this.verbList.filter(verb=> verb.id==='LOOK' || verb.id==="USE")
        },
        currentItem(){
            const { subject, needObject} = this
            if (subject && subject.dataType == 'InventoryItem' && needObject) {return subject}
            return null
        }
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
        },
        handleInventoryBoxVerbClick(verb) {
            this.$emit('verb-picked',verb.id)
        },
        handleInventoryBoxItemClick(item) {
            // if (this.currentVerb.id === 'USE') {
            //     this.currentItem = item
            //     console.log('!!')
            //     console.log(this.currentItem)
            // }
            this.$emit('item-clicked',item)
        }


    }
}
</script>

<style lang="scss">

    .sierra {


        &__menu-wrapper {
            display: flex;
            justify-content: flex-end;	
            align-items: flex-start;

        }
    }

</style>