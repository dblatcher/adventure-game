
<template>

  <p @click="$emit('tile-click')">{{currentVerb.description}}
    <img v-bind:src="currentVerb.icon">
  </p>
</template>

<script>
export default {
    name: 'verbTile',
    props: ['currentVerb']
}
</script>

<style lang="scss" scoped>
p {
  color:red;
  background-color: yellow;
}
</style>