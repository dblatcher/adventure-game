<template>
    <section class="inventory-menu">

        <div class="inventory-menu__holder">
            <figure 
            v-for="item, index in this.items" v-bind:key="index"
            @click="$emit('item-clicked', item)" 
            @contextmenu="rightClickHandler(item, $event)" 
            v-on:mouseover="hoverHandler(item,$event)" 
            v-on:mouseout="hoverHandler(item,$event)"

            class="inventory-menu__item"
            v-bind:class= "{'inventory-menu__item--picked': isItemPicked(item)}" 
            >
                <div class="inventory-menu__pic-background" v-bind:style="makeItemBackground(item)"></div>
                <img class="inventory-menu__pic" 
                v-bind:src="item.rightPicture"
                v-bind:name="item.name"/>
            </figure>

        </div>
    </section>
</template>


<script>
export default {
    name: 'InventoryMenu',

    props:['items','subject'],

    methods: {
        hoverHandler : function (item, event) {
            this.$emit('hover-event', [item, event]);
        },
        rightClickHandler: function(item, event) {
            event.preventDefault();
            this.$emit('item-right-clicked', item)
        },
        isItemPicked : function (item) {
            return item === this.subject;
        },
        makeItemBackground : function (item) {
            return item.backgroundStyleObject
        },
    },
}
</script>

<style lang="scss">

@import '../modules/material';
@import '../modules/layout';

.inventory-menu {
    overflow:hidden;
    box-sizing:border-box;
    transition: background-color 0.75s, opacity 1s;

    flex-basis: 100%;

    height: 4.5rem;
    overflow-x: auto;
    margin-left: .5rem;
    margin-right: .5rem;

    &__holder {
        height: 3rem;
        width: max-content;
        border-left: 3px solid black;
        border-right: 3px solid black;
        border-radius: 15px;
        padding: 0 5px;

    }
    
    &__item {
        cursor: pointer;
        display: inline-block;
        width: 3rem;
        height: 3rem;
        box-sizing:border-box;
        padding:2px;
        margin: -1px 2px 2px 2px;
        border: 2px dotted transparent;
        position:relative;
        
        &--picked {
            border: 2px dashed black;
            border-radius: 5px;
        }
    }

    &__pic {
        max-width: 100%;
    }

    &__pic-background {
        @include centerPoint;
        @include placeAbsolute(50%, 50%);
        width: 95%;
        height: 95%;
        z-index: -1;
        box-sizing: border-box;
    }
}



</style>


