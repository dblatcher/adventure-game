<template>
  <div>

    <FileMenu
      v-bind:isOpen="fileMenuIsOpen"
      v-bind:data="savedGames"
      v-bind:atTitle="showTitleScreen"
      v-on:file-menu-click="handleFileMenuClick($event)"
    ></FileMenu>

    <TitleScreen v-if="showTitleScreen">
      <button @click="loadGameOrRestart()">New Game</button>
      <button @click="function(){fileMenuIsOpen = true}">restore</button>
    </TitleScreen>

    <div v-bind:style="{
      maxHeight: showTitleScreen ? '0': 'unset',
      position: showTitleScreen ? 'fixed': 'unset',
    }">
      <Game ref="game"/> 
    </div>

    <!-- <img v-for="room in roomData" v-bind:key="room.id"
      v-bind:src="room.url"
      style="display:none"
    />
    <img v-for="item in spriteData"  v-bind:key="item.id"
      v-bind:src="item.url"
      style="display:none"
    /> -->


  </div>
</template>

<script>

import /* webpackPreload: true */ Game from "./components/Game";
import FileMenu from "./components/fileMenu";
import /* webpackPreload: true */{TitleScreen, gameData} from "./gameIndex"

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
      showTitleScreen: true,
      fileMenuIsOpen: false,
      roomData:gameData.makeRooms(),
      spriteData:gameData.sprites,
    }
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
          this.loadGameOrRestart();
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
          this.loadGameOrRestart(this.savedGames[event[0]]);
          this.fileMenuIsOpen = false;
          break;
        case 'clear':
          this.deleteSavedGame(event[0]);
          break;
      }
    },

    quitGame : function() {
      this.showTitleScreen = true;
    },

    loadGameOrRestart : function (saveFile = null) {
      this.showTitleScreen = false;
      if (saveFile) { 
          this.$refs.game.loadSaveGame(saveFile);
      } else {
          this.$refs.game.restart();
      }
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
  * {
    @include font;
  }

  body {
    margin: 0;
  }

</style>



