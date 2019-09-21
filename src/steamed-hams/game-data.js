
import { RectZone, PolyZone } from "../modules/zone";
import { Character, WorldItem, Room, EffectZone, Foreground, Verb, InventoryItem, Sprite, CharacterModel, WorldItemModel } from "../modules/constructors"

var sprites = [

  new Sprite ('door',  require('./sprites/door.png'), [3,1]),
  new Sprite ('front_fence',  require('./sprites/fence_front.png'), [1,1]),
  new Sprite ('table',  require('./sprites/table.png'), [1,1]),
  new Sprite ('iceBucket',  require('./sprites/ice-bucket.png'), [1,1]),
  new Sprite ('hamburgerPlatter',  require('./sprites/hamburgers_on_platter.png'), [1,3]),
  new Sprite ('foil',  require('./sprites/foil.png'), [1,1]),
  new Sprite ('oven', require('./sprites/oven.png'), [6,1]),

  new Sprite ('sk1',  require('./sprites/skinner-talk.png'), [6,1]),
  new Sprite ('sk2',  require('./sprites/skinner-talk-l.png'), [6,1]),
  new Sprite ('skw1',  require('./sprites/skinner-walk-r.png'), [3,1]),
  new Sprite ('skw2',  require('./sprites/skinner-walk-l.png'), [3,1]),

  new Sprite ('skw',  require('./sprites/skinner-w-1.png'), [3,1]),
  new Sprite ('ch1l',  require('./sprites/Chalmers-w-l.png'),[7,1]),
  new Sprite ('ch1r',  require('./sprites/Chalmers-w-r.png'),[7,1]),
  new Sprite ('chTl',  require('./sprites/Chalmers-t-l.png'),[7,1]),
  new Sprite ('chTr',  require('./sprites/Chalmers-t-r.png'),[7,1]),
  new Sprite ('chTh-r',  require('./sprites/Chalmers-t-ham.png'),[7,1],[1,1.1]),
  
  new Sprite ('fire',  require('./sprites/window_fire.png'),[2,1]),

  new Sprite ('k-dr', require('./sprites/kitchen-door.png'),[4,3]),

]


var characterModels = {

    skinner : new CharacterModel (65,100,{
        wait : {
            right : [ ['sk1',0,0] ],
            left : [ ['sk2',5,0] ],
        },
        walk : {
            right : [ ['skw1',0,0],['skw1',1,0],['skw1',2,0],  ] ,
            left : [ ['skw2',0,0],['skw2',1,0],['skw2',2,0], ] ,
        },
        talk : {
            right : [ ['sk1',1,0],['sk1',2,0],['sk1',3,0],['sk1',4,0] ],
            left : [ ['sk2',4,0],['sk2',3,0],['sk2',3,0],['sk2',1,0]],
        },
        window_talk : [ ['skw',0,0],['skw',1,0],['skw',2,0] ],
        window_wait : [ ['skw',1,0] ],
            
        
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
        talk_with_ham : 
        [ ['chTh-r',0,0],['chTh-r',1,0],['chTh-r',2,0],['chTh-r',3,0],['chTh-r',4,0] ],
        wait_with_ham : 
        [ ['chTh-r',0,0] ],
        
    },'right'),

    invisible : new CharacterModel (1,1,{
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
    },'right')
}


var worldItemModels = {
    door: new WorldItemModel ({
        closed: [ ['door',0,0]  ],
        open:   [ ['door',2,0]  ],
        opening:   [ ['door',0,0],['door',1,0],['door',2,0]  ],
        closing:   [ ['door',2,0],['door',1,0],['door',0,0]  ],
    }),
    kitchen_door: new WorldItemModel ({
        closed: [ ['k-dr',3,2]  ],
        open:   [ ['k-dr',0,0]  ],
        closed_glowing: [ ['k-dr',3,0], ['k-dr',3,1]  ],
        opening:   [ ['k-dr',0,2],['k-dr',0,1],['k-dr',0,0]  ],
        closing:   [ ['k-dr',0,1],['k-dr',0,2],['k-dr',3,2]  ],
        opening_fire:   [ ['k-dr',1,2],['k-dr',2,2], ['k-dr',1,1] ,['k-dr',2,1], ['k-dr',1,0],['k-dr',2,0]   ],
        closing_fire:   [  ['k-dr',2,0], ['k-dr',1,0],['k-dr',2,1], ['k-dr',1,1],['k-dr',2,2], ['k-dr',1,2]    ]
    }),
    front_fence: new WorldItemModel({
        neutral:[['front_fence',0,0]],
    }),
    table: new WorldItemModel({
        neutral:[['table',0,0]],
    }),
    iceBucket: new WorldItemModel({
        neutral:[['iceBucket',0,0]],
    }),
    hamburgers: new WorldItemModel({
        four:[['hamburgerPlatter',0,0]],
        three:[['hamburgerPlatter',0,1]],
        two:[['hamburgerPlatter',0,2]],
    }),
    foil: new WorldItemModel({
        neutral:[['foil',0,0]],
    }),
    oven: new WorldItemModel({
        closed:[['oven',0,0]],
        open:[['oven',1,0]],
        closed_ham_inside:[['oven',0,0]],
        open_ham_inside:[['oven',2,0]],
        smoking:[['oven',3,0],['oven',4,0],['oven',5,0],['oven',4,0]],
    }),

    fireInWindow: new WorldItemModel({
        neutral:[['fire',0,0],['fire',1,0]],
    })

};


