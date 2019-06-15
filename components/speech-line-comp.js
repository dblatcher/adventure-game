Vue.component('speech-line', {
	props: ['color','text','charCentre'],
	computed: {
		styleObject : function() {
			var that = this;
			return {
				color:this.color,
				fontWeight:'600',
				margin: '0',
				backgroundColor: 'rgba(0,0,0,.25)',
				transform: function() {
					// TO DO adjust for variable units
					var lineWidth = that.text.length * (7.15); // guess at font width in px
					var shiftLeft = -50;
					if (that.charCentre < (lineWidth/2)) { 
						shiftLeft = -50 * (that.charCentre/(lineWidth/2));  
					}
					return `translateX(${shiftLeft}%)`;
				}(),
				zIndex:2000,
				fontFamily:'monospace'
			}
		}
	},
	template: `
	<p v-bind:style="styleObject">{{text}}</p>
	`
})