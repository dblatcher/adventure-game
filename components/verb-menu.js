Vue.component('verb-menu', {

props:['verbList','picked','disabled'],

data: function() {

},

methods: {
	update : function () {
		this.$parent.$emit('verb-picked',this.picked);
	}
	
},

mounted: function () {
	this.update();
},

template: `
<form class="verb-menu" v-on:change="update" v-bind:class="{disabled:disabled}">

	<div class="verb-menu__option" v-for="verb, index in this.verbList":key="index">
		<input class="verb-menu__input" type="radio" name="verb" v-bind:id="'verb_'+verb.id"  v-bind:value="verb.id" v-model="picked"/>
		<label class="verb-menu__label" v-bind:for="'verb_'+verb.id">{{verb.description}}</label>
	</div>
</form>
`


});