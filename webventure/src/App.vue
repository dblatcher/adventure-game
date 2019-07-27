<template>
  <div>

	<h1>status:{{appStatus}}</h1>

  <div id="gameHolder">
  </div>

  <button @click="reloadGame()">restart</button>
  <button @click="reloadGame(loadData)">load</button>
  <button @click="saveGame()">save</button>

  </div>
</template>

<script>


import Game from "./components/Game";
import Vue from 'vue';

export default {
  name: 'App',
  components :{
    Game
  },


  data () {
    return {
      appStatus: 'GAME RUNNING',
      loadData: {},
      gameInstance: null,
    }
  },

  methods : {

    reloadGame : function (state = null) {

      if (this.gameInstance && this.gameInstance._isVue) {
        window.oldVm = this.gameInstance;
        this.gameInstance.$destroy();
        this.gameInstance.$el.parentElement.removeChild( this.gameInstance.$el);
        buildGame.apply(this);
      } else {
        buildGame.apply(this);
      }

      function buildGame() {
        var element = document.querySelector('#gameHolder').appendChild(document.createElement('div'))
        var GameConstructor = Vue.extend(Game);
        this.gameInstance = new GameConstructor({
          propsData: {
            loadData: state,
          }
        })
        this.gameInstance.$mount(element);
      }
    },

    saveGame : function () {
      if (!this.gameInstance) { return false };

      let state =  this.gameInstance.returnCurrentState();
      state = JSON.stringify(state);
      state = JSON.parse(state);

      this.loadData.roomNumber = state.roomNumber;
      this.loadData.gameStatus = state.gameStatus;
      this.$set(this.loadData, 'inventoryItems', state.inventoryItems);
      this.$set(this.loadData, 'allCharacters', state.allCharacters);
      this.$set(this.loadData, 'rooms', state.rooms);

    },

  },


  mounted: function () {
    window.app = this;
    this.reloadGame();
  }

}
</script>



