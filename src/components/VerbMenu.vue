<template>
    <section class="verb-menu" >
        <div class="verb-menu__option" v-for="verb, index in this.verbList":key="index">

            <div class="verb-menu__box"
                v-bind:for="'verb_'+verb.id"
                v-bind:class="{'verb-menu__box--on' : (verb == picked)}"
                @click="$emit('verb-picked',verb.id)"
                >{{verb.description}}</div>

        </div>
    </section>
</template>

<script>
export default {
    name: 'VerbMenu',
    props:['picked','verbList','thingHoveredOn'],
}
</script>

<style lang="scss">
@import '../modules/material';

.verb-menu {
	display: flex;
	flex-wrap: wrap;
	justify-content:center;
    box-sizing:border-box;
    flex-basis: 100%;
    flex-shrink:.7;

    &__option {
        margin: .1rem;
        position: relative;
        flex-basis: 22%;
        font-size: .8rem;
    }

    &__box {
        @include btn-outline(black); 
        display: block;

        &--on {
            @include btn-solid(black); 
        }
    }

    &__input {
        display:none;

        &:checked~.verb-menu__box {
             @include btn-solid(black); 
        }

    }
    
}


</style>
