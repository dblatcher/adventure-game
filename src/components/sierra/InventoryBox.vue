<template>
  <section>

      <button @click="$emit('close-clicked')">close</button>

      <div class="actions">
        <Tile v-for="verb in actions" 
        @tile-click="$emit('verb-clicked', verb)" 
        v-bind:key="verb.id"
        v-bind:size="3"
        v-bind:active="verb===currentVerb"
        v-bind:icon="verb.icon"/>
      </div>

      <div class="item-holder">
        <Tile v-for="item in items"
        @tile-click="$emit('item-clicked', item)" 
        v-bind:key="item.id"
        v-bind:active="item===currentItem"
        v-bind:icon="item.rightPicture"
        v-bind:background="item.background"/>
      </div>

  </section>
</template>

<script>
import Tile from './Tile'
import boxIcon from "../../icons/box-open.svg"

export default {

    name: 'InventoryBox',
    components: {Tile},
    props: ['items', 'currentItem', 'actions','currentVerb'],
    data() {
        return {
            icon: boxIcon
        }
    },
    computed : {
        inventory() {
            return this.items.filter(item=>item.have)
        }
    },
    methods : {
        handleItemClick(event){
            console.log('TILE ITEM', event)
        }
    }

}
</script>

<style lang="scss" scoped>

@import '../../modules/layout';
@import '../../modules/material';

section {
    @include centerPoint;
    @include placeAbsolute(50%, 50%);
    position: fixed;
    padding: 1rem;


    box-shadow: $drop-shadow2;
    background-image: linear-gradient(gray, white)
}

.actions {
    display: flex;
}

.item-holder {
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    padding: .5rem;
    border: 1px solid black;
    min-width: 18rem;
    min-height: 9rem;
    box-sizing: content-box; 
}

</style>