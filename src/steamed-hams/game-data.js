
import { RectZone, PolyZone } from "../modules/zone";
import { Character, WorldItem, Room, EffectZone, Foreground, Verb, InventoryItem, Sprite, CharacterModel, WorldItemModel } from "../modules/constructors"

var sprites = [

  new Sprite ('door', 'door.png', [3,1]),
  new Sprite ('front_fence', 'fence_front.png', [1,1]),
  new Sprite ('table', 'table.png', [1,1]),

  new Sprite ('fire', 'Fire.png', [4,2]),
  new Sprite ('sk1', 'skinner-1-r.png', [12,1]),
  new Sprite ('sk2', 'skinner-1-l.png', [12,1]),
  new Sprite ('skw', 'skinner-w-1.png', [3,1]),
  new Sprite ('ch1l', 'Chalmers-w-l.png',[7,1]),
  new Sprite ('ch1r', 'Chalmers-w-r.png',[7,1]),
  new Sprite ('chTl', 'Chalmers-t-l.png',[7,1]),
  new Sprite ('chTr', 'Chalmers-t-r.png',[7,1]),
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
		window_talk : [ ['skw',0,0],['skw',1,0],['skw',2,0] ],
			
		
	},'left'),
	
	chalmers : new CharacterModel (65,100,{
		wait : {
			right : [ ['ch1r',0,0] ],
			left : [ ['ch1l',6,0] ],
		},
		walk : {
			right : [ ['ch1r',1,0],['ch1r',2,0],['ch1r',3,0],['ch1r',4,0], ['ch1r',5,0]  ] ,
			left : [ ['ch1l',1,0],['ch1l',2,0],['ch1l',3,0],['ch1l',4,0], ['ch1l',5,0]  ] ,
		},
		talk : {
			right : [ ['chTr',0,0],['chTr',1,0],['chTr',2,0],['chTr',3,0],['chTr',4,0] ],
			left :  [ ['chTl',2,0],['chTl',3,0],['chTl',4,0],['chTl',5,0],['chTl',6,0], ],
		},
			
		
	},'right'),

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
	front_fence: new WorldItemModel({
		neutral:[['front_fence',0,0]],
	}),
	table: new WorldItemModel({
		neutral:[['table',0,0]],
	}),

};


var makeCharacters = function() {return [
	new Character ('skinner','Skinner',[200,10,0],'white',characterModels.skinner),
	new Character ('chalmers','Superintendent Chalmers',[100,10,0],'red',characterModels.chalmers),
]}

var pcId = 'SKINNER_C';

var makeRooms = function(){ return [
	
	new Room('FRONT', 'front of house', 'Skinner_House.png',280,160,{
		effectZones: [
			new EffectZone(
				new RectZone(0,0,280,160),
				{scale: function(){return 0.28}}
			),
		],
		worldItems: [
			new WorldItem('garage','car hole',[65,16,0,-10],200,170),
			new WorldItem('front_door','door',[142,28,5,-10],80,120,'closed',worldItemModels.door),
			new WorldItem('front_fence','f',[155,8],470,129,'neutral',worldItemModels.front_fence,{unclickable:true,zAdjust:10}),
		],
		obstacles: [
			new PolyZone([ [0,40],[30,16],[100,20], [100,40] ]),
			new RectZone(0,40,230,20),
			new PolyZone([ [230,50],[243,50],[280,40], [280,60] ]),
			new PolyZone([ [100,40],[104,14],[141,17], [132,30],[132,40] ]),
			new PolyZone([ [154,40], [154,29],[168,17],[209,17], [215,26],[215,40] ]),
		],
		foregrounds: [
			new Foreground("tree_front.png",[200,0],[80,160]),
		],
	}),

	new Room ('DINING','dining room', 'dining_room.png',350,220,{
		worldItems: [
			new WorldItem('table','table',[170,35],120,50,'neutral',worldItemModels.table),
		],
	}),

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