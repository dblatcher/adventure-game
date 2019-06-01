var characterModels = {
	mario : function() {
		return {
			baseHeight:75,baseWidth:50,
			spritesUsed:['m'],
			validDirections : ['right','left'],
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
		};
	},
	billy : function() {
		return {
			baseHeight:50,baseWidth:50,
			spritesUsed:[2,0],
			validDirections : ['down','left','right','up'],
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
		}
	},
	jane : function() {
		return {			
			baseHeight:75,baseWidth:50,
			spritesUsed:['w'],
			validDirections : ['down','left','right','up'],
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
		}
	}
	
}

function Character(id,name,x,y,speechColor,model) {
	this.id = id.toLowerCase() === 'pc' ? 'pc' : id.toUpperCase()+"_C";
	this.name = name;
	this.startX = x;
	this.startY = y;
	this.speechColor= speechColor;
	Object.assign(this,model());
}

var worldItemModels = {
	door: function () {
		return {
			spritesUsed : ['door'],
			cycles: {
				closed: [ ['door',0,0]  ],
				open:   [ ['door',2,0]  ],
				opening:   [ ['door',0,0],['door',1,0],['door',2,0]  ],
				closing:   [ ['door',2,0],['door',1,0],['door',0,0]  ]
			}
		};
	}
};

function WorldItem (id, name, x,y,width,height,status, model) {
	this.id = id.toUpperCase() + "_W";
	this.name = name;
	this.startX = x || 0;
	this.startY = y || 0;
	this.baseWidth = width || 20;
	this.baseHeight = height || 20;
	this.status = status || 'neutral';
	this.queue = [];
	
	if (model) {
		Object.assign(this, model())
	} else {
		this.spritesUsed = [];
		this.cycles = {neutral:[]};
	}
}

var rooms = [
	{id:'r001', name:'Swamp', url: "bg1.png", width:400, height:300, 
	characters : [
		new Character ('pc','Jane Smith',10,10,'white',characterModels.jane)
	]
	,worldItems:[
		new WorldItem ('lake','lake',200,45,400,50)
	]},
	
	{id:'r002', name:'Living room', url: "bg2.jpg", width:400, height:250, 
	characters : [
		new Character ('luigi','Luigi',100,50,'green',characterModels.mario),
		new Character ('pc','Jane Smith',160,50,'white',characterModels.jane)
	],
	worldItems : [		
		new WorldItem ('door','wooden door',265,25,50,100,'closed',worldItemModels.door),
		new WorldItem ('winDow','nice window',120,150,100,145)
	]
	}
]

function InventoryItem (id, name, url, startWith=false) {
	this.id = id.toUpperCase() + "_I";
	this.name=name;
	this.url=url;
	this.have=startWith;
}
inventoryItems = [
	new InventoryItem('bucket', 'bucket', 'bucket.png'),
	new InventoryItem('stick','lolly stick', 'stick.jpg'),
	new InventoryItem('shoe','red shoe', 'shoe.jpg',true),
	new InventoryItem('hammer','hammer', 'hammer.jpg',true),
];

var vm = new Vue({
  el:'#app',

  data: {
    sprites : [
      {id:0, url: 'boy.png', row:4, col:4},
      {id:2, url: 'boy2.png', row:4, col:4},
      {id:'m', url: 'mario.png', row:2, col:3},
      {id:'w', url: 'woman.png', row:4, col:9},
      {id:'door', url: 'door.png', row:1, col:3},
    ], 	
	characters : [],
	worldItems : [],
	rooms: rooms,
	inventoryItems: inventoryItems,
	message: 'blank message',
	roomNumber: 1,
  },
  computed : {
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

  mounted: function () { 
	
  
	this.$on('get-report',function(thing,data){
		var now = new Date();
		this.message = `${now.getHours()}:${now.getMinutes()}.${now.getSeconds()} : message from ${thing.name}: ${data}.`
	});
	
	this.$on('clicked-room', function (component,event){	
		//TO DO -  generate path of steps to navigate around obsticles to closest valid point  
		var pc = this.getThings('pc');
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

function getChildByIdent (ident,instance = vm) {
  var rightChild = null ;
  instance.$children.forEach((child) => {
    if ( child.ident === ident ) {rightChild = child}
  })
  return rightChild;
}
