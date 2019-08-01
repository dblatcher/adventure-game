<template>
  <div>


    <TitleScreen v-if="showTitleScreen">
      <button @click="reloadGame()">New Game</button>
      <button @click="reloadGame(loadData)">load</button>
    </TitleScreen>
    
    <div id="gameHolder"></div>

    <button @click="quitGame()">Quit to Title</button>
    <button @click="reloadGame()">restart</button>
    <button @click="reloadGame(loadData)">load</button>
    <button @click="saveGame()">save</button>
  </div>
</template>

<script>

import Vue from 'vue';
import Game from "./components/Game";
import {TitleScreen} from "./gameIndex"

export default {
  name: 'App',
  components :{
    Game, TitleScreen
  },


  data () {
    return {
      loadData: {},
      gameInstance: null,
    }
  },

  computed : {
    showTitleScreen : function () { return !this.gameInstance}
  },
  
  methods : {

    quitGame : function() {
      if (this.gameInstance && this.gameInstance._isVue) {
        this.gameInstance.$destroy();
        this.gameInstance.$el.parentElement.removeChild( this.gameInstance.$el);
        this.gameInstance = null;
      }
    },

    reloadGame : function (state = null) {

      if (this.gameInstance && this.gameInstance._isVue) {
        this.gameInstance.$destroy();
        this.gameInstance.$el.parentElement.removeChild( this.gameInstance.$el);
        buildGame.apply(this);
      } else {
        buildGame.apply(this);
      }

      function buildGame() {
        var element = document.querySelector('#gameHolder').appendChild(document.createElement('main'))
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

      let state = this.gameInstance.returnCurrentState();
      let app = this;
      Object.keys(state).forEach ( (key) => {
        app.$set(app.loadData, key, state[key]);
      });

    },

  },


  mounted: function () {
    window.app = this;
    //this.reloadGame();
  }

}
</script>



