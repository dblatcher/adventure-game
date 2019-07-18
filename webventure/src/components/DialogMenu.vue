<template>
	<section class="dialog-menu">
		<p @click="clickHandler(choice)" 
		class="dialog-menu__choice" 
		v-for="choice, index in this.choices":key="index">
			{{choice.optionText}}
		</p>
	</section>
</template>

<script>
export default {
	name: 'DialogMenu',

	props:['choices'],


	methods: {
		buttonHandler(direction) {
			if (this.disabled) {return false;}
			if (direction === 'back') {
				if (this.offset > 0) {this.offset--};
			}
			if (direction === 'forward') {
				if (this.offset < this.items.length-this.maxVisible) {this.offset++};
			}
		},
		clickHandler(choice) {
			this.$parent.$emit('dialog-choice', choice);
		},
	},
}
</script>



