
import { RectZone, PolyZone } from "../modules/zone";
import { Character, WorldItem, Room, EffectZone, Foreground, Verb, InventoryItem, Sprite, CharacterModel, WorldItemModel } from "../modules/constructors"

var sprites = [
  new Sprite (0,'boy.png', [4,4]),
  new Sprite (2,'boy2.png',[4,4]), 
  new Sprite ('bf','boy-flag.png', [3,1], [1,2]),
  new Sprite ('bfr', 'boy-flag-raise.png',[1,1],[2,1]),
  new Sprite ('m', 'mario.png',[3,2] ),
  new Sprite ('w', 'woman.png', [9,4]),
  new Sprite ('w2', 'woman2b.png', [3,4]),
  new Sprite ('w-wave', 'womanWave.png', [3,1]),
  new Sprite ('door', 'door.png', [3,1]),
  new Sprite ('bucket', 'bucket.png', [1,1]),
  new Sprite ('stairs', 'stairs.png', [1,1]),
  new Sprite ('platform', 'testroom3platform.png', [1,1]),
  new Sprite ('tube', 'tube.png'),
  new Sprite ('fire', 'Fire.png', [4,2]),
]


var characterModels = {
	mario : new CharacterModel (50,75,{
		wait: {
			right: [ ['m',0,0] ],
			left : [ ['m',2,1] ],
		},
		walk: {
			right:[ ['m',0,0],['m',1,0],['m',2,0]  ],
			left: [ ['m',2,1],['m',1,1],['m',0,1]  ]
		},
		dance: [ ['m',0,0],['m',1,0],['m',0,0],['m',1,0], ['m',2,1],['m',1,1]  ,['m',0,0],['m',1,0],['m',2,0]  ]
	}),

	billy : new CharacterModel (50,50, {
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
		}, 'down'),	

	jane : new CharacterModel (50,75,{
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
	},'down')
	
}


var worldItemModels = {
	door: new WorldItemModel ({
		closed: [ ['door',0,0]  ],
		open:   [ ['door',2,0]  ],
		opening:   [ ['door',0,0],['door',1,0],['door',2,0]  ],
		closing:   [ ['door',2,0],['door',1,0],['door',0,0]  ]
	}),
	bucket:  new WorldItemModel ({
		neutral: [ ['bucket',0,0]  ],
	}),
	stairs: new WorldItemModel ({   
		neutral: [ ['stairs',0,0]  ],
	}),
	tube: new WorldItemModel ({   
		neutral: [ ['tube',0,0]  ],
	}),
	fire: new WorldItemModel ({
		burning: [ ['fire',0,0],['fire',1,0],['fire',2,0],['fire',3,0],  ],
		extinguishing: [ ['fire',0,1],['fire',1,1],['fire',2,1],['fire',3,1],['fire',2,1],['fire',3,1],['fire',2,1],['fire',3,1],  ],
		out: [ ['fire',2,1],  ],
	}),
	platform: new WorldItemModel ({
		neutral: [ ['platform',0,0]  ],
	}),
};


var makeCharacters = function() {return [
	new Character ('jane','Jane Smith',[375,10,3],'white',characterModels.jane),
	new Character ('billy','billy',[200,10,0],'red',characterModels.billy),
	new Character ('luigi','Luigi',[135,21,1],'lightgreen',characterModels.mario),
]}

var pcId = 'JANE_C';

var makeRooms = function(){ return [
	
	new Room ('swamp','swamp',"bg1.png", 400, 250, {
	worldItems:[
		new WorldItem ('lake','lake',[200,40,20,-20],400,50),
		new WorldItem ('house','path back to house',[375,0],50,150),
		new WorldItem ('bucket','bucket',[250,20],40,40,'neutral',worldItemModels.bucket),
		new WorldItem ('bucket2','big bucket',[80,20],40,40,'neutral',worldItemModels.bucket,{scale: 1.5}),
		new WorldItem ('fire','fire',[145,20,20,0],40,40,'burning',worldItemModels.fire),
	],
	obstacles:[
		new RectZone (200,40,400,50,true)
	]}),
	 
	new Room ('LIVING_ROOM', 'Living room', "bg2.jpg", 400, 250,{
	worldItems : [		
		new WorldItem ('door','wooden door',[265,25,0,-20],50,100,'closed',worldItemModels.door,{zAdjust:80}),
		new WorldItem ('window','nice window',[120,150,0,-140],100,145)
	],
	obstacles:[
		new RectZone (200,32,400,200,true),
		new RectZone (135,20,200,200,true),
	]}),
	
	new Room ('TEST_ROOM', 'test room', "testroom.png", 400, 300, {
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
		new Foreground("tree.png",[-70,0],[220,200], {opacity:1,filter:'blur(1px)'}),
	]}),

	new Room ('Gallery', 'The Overlook', "testroom3.png", 400,300, {
		worldItems: [
		//	new WorldItem ('path_down','', [350,80],180,90,'neutral',worldItemModels.stairs,{noZoneScaling:true, unclickable:true}),
			new WorldItem ('platform','', [200,0],400,130,'neutral',worldItemModels.platform,{noZoneScaling:true, unclickable:true, zAdjust:80}),
			new WorldItem ('gate','dark gate', [300,170,0,-15],50,50,'neutral',null,{noZoneScaling:true}),
			new WorldItem ('tube1','tube', [80,20],20,35,'neutral',worldItemModels.tube),
			new WorldItem ('tube2','tube', [110,120],20,35,'neutral',worldItemModels.tube),
		],
		obstacles: [
			new RectZone(45,165,315,100),
			new PolyZone([ [360,165], [400,140],[400, 165] ]),
			new PolyZone([ [50,165], [20,145],[0,145],[0, 165] ]),
			new RectZone(0,0,40,300),
			new RectZone(0,65,360,20),
			new RectZone(380,65,40,20),
			
		],
		effectZones: [
			new EffectZone( new RectZone(0,0,400,80), {
				scale: function() {return 3},
			} ),
			new EffectZone( new RectZone(0,80,400,90), {
				scale: function() {return .75 - (this.y - 85)/300},
			} ),
		],

	}),
]}


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

var makeInventoryItems = function() { return  [
	new InventoryItem('bucket', 'bucket', 'bucket.png'),
	new InventoryItem('sock', 'sock', 'sock.png',true),
	new InventoryItem('nail', 'nail', {1:'nail.png',2:'twonails.png',3:'threenails.png',4:'manynails.jpg'},true, {quantity: 2, pluralName: 'nails'}),
	new InventoryItem('stick','lolly stick', 'stick.jpg',true),
	new InventoryItem('shoe','red shoe', 'shoe.jpg',true),
	new InventoryItem('hammer','hammer', 'hammer.jpg'),
]};

var setGameVars = function ()  { return {
	wantsHammer: false,
	numberOfSomething: 5,
}};

export { sprites, makeRooms, verbList, makeInventoryItems, makeCharacters, pcId, setGameVars }