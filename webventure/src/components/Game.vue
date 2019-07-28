<template>
  <div ref='root'>


		<div class="room-wrapper">
			<Room ref="room" 
				v-bind:room="rooms[roomNumber]" 
				v-bind:measure="roomMeasure">
          <Character ref="characters"
						v-for="char in characters":key="rooms[roomNumber].id + '-' + char.id"
						v-bind:measure="roomMeasure"
						v-bind:char='char'>
					</Character>
          <WorldItem ref="items"
						v-for="item in worldItems":key="item.id"
						v-bind:measure="roomMeasure"
						v-bind:item='item'>
          </WorldItem>
			</Room>
		</div>


		<CommandLine 
			v-bind:command='command' 
			v-bind:class="{hidden:gameStatus === 'LIVE' ? false:true}"
		></CommandLine>

    <div class="menu-wrapper"
      v-bind:class="{hidden:gameStatus === 'LIVE' ? false:true}"
      >
      <VerbMenu v-bind:verb-list='verbList' v-bind:picked='verb.id' ></VerbMenu>
      <InventoryMenu v-bind:items="inventory" ></InventoryMenu>
    </div>

    <DialogMenu
			v-bind:choices="dialogChoices"
			v-bind:class="{hidden:gameStatus === 'CONVERSATION' ? false:true}"
		></DialogMenu>

    <p style="position:fixed; top:0; background-color:white;">{{message}}</p>
		<p style="position:fixed; top:0; right:0; background-color:white;"ref="coordinateDisplay"></p>
  </div>
</template>

<script>

import { gameData } from "../modules/game-data";
import { makeConversations } from "../modules/game-conversations";
import { interactionMatrix } from "../modules/game-interactions";
import { Graph, astar } from "../modules/astar";
import { RectZone, PolyZone} from "../modules/zone";

import {recreateWorldItemFromState} from "../modules/constructors";

import VerbMenu from "./VerbMenu";
import InventoryMenu from "./InventoryMenu";
import DialogMenu from "./DialogMenu";
import CommandLine from "./CommandLine";
import Room from "./Room";
import Character from "./Character";
import WorldItem from "./WorldItem";

