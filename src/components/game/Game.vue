<template>
  <main class="game">

    <HeartBeater 
    @beat="onBeat" 
    delay="50" 
    v-bind:timerIsStopped="timerIsStopped"
    ref="heartBeat"/>

    <OptionsMenu v-show="optionsMenuIsOpen"
    v-bind:options="options"
    @close="toggleOptionsMenu()"/>

   <ControlButtons
    v-bind:gameStatus="gameStatus"
    v-bind:highlightingThings="highlightingThings"
    v-bind:fileMenuIsOpen="fileMenuIsOpen"
    v-bind:optionsMenuIsOpen="optionsMenuIsOpen"
    @pause-button="togglePaused"
    @options-button="toggleOptionsMenu"
    @file-button="openFileMenu"
    @skip-button="handleSkipButton"
    @highlight-button="handleHighlightButton"
   />

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
          @right-clicked-thing="handleRightClickOnThing($event)"
          @hover-event="handleHoverEvent($event[0],$event[1])"/>
 
      </Room>

       <NarrationMessage
       @dismiss="dismissMessage()"
       v-bind:narration="narration"/>
    </div>


    <ScummInterface
    v-bind:gameStatus="gameStatus"
    v-bind:verbList="verbList"
    v-bind:items="inventory"
    v-bind:currentVerb="verb"
    v-bind:subject="subject"
    v-bind:object="object"
    v-bind:needObject="needObject"
    v-bind:thingHoveredOn="thingHoveredOn"
    v-bind:lastCommand="lastCommand"
    v-bind:conversation="conversation"
    v-bind:recommendedVerb="recommendedVerb"
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
  </main>
</template>

<script>

import { /* webpackPreload: true */ gameData } from "../../gameIndex";


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
import ControlButtons from "../ControlButtons";
import NarrationMessage from "../NarrationMessage";

function makeObjectFromList(list, keyname) {
  let result = {}
  list.forEach(item => {
    result[item[keyname]] = item;
  })
  return result
}

export default {
  name: 'Game',
  props: ['running'],
  components :{
    DialogMenu, Room, ThingInRoom, OptionsMenu, 
    HeartBeater, ScummInterface, ControlButtons, NarrationMessage
  },

  data () {

    return Object.assign({
      message: 'blank message',
        roomMeasure: {unit:'px',scale:1}, //only supporting px ?
        thingHoveredOn:null, 
        verb: gameData.verbList[0],
        subject: null, object:null,
        lastCommand: {verb:undefined, subject:undefined, object:undefined, inProgress:false},
        highlightingThings : false,
        optionsMenuIsOpen: false,
        instantMode: false,
        narration: {contents:[], dismissable:true},
        options: {textDelay: 100, sfxVolume: .1, musicVolume: .2, soundEnabled:(this.$parent.audio.enabled)},
        interactionMatrix: gameData.interactionMatrix,
        verbList : gameData.verbList,
        sprites : gameData.sprites,
        sounds  : gameData.sounds, 
        defaultResponses:gameData.defaultResponses,
        sequences: gameData.sequences,
        config: gameData.config,
    }, state.create(this.loadData) );
  },

  computed : {
    needObject: function() {
      const {verb, subject, object, interactionMatrix} = this;
      if (!verb || !subject || object) {return false}
      if (verb.transitive) {
        if (interactionMatrix[verb.id] && interactionMatrix[verb.id][subject.id]  && interactionMatrix[verb.id][subject.id].intransitive ) {  
          return false; // transitive verb, but with an instransitive usage eg 'use lever'
        } else {
          return true; // transitive verb
        }
      } else {
        return false; // intransitive verb
      }
    },
    recommendedVerb : function() {
      const {thingHoveredOn, verbsAsObject} = this;
      const {defaultVerb} = this.config;

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
      this.verbList.forEach (verb => {
        result[verb.id] = verb;
      })
      return result;
    },
    soundsAsObject: function() {
      return makeObjectFromList(this.sounds, 'id')
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
      return (this.gameStatus === 'PAUSED' || this.$parent.fileMenuIsOpen || this.optionsMenuIsOpen || !this.running);
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
      const menuIsBeingClosing =  this.optionsMenuIsOpen

      if (!menuIsBeingClosing) {
        this.options.soundEnabled = this.$parent.audio.enabled
        this.options.sfxVolume = this.$parent.audio.sfxVolume
      }

      this.optionsMenuIsOpen = !this.optionsMenuIsOpen;

      if (menuIsBeingClosing) {
        this.$parent.respondToGameOptionsUpdate(this.options)
      } 

    },

    togglePaused() {
      if (this.fileMenuIsOpen || this.optionsMenuIsOpen) {return false}
      this.setGameStatus ( this.gameStatus === 'PAUSED' ? 'UNPAUSED' : 'PAUSED' )
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
      };

    },

    handleHighlightButton() {
      this.highlightingThings = !this.highlightingThings;
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
        this.conversation = null;
        this.instantMode = false;
        return this.gameStatus;
      };

      if (statusName === 'CONVERSATION' ) {
        this.gameStatus = statusName;
        if (parameter) {this.conversation = parameter};
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
        this.$parent.endGame(parameter);
        return this.gameStatus;
      }

      console.warn(`${statusName} is not a valid gameStatus`);
      return false;
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

