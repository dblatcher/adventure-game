var sprites = [
  {id:0, url: 'assets/sprites/boy.png', row:4, col:4},
  {id:2, url: 'assets/sprites/boy2.png', row:4, col:4},
  {id:'bf', url: 'assets/sprites/boy-flag.png', row:1, col:3, relativeHeight:2},
  {id:'bfr', url: 'assets/sprites/boy-flag-raise.png', row:1, col:1, relativeWidth:2},
  
  {id:'m', url: 'assets/sprites/mario.png', row:2, col:3},
  {id:'w', url: 'assets/sprites/woman.png', row:4, col:9},
  {id:'w2', url: 'assets/sprites/woman2b.png', row:4, col:3},
  {id:'w-wave', url: 'assets/sprites/womanWave.png', row:1, col:3},
  {id:'door', url: 'assets/sprites/door.png', row:1, col:3},
  {id:'bucket', url: 'assets/sprites/bucket.png', row:1, col:1},
  {id:'fire', url: 'assets/sprites/fire.png', row:2, col:4},
]


var characterModels = {
	mario : {
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
			},
			dance: [ ['m',0,0],['m',1,0],['m',0,0],['m',1,0], ['m',2,1],['m',1,1]  ,['m',0,0],['m',1,0],['m',2,0]  ]
		}		
	},
	billy : {
		baseHeight:50,baseWidth:50,
		spritesUsed:[2,0,'bf','bfr'],
		validDirections : ['down','left','right','up'],
		cycles : {
			wait: [[0,0,0]],
			waveFlag: [['bf',0,1],['bf',1,1],['bf',2,1]],
			raiseFlag: [[0,0,0],['bfr',0,0],['bfr',0,0]],
			lowerFlag: [['bfr',0,0],['bfr',0,0],[0,0,0]],
			talk: [[0,0,0],[2,0,0],],
			walk: {
				up 	  : [[0,0,1],[0,1,1],[0,2,1],[0,3,1]  ],
				down  : [[0,0,0],[0,1,0],[0,2,0],[0,3,0]  ],
				left  : [[0,0,2],[0,1,2],[0,2,2],[0,3,2]  ],
				right : [[0,0,3],[0,1,3],[0,2,3],[0,3,3]  ],
			}
		}	
	},
	jane : {			
		baseHeight:75,baseWidth:50,
		spritesUsed:['w','w2','w-wave'],
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
			talk : {
				up 	  : [ ['w',0,0], ['w2',0,0], ['w2',1,0],['w2',2,0] ],
				left  : [ ['w',0,1], ['w2',0,1], ['w2',1,1],['w2',2,1] ],
				down  : [ ['w',0,2], ['w2',0,2], ['w2',1,2],['w2',2,2] ],
				right : [ ['w',0,3], ['w2',0,3], ['w2',1,3],['w2',2,3] ] ,
			},
			wave : 
				[ ['w-wave',0,0], ['w-wave',1,0],['w-wave',2,0],['w-wave',0,0], ['w-wave',1,0],['w-wave',2,0] ]
			,
		}	
	}
	
}
function Character(id,name,coords,speechColor,model) {
	this.id = id.toLowerCase() === 'pc' ? 'pc' : id.toUpperCase()+"_C";
	this.name = name;
	this.startX = coords[0];
	this.startY = coords[1];
	this.speechColor= speechColor;
	Object.assign(this,model);
}


var worldItemModels = {
	door: {
		spritesUsed : ['door'],
		cycles: {
			closed: [ ['door',0,0]  ],
			open:   [ ['door',2,0]  ],
			opening:   [ ['door',0,0],['door',1,0],['door',2,0]  ],
			closing:   [ ['door',2,0],['door',1,0],['door',0,0]  ]
		}
	},
	bucket:  {
		spritesUsed : ['bucket'],
		cycles: {
			neutral: [ ['bucket',0,0]  ]
		}
	},
	fire: {
		spritesUsed : ['fire'],
		cycles: {
			burning: [ ['fire',0,0],['fire',1,0],['fire',2,0],['fire',3,0],  ],
			extinguishing: [ ['fire',0,1],['fire',1,1],['fire',2,1],['fire',3,1],['fire',2,1],['fire',3,1],['fire',2,1],['fire',3,1],  ],
			out: [ ['fire',2,1],  ],
		}
	},
};
function WorldItem (id, name, coords ,width,height,initialCycle, model) {
	this.id = id.toUpperCase() + "_W";
	this.name = name;
	this.startX = coords[0] || 0;
	this.startY = coords[1] || 0;
	this.walkOffsetX =  coords[2] || 0;
	this.walkOffsetY =  coords[3] || 0;
		
	this.baseWidth = width || 20;
	this.baseHeight = height || 20;
	this.status = {cycle: initialCycle||'neutral'};
	this.queue = [];
	
	if (model) {
		Object.assign(this, model);
	} else {
		this.spritesUsed = [];
		this.cycles = {neutral:[]};
	}
}

