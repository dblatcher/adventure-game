
<template>
  <figure @click="$emit('tile-click',currentItem)">
    <img v-if="currentItem" v-bind:src="image">
  </figure>
</template>

<script>
export default {
    name: 'ItemTile',
    props: ['currentItem'],
    computed : {
        caption () {
            if(this.currentItem) {
                return this.currentItem.id
            }
            return ''
        },

        image() {
            if(this.currentItem) {
                return this.findRightPicture()
            }
            return ''
        }
    },
    methods: {
        makeItemBackground : function () {
            let item = this.currentItem
			if (!item || typeof item.background !== 'object'){return {display:'none'}}
			let bg= item.background

			switch (bg.shape) {
				case 'circle': return {
					borderRadius: '50%',
					backgroundColor : bg.color,
					boxShadow: '2px 2px black',
				}
				break;
				case 'square': return {
					backgroundColor : bg.color,
					boxShadow: '2px 2px black',
				}
				break;
				case 'diamond': return {
					transform: 'translateX(-50%) translateY(-50%) rotate(45deg) scale(.75,.75)',
					backgroundColor : bg.color,
					boxShadow: '3px 1px black',
				}
				break;
				default: return {}
			}

		},
        findRightPicture : function () {
			let item = this.currentItem;
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
    }
}
</script>

<style lang="scss" scoped>
figure {
  border: 1px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 6rem;
  width:  6rem;
  position:relative;
  padding:0;
  margin:.25rem;
  flex-shrink: 0;
}

img {
  height: 75%;
  width: 75%;
}
</style>