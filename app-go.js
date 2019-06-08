


function marchRightThenLeft(character) {
	var ref = 'march_'+character.ident+Number(new Date);
	
	var goLeftThenTurn = function () {
		character.goTo({x:character.x-150, y:character.y},{action:'walk', direction: 'left', ref:ref})
		this.say(' ',{time: 50});
		this.say('going left!');
		this.$root.$once('mile-stone:'+ref, function(){goRightThenTurn.apply(character)});
	};
	
	var goRightThenTurn = function () {
		character.goTo({x:character.x+150, y:character.y}, {action:'walk', direction: 'right', ref:ref});
		this.say(' ',{time: 50});
		this.say('going right!');
		this.$root.$once('mile-stone:'+ref, function(){goLeftThenTurn.apply(character)});
	};
	
	goRightThenTurn.apply(character,[]);
	return ref;
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
	verb: verbList[0],thingHoveredOn:null, 
	subject: null, needObject:false, object:null,
	seqenceRef:1000
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
	}
  },
  
  methods : {
	changeRoom: function (rNum,data) {		
		this.$emit('get-report',{name:'[game]'},'changing to room '+rNum+'')
		this.characters.splice(0, this.characters.length);
		this.characters.push(...this.rooms[rNum].characters);

		this.worldItems.splice(0, this.worldItems.length);
		this.worldItems.push(...this.rooms[rNum].worldItems);
			
		this.roomNumber = rNum;
		this.resetListeners();
		this.$emit('room-change-done',data);

	},
	getThings : function (ident) {
		var list = this.$children[0].$children; // array of components in room
		var result = {}
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
			"WALK" : function() {this.getThings('pc').goTo(this.getThings(command.subject.id))},
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
	
	resetListeners: function() {
		this.$off();
		this.$on('get-report',function(thing,data){
			var now = new Date();
			this.message = `${now.getHours()}:${now.getMinutes()}.${now.getSeconds()} : message from ${thing.name}: ${data}.`
		});
		
		this.$on('mile-stone',function(type,thing,order){
			console.log(thing.name, type, order ? 'ref: '+order.ref:null);
		})
		
		this.$on('verb-picked',function(verbID) {
			this.subject = null;
			for (var i=0; i<this.verbList.length; i++) {
				if (this.verbList[i].id === verbID ) {
					this.verb = this.verbList[i];
					return;
				}
			};
		});
		
		this.$on('hover-event',function(component,event){
			if (event.type=== 'mouseover') {
				this.thingHoveredOn = component;
			};
			if (event.type=== 'mouseout' && this.thingHoveredOn === component) {
				this.thingHoveredOn = null;
			};	
		});
		
		this.$on('clicked-room', function (component,event){	
			//TO DO -  generate path of steps to navigate around obsticles to closest valid point
			var roomElement = this.$el.getElementsByTagName('main')[0];
			var pc = this.getThings('pc');
			//scaledHeightOfPcAsCssString = getComputedStyle(this.getThings().pc.$children[0].$el.children[0]).height
			this.getThings('pc').goTo ( {y: (event.target.offsetHeight - event.offsetY),x: (event.offsetX), ref:false});
		});
		
		this.$on('clicked-thing', function(thing){
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
		});
		

		this.$on('room-change-done', function (callback){
			this.$nextTick( function(){
				if (typeof callback === "function") {
					callback.apply(this,[]);
				}
			})
		});
		
	},
  },

  beforeMount: function () { 
	
	//this.resetListeners();
		
	this.changeRoom(this.roomNumber,function() {
		this.getThings('pc').say('Hello, World. I am the player character.');
		this.getThings('pc').say('My name is ' + this.getThings('pc').name +'.');						
	});

  }

})

function pc(){return vm.getThings('pc')}
