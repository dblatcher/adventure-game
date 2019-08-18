<template>
  <div class="game"  @mouseup="highlightingThings=false; instantMode=false">

    <nav class="game__settings">
      <div class="game__settings-button game__settings-button--skip"
      @mousedown="instantMode=true"
      >skip</div>
      <div class="game__settings-button game__settings-button--highlight"
      @mousedown="highlightingThings=true"
     
      >Highlight</div>
      <div class="game__settings-button game__settings-button--file"
      @click="openFileMenu()"
      >file</div>
    </nav>

    <div class="game__room-wrapper">
      <Room ref="room" 
        v-bind:room="rooms[roomNumber]" 
        v-bind:measure="roomMeasure">

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
        v-bind:class="{
          disabled:gameStatus === 'LIVE' ? false:true,
        }"
        >
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

import { /* webpackPreload: true */ gameData } from "../gameIndex";

import { Graph, astar } from "../modules/astar";
import { RectZone, PolyZone} from "../modules/zone";
import state from "../modules/savedStates";


import VerbMenu from "./VerbMenu";
import InventoryMenu from "./InventoryMenu";
import DialogMenu from "./DialogMenu";
import CommandLine from "./CommandLine";
import Room from "./Room";
import ThingInRoom from "./ThingInRoom";

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
        if (!item.condition) {return true};

        return item.condition.apply(that,[]);

      });

      return validChoices;
    },
    obstacles : function(){
      return this.rooms[this.roomNumber].obstacles;
    },
    grid : function() {
      var obstacles = this.rooms[this.roomNumber].obstacles;
      var cellSize = 3;	
      var columns = Math.ceil(this.rooms[this.roomNumber].width/cellSize), 
      rows = Math.ceil(this.rooms[this.roomNumber].height/cellSize),x,y, grid = [];
      function cellValue(x,y){
        var cell = new RectZone (x*cellSize, y*cellSize, cellSize, cellSize, false), i;
        for (i=0; i<obstacles.length; i++) {
          if (obstacles[i].overlapsRectangle(cell)) {return 0}
        }
        return 1;
      }
      
      for (y = 0; y < rows; y++) {
        grid.push([]);
        for (x = 0; x < columns; x++) {
          grid[y].push( cellValue (x,y));
        }	
      }		
      return grid;	
      
    }
  },
  
  methods : {

    openFileMenu(event) {
      this.$parent.handleFileMenuClick([null, 'toggle']);
    },

    changeRoom: function (rNum,pcX,pcY,data) {
      
      if (typeof rNum === 'string') {
        for (let i = 0; i < this.rooms.length; i++) {
          if (this.rooms[i].id === rNum ) {
            rNum = i;
            break;
          };
        }
      }

      this.$emit('mile-stone','changing room to '+this.rooms[rNum].name)
      if (this.$refs.characters) {
        this.$refs.characters.forEach ( (charComp) => {
          charComp.$destroy();
        })
      };

      var pc;
      this.allCharacters.forEach ( (charObject) => {
        if (charObject.id === this.pcId) {pc=charObject}  
      } )
	  
      if (pc && !data.pcNotMoving) {
        pc.room = rNum;
        pc.x = pcX;
        pc.y = pcY;
      }

      this.roomNumber = rNum;
      this.thingHoveredOn = null;
      this.resetListeners();
      this.$emit('room-change-done',data.callback);

    },
    getThings : function (ident) {		
      if (ident == 'pc') {ident = this.pcId;}

      var list = [].concat(this.$refs.things); // array of components in room
      var list = this.$refs.things.map(function (item) {return item.$children[0]} );

      var result = {};
      for (var i = 0; i<list.length; i++) {
        if (list[i].ident === ident ){ return list[i]};
        result[list[i].ident] = list[i];
      };
      if (ident) {return false};
      if (this.pcId) {
        result['pc'] = result[this.pcId];
      }
      return result;
    },
    executeCommand : function (command) {
      if (!command) {command = {verb: this.verb, subject: this.subject, object: this.object};}
      
      var interactionDone = false, failedCondition = false;
      //find array of conditions/response object matching the command
      var thirdParam = command.object? command.object.id : 'intransitive';
      var matchingList = [];
      if (this.interactionMatrix[command.verb.id] && this.interactionMatrix[command.verb.id][command.subject.id] ) {
        matchingList = this.interactionMatrix[command.verb.id][command.subject.id][thirdParam] || [];
      }

      //perform the first reponse on the list for which the condition tests pass
      for (var i=0; i< matchingList.length; i++) {
        failedCondition = false;
        
        // test for matchingList[i].conditions being satisfied, if not skip to next 
        for (var j=0; j<matchingList[i].conditions.length; j++) {
          if (matchingList[i].conditions[j].apply(this,[]) == false) {
            failedCondition = true;
            break;
          }
        }
        if (failedCondition) {continue};
            
        matchingList[i].response.apply(this,[]);
        interactionDone = true;
        break;
      }

      var defaultResponse = {
        "WALK" : function() {this.getThings('pc').goTo(this.getThings(command.subject.id).walkToPoint)},
        "LOOK" : function() {
          if (command.subject.id.endsWith('W')) {
            this.getThings('pc').say(`It looks like a normal ${command.subject.name} to me.`);
          } else {
            this.getThings('pc').say(`I don't see anything special about ${command.subject.name}.`);
          }
        },
        "misc" : function() {this.getThings('pc').say('I will not do that.');} 
      };


      if (!interactionDone) {
        if (defaultResponse[command.verb.id]) {
          defaultResponse[command.verb.id].apply(this,[])				
        } else {
          defaultResponse["misc"].apply(this,[])				
        }
      }

      this.subject = null; 
      this.object = null;
      this.verb = this.verbList[0];
      this.$refs.VerbMenu.reset(); 
    },
    removeThing: function (id, options={} ) {
      if (typeof id === 'object') {id=id.ident};
      var currentList, currentIndex;

      if (id.endsWith('_W')) {
        currentList = this.rooms[this.roomNumber].worldItems;
        for (var i=0; i<currentList.length; i++) {
          if (currentList[i].id === id) {currentIndex = i; break;}
        };
        currentList.splice(currentIndex,1);
      } else {
        for (var i=0; i<this.allCharacters.length; i++) {
          if (this.allCharacters[i].id === id) {currentIndex = i; break;}
        };
        this.allCharacters[currentIndex].room = null;
      };

    },
    characterRoomChange: function (movingCharacter, rNum,x,y) {
      movingCharacter.room = rNum;
      movingCharacter.x = x;
      movingCharacter.y = y;
    },
    handleClickOnRoom: function (event){
      if (this.gameStatus !== 'LIVE') {return false};
      var pc = this.getThings('pc');
      var room = this.$refs.room;		
      var clickCoordinPx = {x: (event.offsetX),y: (room.$el.offsetHeight - event.offsetY)};

      if (event.target !== room.$el ) {
        clickCoordinPx.x += event.target.getClientRects()[0].x;
        clickCoordinPx.x -= room.$el.getClientRects()[0].x;	
        clickCoordinPx.y -= event.target.getClientRects()[0].y;
        clickCoordinPx.y += room.$el.getClientRects()[0].y;
      }

      var clickCoord = {
        x : clickCoordinPx.x * room.room.width  / room.$el.clientWidth,
        y : clickCoordinPx.y * room.room.height / room.$el.clientHeight,
      };

      this.$refs.coordinateDisplay.innerText = `[${Math.round(clickCoord.x)} , ${Math.round(clickCoord.y)}]`
      this.getThings('pc').goTo ( {x:clickCoord.x, y:clickCoord.y, ref:false});
    },	
    handleClickOnThing: function(thing) {
      if (this.gameStatus !== 'LIVE') {return false};

      if (this.verb.id === 'WALK' && thing.id.endsWith('_I')) {return false};
      if (!this.subject) {
        this.subject = thing;
        if (this.verb.transitive) {
          if (this.interactionMatrix[this.verb.id] && this.interactionMatrix[this.verb.id][this.subject.id]  && this.interactionMatrix[this.verb.id][this.subject.id].intransitive ) {  // test for non transitive use of transitive verb, like 'use lever'
            this.needObject = false;
          } else {
            this.needObject = true;
          }		
        } else {
          this.needObject = false;
        }
      } else {
        if (!this.command.complete && thing !== this.subject) {
          this.object = thing;
        }
      };

      if (this.command.complete) {this.executeCommand();}		
    },	

    handleDialogChoice: function (choice) {
      var theApp = this, script = choice.script;
      theApp.gameStatus = 'CUTSCENE';
      
      function executeScriptItem (index) {
        var actorId;
        
        function findActorId(item){
          var id = item.actor;
          if (id === 'npc') {id = theApp.conversations[theApp.conversation].npc};
          return id;
        }
      
        function handleEndOfScript() {

          var currentConversation = theApp.conversations[theApp.conversation];

          if (choice.canOnlySayOnce) {
            choice.disabled = true;
          }
		  if (choice.addItems) {
			  choice.addItems.forEach ( (itemId) => {
				  theApp.inventoryItems.filter(function(a){return a.id==itemId})[0].have = true;
			  })
		  }
		  if (choice.removeItems) {
			  choice.removeItems.forEach ( (itemId) => {
				  theApp.inventoryItems.filter(function(a){return a.id==itemId})[0].have = false;
			  })
		  }
          if (choice.changesBranch) {
            currentConversation.currentBranch = choice.changesBranch;
          } 
          if (typeof choice.consequence === 'function' ) {choice.consequence(theApp,choice)};
          
          theApp.gameStatus = choice.ends ? "LIVE" : "CONVERSATION";
        };

        function nextItemOrEnd () {
          if (index === script.length-1) {
            handleEndOfScript();
          } else {
            executeScriptItem(index+1);
          }
        };
        
        if (Array.isArray(script[index])) {
          var promiseSet = [];
          for (var j=0; j< script[index].length; j++){
            actorId = findActorId(script[index][j]);
            promiseSet.push(
              theApp.getThings(actorId)[script[index][j].orderType](script[index][j].text)
            );
          };
          Promise.all(promiseSet)
          .then( nextItemOrEnd  )
          
        } else {
          actorId = findActorId(script[index]);
          theApp.getThings(actorId)[script[index].orderType](script[index].text)
          .then( nextItemOrEnd );	
        };	

      };
      
      executeScriptItem(0)
    },

    pickVerb: function(verbID) {
      this.subject = null;
      for (var i=0; i<this.verbList.length; i++) {
        if (this.verbList[i].id === verbID ) {
          this.verb = this.verbList[i];
          return;
        }
      };
    },
    reportEvent: function(type,thing,order){
      var now = new Date();
      thing = thing || {name:'[game]'};
      order = order || {};
      this.message = `${now.getHours()}:${now.getMinutes()}.${now.getSeconds()} - ${thing.name}: ${type} ${order.ref ? 'ref: '+order.ref:''}. `
    },
    handleHoverEvent: function(component,event){
      if (event.type=== 'mouseover') {
        this.thingHoveredOn = component;
      };
      if (event.type=== 'mouseout' && this.thingHoveredOn === component) {
        this.thingHoveredOn = null;
      };	
    },
    findPath : function (startPoint, endPoint) {
      var i, obstacles = this.rooms[this.roomNumber].obstacles, directPath = true;
      for (i=0; i < obstacles.length; i++) {
        if (obstacles[i].intersectsLineSegment(startPoint, endPoint)){
          directPath = false;
          break;
        }
      }
      if (directPath) {return [{x:endPoint.x, y:endPoint.y}]};

      var g = new Graph(this.grid,{diagonal:true}); 
      var cellSize = 3;
      var sx = Math.floor (startPoint.x / cellSize); 
      var sy = Math.floor (startPoint.y / cellSize); 
      var ex = Math.floor (endPoint.x / cellSize); 
      var ey = Math.floor (endPoint.y / cellSize); 

      // TO DO if start or end is not accessible, find closest open point?
      // To DECIDE what is open? what is closest

      var gridPath = astar.search (g,g.grid[sy][sx],g.grid[ey][ex]); 
      function getPointFromNode(node) {
        return { // don't know why coord are reversed. It seems to work.
        x: (node.y*cellSize) + cellSize/2, 
        y : (node.x*cellSize) + cellSize/2, 
        }
      }

      var path = [],i,l,dx,dy, dxn,dyn;
      for (i=0; i< gridPath.length; i++) { 
        path.push(getPointFromNode(gridPath[i]));		
        l = path.length-1;
        if (l >= 2 && i < gridPath.length-1 ) {
          dx = path[l-2].x - path[l-1].x;
          dy = path[l-2].y - path[l-1].y;
          dxn = path[l-1].x - path[l].x;
          dyn = path[l-1].y - path[l].y;
          
          if (dx === dxn && dy === dyn) {
            path.pop();
          }
        }
      }
      return path;
    },
    callRoomChangeCallback: function (callback){
      this.$nextTick( function(){
        if (typeof callback === "function") {
          callback.apply(this,[]);
        }
      })
    },
    resetListeners: function() {
      this.$off();
      this.$on('hover-event',this.handleHoverEvent);	
      this.$on('mile-stone',this.reportEvent);
      this.$on('clicked-room', this.handleClickOnRoom);
      this.$on('clicked-thing', this.handleClickOnThing);
      this.$on('room-change-done', this.callRoomChangeCallback);
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
    this.changeRoom(this.roomNumber,200,10,{
      pcNotMoving: true,
      callback: function() {
        console.log(vm.loadData ? 'reload' : 'restart', new Date);
      },
    });
  },


}
</script>

<style lang="scss" src="../modules/style.scss"></style>

