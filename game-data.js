var sprites = [
  {id:0, url: 'assets/sprites/boy.png', row:4, col:4},
  {id:2, url: 'assets/sprites/boy2.png', row:4, col:4},
  {id:'m', url: 'assets/sprites/mario.png', row:2, col:3},
  {id:'w', url: 'assets/sprites/woman.png', row:4, col:9},
  {id:'door', url: 'assets/sprites/door.png', row:1, col:3},
]


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
	{id:'r001', name:'Swamp', url: "assets/rooms/bg1.png", width:400, height:300, 
	characters : [
		new Character ('pc','Jane Smith',10,10,'white',characterModels.jane)
	]
	,worldItems:[
		new WorldItem ('lake','lake',200,45,400,50)
	]},
	
	{id:'r002', name:'Living room', url: "assets/rooms/bg2.jpg", width:400, height:250, 
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


function Verb (description, id, preposition) {
	this.description = description;
	this.id = id;
	this.preposition = preposition || '[NO PREPOSITION]';
	this.hasPreposition = !!(preposition);
}
var verbList = [new Verb('walk to','WALK'), new Verb('pick up','TAKE'),
		new Verb('look at','LOOK'), new Verb('give','GIVE', 'to'),
		new Verb('use','USE', 'with'), new Verb('talk to','TALK'),
		new Verb('open','OPEN'), new Verb('close','SHUT')];


function InventoryItem (id, name, url, startWith=false) {
	this.id = id.toUpperCase() + "_I";
	this.name=name;
	this.url='assets/items/'+url;
	this.have=startWith;
}
inventoryItems = [
	new InventoryItem('bucket', 'bucket', 'bucket.png'),
	new InventoryItem('stick','lolly stick', 'stick.jpg'),
	new InventoryItem('shoe','red shoe', 'shoe.jpg',true),
	new InventoryItem('hammer','hammer', 'hammer.jpg',true),
];