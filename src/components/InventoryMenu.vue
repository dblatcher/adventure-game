<template>
	<section class="inventory-menu">

		<div class="inventory-menu__holder">

			<div @click="clickHandler(item)" 
			v-on:mouseover="hoverHandler($event,item)" 
			v-on:mouseout="hoverHandler($event,item)"
			class="inventory-menu__item" 
			v-for="item, index in this.items":key="index">
				<img class="inventory-menu__pic" v-bind:src="findRightPicture(index)" v-bind:name="item.name"/>
			</div>
			
		</div>


	</section>
</template>


<script>
export default {
	name: 'InventoryMenu',

	props:['items'],

	methods: {
		clickHandler(item) {
			this.$parent.$emit('clicked-thing', item);
		},
		hoverHandler : function (event,item) {
			this.$parent.$emit('hover-event', item, event);
		},
		findRightPicture : function (index) {
			let item = this.items[index];
			if(!item.quantified) {return item.picture[1]}

			let numberToUse = item.quantity;
			let keyList = Object.keys(this.items[index].picture).map(item => Number(item) );

			if (!keyList.includes(numberToUse)) {
				for (let index = keyList.length; index > 0; index--) {
					console.log(index, keyList[index])
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

	height: 4rem;
    overflow-x: scroll;
	margin-left: .5rem;
    margin-right: .5rem;
    background-color: black;

    &__holder {
		height: 3rem;
    	width: max-content;
    }
    
    &__item {
		display: inline-block;

        width: 2.4rem;
        box-sizing:border-box;
        padding:2px;
        margin:2px;
        border: 1px solid black;
        background-color: white;
    }

    &__pic {
		max-width: 100%;
    }



    @media (min-width: 600px) {
        flex-basis: 45%;
    }

}



</style>


