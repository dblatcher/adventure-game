<template>
	<section class="command-line" v-bind:class="{'command-line--complete' : command.complete, disabled:disabled}">
	
		<p class="command-line__sentence">
		{{choosenText}}<span class="command-line__last-phrase">{{possibleText}}</span>
		</p>
	
	</section>
	
</template>

<script>
export default {
	name:'CommandLine',

	props:['command','disabled'],
	
	computed: {
		choosenText : function () {
			return this.disabled ? '' : this.command.sentence;
		},
		possibleText : function () {
			return this.disabled ? '' : this.command.undecidedNoun;
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
		}

		@media (pointer: coarse) {
			display: none;
		}

		@media (hover: none) {
			display: none;
		}

	}

</style>
