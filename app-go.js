
function stop (character) {
	character.destinationQueue = [];
	character.act('wait');
}

function marchRightThenLeft(character) {
	
	var goLeftThenTurn = function () {
		this.destinationQueue.push({x:character.x-150, y:character.y, action:'walk', direction: 'left'});
		this.say(' ',100);
		this.say('going left!');
		this.$once('reached-destination', goRightThenTurn);
	};
	
	var goRightThenTurn = function () {
		this.destinationQueue.push({x:character.x+150, y:character.y,action:'walk', direction: 'right'});
		this.say(' ',100);
		this.say('going right!');
		this.$once('reached-destination', goLeftThenTurn);
	};
	
	goRightThenTurn.apply(character,[]);

}

function goTo (character,destination,action='walk') {
	var order = Object.assign({}, destination,{action:action})
	var horizontal = order.x > character.x ? 'right' : 'left';
	var vertical   = order.y > character.y ? 'up' : 'down';
		
	order.direction = Math.abs(order.x - character.x) > Math.abs(order.y - character.y) ? 
		horizontal:
		character.char.validDirections.includes(vertical) ?
			vertical : horizontal;
	
	
	character.destinationQueue = [order];	
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
	subject: null, needObject:false, object:null
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
		var defaultResponse = function() {
			this.getThings('pc').say('I will not do that.');
		}

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
		
		if (!interactionDone) {defaultResponse.apply(this,[])}
		this.subject = null; this.object = null; this.verb = this.verbList[0];
	}
  },

  beforeMount: function () { 
	
  
	this.$on('get-report',function(thing,data){
		var now = new Date();
		this.message = `${now.getHours()}:${now.getMinutes()}.${now.getSeconds()} : message from ${thing.name}: ${data}.`
	});
	
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
		goTo (this.getThings('pc'), {y: (event.target.offsetHeight - event.offsetY),x: (event.offsetX)});
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
	
	this.$on('room-change-done', function (data){
		var that = this;
		setTimeout (function(){			
			if (data === 'start') {
				that.getThings('pc').say('Hello, World. I am the player character.');
				that.getThings('pc').say('My name is ' + that.getThings('pc').name +'.');				
			}
		}, 50);
	});
	
	this.changeRoom(this.roomNumber,'start');
	
  }

})


