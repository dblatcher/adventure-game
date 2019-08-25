
import { RectZone, PolyZone } from "../modules/zone";
import { Character, WorldItem, Room, EffectZone, Foreground, Verb, InventoryItem, Sprite, CharacterModel, WorldItemModel } from "../modules/constructors"

var sprites = [

  new Sprite ('door', 'door.png', [3,1]),

  new Sprite ('fire', 'Fire.png', [4,2]),
  new Sprite ('sk1', 'skinner-1-r.png', [12,1]),
  new Sprite ('sk2', 'skinner-1-l.png', [12,1]),
]


var characterModels = {

	skinner : new CharacterModel (65,100,{
		wait : {
			right : [ ['sk1',0,0] ],
			left : [ ['sk2',11,0] ],
		},
		walk : {
			right : [ ['sk1',3,0],['sk1',4,0],['sk1',5,0],['sk1',6,0],  ] ,
			left : [ ['sk2',8,0],['sk2',7,0],['sk2',6,0],['sk2',5,0],  ] ,
		},
		talk : {
			right : [ ['sk1',0,0],['sk1',0,0],['sk1',2,0] ],
			left : [ ['sk2',11,0],['sk2',11,0],['sk2',9,0] ],
		},
		yell : {
			right : [ ['sk1',11,0],['sk1',11,0],['sk1',10,0] ],
			left : [ ['sk2',0,0],['sk2',0,0],['sk2',1,0] ],
		},
		think : {
			right : [ ['sk1',9,0],['sk1',8,0],['sk1',9,0] ],
			left : [ ['sk2',2,0],['sk2',3,0],['sk2',2,0] ],
		},
	},'left'),
	
}


var worldItemModels = {
	door: new WorldItemModel ({
		closed: [ ['door',0,0]  ],
		open:   [ ['door',2,0]  ],
		opening:   [ ['door',0,0],['door',1,0],['door',2,0]  ],
		closing:   [ ['door',2,0],['door',1,0],['door',0,0]  ]
	}),
	fire: new WorldItemModel ({
		burning: [ ['fire',0,0],['fire',1,0],['fire',2,0],['fire',3,0],  ],
		extinguishing: [ ['fire',0,1],['fire',1,1],['fire',2,1],['fire',3,1],['fire',2,1],['fire',3,1],['fire',2,1],['fire',3,1],  ],
		out: [ ['fire',2,1],  ],
	}),

};


var makeCharacters = function() {return [
	new Character ('skinner','Skinner',[200,10,0],'white',characterModels.skinner),
]}

var pcId = 'SKINNER_C';

var makeRooms = function(){ return [
	
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