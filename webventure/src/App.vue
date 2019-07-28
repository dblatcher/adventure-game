<template>
  <div>

    <button @click="reloadGame()">restart</button>
    <button @click="reloadGame(loadData)">load</button>
    <button @click="saveGame()">save</button>

    <TitleScreen v-if="showTitleScreen"></TitleScreen>
    
    <div id="gameHolder"></div>

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



