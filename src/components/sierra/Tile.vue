
<template>

  <figure @click="$emit('tile-click')"  v-bind:style="tileStyle">
    <div class="background" v-bind:style="backgroundStyle"></div>
    <img v-if="icon" v-bind:src="icon">
  </figure>

</template>

<script>
export default {
    name: 'Tile',
    props: ['icon', 'background', 'size'],

    computed : {
        tileStyle() {
            let size = this.size || 4
            return {
                height: `${size}rem`,
                width: `${size}rem`,
            }
        },
        backgroundStyle () {
            let bg= this.background
            if (!bg || typeof bg !== 'object'){return {display:'none'}}

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
    }
}
</script>

<style lang="scss" scoped>
@import '../../modules/layout';


figure {
  border: 1px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  position:relative;
  padding: .1rem;
  margin:.25rem;
  flex-shrink: 0;
}

img {
  height: 75%;
  width: 75%;
  z-index: 5;
}

.background {
    @include centerPoint;
    @include placeAbsolute(50%, 50%);
    width: 90%;
    height: 90%;
    box-sizing: border-box;
}

</style>