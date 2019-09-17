<template>
	<section class="inventory-menu">

		<div class="inventory-menu__holder">
			<div @click="clickHandler(item)" 
			v-for="item, index in this.items" v-bind:key="index"
			v-on:mouseover="hoverHandler($event,item)" 
			v-on:mouseout="hoverHandler($event,item)"
			class="inventory-menu__item"
			v-bind:class= "{'inventory-menu__item--picked': isItemPicked(item)}" 
			>
				<img class="inventory-menu__pic" 
				v-bind:src="findRightPicture(index)"
				v-bind:name="item.name"/>
			</div>
			
		</div>


	</section>
</template>


<script>
export default {
	name: 'InventoryMenu',

	props:['items','subject'],

	methods: {
		clickHandler(item) {
			this.$parent.$emit('clicked-thing', item);
		},
		hoverHandler : function (event,item) {
			this.$parent.$emit('hover-event', item, event);
		},
		isItemPicked : function (item) {
			return item === this.subject;
		},
		findRightPicture : function (index) {
			let item = this.items[index];
			if(!item.quantified) {return item.picture[1]}

			let numberToUse = item.quantity;
			let keyList = Object.keys(this.items[index].picture).map(item => Number(item) );

			if (!keyList.includes(numberToUse)) {
				for (let index = keyList.length; index > 0; index--) {
					if (numberToUse > keyList[index] ) {
						numberToUse = keyList[index];
						break;
					}
				}
			}

			return this.items[index].picture[numberToUse];
		}
	},


}
</script>

<style scoped="true" lang="scss">

.inventory-menu {
	overflow:hidden;
	box-sizing:border-box;
	transition: background-color 0.75s, opacity 1s;

	flex-basis: 100%;

	height: 4.5rem;
    overflow-x: scroll;
	margin-left: .5rem;
    margin-right: .5rem;

    &__holder {
		height: 100%;
		width: max-content;
		border-left: 3px solid black;
		border-right: 3px solid black;
		border-radius: 15px;
		padding: 0 5px;

    }
    
    &__item {
		cursor: pointer;
		display: inline-block;
        width: 3.5rem;
        box-sizing:border-box;
        padding:2px;
		margin:2px;
		border: 1px dotted transparent;
		
		&--picked {
			border: 1px dotted black;
		}
    }

    &__pic {
		max-width: 100%;
    }




}



</style>


