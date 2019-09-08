<template>
  <div class="game">

    <nav class="game__settings">
      <div class="skip-button" 
      v-bind:class="{'skip-button--disabled': gameStatus !== 'CUTSCENE'}"
      @click="handleSkipButton">
      <img class="button-icon" src="./forward.svg"/></div>

      <input class="highlight-control" type="checkbox" id="highlight-checkbox" v-model="highlightingThings">
      <label class="highlight-button" for="highlight-checkbox">
        <img class="button-icon" src="./eye.svg"/>
      </label>

      <div class="file-button"
      @click="openFileMenu()"
      v-bind:class="{'file-button--active': fileMenuIsOpen}"
      ><img class="button-icon" src="./save.svg"/></div>

    </nav>

    <div class="game__room-wrapper">
      <Room ref="room" 
        v-bind:room="rooms[roomNumber]" 
        v-bind:measure="roomMeasure"
        v-on:clicked-room="handleClickOnRoom($event)">

        <ThingInRoom ref="things"
          v-for="thing in thingsInRoom":key="rooms[roomNumber].id + '--' + thing.id"
          v-bind:measure="roomMeasure"
          v-bind:data="thing"
          v-bind:roomWidth="rooms[roomNumber].width"
          v-bind:highlight="highlightingThings"/>
 
      </Room>
    </div>

    <div class="game__controls">
      <CommandLine 
        v-bind:command='command' 
        v-bind:class="{
          disabled:gameStatus === 'LIVE' ? false:true,
        }"
      ></CommandLine>

      <div class="game__menu-wrapper"
        v-bind:class="{disabled:gameStatus === 'LIVE' ? false:true,}">
        <VerbMenu ref="VerbMenu" 
        v-on:verb-picked="pickVerb($event)"
        v-bind:verb-list='verbList' 
        v-bind:initalPick='verbList[0].id' ></VerbMenu>
        <InventoryMenu v-bind:items="inventory" ></InventoryMenu>
      </div>

      <DialogMenu
        v-on:dialog-choice="handleDialogChoice($event)"
        v-bind:choices="dialogChoices"
        v-bind:class="{
          hidden:gameStatus === 'CONVERSATION' ? false:true
        }"
      ></DialogMenu>

    </div>

    <p style="display:none; position:absolute; bottom:0; right:0; background-color:white;">
      <span>{{message}}</span>
      <span ref="coordinateDisplay"></span>
    </p>
  </div>
</template>

<script>

import { /* webpackPreload: true */ gameData } from "../../gameIndex";


import state from "../../modules/savedStates";


import * as pathFinding from "./pathFinding";
import handleDialogChoice from "./handleDialogChoice";
import changeRoom from "./changeRoom";
import executeCommand from "./executeCommand";
import getThings from "./getThings";
import removeThing from "./removeThing";
import handleClickOnRoom from "./handleClickOnRoom";
import handleClickOnThing from "./handleClickOnThing";
import handleHoverEvent from "./handleHoverEvent";
import {getInventoryItem, looseInventoryItem} from "./inventoryMethods";

import VerbMenu from "../VerbMenu";
import InventoryMenu from "../InventoryMenu";
import DialogMenu from "../DialogMenu";
import CommandLine from "../CommandLine";
import Room from "../Room";
import ThingInRoom from "../ThingInRoom";

