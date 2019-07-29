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
