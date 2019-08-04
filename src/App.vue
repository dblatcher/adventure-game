<template>
  <div>

    <FileMenu
      v-bind:isOpen="fileMenuIsOpen"
      v-bind:data="savedGames"
      v-bind:atTitle="!gameInstance"
      v-on:click:happen="handleFileMenuClick($event)"
    ></FileMenu>

    <TitleScreen v-if="showTitleScreen">
      <button @click="reloadGame()">New Game</button>
      <button @click="function(){fileMenuIsOpen = true}">restore</button>
    </TitleScreen>
    
    <div id="gameHolder"></div>

    <nav v-if="gameInstance" class="control-bar">
      <div 
      class="control-bar__button btn-solid-black" 
      @click="function(){fileMenuIsOpen = !fileMenuIsOpen}"
      >File</div>
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
    let i, jsonString, savedGames = [];
    for (i=0; i<5; i++) {
      jsonString = window.localStorage.getItem('savedGame_'+i);
      savedGames.push( JSON.parse(jsonString) || {} );
    }

    return {
      savedGames: savedGames,
      gameInstance: null,
      fileMenuIsOpen: false
    }
  },

  computed : {
    showTitleScreen : function () { return !this.gameInstance }
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
          this.saveGame(event[0]);
          this.fileMenuIsOpen = false;
          break;
        case 'load':
          this.reloadGame(this.savedGames[event[0]]);
          this.fileMenuIsOpen = false;
          break;
        case 'clear':
          this.deleteSavedGame(event[0]);
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
          propsData: { loadData: state, }
        })
        this.gameInstance.$mount(element);
      }
    },

    saveGame : function (slotNumber) {
      if (!this.gameInstance) { return false };

      let state = this.gameInstance.returnCurrentState();
      let dataString = JSON.stringify(state);
      window.localStorage.setItem('savedGame_'+slotNumber, dataString)

      let app = this;
      Object.keys(state).forEach ( (key) => {
        app.$set(app.savedGames[slotNumber], key, state[key]);
      });

    },

    deleteSavedGame : function (slotNumber) {
      window.localStorage.removeItem('savedGame_'+slotNumber);
      app.$set( app.savedGames, slotNumber, {} );
    },

  },

  mounted: function () {
    window.app = this;
  }

}
</script>

<style lang="scss">
  @import "./modules/_material.scss";
  * {
    @include font;
  }

  body {
    margin: 0;
  }

  .control-bar {
    position: fixed;
    top: 0;
    right: 0;
    margin: .25rem;
  }

</style>



