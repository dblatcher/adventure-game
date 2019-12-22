<template>
  <audio v-bind:src="data.path" />
</template>

<script>
export default {
    name: "AudioTrack", 
    props:  ["data"],
}
</script>
