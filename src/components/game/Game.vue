<template>
  <main class="game">

    <HeartBeater @beat="onBeat" delay="50" v-bind:timerIsStopped="timerIsStopped"/>

    <OptionsMenu v-show="optionsMenuIsOpen"
    v-bind:options="options"
    @close="toggleOptionsMenu()"
    />

    <nav class="game__settings">
      <div class="skip-button" 
      v-bind:class="{'skip-button--disabled': gameStatus !== 'CUTSCENE'}"
      @click="handleSkipButton">
      <img class="button-icon" src="./forward.svg"/></div>

      <input class="highlight-control" type="checkbox" id="highlight-checkbox" v-model="highlightingThings">
      <label class="highlight-button" for="highlight-checkbox">
        <img class="button-icon" src="./eye.svg"/>
      </label>

      <div class="pause-button"
      @click="togglePaused()"
      v-bind:class="{'pause-button--active': gameStatus === 'PAUSED'}"
      ><img class="button-icon" src="./pause.svg"/></div>

      <div class="options-button"
      @click="toggleOptionsMenu()"
      v-bind:class="{'options-button--active': optionsMenuIsOpen}"
      ><img class="button-icon" src="./cogs.svg"/></div>

      <div class="file-button"
      @click="openFileMenu()"
      v-bind:class="{
        'file-button--active': fileMenuIsOpen,
        'disabled': gameStatus === 'CUTSCENE'
      }"
      ><img class="button-icon" src="./save.svg"/></div>

    </nav>

    <div class="game__room-wrapper">
      <Room ref="room" 
        v-bind:room="rooms[roomNumber]" 
        v-bind:measure="roomMeasure"
        v-on:clicked-room="handleClickOnRoom($event)"
        v-on:double-click="handleDoubleClick($event)">

        <ThingInRoom ref="things"
          v-for="thing in thingsInRoom":key="rooms[roomNumber].id + '--' + thing.id"
          v-bind:measure="roomMeasure"
          v-bind:data="thing"
          v-bind:roomWidth="rooms[roomNumber].width"
          v-bind:roomHeight="rooms[roomNumber].height"
          v-bind:highlight="highlightingThings"
          @dblclick="handleDoubleClick($event)"
          @clicked-thing="handleClickOnThing($event)"
          @hover-event="handleHoverEvent($event[0],$event[1])"/>
 
      </Room>
    </div>


    <ScummInterface
    v-bind:disabled="hideControls"
    v-bind:verbList="verbList"
    v-bind:items="inventory"
    v-bind:currentVerb="verb"
    v-bind:subject="subject"
    v-bind:object="object"
    v-bind:needObject="needObject"
    v-bind:thingHoveredOn="thingHoveredOn"
    v-on:verb-picked="pickVerb($event)"
    v-on:item-clicked="handleClickOnThing($event)"
    v-on:hover-event="handleHoverEvent($event[0],$event[1])"
    />

    <DialogMenu
      v-on:dialog-choice="handleDialogChoice($event)"
      v-bind:choices="dialogChoices"
      v-bind:class="{
        hidden:gameStatus === 'CONVERSATION' ? false:true
      }"
    ></DialogMenu>


    <aside v-show="gameStatus === 'PAUSED'" 
    @click="togglePaused()"
    class="game__paused-message">
      PAUSED
    </aside>

    <p style="display:none; position:absolute; bottom:0; right:0; background-color:white;">
      <span>{{message}}</span>
      <span ref="coordinateDisplay"></span>
    </p>
  </main>
</template>

<script>

import { /* webpackPreload: true */ gameData } from "../../gameIndex";


import state from "../../modules/savedStates";
import * as pathFinding from "./pathFinding";

import { executeStandardOrder, executeOrder, runSequence, evaluateStandardCondition, resolveDestination } from "./orderExecution";
import {changeRoom, teleportCharacter} from "./roomMethods";
import {getInventoryItem, looseInventoryItem} from "./inventoryMethods";

import handleDialogChoice from "./handleDialogChoice";
import executeCommand from "./executeCommand";
import getThings from "./getThings";
import getComponentOrDataObject from "./getCompOrData";
import removeThing from "./removeThing";
import handleClickOnRoom from "./handleClickOnRoom";
import handleClickOnThing from "./handleClickOnThing";
import handleHoverEvent from "./handleHoverEvent";


