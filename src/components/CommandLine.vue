<template>
	<section class="command-line" 
	v-bind:class="{
		 disabled:disabled
	}">
	
		<p class="command-line__sentence">
		{{choosenText}}<span class="command-line__last-phrase">{{possibleText}}</span>
		</p>
	
	</section>
	
</template>

<script>

function describe(thing) {
return thing.quantified && thing.quantity !== 1 ? 
	thing.quantity + ' ' +thing.pluralName : 
	thing.name;
}

export default {
	name:'CommandLine',

	props:['needObject','disabled', 'verb','subject','object','thingHoveredOn'],
	
	computed: {
		choosenText : function () {


			var sentence = this.verb.description + ' ';
			if (this.subject) {
				sentence += describe(this.subject) + ' ';
				if (this.needObject) {sentence += this.verb.preposition + ' ';}
			}
			if (this.object) {
				sentence +=  describe(this.object);
			}
			
			return sentence;
		},
		possibleText : function () {
			return  this.thingHoveredOn ? describe(this.thingHoveredOn) : '';
		}
	},

}
</script>

<style lang="scss">

	.command-line {
		margin: 0 .25rem .25rem;
		background-color: black;
		display: flex;
		flex-wrap: wrap;
		transition: background-color 0.75s, opacity 0.75s;

		&--complete {
			background-color:yellow;
		}

		&__sentence {
			min-height: 1.2em;
			margin: 0;
			padding: .25rem 1rem;
			color:white;
		}

		&__last-phrase {
			color: yellow;
			@media (pointer: coarse) {
				display: none;
			}
			@media (hover: none) {
				display: none;
			}
		}


	}

</style>
