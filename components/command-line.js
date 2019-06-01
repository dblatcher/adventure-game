
Vue.component('command-line', {

props:['command'],

data: function() {
	return {

	};
},

methods: {
	
},

template: `
<section class="command-line" v-bind:class="{'command-line--complete' : command.complete}">

	<p class="command-line__sentence">
	{{command.sentence}}<span class="command-line__last-phrase">{{command.undecidedNoun}}</span>
	</p>

</section>
`


});