var makeCharacters = function() {return [
    new Character ('skinner','Skinner',[200,10,0],'white',characterModels.skinner),
    new Character ('chalmers','Superintendent Chalmers',[100,10,null],'red',characterModels.chalmers),
    new Character ('server','sever',[230,100,2],'lime',characterModels.invisible),
    new Character ('agnes','agnes',[165,90,0],'violet',characterModels.invisible),
]}

var pcId = 'SKINNER_C';

var makeRooms = function(){ return [
    
    new Room('FRONT', 'front of house', require('./rooms/Skinner_House.png'),280,160,{
        effectZones: [
            new EffectZone(
                new RectZone(0,0,280,160),
                {scale: function(){return 0.28}}
            ),
        ],
        worldItems: [
            new WorldItem('garage','car hole',[65,16,0,-10],200,170),
            new WorldItem('bush','bush',[185,14,20,-2],130,65),
            new WorldItem('bush_2','bush',[125,14,20,-2],120,65),
            new WorldItem('bush_3','bush',[225,23,10,-2],80,75),
            new WorldItem('front_door','door',[142,28,5,-10],80,120,'closed',worldItemModels.door),
            new WorldItem('front_fence','f',[155,8],470,129,'neutral',worldItemModels.front_fence,{unclickable:true,zAdjust:10}),
            new WorldItem('window_fire','fire',[175,35],25,30,'neutral',worldItemModels.fireInWindow,{unclickable:true,removed:true, noZoneScaling:true,}),
        ],
        obstacles: [
            new PolyZone([ [0,40],[30,16],[100,20], [100,40] ]),
            new RectZone(0,40,230,20),
            new PolyZone([ [230,50],[243,50],[280,40], [280,60] ]),
            new PolyZone([ [100,40],[104,14],[141,17], [132,30],[132,40] ]),
            new PolyZone([ [154,40], [154,29],[168,17],[209,17], [215,26],[215,40] ]),
        ],
        foregrounds: [
            new Foreground(require("./rooms/tree_front.png"),[200,0],[80,160]),
        ],
    }),

    new Room ('DINING','dining room', require('./rooms/dining_room2.png'),350,220,{
        worldItems: [
            new WorldItem('TABLE','table',[170,20,35,20],120,60,'neutral',worldItemModels.table),
            new WorldItem('DINING_KITCHENDOOR','door',[310,10,-30,0],68,150,'closed',worldItemModels.kitchen_door,{
                zAdjust:500
            }),
            new WorldItem('DINING_WAYOUT','way out',[45,45,20,10],50,125,'neutral'),
            new WorldItem('ICE_BUCKET', 'ice bucket', [170,70],30,25,'neutral',worldItemModels.iceBucket,{
                zAdjust:-50,
                removed:true,
            }),
            new WorldItem('HAMBURGERS', '\'steamed hams\'', [170,60],80,30,'four',worldItemModels.hamburgers,{
                zAdjust:-40,
                removed:true,
            }),
        ],
        obstacles: [
            new PolyZone ([ [0,0], [86,81],[86,220],[0,220] ]),
            new PolyZone ([ [86,81],[86,220],[270,220],[270,81] ]),
            new PolyZone ([ [270,220],[270,81],[350,0],[350,220] ]),
            new PolyZone ([ [110,20],[230,20],[230,30],[110,30] ]),
        ]
    }),


    new Room ('KITCHEN', 'kitchen', require('./rooms/kitchen.png'),290,180,{
        worldItems : [    
            new WorldItem('OVEN','oven', [145,35,30,-10],70,100,'closed',worldItemModels.oven),
            new WorldItem('KRUSTYBURGER','Krusty Burger',[210,70,10,-40],50,40,'neutral',null,{noZoneScaling:true}),
            new WorldItem('KITCHEN_DININGDOOR','way back to dining room',[145,0],290,12),
            new WorldItem('cupboard','cupboard',[90,39,0,-5],50,130),
            new WorldItem('foil','foil',[270,70,-30,-35],50,15,'neutral',worldItemModels.foil),
        ],
        obstacles : [
            new RectZone(0,44,290,20),
            new RectZone(50,35,140,20),
            new PolyZone ([[5,0],[66,39],[66,60],[0,60],[0,0]])
        ],
        effectZones: [
            new EffectZone(new RectZone(185,70,50,40),{
                scale: function(){return .175 - (this.y-70)/150}
            })
        ]
    })

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
    new InventoryItem('roast', 'raw roast', require('./items/roast.png'),true),
    new InventoryItem('roast_glazed', 'glazed roast', require('./items/glazed-roast.png')),
    new InventoryItem('bucket_foil', 'ice bucket', require('./items/bucket_foil.png')),
    new InventoryItem('bucket_sand', 'fire bucket', require('./items/bucket_sand.png')),
    new InventoryItem('bucket_empty', 'fire bucket', require('./items/bucket.png')),
    new InventoryItem('foil', 'aluminium foil', require('./items/foil.jpg')),
    new InventoryItem('bourbon','bourbon', require('./items/bourbon.png')),
    new InventoryItem('hamburger_bag','hamburgers', require('./items/bag.png')),
    new InventoryItem('hamburger_platter','elegantly arranged hamburgers', require('./items/hamburgers_on_platter.png')),
    new InventoryItem('platter','platter', require('./items/platter.png')),

]};

var setGameVars = function ()  { return {
    cupboardEmpty: false,
    beenToKrustyBurger:false,
	roastIsInOven: false,
	iceBucketIsOnTable : false,
	haveSeenBurningRoast: false,
}};

export { sprites, makeRooms, verbList, makeInventoryItems, makeCharacters, pcId, setGameVars }