export default {
  name: 'Game',
  components :{
    VerbMenu, InventoryMenu, DialogMenu,CommandLine, Room, Character, WorldItem
  },
  props:['loadData'],

  data () {
    let state = {
      gameStatus : 'LIVE',
      roomNumber : 0,
      conversation : null,
      rooms : gameData.makeRooms(),
      inventoryItems: gameData.makeInventoryItems(),
      allCharacters : gameData.makeCharacters(),
      conversations : makeConversations(),
    };

    if (this.loadData && this.loadData.gameStatus) {
      state.gameStatus = this.loadData.gameStatus;
      state.roomNumber = this.loadData.roomNumber;
      state.conversation = this.loadData.conversation;

      var i,j, listForRoom;
      // replace plain objects in each loadData room with array of WorldItems
      for (i=0; i<state.rooms.length; i++) {
        listForRoom = this.loadData.rooms[i].worldItems;
        for (j=0; j<listForRoom.length; j++) {
          listForRoom.splice  (j,1, recreateWorldItemFromState(listForRoom[j]) );
        }
      }

      for (i=0; i<state.rooms.length; i++) {
        state.rooms[i] = Object.assign(state.rooms[i], this.loadData.rooms[i]);
      }
      for (i=0; i<state.inventoryItems.length; i++) {
        state.inventoryItems[i] = Object.assign(state.inventoryItems[i], this.loadData.inventoryItems[i]);
      }
      for (i=0; i<state.allCharacters.length; i++) {
        state.allCharacters[i] = Object.assign(state.allCharacters[i], this.loadData.allCharacters[i]);
      }

      //set each conversations current branch (string)
      //assign the values saved in the data to the corresponding dialog choice
      //currently, only the 'disabled' property is saved in loadData 
      let conversationData = this.loadData.conversations;
      Object.keys (state.conversations).forEach ( (label) => {
        state.conversations[label].currentBranch = conversationData[label].currentBranch;
        Object.keys(state.conversations[label].branches).forEach ( (branchLabel) => {
          let stateChoiceList = state.conversations[label].branches[branchLabel].choices;
          let dataChoiceList = conversationData[label].branches[branchLabel].choices;
          stateChoiceList.forEach ( (choice, index) => {
            choice = Object.assign (choice, dataChoiceList[index])
          });
        })
      })

    }

    return Object.assign({
      interactionMatrix:interactionMatrix,
      verbList : gameData.verbList,
      sprites : gameData.sprites, 	
      worldItems : [],
      message: 'blank message',
      roomMeasure: {unit:'em',scale:0.05},
      verb: gameData.verbList[0],
      thingHoveredOn:null, 
      subject: null, needObject:false, object:null,
    }, state);
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
    inventory : function() {
      return this.inventoryItems.filter(function(i){return i.have});
    },
    dialogChoices : function () {
      if (!this.conversations[this.conversation]) return [];
      return this.conversations[this.conversation].getEnabledOptions();
    },
    obstacles : function(){
      return this.rooms[this.roomNumber].obstacles;
    },
    grid : function() {
      var obstacles = this.rooms[this.roomNumber].obstacles;
      var cellSize = 5;	
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
    changeRoom: function (rNum,pcX,pcY,data) {		
      this.$emit('mile-stone','changing room to '+this.rooms[rNum].name)
      if (this.$refs.characters) {
        this.$refs.characters.forEach ( (charComp) => {
          charComp.$destroy();
        })
      };

      var pc;
      this.allCharacters.forEach ( (charObject) => {
        if (charObject.id === 'pc') {pc=charObject}  
      } )
	  
      if (pc && !data.pcNotMoving) {
        pc.room = rNum;
        pc.x = pcX;
        pc.y = pcY;
      }
	  
      this.worldItems.splice(0, this.worldItems.length);
      this.worldItems.push(...this.rooms[rNum].worldItems);

      this.roomNumber = rNum;
      this.thingHoveredOn = null;
      this.resetListeners();
      this.$emit('room-change-done',data.callback);

    },
    getThings : function (ident) {		
      var list = [].concat(this.$refs.characters, this.$refs.items); // array of components in room
      var result = {};
      for (var i = 0; i<list.length; i++) {
        if (list[i].ident === ident ){ return list[i]};
        result[list[i].ident] = list[i];
      };
      if (ident) {return false};
      return result;
    },
    executeCommand : function (command) {
      if (!command) {command = {verb: this.verb, subject: this.subject, object: this.object};}
      
      var interactionDone = false, failedCondition = false;
      //find array of conditions/response object matching the command
      var thirdParam = command.object? command.object.id : 'intransitive';
      var matchingList = [];
      if (interactionMatrix[command.verb.id] && interactionMatrix[command.verb.id][command.subject.id] ) {
        matchingList = interactionMatrix[command.verb.id][command.subject.id][thirdParam] || [];
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
      
      
      this.subject = null; this.object = null; this.verb = this.verbList[0];
    },
    removeThing: function (id, options={} ) {
      if (typeof id === 'object') {id=id.ident};
      var currentList, permList, currentIndex, permIndex;

      if (id.endsWith('_W')) {
        currentList = this.worldItems;
        permList = this.rooms[this.roomNumber].worldItems;
      } else {
        currentList = this.characters;
        permList = this.rooms[this.roomNumber].characters;
      };
      
      for (var i=0; i<currentList.length; i++) {
        if (currentList[i].id === id) {currentIndex = i; break;}
      };
      currentList.splice(currentIndex,1);
      
      if (!options.temporary) {
        for (var i=0; i<permList.length; i++) {
          if (permList[i].id === id) {permIndex = i; break;}
        };
        permList.splice(permIndex,1);			
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
          if (interactionMatrix[this.verb.id] && interactionMatrix[this.verb.id][this.subject.id]  && interactionMatrix[this.verb.id][this.subject.id].intransitive ) {  // test for non transitive use of transitive verb, like 'use lever'
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
      var cellSize = 5;
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
      this.$on('verb-picked',this.pickVerb);	
      this.$on('hover-event',this.handleHoverEvent);	
      this.$on('mile-stone',this.reportEvent);
      this.$on('clicked-room', this.handleClickOnRoom);
      this.$on('clicked-thing', this.handleClickOnThing);
      this.$on('dialog-choice', this.handleDialogChoice);
      this.$on('room-change-done', this.callRoomChangeCallback);
      this.$on('character-room-change', this.characterRoomChange);
    },
    returnCurrentState: function() {
      
      let currentState = {
        roomNumber : this.roomNumber,
        gameStatus : this.gameStatus,
        conversation: this.conversation,
        inventoryItems : [],
        allCharacters : [],
        rooms: [],
        conversations: {},
      }

      const gameConversations = this.conversations;
      Object.keys (gameConversations).forEach ( (label) => {
        currentState.conversations[label] = gameConversations[label].returnState();
      })

      this.inventoryItems.forEach ( (item) => {
        currentState.inventoryItems.push( item.returnState() );
      })
      this.allCharacters.forEach ( (item) => {
        currentState.allCharacters.push( item.returnState() );
      })
      this.rooms.forEach ( (item) => {
        currentState.rooms.push( item.returnState() );
      })

      return currentState;
    },
  },


  beforeMount: function () {
    window.vm = this;


    this.resetListeners(); 
    this.changeRoom(this.roomNumber,0,0,{
      pcNotMoving: true,
      callback: function() {
        console.log(vm.loadData ? 'reload' : 'restart', new Date)
      },
    });
  }

}
</script>

<style src="../modules/style.css"></style>

