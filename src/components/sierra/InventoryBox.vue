<template>
  <section>

      <img class= "close-icon"
      v-bind:src="closeIcon" 
      @click="$emit('close-clicked')"/>

      <div class="actions">
        <Tile v-for="verb in actions" 
        @tile-click="$emit('verb-clicked', verb)" 
        v-bind:key="verb.id"
        v-bind:size="3"
        v-bind:active="verb===currentVerb"
        v-bind:icon="verb.icon"/>
      </div>

      <p class="caption">{{caption || "&nbsp;"}}</p>

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
import closeIcon from "../../icons/window-close.svg"

export default {

    name: 'InventoryBox',
    components: {Tile},
    props: ['items', 'currentItem', 'actions','currentVerb'],
    data() {
        return {
            closeIcon
        }
    },
    computed : {
        inventory() {
            return this.items.filter(item=>item.have)
        },
        caption() {
            const{currentVerb, currentItem,actions} = this;

            if (!currentVerb ) {return null}
            if (!actions.includes(currentVerb) ) {return null}
            if (!currentVerb.usesSelectedItem) {
                return `${currentVerb.description}...`
            }
            if (currentVerb.usesSelectedItem && !currentItem) {
                return `${currentVerb.description}...`
            }
            if (currentVerb.usesSelectedItem && currentItem) {
                return `${currentVerb.description} ${currentItem.name} ${currentVerb.preposition}...`
            }


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
    margin: 1rem;
    max-height: 100%;
    box-sizing: border-box;
    padding: .5rem;
    display: flex;
    flex-flow: column nowrap;

    box-shadow: $drop-shadow2;
    background-image: linear-gradient(gray, white);
}

.actions {
    display: flex;
    justify-content: space-around;
    padding: 0 2.5rem;
}

.close-icon {
    width: 2rem;
    height: 2rem;
    align-self: flex-end;
    cursor: pointer;
    position: absolute;
    right:.25rem;
    top:.25rem;
}

.caption {
    margin:0;
}

.item-holder {
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    padding: .5rem;
    border: 1px solid black;
    min-width: 18rem;
    min-height: 3rem;
    box-sizing: content-box; 
}

</style>