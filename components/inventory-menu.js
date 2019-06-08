Vue.component('inventory-menu', {

props:['items'],

data: function() {
	return {
		maxVisible: 6,
		offset: 0
	};
},

computed: {
	visibleItems: function() {
		if (this.items.length <= this.maxVisible) {return this.items;}
		
		var visibleItems = [];
		for (var i = 0; (i< this.maxVisible && i+this.offset< this.items.length); i++) {
			visibleItems.push(this.items[i+this.offset]);
		}
		return visibleItems;
	},
	enableBack : function(){
		return (this.offset > 0 &&  this.items.length > this.maxVisible )
	},
	enableForward : function(){
		return (this.offset < this.items.length-this.maxVisible &&  this.items.length > this.maxVisible )
	},
},

methods: {
	buttonHandler(direction) {
		if (direction === 'back') {
			if (this.offset > 0) {this.offset--};
		}
		if (direction === 'forward') {
			if (this.offset < this.items.length-this.maxVisible) {this.offset++};
		}
	},
	clickHandler(item) {
		this.$root.$emit('clicked-thing', item);
	},
	hoverHandler : function (event,item) {
		this.$root.$emit('hover-event', item, event);
	},
},

template: `
<section class="inventory-menu">

	<button @click="buttonHandler('back')" v-bind:class="{ 'inventory-menu__button--enabled': enableBack }"
	class="inventory-menu__button inventory-menu__button--back"> &larr; </button> 
	<button @click="buttonHandler('forward')" v-bind:class="{ 'inventory-menu__button--enabled': enableForward }" 
	class="inventory-menu__button inventory-menu__button--forward"> &rarr; </button> 
	
	<div class="inventory-menu__holder">
		<div @click="clickHandler(item)" v-on:mouseover="hoverHandler(event,item)" v-on:mouseout="hoverHandler(event,item)"
		class="inventory-menu__item" v-for="item, index in this.visibleItems":key="index">
			<img class="inventory-menu__pic" v-bind:src="item.url" v-bind:name="item.name"/>
		</div>
	<div>
	
</section>
`


});