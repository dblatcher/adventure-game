Vue.component('speech-line', {
	props: ['color','text'],
	computed: {
		styleObject : function() {
			return {
				color:this.color,
				fontWeight:'600',
				margin: '0',
				backgroundColor: 'rgba(0,0,0,.25)',
				zIndex:2
			}
		}
	},
	template: `
	<p v-bind:style="styleObject">{{text}}</p>
	`
})