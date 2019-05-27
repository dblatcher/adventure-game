Vue.component ('game-room', {
	props: ['room'],
	data: function() { return {
		
	}},
	methods : {
		clickHandler : function (event) {
			this.$root.$emit('get-report', this, 'clicked');
			this.$root.$emit('clicked-room', this, event);	
		},
	},
	computed: {
		ident: function() {
			return this.room.id;
		},
		name: function() {
			return this.room.name;
		},
		styleObject : function() {
			return {
				width:  this.room.width + 'px',
				height: this.room.height+ 'px',
				backgroundSize: 'cover',
				backgroundImage: `url(${this.room.url})`,
			}
		}
	},
	template : `
	<main class="room"
	v-on:click="clickHandler(event)"
	v-bind:style="styleObject">
		<slot></slot>
	</main>
	
	`
	
	
})