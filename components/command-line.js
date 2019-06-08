
Vue.component('command-line', {

props:['command','disabled'],

computed: {
	choosenText : function () {
		return this.disabled ? '' : this.command.sentence;
	},
	possibleText : function () {
		return this.disabled ? '' : this.command.undecidedNoun;
	}
},

template: `
<section class="command-line" v-bind:class="{'command-line--complete' : command.complete, disabled:disabled}">

	<p class="command-line__sentence">
	{{choosenText}}<span class="command-line__last-phrase">{{possibleText}}</span>
	</p>

</section>
`


});