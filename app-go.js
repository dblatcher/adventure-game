
function marchRightThenLeft(character) {
	var ref = 'march_'+character.ident+Number(new Date);
	var halt = false;
	var X=character.x, Y=character.y;
	
	var controller = {
		start: function(){
			halt = false;
			goRightThenTurn.apply(character,[]);
		},
		stop: function() {
			halt = true;
			character.$root.$off(ref);
			character.goTo({x:character.x, y:character.y},{action:'walk'},true)		
		}
	}
	
	var goLeftThenTurn = function () {
		character.goTo({x:X, y:Y},{action:'walk', direction: 'left', ref:ref},true)		
		this.say('going left!',{time:500});
		if (halt) {return};
		this.$root.$once('mile-stone:'+ref, function(){goRightThenTurn.apply(character)});
	};
	
	var goRightThenTurn = function () {
		character.goTo({x:X+200, y:Y}, {action:'walk', direction: 'right', ref:ref},true);
		this.say('going right!',{time:500});
		if (halt) {return};
		this.$root.$once('mile-stone:'+ref, function(){goLeftThenTurn.apply(character)});
	};
	
	return controller;
}


var vm = new Vue({
  el:'#app',

  data: {
    verbList : verbList,
	sprites : sprites, 	
	characters : [],
	worldItems : [],
	rooms: rooms,
	interactionMatrix:interactionMatrix,
	inventoryItems: inventoryItems,
	message: 'blank message',
	roomNumber: 1,
	roomMeasure: {unit:'em',scale:0.06},
	verb: verbList[0],thingHoveredOn:null, 
	subject: null, needObject:false, object:null,
	gameStatus: 'LIVE',
	conversation: null,
	interlocutor: null,
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
	inventory : function() {
		return this.inventoryItems.filter(function(i){return i.have});
	},
	dialogChoices : function () {
		if (!this.conversation) return [];
		return this.conversation.getOptions();
	},
	obstacles : function(){
		return this.rooms[this.roomNumber].obstacles;
	},
	grid : function() {
		var obstacles = this.rooms[this.roomNumber].obstacles;
		var cellSize = 10;	
		var columns = Math.ceil(this.rooms[this.roomNumber].width/cellSize), 
		rows = Math.ceil(this.rooms[this.roomNumber].height/cellSize),x,y, grid = [];
		function cellValue(x,y){
			var cell = {x: x*cellSize, y: y*cellSize, height:cellSize, width:cellSize}, i;
			for (i=0; i<obstacles.length; i++) {
				if (obstacles[i].overlaps(cell)) {return 0}
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
	changeRoom: function (rNum,data) {		
		this.$emit('mile-stone','changing room to '+this.rooms[rNum].name)
		this.characters.splice(0, this.characters.length);
		this.characters.push(...this.rooms[rNum].characters);

		this.worldItems.splice(0, this.worldItems.length);
		this.worldItems.push(...this.rooms[rNum].worldItems);
			
		this.roomNumber = rNum;
		this.thingHoveredOn = null;
		this.resetListeners();
		this.$emit('room-change-done',data);

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
		if (interactionMatrix[command.verb.id][command.subject.id] ) {
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
	handleClickOnRoom: function (event){
		if (this.gameStatus !== 'LIVE') {return false};
		var pc = this.getThings('pc');
		var room = this.$refs.room;		
		var clickCoordinPx = {x: (event.offsetX),y: (room.$el.offsetHeight - event.offsetY)};
		
		var clickCoord = {
			x : clickCoordinPx.x * room.room.width  / room.$el.clientWidth,
			y : clickCoordinPx.y * room.room.height / room.$el.clientHeight,
		};
	
		vm.$refs.coordinateDisplay.innerText = `[${Math.round(clickCoord.x)} , ${Math.round(clickCoord.y)}]`
		this.getThings('pc').goToViaPath ( {x:clickCoord.x, y:clickCoord.y, ref:false});
	},	
	handleClickOnThing: function(thing) {
		if (this.gameStatus !== 'LIVE') {return false};
		
		
		if (this.verb.id === 'WALK' && thing.id.endsWith('_I')) {return false};
		if (!this.subject) {
			this.subject = thing;
			if (this.verb.transitive) {
				if (interactionMatrix[this.verb.id][this.subject.id]  && interactionMatrix[this.verb.id][this.subject.id].intransitive ) {  // test for non transitive use of transitive verb, like 'use lever'
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
	handleDialogChoice: function(choice) {
		console.log(choice);
		
		this.gameStatus = "CUTSCENE";
		
		var que = function(that,c,queuedActorId) {
			that.$once(
				'mile-stone:dialog'+(c-1),
				function(){
					if (that.getThings(queuedActorId)[choice.script[c].orderType](choice.script[c].text,{ref:'dialog'+c})=== false)
					{
						console.error('invalid command '+ choice.script[c].orderType + ':'+ choice.script[c].text +' in dialog.',choice.dialogBranch.label + ' in ' + choice.dialogBranch.conversation.label);
						that.$emit('mile-stone:dialog'+c);
					}
					
				}
			)
		};
		
		var actorId;
		for (var i=0; i<choice.script.length; i++) {
			actorId = choice.script[i].actor;
			if (actorId === 'npc') {actorId = this.interlocutor};
			if ( i == 0) { 
				this.getThings(actorId)[choice.script[i].orderType](choice.script[i].text,{ref:'dialog'+i});
			} else { // queue next line
				que(this,i,actorId);	
			}
			
		};
		
		this.$once('mile-stone:dialog'+(i-1),function(){		
			if (choice.canOnlySayOnce) {			
				this.conversation.getOptions().splice( this.conversation.getOptions().indexOf(choice),1 );
			}
			if (choice.changesBranch) {
				this.conversation.currentBranch = choice.changesBranch;
			} 			
			if (typeof choice.consequence === 'function' ) {choice.consequence(this,choice)};
			
			this.gameStatus = choice.ends ? "LIVE" : "CONVERSATION";
			
		})
		
		
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
		//console.log(thing.name, type, order ? 'ref: '+order.ref:null);
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
		
		//TO DO test if direct route is possible - if so, use it!
		
		var i, obstacles = this.rooms[this.roomNumber].obstacles, directPath = true;
		for (i=0; i < obstacles.length; i++) {
			if (obstacles[i].intersectsLineSegment(startPoint, endPoint)){
				directPath = false;
				break;
			}
		}
		if (directPath) {return [{x:endPoint.x, y:endPoint.y}]};
		
		var g = new Graph(vm.grid,{diagonal:true}); 
		var cellSize = 10;
		var sx = Math.floor (startPoint.x / cellSize); 
		var sy = Math.floor (startPoint.y / cellSize); 
		var ex = Math.floor (endPoint.x / cellSize); 
		var ey = Math.floor (endPoint.y / cellSize); 
		
		// TO DO if start or end is not accessible, find closest open point?
		// To DECIDE what is open? what is closest
		
		gridPath = astar.search (g,g.grid[sy][sx],g.grid[ey][ex]); 
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
	},
  },

  beforeMount: function () { 
	this.changeRoom(this.roomNumber,function() {
		this.getThings('pc').say('Hello, World. I am the player character.');
		this.getThings('pc').say('My name is ' + this.getThings('pc').name +'.');						
	});
  }

})

function pc(){return vm.getThings('pc')}
