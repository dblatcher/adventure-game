<template>
  <main class="game">

    <HeartBeater 
    @beat="onBeat" 
    delay="50" 
    v-bind:timerIsStopped="timerIsStopped"
    ref="heartBeat"/>

    <OptionsMenu v-bind="{optionsMenuIsOpen}"
    @close="handleOptionsMenuClose"/>

   <ControlButtons
    v-bind="{ gameStatus, highlightingThings,fileMenuIsOpen,optionsMenuIsOpen }"
    @pause-button="togglePaused"
    @options-button="openOptionsMenu"
    @file-button="openFileMenu"
    @skip-button="handleSkipButton"
    @highlight-button="handleHighlightButton"
   />

    <div class="game__room-wrapper">
      <Room ref="room" 
        v-bind:room="rooms[roomNumber]" 
        v-bind:measure="roomMeasure"
        @scale-change="changeScale"
        v-on:clicked-room="handleClickOnRoom($event)"
        v-on:double-click="handleDoubleClick($event)">

        <ThingInRoom ref="things"
          v-for="thing in thingsInRoom" :key="rooms[roomNumber].id + '--' + thing.id"
          v-bind:measure="roomMeasure"
          v-bind:data="thing"
          v-bind:roomWidth="rooms[roomNumber].width"
          v-bind:roomHeight="rooms[roomNumber].height"
          v-bind:highlight="highlightingThings"
          @dblclick="handleDoubleClick($event)"
          @clicked-thing="handleClickOnThing($event)"
          @right-clicked-thing="handleRightClickOnThing($event)"
          @hover-event="handleHoverEvent($event[0],$event[1])"/>
 
      </Room>

       <NarrationMessage
       @dismiss="dismissMessage()"
       v-bind:narration="narration"/>
    </div>

    <component v-if="gameStatus === 'MINIGAME' && currentMinigameName"
    v-bind:is="minigames[currentMinigameName]"
    @cancel="cancelMinigame"/>


    <component v-bind:is="interfaceComponent"
    v-bind="{
      gameStatus, subject, object, needObject, thingHoveredOn, lastCommand,conversation,recommendedVerb, selectedInventoryItem,
      items: inventory,
      currentVerb: verb,
    }"
    v-on:verb-picked="pickVerb($event)"
    v-on:item-clicked="handleClickOnThing($event)"
    v-on:item-right-clicked="handleRightClickOnThing($event)"
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

    <MusicPlayer
    v-bind:orders="musicOrders"
    ref="audio"/>
  </main>


</template>

<script>

import state from "../../modules/savedStates";
import * as pathFinding from "./pathFinding";

import { runSequence, resolveDestination } from "./orderExecution";
import {changeRoom, teleportCharacter} from "./roomMethods";
import {getInventoryItem, looseInventoryItem} from "./inventoryMethods";

import {wait} from "./wait";
import {showNarration} from "./showNarration";

import handleDialogChoice from "./handleDialogChoice";
import handleCommand from "./handleCommand";
import getThings from "./getThings";
import getComponentOrDataObject from "./getCompOrData";
import removeThing from "./removeThing";
import handleClickOnRoom from "./handleClickOnRoom";
import handleClickOnThing from "./handleClickOnThing";
import handleRightClickOnThing from "./handleRightClickOnThing";
import handleHoverEvent from "./handleHoverEvent";


import DialogMenu from "../DialogMenu";
import Room from "../Room";
import ThingInRoom from "../ThingInRoom";
import OptionsMenu from "../optionsMenu";
import HeartBeater from "../HeartBeater";
import ScummInterface from "../ScummInterface";
import SierraInterface from "../sierra/SierraInterface"
import ControlButtons from "../ControlButtons";
import NarrationMessage from "../NarrationMessage";
import MusicPlayer from "../MusicPlayer"


