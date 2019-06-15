Vue.component ('game-room', {
	props: ['room','measure'],
	data: function() { return {
		
	}},
	methods : {
		clickHandler : function (event) {
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
				width:  (this.room.width  * this.measure.scale) + this.measure.unit,
				height: (this.room.height * this.measure.scale) + this.measure.unit,
				backgroundSize: '100% 100%',
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