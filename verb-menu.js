function Verb (description, id) {
	this.description = description;
	this.id = id;
}


Vue.component('verb-menu', {

props:[],

data: function() {

	return {
		verbs: [
		new Verb('walk to','WALK'), new Verb('pick up','TAKE'),
		new Verb('look at','LOOK'), new Verb('give','GIVE'),
		new Verb('use','USE'), new Verb('talk to','TALK')
		]
	};
},

template: `
<form class="verb-menu">

	<div class="verb-menu__option" v-for="verb, index in this.verbs":key="index">
		<input class="verb-menu__input" type="radio" name="verb" v-bind:id="'verb_'+verb.id"  v-bind:value="verb.id"/>
		<label class="verb-menu__label" v-bind:for="'verb_'+verb.id">{{verb.description}}</label>
	</div>

</form>
`


});