export default {
  name: 'Game',
  props: ['running', 'fileMenuIsOpen', 'minigames'],
  components :{
    DialogMenu, Room, ThingInRoom, OptionsMenu, 
    HeartBeater, ControlButtons, NarrationMessage,
    SierraInterface, ScummInterface,
    MusicPlayer
  },

  data () {

    const {gameData} = this.$store.state;

    return Object.assign({
      message: 'blank message',
      roomMeasure: {unit:'px',scale:1}, //only supporting px ?
      thingHoveredOn:null, 
      verb: gameData.verbList[0],
      selectedInventoryItem:null,
      subject: null, object:null,
      lastCommand: {verb:undefined, subject:undefined, object:undefined, inProgress:false},
      highlightingThings : false,
      optionsMenuIsOpen: false,
      instantMode: false,
      narration: {contents:[], dismissable:true},
      currentMinigameName: false,
    }, state.create(this.loadData, gameData) );
  },

  computed : {

    gameData() {return this.$store.state.gameData},
    interfaceComponent(){
      switch (this.gameData.config.interface) {
        case 'Sierra': return SierraInterface;
        default: return ScummInterface;
     }
    },

    needObject: function() {
      const {verb, subject, object} = this;
      const {interactionMatrix} = this.$store.state.gameData;
      if (!verb || !subject || object) {return false}
      if (verb.transitive) {
        if (interactionMatrix[verb.id] && interactionMatrix[verb.id][subject.id]  && interactionMatrix[verb.id][subject.id].intransitive ) {  
          return false; // transitive verb, but with an instransitive usage eg 'use lever'
        } 
        else if (subject && !subject.id.endsWith('I')) {
          return false // transitive verb, but not on Inventoryitem
        }
        else {
          return true; // transitive verb
        }
      } 
      else {
        return false; // intransitive verb
      }
    },
    recommendedVerb : function() {
      const {thingHoveredOn, verbsAsObject} = this;
      const {defaultVerb} = this.gameData.config;

      if (!thingHoveredOn ) {return null}
      const {recommendedVerb, dataType, status} = thingHoveredOn;

      let verbId;
      if (typeof recommendedVerb === 'string' ) {
        verbId = recommendedVerb
      }
      else if (recommendedVerb && typeof recommendedVerb === 'object') {
        if (dataType === 'WorldItem' && recommendedVerb[status]){ verbId = recommendedVerb[status] }
      }
      else if (typeof defaultVerb === 'string') {
        verbId = defaultVerb
      }
      else if (defaultVerb && typeof defaultVerb === 'object') {
        verbId = defaultVerb[dataType]
      }
      return verbsAsObject[verbId]
    },
    haveCompleteCommand : function() {
      const {verb, subject, object, needObject} = this;
      return (verb && subject && !needObject) || (verb && subject && object)
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
    verbsAsObject: function(){
      let result = {};
      this.gameData.verbList.forEach (verb => {
        result[verb.id] = verb;
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
    timerIsStopped () {
      return (this.gameStatus === 'PAUSED' || this.fileMenuIsOpen || this.optionsMenuIsOpen || !this.running);
    },
    hideControls () {
      return !(this.gameStatus === 'LIVE')
    },
    musicOrders () {
      const {audio} = this.$store.state
      const song = this.rooms[this.roomNumber].bgm

      return {
          playing: this.running && audio.soundEnabled && !!this.gameData.music[song],
          noFade: !audio.soundEnabled,
          volume: audio.musicVolume,
          song: this.gameData.music[song],
          pause: this.timerIsStopped,
      }
    }
  },
  
  methods : {

    onBeat (data) {
      this.$refs.things.forEach(thing => {thing.onBeat(data)})
    },

    openFileMenu() {
     if (this.gameStatus === 'CUTSCENE') {return false}
     this.$emit('open-file-menu')
    },

    openOptionsMenu() {
      this.optionsMenuIsOpen = true
    },

    handleOptionsMenuClose(newOptions) {
      this.optionsMenuIsOpen = false
      this.$emit('options-change', newOptions)
    },

    togglePaused() {
      if (this.fileMenuIsOpen || this.optionsMenuIsOpen) {return false}
      this.setGameStatus ( this.gameStatus === 'PAUSED' ? 'UNPAUSED' : 'PAUSED' )
    },

    changeScale(adjustment) {
      this.roomMeasure.scale *= adjustment;
    },

    findPath: pathFinding.findPath, 

    changeRoom, 
    getThings,
    getComponentOrDataObject,
    handleCommand,
    removeThing,
    handleDialogChoice,
    handleClickOnRoom,
    handleClickOnThing,
    handleRightClickOnThing,
    handleHoverEvent,
    getInventoryItem,
    looseInventoryItem,
    teleportCharacter,
    runSequence,
    resolveDestination,
    wait,
    showNarration,

    dismissMessage(forceDismiss) {
      if (this.narration.dismissable === false && !forceDismiss) {return false}
      this.narration.contents.splice(0, this.narration.contents.length)
      this.$emit('dismissed-message',{})
    },

    handleSkipButton() {
      if (this.gameStatus === 'LIVE') {return}
      else {
        this.instantMode = true
        this.$emit('instant-mode',{})
      }

    },

    handleHighlightButton() {
      this.highlightingThings = !this.highlightingThings;
    },

    handleDoubleClick () {
      let pc = this.getThings('pc');
      if (!pc) { return false}
      pc.char.destinationQueue.forEach (order=> {
        if (order.wasManual) {order.isRun = true}
      })
    },

    setGameStatus(statusName,parameter) {

      if (statusName === 'LIVE' ) {
        this.gameStatus = statusName;
        this.conversation = null;
        this.instantMode = false;
        return this.gameStatus;
      }

      if (statusName === 'CONVERSATION' ) {
        this.gameStatus = statusName;
        if (parameter) {this.conversation = parameter}
        this.instantMode = false;
        return this.gameStatus;
      }

      if (statusName === 'CUTSCENE' ) {
        this.gameStatus = statusName;
        return this.gameStatus;
      }

      if (statusName === 'PAUSED' ) {
        this.gameStatusBeforePause = this.gameStatus;
        this.gameStatus = statusName;
        return this.gameStatus;
      }

      if (statusName === 'UNPAUSED' ) {
        this.gameStatus = this.gameStatusBeforePause || 'LIVE';
        this.gameStatusBeforePause = null;
        return this.gameStatus;
      }

      if (statusName === 'COMPLETE' ) {
        this.gameStatus = statusName;
        this.$emit('game-over', parameter)
        return this.gameStatus;
      }

      if (statusName === 'MINIGAME' ) {

        if (!parameter || !this.minigames[parameter]) {
          this.$store.commit('debugMessage', parameter ? `${parameter} is not a minigame.` : 'No minigame name provided')
          return this.gameStatus;
        }

        this.gameStatus = statusName
        this.currentMinigameName = parameter
        return this.gameStatus;
      }

      this.$store.commit('debugMessage',`${statusName} is not a valid gameStatus`)
      return false;
    },

    cancelMinigame() {
      this.setGameStatus('LIVE')
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
      const {verbList} = this.gameData;
      this.subject = null;
      for (var i=0; i < verbList.length; i++) {
        if ( verbList[i].id === verbID ) {
          this.verb = verbList[i];
          if (this.verb.usesSelectedItem) {this.subject = this.selectedInventoryItem}
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
      state.modify(this.$data, state.create(false, this.gameData));
      this.$nextTick(function(){
        this.$refs.room.resize();
      });

      if (this.gameData.sequences.starting) {
        this.runSequence('starting');
      }
    }
  },

  beforeMount: function () {
    window.vm = this;
    this.$store.commit('debugMessage',`Game Restarted`)
  },

}
</script>

<style lang="scss" src="./style.scss"></style>

