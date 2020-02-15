
<template>

  <figure @click="$emit('tile-click')"  
  v-bind:style="tileStyle" 
  v-bind:class="{active: active, static:static}">
    <div class="background" v-bind:style="backgroundStyle"></div>
    <img v-if="icon" v-bind:src="icon">
  </figure>

</template>

<script>
export default {
    name: 'Tile',
    props: ['icon', 'background', 'size', 'active', 'static'],

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
  transition: box-shadow .4s, transform .4s; 
  box-shadow: 3px 3px 2px black;
  transform: translateX(-3px) translateY(-3px);
  box-sizing: border-box;
  background-color: rgba($color: #000000, $alpha: .1)
}


.static {
    box-shadow: 0 0 black;
    transform: translateX(0) translateY(0);
}

.active {
    box-shadow: inset 2px 2px 1px black;
    transform: translateX(0px) translateY(0px);
}

img {
  height: 75%;
  width: 75%;
  z-index: 5;
}

.background {
    @include centerPoint;
    @include placeAbsolute(50%, 50%);
    width: 80%;
    height: 80%;
    box-sizing: border-box;
}

</style>