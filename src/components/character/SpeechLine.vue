<template>
	<p v-bind:style="style.box">
		<span class="tail" v-bind:style="style.tail"></span>
		<span>{{text}}</span>
	</p>
</template>

<script>
export default {
	name:'SpeechLine',
	props: ['color','text','measure','pos'],
	computed: {
		style : function() {
			const {x,y,characterHeight, characterWidth,roomHeight, roomWidth, speechBubbleDown,speechBubbleIn} = this.pos
			const {unit, scale} = this.measure
			const {text, color} = this
			const onRight = (x > roomWidth/2)
			const toCssValue = (v) => ((v*scale)+unit)

			const tailTop = characterHeight * speechBubbleDown
			const tailWidth = characterWidth * speechBubbleIn

			function tail() {return {
				display: text === '' ? 'none' : 'inline-block',
				borderLeft:  onRight ? 'unset' : `${toCssValue(tailWidth)} solid transparent`,
				borderRight:  !onRight ? 'unset' : `${toCssValue(tailWidth)} solid transparent`,
				left  : onRight  ? 'unset' : toCssValue(-tailWidth),
				right : !onRight ? 'unset' : toCssValue(-tailWidth),
				top: toCssValue(tailTop), 
			} }

			function box () {return {
				color: color,
				display: text === '' ? 'none' : 'flex',
				left: onRight  ? 'unset' : toCssValue (x + characterWidth/2) ,
				right: !onRight ? 'unset' : toCssValue (roomWidth - x + characterWidth/2),
				top: toCssValue (Math.max((roomHeight - y - characterHeight),0)), 
				marginLeft:  !onRight ? '0' : '.5rem', 
				marginRight:  onRight  ? '0' : '.5rem',
				minHeight: toCssValue(tailTop), 
				minWidth: toCssValue(tailTop), 
			}}

			return {
				tail : tail(),
				box: box(),
			}

		}

	},
}
</script>

<style lang="scss" scoped>
	p {
		position: absolute;
		font-weight: 100;
		background-color: rgba(0,0,0,.6);
		z-index: 200;
		margin: 0;
		border-radius: .5rem;
		max-width: 50%;
		padding: .25rem .5rem;
		align-items: center;
		justify-content: center;
	}
	.tail {
		position: absolute;
		border-bottom: 1rem solid  rgba(0,0,0,.6);
		width: 0rem;
		transform: translateY(-1rem);
	}
</style>