function Room (id, name, backgroundUrl, width,height, contents) {
	this.id = this.id = id.toUpperCase()+"_R";
	this.name = name;
	this.url = backgroundUrl;
	this.width = width;
	this.height = height;
	this.characters = contents.characters || [];
	this.worldItems = contents.worldItems || [];
	this.obstacles = contents.obstacles || [];
	this.effectZones = contents.effectZones || [];
	this.foregrounds = contents.foregrounds || [];
}

function EffectZone (zone,effect) {
	this.zone = zone,
	this.effect = effect;
}

function Foreground (url, coords, size, style) {
	this.url=url;
	this.x=coords[0];
	this.y=coords[1];
	this.width=size[0];
	this.height=size[1];
	this.style = style || {};
}

var rooms = [
	
	new Room ('swamp','swamp',"assets/rooms/bg1.png", 400, 300, {
	characters : [
		new Character ('pc','Jane Smith',[375,10],'white',characterModels.jane),
		new Character ('billy','billy',[200,10],'red',characterModels.billy)
	]
	,worldItems:[
		new WorldItem ('lake','lake',[200,45],400,50),
		new WorldItem ('house','path back to house',[375,0],50,150),
		new WorldItem ('bucket','bucket',[250,25],40,40,'neutral',worldItemModels.bucket),
		new WorldItem ('fire','fire',[145,30,20,0],40,40,'burning',worldItemModels.fire),
	],
	obstacles:[
		new RectZone (200,45,400,50,true)
	]}),
	 
	new Room ('LIVING_ROOM', 'Living room', "assets/rooms/bg2.jpg", 400, 250,{
	characters : [
		new Character ('luigi','Luigi',[135,21],'lightgreen',characterModels.mario),
		new Character ('pc','Jane Smith',[160,20],'white',characterModels.jane)
	],
	worldItems : [		
		new WorldItem ('door','wooden door',[265,30,0,-20],50,100,'closed',worldItemModels.door),
		new WorldItem ('window','nice window',[120,150,0,-140],100,145)
	],
	obstacles:[
		new RectZone (200,32,400,200,true),
		new RectZone (135,20,200,200,true),
	]}),
	
	new Room ('TEST_ROOM', 'test room', "assets/rooms/testroom.png", 400, 300, {
	characters : [
		new Character ('pc','Jane Smith',[200,20],'white',characterModels.jane)
		],
	effectZones:[
		new EffectZone(
		new PolyZone ([ [184,90], [219,78],[206,60],[160,60],[150,78] ]),
		{ filter:'sepia(100%) brightness(60%)'}),
		new EffectZone(
		new RectZone (0,0,400,200),
		{ scale:function(){return 1.5- this.y/200} }),
	],
	obstacles:[
		new PolyZone ([ [0,0],[83,126],[83,251],[0,300]  ]),
		new RectZone (83,126, 296-83 ,120 ,false),
		new PolyZone ([ [275,35], [305,35], [290,90]  ]),
		new PolyZone ([ [296,130], [296,250], [400,300], [400,0] ]),
	],
	foregrounds:[
		new Foreground("assets/rooms/tree.png",[-70,0],[220,200], {opacity:1,filter:'blur(1px)'}),
	]}),
]


function Verb (description, id, preposition) {
	this.description = description;
	this.id = id;
	this.preposition = preposition || '[NO PREPOSITION]';
	this.transitive = !!(preposition);
}
var verbList = [
	new Verb('walk to','WALK'),
	new Verb('pick up','TAKE'),
	new Verb('look at','LOOK'),
	new Verb('give','GIVE', 'to'),
	new Verb('use','USE', 'with'),
	new Verb('talk to','TALK'),
	new Verb('open','OPEN'),
	new Verb('close','SHUT')
];


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
	new InventoryItem('hammer','hammer', 'hammer.jpg'),
];