import DialogMenu from "../DialogMenu";
import Room from "../Room";
import ThingInRoom from "../ThingInRoom";
import OptionsMenu from "../optionsMenu";
import HeartBeater from "../HeartBeater";
import ScummInterface from "../ScummInterface";

export default {
  name: 'Game',
  components :{
    DialogMenu, Room, ThingInRoom, OptionsMenu, HeartBeater, ScummInterface
  },

  data () {
    return state.create(this.loadData);
  },

  computed : {
    haveCompleteCommand : function() {
      return (this.subject && ! this.needObject) || (this.subject && this.object)
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
    allInventoryItemsAsObject: function() {
      var result ={};
      this.inventoryItems.forEach(item => {
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
    allCharactersAsObject: function() {
      let result = {};
        this.allCharacters.forEach (char => {
          result[char.id] = char;
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
    currentRoom : function() {
      return this.rooms[this.roomNumber].id
    },
    obstacles : function(){
      return this.rooms[this.roomNumber].obstacles;
    },
    grid : pathFinding.makeGrid,
    fileMenuIsOpen () {
      return this.$parent.fileMenuIsOpen;
    },
    timerIsStopped () {
      return (this.gameStatus === 'PAUSED' || this.$parent.fileMenuIsOpen || this.optionsMenuIsOpen);
    },
    hideControls () {
      return !(this.gameStatus === 'LIVE')
    }
  },
  
  methods : {

    onBeat (data) {
      this.$refs.things.forEach(thing => {thing.onBeat(data)})
    },

    openFileMenu(event) {
     
     if (this.gameStatus === 'CUTSCENE') {return false}

     this.$parent.handleFileMenuClick([null, 'toggle']);
    },

    toggleOptionsMenu(event) {
      this.optionsMenuIsOpen = !this.optionsMenuIsOpen;
    },

    togglePaused() {
      if (this.fileMenuIsOpen || this.optionsMenuIsOpen) {return false}
      this.setGameStatus ( this.gameStatus === 'PAUSED' ? 'UNPAUSED' : 'PAUSED' )
    },

    findPath: pathFinding.findPath, 

    changeRoom, 
    getThings,
    getComponentOrDataObject,
    executeCommand,
    removeThing,
    handleDialogChoice,
    handleClickOnRoom,
    handleClickOnThing,
    handleHoverEvent,
    getInventoryItem,
    looseInventoryItem,
    teleportCharacter,
    executeStandardOrder, executeOrder,
    evaluateStandardCondition,
    runSequence,
    resolveDestination,

    handleSkipButton() {
      if (this.gameStatus === 'LIVE') {return}
      else {this.instantMode = true};
    },

    handleDoubleClick (event) {
      let pc = this.getThings('pc');
      if (!pc) { return false}
      pc.char.destinationQueue.forEach (order=> {
        if (order.wasManual) {order.isRun = true}
      })

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
        this.gameStatusBeforePause = this.gameStatus;
        this.gameStatus = statusName;
        return;
      }

      if (statusName === 'UNPAUSED' ) {
        this.gameStatus = this.gameStatusBeforePause || 'LIVE';
        this.gameStatusBeforePause = null;
        return;
      }

      if (statusName === 'COMPLETE' ) {
        this.gameStatus = statusName;
        this.$parent.endGame(parameter);
        return;
      }

      console.warn(`${statusName} is not a valid gameStatus`);
    },

    setGameVar(target, options={}) {
      Object.keys(target).forEach(key => {
        this.$set(this.gameVars,key, target[key])
      })
      Object.keys(options).forEach(key => {
        this.$set(this.gameVars,key, options[key])
      })
      return this.gameVars;
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
    returnCurrentState: function() {
      return state.get(this);
    },
    loadSaveGame (savedGame) {
      state.modify(this.$data, savedGame);
      this.$nextTick(function(){
        this.$refs.room.resize();
      });
    },
    restart () {
      state.modify(this.$data, state.create());

      this.$nextTick(function(){
        this.$refs.room.resize();
      });

      if (this.sequences.starting) {
        this.runSequence('starting');
      }
    }
  },


  beforeMount: function () {
    window.vm = this;
    console.log('GAME RESTARTED!', new Date);

  },


}
</script>

<style lang="scss" src="./style.scss"></style>

