<template>
<div>

  <figure id="loadingBarHolder">
    <div id="loadingBar"
    v-bind:style="{ width: (progress*100).toFixed(0)+'%'}"
    ></div>
  </figure>
  <p id="loadingBarCaption">loading {{total}} assets...{{isDone? 'done': (progress*100).toFixed(0)+'%' }} </p>

  <img v-for="item in roomAssets" 
  v-bind:key="item.id" 
  v-on:load="imageLoadHandler(item)"
  v-bind:src="item.url" 
  style="display:none" />

  <img v-for="item in spriteAssets"  
  v-on:load="imageLoadHandler(item)"
  v-bind:key="item.id"
  v-bind:src="item.url"
  style="display:none" />

</div>
</template>

<script>
export default {
    name: 'LoadingBar',
    props: ['roomAssets','spriteAssets'],

    data: function() {
      return {
        loadedCount: 0,
      }
    },

    computed: {
      total: function() { return (this.spriteAssets.length + this.roomAssets.length); },
      isDone: function() { return (this.total === this.loadedCount) },
      progress: function() { return (this.loadedCount / this.total ) }
    },

    methods: {
      imageLoadHandler: function(data) {
        this.$emit('loaded',data)
        this.loadedCount++;
      },
    },
}
</script>

