Vue.component('speech-line', {
	props: ['color','text','charCentre'],
	computed: {
		styleObject : function() {
			var that = this;
			return {
				color:this.color,
				position:'absolute',
				fontWeight:'600',
				margin: '0',
				borderRadius:'.5em',
				padding: function() {
					return that.text === '' ? '0': '.5em'
				}(),
				backgroundColor: 'rgba(0,0,0,.5)',
				transform: 'translateY(-1em)',
				/* 				
				transform: function() {
					// TO DO adjust for variable units
					var lineWidth = that.text.length * (7.15); // guess at font width in px
					var shiftLeft = -50;
					if (that.charCentre < (lineWidth/2)) { 
						shiftLeft = -50 * (that.charCentre/(lineWidth/2));  
					}
					return `translateX(${shiftLeft}%)`;
				}(), */
				zIndex:2000,
				fontFamily:'monospace'
			}
		}
	},
	template: `
	<p v-bind:style="styleObject">{{text}}</p>
	`
})