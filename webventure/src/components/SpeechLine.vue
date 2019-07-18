<template>
	<p v-bind:style="styleObject">{{text}}</p>
</template>

<script>
export default {
	name:'SpeechLine',
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
				zIndex:2000,
				fontFamily:'monospace'
			}
		}
	},
}
</script>
