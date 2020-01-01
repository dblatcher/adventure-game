<template>
  <div>

    <FileMenu
      v-bind:isOpen="fileMenuIsOpen"
      v-bind:data="savedGames"
      v-bind:atTitle="showTitleScreen"
      v-on:file-menu-click="handleFileMenuClick($event)"
    ></FileMenu>

    <TitleScreen v-show="showTitleScreen">

      <template v-slot:file-buttons>
        <button @click="restartGame()">New Game</button>
        <button @click="function(){fileMenuIsOpen = true}">Restore</button>
      </template>

      <template v-slot:loading-bar><LoadingBar /></template>

    </TitleScreen>

    <EndingScreen v-show="showEndingScreen">
      <template v-slot:file-buttons>
        <button @click="quitGame()">Restart</button>
        <button @click="function(){fileMenuIsOpen = true}">Restore</button>
      </template>
    </EndingScreen>

    <div v-bind:style="{
      maxHeight: showGame ? 'unset': '0',
      position: showGame ? 'unset': 'fixed',
      overflow: showGame ? 'unset': 'hidden',
      visibility: showGame ? 'unset': 'hidden',
    }">
      <Game ref="game"/> 
    </div>

  </div>
</template>

<script>

import Game from "./components/game/Game";
import LoadingBar from "./components/LoadingBar";
import FileMenu from "./components/fileMenu";
import {TitleScreen, EndingScreen} from "./gameIndex"

export default {
  name: 'App',
  components :{
    Game, TitleScreen, EndingScreen, FileMenu, LoadingBar
  },

  data () {
    let i, jsonString, savedGames = [];
    for (i=0; i<5; i++) {
      jsonString = window.localStorage.getItem('savedGame_'+i);
      savedGames.push( JSON.parse(jsonString) || {} );
    }

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const appAudioContext = new AudioContext();
    const masterGainNode = appAudioContext.createGain()
    masterGainNode.gain.value = .1;

    return {
      savedGames: savedGames,
      showTitleScreen: true,
      showEndingScreen: false,
      fileMenuIsOpen: false,
      audio : {
        appAudioContext,
        masterGainNode,
      },
    }
  },

  computed : {

    showGame() {
      return (!this.showTitleScreen && !this.showEndingScreen)
    },

    masterVolume : {
      get() {return this.audio.masterGainNode.gain.value},
      set(value) {this.audio.masterGainNode.gain.value = value;
      return this.audio.masterGainNode.gain.value} 
    },

  },

  methods : {

    handleFileMenuClick: function(event) {
      switch (event[1]) {
        case 'close':
          this.fileMenuIsOpen = false;
          break;
        case 'toggle':
          this.fileMenuIsOpen = !this.fileMenuIsOpen;
          break;
        case 'restart':
          this.restartGame();
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
          this.loadGame(this.savedGames[event[0]]);
          this.fileMenuIsOpen = false;
          break;
        case 'clear':
          this.deleteSavedGame(event[0]);
          break;
      }
    },

    quitGame : function() {
      this.showTitleScreen = true;
      this.showEndingScreen = false;
      this.$refs.game.setGameStatus('PAUSED');
    },

    endGame : function() {
      this.showTitleScreen = false;
      this.showEndingScreen = true;
    },

    loadGame : function(saveFile) {
      this.showTitleScreen = false;
      this.showEndingScreen = false;
      this.$refs.game.loadSaveGame(saveFile);
    },

    restartGame : function () {
      this.showTitleScreen = false;
      this.showEndingScreen = false;
      this.$refs.game.restart();
    },

    saveGame : function (slotNumber) {
      let state = this.$refs.game.returnCurrentState();
      let dataString = JSON.stringify(state);
      window.localStorage.setItem('savedGame_'+slotNumber, dataString)

      let app = this;
      Object.keys(state).forEach ( (key) => {
        app.$set(app.savedGames[slotNumber], key, state[key]);
      });

    },

    deleteSavedGame : function (slotNumber) {
      window.localStorage.removeItem('savedGame_'+slotNumber);
      this.$set( this.savedGames, slotNumber, {} );
    },

  },

  mounted: function () {
    window.app = this;
  }

}
</script>

<style lang="scss">
  @import "./modules/_material.scss";
  @import "./modules/layout.scss";
  * {
    @include font;
  }

  body {
    margin: 0;
  }

</style>



