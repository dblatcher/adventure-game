<template>
	<p v-bind:style="styleObject">
		<span class="tail" v-bind:style="tailStyleObject"></span>
		<span>{{text}}</span>
	</p>
</template>

<script>
export default {
	name:'SpeechLine',
	props: ['color','text','measure','pos'],
	computed: {
		styleObject : function() {
			const {x,y,characterHeight, characterWidth,roomHeight, roomWidth} = this.pos;
			const {unit, scale} = this.measure
			const toCssValue = (v) => ((v*scale)+unit)

			const onRight = (x > roomWidth/2);
			const left  = onRight  ? 'unset' : toCssValue (x + characterWidth/2)
			const right = !onRight ? 'unset' : toCssValue (roomWidth - x + characterWidth/2)
			const top   = toCssValue (Math.max((roomHeight - y - characterHeight),0))
			const padding  = this.text === '' ? '0': '.5em'
			const marginLeft  = !onRight ? '0' : '.5rem'
			const marginRight = onRight  ? '0' : '.5rem'

			return {
				color:this.color,
				padding,left,right,top, marginLeft, marginRight
			}
		},
		tailStyleObject : function() {
			const {x,y,characterHeight, characterWidth,roomHeight, roomWidth} = this.pos;
			const {unit, scale} = this.measure
			const toCssValue = (v) => ((v*scale)+unit)

			const onRight = (x > roomWidth/2);
			const left  = onRight  ? 'unset' : '-1rem'
			const right = !onRight ? 'unset' : '-1rem'
			const display = this.text === '' ? 'none' : 'inline-block'
			const borderTopLeftRadius   = !onRight ? '.5rem' : '0'
			const borderTopRightRadius  =  onRight ? '.5rem' : '0'
			const borderBottomLeftRadius   = !onRight ? '.5rem' : '0'
			const borderBottomRightRadius  =  onRight ? '.5rem' : '0'

			return {left, right, display, 
			borderTopLeftRadius, borderTopRightRadius,
			borderBottomLeftRadius, borderBottomRightRadius}
		}
	},
}
</script>

<style lang="scss" scoped>
	p {
		position: absolute;
		font-family: monospace;
		font-weight: 600;
		background-color: rgba(0,0,0,.6);
		z-index: 200;
		margin: 0;
		border-radius: .5rem;
		max-width: 50%;
		min-height: 3rem;
		display: flex;
		align-items: center;
	}
	.tail {
		position: relative;
		position: absolute;
		width: 1rem;
		height: .5rem;
		background-color: rgba(0,0,0,.6);
		bottom:50%;
		transform: (translateY(50%));

	}
</style>

