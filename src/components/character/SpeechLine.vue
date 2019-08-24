<template>
	<p v-bind:style="styleObject">{{text}}</p>
</template>

<script>
export default {
	name:'SpeechLine',
	props: ['color','text','left','right','side','measure'],
	computed: {
		styleObject : function() {
			var that = this;
			return {
				color:this.color,
				padding: function() {
					return that.text === '' ? '0': '.5em'
				}(),				
				transform: 'translateY(-1em)',

				left: this.side == 'left' ?
					(this.left * this.measure.scale)+this.measure.unit :
					'unset',

				right: this.side == 'right' ?
					(this.right * this.measure.scale)+this.measure.unit :
					'unset',

			}
		}
	},
}
</script>

<style lang="scss" scoped>
	p {
		position: absolute;
		font-family: monospace;
		font-weight: 600;
		background-color: rgba(0,0,0,.5);
		z-index: 200;
		margin: 0;
		border-radius: .5rem;
	}
</style>

