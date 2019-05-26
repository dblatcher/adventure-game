Vue.component ('game-room', {
	props: ['room'],
	data: function() { return {
		ident: this.room.id,
		name: 'room(' + this.room.id + ')',
	}},
	methods : {
		clickHandler : function (event) {
			this.$root.$emit('get-report', this, 'clicked');
			this.$root.$emit('clicked', this, 'room', event);
			
		},
	},
	computed: {
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