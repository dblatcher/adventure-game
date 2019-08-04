<template>
    <form class="verb-menu" v-on:change="update" >
        <div class="verb-menu__option" v-for="verb, index in this.verbList":key="index">
            
            <input class="verb-menu__input" type="radio" name="verb" 
            v-bind:id="'verb_'+verb.id"  v-bind:value="verb.id" v-model="picked"/>
            
            <label class="verb-menu__box" v-bind:for="'verb_'+verb.id">
                {{verb.description}}
            </label>

        </div>
    </form>
</template>

<script>
export default {
    name: 'VerbMenu',
    props:['verbList','initalPick'],
    data () {
        return {picked:this.initalPick}
    },

    methods: {
        update : function () {
            this.$parent.$emit('verb-picked',this.picked);
        },
        reset : function () {
            this.picked = this.initalPick;
        }   
    },

    mounted: function () {
        this.update();
    },
}
</script>

<style lang="scss">
@import '../modules/material';

.verb-menu {
	display: flex;
	flex-wrap: wrap;
	justify-content:center;
	box-sizing:border-box;
    
    &__option {
        margin: .1rem;
        position: relative;
        flex-basis: 22%;
        font-size: .8rem;
    }
    
    &__box {    
        @include btn-outline(black); 
        display: block;
    }

    &__input {
        display:none;

        &:checked~.verb-menu__box {
             @include btn-solid(black); 
        }

    }
    
    @media (min-width: 600px) {
        flex-basis: 45%;
    }

}
	

</style>
