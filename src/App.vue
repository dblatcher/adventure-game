<template>
  <div>

    <FileMenu
      v-bind:isOpen="fileMenuIsOpen"
      v-bind:data="savedGames"
      v-bind:atTitle="showTitleScreen"
      v-on:file-menu-click="handleFileMenuClick($event)"
    ></FileMenu>

    <TitleScreen v-show="showTitleScreen" v-bind:soundEnabled="audio.enabled">

      <template v-slot:file-buttons>
        <button id="new-game" @click="restartGame()">New Game</button>
        <button id="restore" @click="function(){fileMenuIsOpen = true}">Restore</button>
        <button v-show="autoSaveSlotisUsed" @click="continueGame">Continue</button>
      </template>

      <template v-slot:sound-toggle>
        <button id="toggle-sound" @click="toggleSound">{{audio.enabled? 'disable sound' : 'enable sound'}}</button>
      </template>

      <template v-slot:loading-bar><LoadingBar /></template>

    </TitleScreen>

        <SfxPlayer 
        v-bind:sounds="sounds" 
        v-bind:audioPosition="titleMusicPosition"
        v-bind:contextSource="audio"
        v-bind:audioContextStatusEmitter="self"   
        ref="audio"/>

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
      <Game ref="game" 
      v-bind:running="showGame"
      v-on:auto-save="autoSave"/> 
    </div>

  </div>
</template>

<script>

import Game from "./components/game/Game";
import LoadingBar from "./components/LoadingBar";
import FileMenu from "./components/fileMenu";
import {TitleScreen, EndingScreen} from "./gameIndex"
import SfxPlayer from "./components/SfxPlayer"

import { /* webpackPreload: true */ gameData } from "./gameIndex";


import {config} from "./gameIndex"

export default {
  name: 'App',
  components :{
    Game, TitleScreen, EndingScreen, FileMenu, LoadingBar, SfxPlayer,
  },

  data () {
    let i, jsonString, savedGames = [];
    for (i=0; i<5; i++) {
      jsonString = window.localStorage.getItem(config.title+'_savedGame_'+i);
      savedGames.push( JSON.parse(jsonString) || {} );
    }

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();
    const masterGainNode = audioContext.createGain()
    masterGainNode.gain.value = 0; // initial gain value is 0 because enabled is false 

    return {
      savedGames: savedGames,
      showTitleScreen: true,
      showEndingScreen: false,
      fileMenuIsOpen: false,
      audio : {
        audioContext,
        masterGainNode,
        enabled: false,
        masterVolume: 1,
        titleMusicVolume: .25,
      },
    }
  },

  computed : {

    self() {return this},
    sounds() { return gameData.sounds},

    titleMusicPosition() {
      return {
          pan: 0,
          gain: this.audio.titleMusicVolume,
          loopSound: this.showTitleScreen? 'music' : null
      }
    },


    showGame() {
      return (!this.showTitleScreen && !this.showEndingScreen)
    },

    masterVolume : {
      get() {return this.audio.masterGainNode.gain.value},
      set(value) {
        this.audio.masterGainNode.gain.value = value;
        return this.audio.masterGainNode.gain.value} 
    },

    autoSaveSlotisUsed() {
      return !!this.savedGames[0].gameStatus
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

   respondToGameOptionsUpdate: function(newOptions) {
    this.audio.enabled = newOptions.soundEnabled
    if (typeof newOptions.masterVolume === 'number' ) {
      this.audio.masterVolume = newOptions.masterVolume
    }
    this.audio.masterGainNode.gain.value = this.audio.enabled ? this.audio.masterVolume : 0;

    if ( this.audio.enabled && this.audio.audioContext.state === 'suspended') {
      this.audio.audioContext.resume()
      .then( () => {
        this.$emit('audio-enabled')
      })
    }
   },

    toggleSound : function() {
      this.respondToGameOptionsUpdate({soundEnabled: !this.audio.enabled})
    },

    autoSave: function() {
      this.saveGame(0);
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

    continueGame : function () {
      this.showTitleScreen = false;
      this.showEndingScreen = false;
      this.$refs.game.loadSaveGame(this.savedGames[0]);
    },

    saveGame : function (slotNumber) {
      let state = this.$refs.game.returnCurrentState();
      let dataString = JSON.stringify(state);
      window.localStorage.setItem(config.title+'_savedGame_'+slotNumber, dataString)

      let app = this;
      Object.keys(state).forEach ( (key) => {
        app.$set(app.savedGames[slotNumber], key, state[key]);
      });

    },

    deleteSavedGame : function (slotNumber) {
      window.localStorage.removeItem(config.title+'_savedGame_'+slotNumber);
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



