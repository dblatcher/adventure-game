<template>
  <div>

    <FileMenu
      v-bind:isOpen="fileMenuIsOpen"
      v-bind:data="loadData"
      v-bind:atTitle="!gameInstance"
      v-on:click:happen="handleFileMenuClick($event)"
    ></FileMenu>

    <TitleScreen v-if="showTitleScreen">
      <button @click="reloadGame()">New Game</button>
      <button @click="function(){fileMenuIsOpen = true}">restore</button>
    </TitleScreen>
    
    <div id="gameHolder"></div>

    <nav v-if="gameInstance" class="control-bar">
      <button class="control-bar__button" @click="function(){fileMenuIsOpen = !fileMenuIsOpen}">file</button>
    </nav>

  </div>
</template>

<script>

import Vue from 'vue';
import Game from "./components/Game";
import FileMenu from "./components/fileMenu";
import {TitleScreen} from "./gameIndex"

export default {
  name: 'App',
  components :{
    Game, TitleScreen, FileMenu
  },


  data () {

    //console.log (window.localStorage.getItem('saveGameData'));
    let dataFromStorage = window.localStorage.getItem('saveGameData');
    dataFromStorage = JSON.parse(dataFromStorage);
    console.log(dataFromStorage)

    return {
      loadData: dataFromStorage || {},
      gameInstance: null,
      fileMenuIsOpen: false
    }
  },

  computed : {
    showTitleScreen : function () { return !this.gameInstance}
  },
  
  methods : {

    handleFileMenuClick: function(event) {
      switch (event[1]) {
        case 'close':
          this.fileMenuIsOpen = false;
          break;
        case 'restart':
          this.reloadGame();
          this.fileMenuIsOpen = false;
          break;
        case 'quit':
          this.quitGame();
          this.fileMenuIsOpen = false;
          break;
        case 'save':
          this.saveGame();
          this.fileMenuIsOpen = false;
          break;
        case 'load':
          this.reloadGame(this.loadData);
          this.fileMenuIsOpen = false;
          break;
        case 'clear':
          this.deleteSavedGame();
          break;
      }
    },

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
      let dataString = JSON.stringify(state);
      window.localStorage.setItem('saveGameData', dataString)

      let app = this;
      Object.keys(state).forEach ( (key) => {
        app.$set(app.loadData, key, state[key]);
      });

    },

    deleteSavedGame : function () {
      window.localStorage.removeItem('saveGameData');
      app.loadData = {};
    },

  },


  mounted: function () {
    window.app = this;
    //this.reloadGame();
  }

}
</script>

<style lang="scss">

body {
  margin: 0;
}

.control-bar {
  position: fixed;
  top: 0;
  right: 0;
  margin: .25rem;

  &__button {
    font-size: 1.5rem;
  }
}

</style>


