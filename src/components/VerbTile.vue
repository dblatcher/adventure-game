
<template>

  <figure @click="$emit('tile-click')">
    <p v-if="!currentVerb.icon">{{currentVerb.id}}</p>
    <img v-if="currentVerb.icon" v-bind:src="currentVerb.icon">
  </figure>

</template>

<script>
export default {
    name: 'verbTile',
    props: ['currentVerb']
}
</script>

<style lang="scss" scoped>
figure {
  background-color: yellow;
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