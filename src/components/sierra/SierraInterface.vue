<template>

<aside class="sierra">  

    <div class="sierra__menu-wrapper"
    v-bind:class="{
        disabled:(gameStatus !== 'LIVE'),
    }">

        <Tile v-bind:icon='verbIcon'
        v-bind:background="verbBackground"
        backgroundColor="white"
        v-bind:static="true"
        v-show="!inventoryIsOpen"
        v-on:tile-click="changeToNextVerb"/>

        <Tile v-bind:icon='boxIcon'
        backgroundColor="white"
        v-bind:static="true"
        v-show="!inventoryIsOpen"
        v-on:tile-click="toggleInventory"/>

        <InventoryBox 
        v-show="inventoryIsOpen"

        v-on:verb-clicked="handleInventoryBoxVerbClick($event)"
        v-on:item-clicked="handleInventoryBoxItemClick($event)"
        v-on:close-clicked="toggleInventory()"

        v-bind:currentItem="selectedInventoryItem"
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
import boxIcon from "../../icons/box-open.svg"

export default {
    name: 'SierraInterface',
    components: {InventoryBox, Tile},
    props: ['gameStatus', 
    'currentVerb',
    'items', 
    'subject','object','thingHoveredOn','needObject', 'lastCommand', 
    'conversation','recommendedVerb','selectedInventoryItem'],

    data : function () {
        return {
            inventoryIsOpen: false,
            boxIcon
        }
    },

    computed: {
        verbIcon() {
            const {currentVerb, selectedInventoryItem} = this
            if (!currentVerb) return null
            if (selectedInventoryItem && currentVerb.usesSelectedItem) {return selectedInventoryItem.rightPicture}
            return currentVerb.icon
        },
        verbBackground() {
            const {currentVerb, selectedInventoryItem} = this
            if (selectedInventoryItem && currentVerb.usesSelectedItem) {return selectedInventoryItem.background}
            return false
        },
        inventoryVerbs(){
            return this.$store.state.gameData.verbList.filter(verb=> verb.showOnInventoryBox)
        },
    },

    methods :{
        changeToNextVerb() {
            const {verbList} = this.$store.state.gameData;
            const {currentVerb, selectedInventoryItem} = this;

            function tryNext(index) {
                let nextIndex = index +1 < verbList.length ? index+1 : 0
                if (verbList[nextIndex].usesSelectedItem) {
                    if (!selectedInventoryItem) { return tryNext(nextIndex)}
                }
                return nextIndex  
            }

            let indexOfNextVerb = tryNext (verbList.indexOf(currentVerb) )
            this.$emit('verb-picked', verbList[indexOfNextVerb].id)
        },
        toggleInventory() {
            this.inventoryIsOpen = !this.inventoryIsOpen;
            if (this.inventoryIsOpen) {
                this.$emit('verb-picked',this.inventoryVerbs[0].id)    
            } 
            else {
                if (this.currentVerb.usesSelectedItem && ! this.selectedInventoryItem) {
                    this.changeToNextVerb()
                }
            }
        },
        closeInventory(){
            this.inventoryIsOpen = false;
            if (this.currentVerb.usesSelectedItem && ! this.selectedInventoryItem) {
                this.changeToNextVerb()
            }
        },
        handleInventoryBoxVerbClick(verb) {
            this.$emit('verb-picked',verb.id)
        },
        handleInventoryBoxItemClick(item) {
            this.$emit('item-clicked',item)
        }
    },

    mounted () {
        window.addEventListener('contextmenu',this.changeToNextVerb)
        this.$parent.$on('unhandled-right-click-on-thing', this.changeToNextVerb)
        this.$parent.$on('interaction-start', this.closeInventory)
        this.$parent.$on('default-response-start', this.closeInventory)
    },
    beforeDestroy() {
        window.removeEventListener('contextmenu',this.changeToNextVerb)
        this.$parent.$off('unhandled-right-click-on-thing', this.changeToNextVerb)
        this.$parent.$off('interaction-start', this.closeInventory)
        this.$parent.$off('default-response-start', this.closeInventory)
    }
}
</script>

<style lang="scss">

    .sierra {

        &__menu-wrapper {
            position: fixed;
            bottom: 0;
            right: 0;
            display: flex;
            justify-content: flex-end;	
            align-items: flex-start;

        }
    }

</style>