export default {
  name: 'Game',
  components :{
    VerbMenu, InventoryMenu, DialogMenu,CommandLine, Room, ThingInRoom
  },

  data () {
    return state.create(this.loadData);
  },

  computed : {
    command : function() {

      function describe(thing) {
       return thing.quantified && thing.quantity !== 1 ? 
        thing.quantity + ' ' +thing.pluralName : 
        thing.name;
      }

      var sentence = this.verb.description + ' ';
      if (this.subject) {
        sentence += describe(this.subject) + ' ';
        if (this.needObject) {sentence += this.verb.preposition + ' ';}
      }
      if (this.object) {
        sentence +=  describe(this.object);
      }

      var completeCommand = (this.subject && ! this.needObject) || (this.subject && this.object)
      var undecidedNoun='';	
      if (!completeCommand && this.thingHoveredOn) {undecidedNoun = describe(this.thingHoveredOn);} 
      
      return {
        sentence: sentence,
        undecidedNoun: undecidedNoun,
        complete:completeCommand
      }
    },
    thingsInRoom : function() {
      var that = this, set = [];
      let cSet =  this.allCharacters.filter( (char)=> {
        return char.room === that.roomNumber;
      });
      let wSet = this.rooms[this.roomNumber].worldItems.filter ( (item)=> {
        return !item.removed;
      });
      
      set.push(...wSet, ...cSet);
      set.sort( function(a,b) { return (b.y + b.zAdjust) - (a.y + a.zAdjust)} )
      return set;
    },
    inventory : function() {
      return this.inventoryItems.filter(function(i){return i.have});
    },
    inventoryAsObject: function() {
      var result ={};
      this.inventoryItems.filter(function(i){return i.have}).forEach(item => {
        result[item.id] = item;
      });
      return result;
    },
    allRoomItemData: function() {
      var result = {};
      this.rooms.forEach ( room => {
        result[room.id] = {};
        room.worldItems.forEach (item => {
          result[room.id][item.id] = item;
        })
      })
      return result;
    },
    dialogChoices : function () {
      if (!this.conversations[this.conversation]) return [];
      let validChoices = this.conversations[this.conversation].getEnabledOptions();
      let that= this;
      validChoices = validChoices.filter(function (item) {
        if (!item.condition) {return true}
        return item.condition.apply(that,[]);
      });

      return validChoices;
    },
    obstacles : function(){
      return this.rooms[this.roomNumber].obstacles;
    },
    grid : pathFinding.makeGrid,
    fileMenuIsOpen () {
      return this.$parent.fileMenuIsOpen;
    }
  },
  
  methods : {

    openFileMenu(event) {
      this.$parent.handleFileMenuClick([null, 'toggle']);
    },

    findPath: pathFinding.findPath, 

    changeRoom, 
    getThings,
    executeCommand,
    removeThing,
    handleDialogChoice,
    handleClickOnRoom,
    handleClickOnThing,
    handleHoverEvent,
    getInventoryItem,
    looseInventoryItem,

    handleSkipButton() {
      console.log('skip button');
      if (this.gameStatus === 'LIVE') {return}
      else {this.instantMode = true};
    },

    setGameStatus(statusName,parameter) {

      if (statusName === 'LIVE' ) {
        this.gameStatus = statusName;
        this.instantMode = false;
        return;
      };

      if (statusName === 'CONVERSATION' ) {
        this.gameStatus = statusName;
        if (parameter) {this.conversation = parameter};
        this.instantMode = false;
        return;
      }

      if (statusName === 'CUTSCENE' ) {
        this.gameStatus = statusName;
        return;
      }

      if (statusName === 'PAUSED' ) {
        this.gameStatus = statusName;
        return;
      }



      console.warn(`${statusName} is not a valid gameStatus`);
    },

    characterRoomChange: function (movingCharacter, rNum,x,y) {
      let game = this;

      if (typeof movingCharacter === 'string') {
        let charId = movingCharacter;
        game.allCharacters.forEach(char => {
          if (char.id === charId) { movingCharacter = char}
        });
      }

      if (typeof movingCharacter === 'string') {
        return Promise.resolve( {success:false, reason:`no character with id ${movingCharacter}`} )
      }

      return new Promise ( function(resolve,reject) {
        movingCharacter.room = rNum;
        movingCharacter.x = x;
        movingCharacter.y = y;
        game.$nextTick( function() {
          resolve({success:true, char:movingCharacter})
        });

      });

    },
    pickVerb: function(verbID) {
      this.subject = null;
      for (var i=0; i<this.verbList.length; i++) {
        if (this.verbList[i].id === verbID ) {
          this.verb = this.verbList[i];
          return;
        }
      }
    },
    reportEvent: function(message){
      var now = new Date();
      this.message = `${now.getHours()}:${now.getMinutes()}.${now.getSeconds()} - ${message}. `
    },
    resetListeners: function() {
      this.$off();
      this.$on('hover-event',this.handleHoverEvent);	
      this.$on('clicked-thing', this.handleClickOnThing);
      this.$on('character-room-change', this.characterRoomChange);
    },
    returnCurrentState: function() {
      return state.get(this);
    },
    loadSaveGame (savedGame) {
      state.modify(this.$data, savedGame);
    },
    restart () {
      state.modify(this.$data, state.create());
      this.$refs.room.resize();
      if (typeof this.sequences.starting === 'function') {
        this.sequences.starting.apply(this,[]);
      }
    }
  },


  beforeMount: function () {
    window.vm = this;

    this.resetListeners(); 
    console.log('GAME RESTARTED!', new Date);

  },


}
</script>

<style lang="scss" src="./style.scss"></style>

