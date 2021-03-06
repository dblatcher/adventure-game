<template>
  <main class="game">

    <HeartBeater v-bind="{ timerIsStopped, delay: 50 }"/>

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

      <div class="game__room-wrapper" ref="roomWrap">
        <Room ref="room" 
          v-bind:room="rooms[roomNumber]" 
          v-bind:measure="roomMeasure"
          @scale-change="changeScale"
          v-on:clicked-room="handleClickOnRoom($event)"
          v-on:double-click="handleDoubleClick($event)">

          <component :ref="setThingsRef"
            v-for="data in thingsInRoom" :key="rooms[roomNumber].id + '--' + data.id"
            v-bind:is="thingInRoomComponents[data.dataType]"
            v-bind="{
              data: data,
              measure: roomMeasure,
              roomWidth: rooms[roomNumber].width,
              roomHeight: rooms[roomNumber].height,
              highlight: highlightingThings,
            }"

            @character-moved="adjustScroll"
            @dblclick="handleDoubleClick($event)"
            @clicked-thing="handleClickOnThing($event)"
            @right-clicked-thing="handleRightClickOnThing($event)"
            @hover-event="handleHoverEvent($event[0],$event[1])"/>
  
        </Room>

        <NarrationMessage
        @dismiss="dismissMessage()"
        v-bind:narration="narration"/>
      </div>

    <component v-if="currentMinigameName"
    ref="minigame"
    @outcome="handleMinigameOutcome"
    v-bind:is="minigames[currentMinigameName]"
    v-bind="currentMinigameProps"/>


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

import { runSequence,startLoopSequence, haltLoopSequence, resolveDestination, processWildCards } from "./orderExecution";
import {changeRoom, teleportCharacter, setRoomFilter} from "./roomMethods";
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
import {launchMinigame, handleMinigameOutcome} from "./minigameMethods";


import DialogMenu from "../DialogMenu";
import Room from "../Room";
import OptionsMenu from "../optionsMenu";
import HeartBeater from "../HeartBeater";
import ScummInterface from "../ScummInterface";
import SierraInterface from "../sierra/SierraInterface"
import ControlButtons from "../ControlButtons";
import NarrationMessage from "../NarrationMessage";
import MusicPlayer from "../MusicPlayer"
import WorldItem from "../Worlditem/WorldItem";
import Character from "../character/Character";

export default {
  name: 'Game',
  props: ['running', 'fileMenuIsOpen', 'minigames'],
  components :{
    DialogMenu, Room, OptionsMenu, 
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
      currentMinigameProps: {},
      activeLoopSequences: {},
      thingRefs: {},
      

    }, state.create(this.loadData, this) );
  },

  computed : {

    gameData() {return this.$store.state.gameData},
    interfaceComponent(){
      switch (this.gameData.config.interface) {
        case 'Sierra': return SierraInterface;
        default: return ScummInterface;
     }
    },
    thingInRoomComponents() {
      return {WorldItem, Character}
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
      const {recommendedVerb, dataType} = thingHoveredOn;

      let verbId;
      if (typeof recommendedVerb === 'string' ) {
        verbId = recommendedVerb
      }
      else if (recommendedVerb && typeof recommendedVerb === 'object') {
        if (dataType === 'WorldItem' && recommendedVerb[thingHoveredOn.status]){ verbId = recommendedVerb[thingHoveredOn.status] }
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
      let cSet =  this.allCharacters.filter( (character)=> {
        return character.room === that.roomNumber;
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
        this.allCharacters.forEach (character => {
          result[character.id] = character;
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

    setThingsRef(el) {
      if (el && el.ident) {
        this.thingRefs[el.ident] = el
      }
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
      this.adjustScroll()
    },

    adjustScroll() {
      let scrollWidth = this.$refs.roomWrap.scrollWidth
      let offsetWidth = this.$refs.roomWrap.offsetWidth

      if (scrollWidth > offsetWidth) {
        let pcScrollX = (this.getThings('pc').item.x / this.rooms[this.roomNumber].width) * scrollWidth
        let scrollValue = Math.max(pcScrollX - (offsetWidth/2),0)
        this.$refs.roomWrap.scrollTo(scrollValue,0)
      } 
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
    setRoomFilter,
    runSequence, startLoopSequence, haltLoopSequence,
    resolveDestination,
    processWildCards,
    wait,
    showNarration,
    launchMinigame, handleMinigameOutcome,

    dismissMessage(forceDismiss) {
      if (this.narration.dismissable === false && !forceDismiss) {return false}
      this.narration.contents.splice(0, this.narration.contents.length)
      this.$store.state.gameEmitter.emit('dismissed-message',{})
    },

    handleSkipButton() {
      if (this.gameStatus === 'LIVE') {return}
      else {
        this.instantMode = true
        this.$store.state.gameEmitter.emit('instant-mode',{})
      }

    },

    handleHighlightButton() {
      this.highlightingThings = !this.highlightingThings;
    },

    handleDoubleClick () {
      let pc = this.getThings('pc');
      if (!pc) { return false}
      pc.item.destinationQueue.forEach (order=> {
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

      this.$store.commit('debugMessage',`${statusName} is not a valid gameStatus`)
      return false;
    },


    setGameVar(target, options={}) {
      Object.keys(target).forEach(key => {
        this.gameVars[key] = key
        })
      Object.keys(options).forEach(key => {
        this.gameVars[key] = key
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
    returnCurrentState: function() {
      return state.get(this);
    },
    loadSaveGame (savedGame) {
      state.modify(this.$data, savedGame, this);
      this.$nextTick(() => {
        this.$refs.room.resize();
      });
    },
    restart () {
      state.modify(this.$data, state.create(false, this), this);

      this.$nextTick(() =>{
        this.$refs.room.resize();
      });

      if (this.gameData.sequences._starting) {
        this.runSequence('_starting');
      }
    }
  },

  beforeMount: function () {
    window.vm = this;
    this.$store.commit('debugMessage',`Game Restarted`)
  },

  beforeUpdate() {
    this.thingRefs = {}
  },

  updated() {
    //console.log(this.thingRefs)
  }

}
</script>

<style lang="scss" src="./style.scss"></style>

