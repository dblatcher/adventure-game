<template>
  <div>

    <FileMenu
      v-bind:isOpen="fileMenuIsOpen"
      v-bind:data="savedGames"
      v-bind:atTitle="showTitleScreen"
      v-on:file-menu-click="handleFileMenuClick($event)"
    ></FileMenu>


<component v-bind:is="TitleScreen" v-show="showTitleScreen" v-bind:soundEnabled="audio.enabled" v-bind:config="rootProps.gameIndex.config">

      <template v-slot:file-buttons>
        <button id="new-game" @click="restartGame()">New Game</button>
        <button id="restore" @click="function(){fileMenuIsOpen = true}">Restore</button>
        <button v-show="autoSaveSlotisUsed" @click="continueGame">Continue</button>
      </template>

      <template v-slot:sound-toggle>
        <button id="toggle-sound" @click="toggleSound">{{audio.enabled? 'disable sound' : 'enable sound'}}</button>
      </template>

      <template v-slot:loading-bar><LoadingBar v-bind:gameData="rootProps.gameIndex.gameData" /></template>

</component>

    <MusicPlayer
    v-bind:orders="musicOrders"
    v-bind:audioContext="audio.audioContext"
    v-bind:audioContextStatusEmitter="self"   
    ref="audio"/>

    <component v-bind:is="EndingScreen" v-show="showEndingScreen" v-bind:config="rootProps.gameIndex.config">
      <template v-slot:file-buttons>
        <button @click="quitGame()">Restart</button>
        <button @click="function(){fileMenuIsOpen = true}">Restore</button>
      </template>
    </component>

    <div v-bind:style="{
      maxHeight: showGame ? 'unset': '0',
      position: showGame ? 'unset': 'fixed',
      overflow: showGame ? 'unset': 'hidden',
      visibility: showGame ? 'unset': 'hidden',
    }">
      <Game ref="game"
      v-bind:gameData="rootProps.gameIndex.gameData" 
      v-bind:running="showGame"
      v-on:auto-save="autoSave"/> 
    </div>

  </div>
</template>

<script>

import Game from "./components/game/Game";
import LoadingBar from "./components/LoadingBar";
import FileMenu from "./components/fileMenu";
import MusicPlayer from "./components/MusicPlayer"
import DefaultTitleScreen from "./components/DefaultTitleScreen"
import DefaultEndingScreen from "./components/DefaultEndingScreen"



export default {
  name: 'App',
  props: ['rootProps'],
  components :{
    Game, FileMenu, LoadingBar, MusicPlayer,
  },

  data () {
    let i, jsonString, savedGames = [];
    for (i=0; i<5; i++) {
      jsonString = window.localStorage.getItem(this.rootProps.gameIndex.config.title+'_savedGame_'+i);
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
      song:'title',
      audio : {
        audioContext, 
        masterGainNode,
        enabled: false,
        sfxVolume: 1,
        musicVolume: .2,
      },
    }
  },

  computed : {
    TitleScreen() { return this.rootProps.gameIndex.TitleScreen || DefaultTitleScreen},
    EndingScreen() { return this.rootProps.gameIndex.EndingScreen || DefaultEndingScreen},

    self() {return this},
    sounds() { return this.rootProps.gameIndex.gameData.sounds},
    music() { return this.rootProps.gameIndex.gameData.music},

    musicOrders() {
      return {
          playing: this.showTitleScreen && this.audio.enabled && !!this.music[this.song],
          noFade: !this.audio.enabled,
          pause: false,
          volume: this.audio.musicVolume,
          song: this.music[this.song],
      }
    },


    showGame() {
      return (!this.showTitleScreen && !this.showEndingScreen)
    },

    sfxVolume : {
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
    if (typeof newOptions.sfxVolume === 'number' ) {
      this.audio.sfxVolume = newOptions.sfxVolume
    }
    if (typeof newOptions.musicVolume === 'number' ) {
      this.audio.musicVolume = newOptions.musicVolume
    }
    this.audio.masterGainNode.gain.value = this.audio.enabled ? this.audio.sfxVolume : 0;

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
      window.localStorage.setItem(this.rootProps.gameIndex.config.title+'_savedGame_'+slotNumber, dataString)

      let app = this;
      Object.keys(state).forEach ( (key) => {
        app.$set(app.savedGames[slotNumber], key, state[key]);
      });

    },

    deleteSavedGame : function (slotNumber) {
      window.localStorage.removeItem(this.rootProps.gameIndex.config.title+'_savedGame_'+slotNumber);
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



