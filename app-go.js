

var vm = new Vue({
  el:'#app',

  data: {
    verbList : verbList,
	sprites : sprites, 	
	characters : [],
	worldItems : [],
	rooms: rooms,
	inventoryItems: inventoryItems,
	message: 'blank message',
	roomNumber: 1,
	verb: verbList[0],thingHoveredOn:null
  },
  computed : {
	command : function() {
			
		var subject = null;
		var needObject = true;
		
		var sentence = this.verb.description + ' ';
		if (subject) {
			sentence +=  subject.name+ ' ';			
			if (needObject && this.verb.hasPreposition) {sentence += this.verb.preposition + ' ';}
		}
		
		var undecidedNoun='';
		if (this.thingHoveredOn) {undecidedNoun = this.thingHoveredOn.name;} 
		
		return {
			sentence: sentence,
			undecidedNoun: undecidedNoun
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
	}
  },

  beforeMount: function () { 
	
  
	this.$on('get-report',function(thing,data){
		var now = new Date();
		this.message = `${now.getHours()}:${now.getMinutes()}.${now.getSeconds()} : message from ${thing.name}: ${data}.`
	});
	
	this.$on('verb-picked',function(verbID) {
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
		
		var order = {
			y: (event.target.offsetHeight - event.offsetY),
			x: (event.offsetX),
			action: 'walk'
		};
		var horizontal = order.x > pc.x ? 'right' : 'left';
		var vertical   = order.y > pc.y ? 'up' : 'down';
		var direction = Math.abs(order.x - pc.x) > Math.abs(order.y - pc.y) ? 
			horizontal:
			(pc.char.validDirections.includes(vertical) ? vertical : horizontal );
		order.direction = direction;
		
		pc.destinationQueue = [order];	
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

