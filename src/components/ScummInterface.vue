<template>

<aside class="scumm">  

    <CommandLine 
    v-bind:command='command' 
    v-bind:class="{
    disabled: disabled,
    }"
    ></CommandLine>

    <div class="scumm__menu-wrapper"
    v-bind:class="{
    disabled:disabled,
    }">

        <VerbMenu 
        v-on:verb-picked="$emit('verb-picked',$event)"
        v-bind:verb-list='verbList'
        v-bind:picked='currentVerb'/>

        <InventoryMenu 
        v-on:item-clicked="$emit('item-clicked',$event)"
        v-on:hover-event="$emit('hover-event', $event)"
        v-bind:items="items" 
        v-bind:subject="subject"/>

    </div>

</aside>

</template>

<script>
import VerbMenu from "./VerbMenu";
import InventoryMenu from "./InventoryMenu";
import CommandLine from "./CommandLine";


export default {
    name: 'ScummInterface',
    components: {VerbMenu, InventoryMenu, CommandLine},
    props: ['disabled', 'command', 'currentVerb','verbList', 'items', 'subject'],
}
</script>

<style lang="scss">

    .scumm {
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