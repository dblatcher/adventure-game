var summonCharacter = {
	billy: function(x,y,custom = {}) {
	return {
		id:custom.ident || 'Billy', name:custom.name || 'Billy', speechColor: 'red',
		spritesUsed:[2,0],
		validDirections : ['down','left','right','up'],
		baseHeight:50,baseWidth:50,
		startX:10,startY:10,
		cycles : {
			wait: [[0,0,0]],
			talk: [[0,0,0],[2,0,0]],
			walk: {
				up 	  : [[0,0,1],[0,1,1],[0,2,1],[0,3,1]  ],
				down  : [[0,0,0],[0,1,0],[0,2,0],[0,3,0]  ],
				left  : [[0,0,2],[0,1,2],[0,2,2],[0,3,2]  ],
				right : [[0,0,3],[0,1,3],[0,2,3],[0,3,3]  ],
			}
		}
	};
	},
	
	mario: function(x,y,custom = {}) {
	return {
		id:custom.ident||'npc', name:custom.name || 'Mario', speechColor: 'blue', 
		spritesUsed:['m'],
		validDirections : ['right','left'],
		baseHeight:75,baseWidth:50,
		startX:x,startY:y,
		cycles : {
			wait: {
				right: [ ['m',0,0] ],
				left : [ ['m',2,1] ],
			},
			walk: {
				right:[ ['m',0,0],['m',1,0],['m',2,0]  ],
				left: [ ['m',2,1],['m',1,1],['m',0,1]  ]
			}
		}
	};},
	
	jane: function(x,y,custom = {}) {
		return {id: custom.ident || 'pc' , name:custom.name || 'Jane', speechColor: 'white',
		spritesUsed:['w'],
		validDirections : ['down','left','right','up'],
		baseHeight:75,baseWidth:50,
		startX:x,startY:y,
		cycles : {
			wait : {
				up 	  : [ ['w',0,0] ],
				left  : [ ['w',0,1] ],
				down  : [ ['w',0,2] ],
				right : [ ['w',0,3] ],
			},
			walk : {
				up 	  : [ ['w',0,0],['w',1,0],['w',2,0],['w',3,0], ['w',4,0],['w',5,0],['w',6,0],['w',7,0], ['w',8,0] ],
				left  : [ ['w',0,1],['w',1,1],['w',2,1],['w',3,1], ['w',4,1],['w',5,1],['w',6,1],['w',7,1], ['w',8,1] ],
				down  : [ ['w',0,2],['w',1,2],['w',2,2],['w',3,2], ['w',4,2],['w',5,2],['w',6,2],['w',7,2], ['w',8,2] ],
				right : [ ['w',0,3],['w',1,3],['w',2,3],['w',3,3], ['w',4,3],['w',5,3],['w',6,3],['w',7,3], ['w',8,3] ] ,
				
			},
		}
		};
	}

}

var rooms = [
	{id:'r001', name:'Swamp', url: "bg1.png", width:400, height:300, characters : [summonCharacter.jane(10,10)]},
	{id:'r002', name:'Living room', url: "bg2.jpg", width:300, height:200, characters : [summonCharacter.mario(30,50),summonCharacter.jane(160,50),]}
]

var vm = new Vue({
  el:'#app',

  data: {
    sprites : [
      {id:0, url: 'boy.png', row:4, col:4},
      {id:2, url: 'boy2.png', row:4, col:4},
      {id:'m', url: 'mario.png', row:2, col:3},
      {id:'w', url: 'woman.png', row:4, col:9},
    ], 	
	characters : [],
	rooms: rooms,
	message: 'blank message',
	roomNumber: 0,
  },
  computed : {
	comp : function() {
	
		var list = this.$children[0].$children; // array of components in room
		var result = {}
		for (var i = 0; i<list.length; i++) {
			result[list[i].ident] = list[i];
		};
		return result;
	
	}
  },
  methods : {
	changeRoom: function (rNum,data) {		
		this.$emit('get-report',{name:'[game]'},'changing to room '+rNum+'')
		this.characters.splice(0, this.characters.length);
		this.characters.push(...this.rooms[rNum].characters);
		this.roomNumber = rNum;
		this.$emit('room-change-done',data);

	},
	getComp : function (ident) {
		var list = this.$children[0].$children; // array of components in room
		for (var i = 0; i<list.length; i++) {
			if (list[i].ident === ident ){ return list[i]};
		};
		return false;
	}
  },

  mounted: function () { 
	
  
	this.$on('get-report',function(component,data){
		var now = new Date();
		this.message = `${now.getHours()}:${now.getMinutes()}.${now.getSeconds()} : message from ${component.name}: ${data}.`
	});
	
	this.$on('clicked-room', function (component,event){	
		//TO DO -  generate path of steps to navigate around obsticles to closest valid point  
		var pc = this.getComp('pc');
		var order = {
			y: (event.target.offsetHeight - event.clientY + event.target.offsetTop),
			x: (event.clientX - event.target.offsetLeft),
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
				that.getComp('pc').say('Hello, World. I am the player character.');
				that.getComp('pc').say('My name is ' + that.getComp('pc').name +'.');				
			}
		}, 50);
	});
	
	this.changeRoom(0,'start');
	
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

function getChildByIdent (ident,instance = vm) {
  var rightChild = null ;
  instance.$children.forEach((child) => {
    if ( child.ident === ident ) {rightChild = child}
  })
  return rightChild;
}
