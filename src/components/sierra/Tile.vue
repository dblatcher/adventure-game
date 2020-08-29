
<template>

  <figure @click="$emit('tile-click')"  
  v-bind:style="tileStyle" 
  v-bind:class="{active: active, static:static}">
    <div class="shape" v-bind:style="background"></div>
    <img v-if="icon" v-bind:src="icon">
  </figure>

</template>

<script>

export default {
    name: 'Tile',
    props: ['icon', 'background', 'size', 'active', 'static', 'backgroundColor'],

    computed : {
      tileStyle() {
        let size = this.size || 4
        let backgroundColor = this.backgroundColor || 'unset'
        return {
            height: `${size}rem`,
            width: `${size}rem`,
            backgroundColor: backgroundColor,
        }
      },
    }
}
</script>

<style lang="scss" scoped>
@import '../../modules/layout';


figure {
  border: 1px solid black;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  position:relative;
  padding: .1rem;
  margin:.25rem;
  flex-shrink: 0;
  transition: box-shadow .4s, transform .4s; 
  box-shadow: 4px 4px 2px black;
  transform: translateX(-4px) translateY(-4px);
  box-sizing: border-box;
}


.static {
    box-shadow: 0 0 black;
    transform: translateX(0) translateY(0);
}

.active {
    box-shadow: 1px 1px 1px black;
    transform: translateX(1px) translateY(1px);
}

img {
  height: 75%;
  width: 75%;
  z-index: 5;
}

.shape {
    @include centerPoint;
    @include placeAbsolute(50%, 50%);
    width: 75%;
    height: 75%;
    box-sizing: border-box;
}

</style>