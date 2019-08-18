<template>
  <div class="game">

    <nav class="game__settings">
      <div class="game__settings-button game__settings-button--skip"
      @click="instantMode=!instantMode"
      >skip</div>
      <div class="game__settings-button game__settings-button--highlight"
      @click="highlightingThings=!highlightingThings"
     
      >Highlight</div>
      <div class="game__settings-button game__settings-button--file"
      @click="openFileMenu()"
      >file</div>
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
      var sentence = this.verb.description + ' ';
      if (this.subject) {
        sentence +=  this.subject.name+ ' ';			
        if (this.needObject) {sentence += this.verb.preposition + ' ';}
      }
      if (this.object) {
        sentence +=  this.object.name;			
      }
      
      var completeCommand = (this.subject && ! this.needObject) || (this.subject && this.object)
      var undecidedNoun='';	
      if (!completeCommand && this.thingHoveredOn) {undecidedNoun = this.thingHoveredOn.name;} 
      
      return {
        sentence: sentence,
        undecidedNoun: undecidedNoun,
        complete:completeCommand
      }
    },
    characters : function() {
      var that = this;
      return this.allCharacters.filter( (char)=> {
        return char.room === that.roomNumber;
      });
    },
    thingsInRoom : function() {
      var that = this, set = [];
      let cSet =  this.allCharacters.filter( (char)=> {
        return char.room === that.roomNumber;
      });
      let wSet = this.rooms[this.roomNumber].worldItems;
      set.push(...wSet, ...cSet);
      set.sort( function(a,b) { return (b.y + b.zAdjust) - (a.y + a.zAdjust)} )
      return set;
    },
    inventory : function() {
      return this.inventoryItems.filter(function(i){return i.have});
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


    characterRoomChange: function (movingCharacter, rNum,x,y) {
      movingCharacter.room = rNum;
      movingCharacter.x = x;
      movingCharacter.y = y;
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
    }
  },


  beforeMount: function () {
    window.vm = this;

    this.resetListeners(); 
    this.changeRoom(this.roomNumber,0,0,{
      pcNotMoving: true,
      callback: function() {
        console.log(this.loadData ? 'reload' : 'restart', new Date);
      },
    });
  },


}
</script>

<style lang="scss" src="./style.scss"></style>

