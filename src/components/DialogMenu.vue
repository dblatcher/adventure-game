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

<style lang="scss">

.dialog-menu {
	padding:.5rem;
	max-height: 100%;
    box-sizing: border-box;
    min-height: 100%;
	margin: 0 .25rem;
	border-radius:5px;
	
    overflow-y: auto;
	background-color: black;
	
    &__choice {
        color:white;
        transition: color .25s;
        cursor:pointer;
        margin-block-start: .25em;
        margin-block-end: .25em;
        
        &:hover {
            color:red;
        }
    }
}

</style>


