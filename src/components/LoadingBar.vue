<template>
<section id="loadingBarSection">

  <figure id="loadingBarHolder">
    <div id="loadingBar"
    v-bind:style="{ width: (progress*100).toFixed(0)+'%'}"
    ></div>
  </figure>
  <p id="loadingBarCaption">loading {{total}} assets...{{isDone? 'done': (progress*100).toFixed(0)+'%' }} </p>

  <img v-for="item in roomData" 
  v-bind:key="item.id" 
  v-on:load="imageLoadHandler(item)"
  v-bind:src="item.url" 
  style="display:none" />

  <img v-for="item in spriteData"  
  v-on:load="imageLoadHandler(item)"
  v-bind:key="item.id"
  v-bind:src="item.url"
  style="display:none" />

  <img v-for="item in itemData"  
  v-on:load="imageLoadHandler(item)"
  v-bind:key="item.id"
  v-bind:src="item.picture[1]"
  style="display:none" />

</section>
</template>

<script>

export default {
    name: 'LoadingBar',
    props: [],

    data: function() {
      return {
        loadedCount: 0,
        roomData: this.$store.state.gameData.makeRooms(),
        spriteData: this.$store.state.gameData.sprites,
        itemData: this.$store.state.gameData.makeInventoryItems(),
      }
    },

    computed: {
      total: function() { return (this.spriteData.length + this.roomData.length + this.itemData.length); },
      isDone: function() { return (this.total === this.loadedCount) },
      progress: function() { return (this.loadedCount / this.total ) }
    },

    methods: {
      imageLoadHandler: function(data) {
        this.$emit('loaded-asset',data)
        this.loadedCount++;
        if (this.loadedCount === this.total) {this.$emit('loading-done')}
      },
    },
}
</script>

