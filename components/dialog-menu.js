Vue.component('dialog-menu', {

props:['choices'],

data: function() {
	return {

	};
},

computed: {

},

methods: {
	buttonHandler(direction) {
		if (this.disabled) {return false;}
		if (direction === 'back') {
			if (this.offset > 0) {this.offset--};
		}
		if (direction === 'forward') {
			if (this.offset < this.items.length-this.maxVisible) {this.offset++};
		}
	},
	clickHandler(choice) {
		this.$root.$emit('dialog-choice', choice);
	},
},

template: `
<section class="dialog-menu">
	<p @click="clickHandler(choice)" 
	class="dialog-menu__choice" 
	v-for="choice, index in this.choices":key="index">
		{{choice.optionText}}
	</p>
</section>
`


});