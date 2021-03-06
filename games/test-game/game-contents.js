import { RectZone, PolyZone } from "../../src/modules/zone";
import { Room, EffectZone, Foreground, Sprite, Sound } from "../../src/modules/constructors"
import Character from "../../src/modules/characterDataClass"
import WorldItem from "../../src/modules/WorldItemDataClass"
import InventoryItem from "../../src/modules/InventoryItem"

var sprites = [
  new Sprite (0, require('./sprites/boy.png'), [4,4]),
  new Sprite (2, require('./sprites/boy2.png'),[4,4]), 
  new Sprite ('bf', require('./sprites/boy-flag.png'), [3,1], [1,2]),
  new Sprite ('bfr',  require('./sprites/boy-flag-raise.png'),[1,1],[2,1]),
  new Sprite ('m',  require('./sprites/mario.png'),[3,2] ),
  new Sprite ('w',  require('./sprites/woman.png'), [9,4]),
  new Sprite ('w2',  require('./sprites/woman2b.png'), [3,4]),
  new Sprite ('w-wave',  require('./sprites/womanWave.png'), [3,1]),
  new Sprite ('door',  require('./sprites/door.png'), [3,1]),
  new Sprite ('bucket',  require('./sprites/bucket.png'), [1,1]),
  new Sprite ('stairs',  require('./sprites/stairs.png'), [1,1]),
  new Sprite ('platform',  require('./sprites/testroom3platform.png'), [1,1]),
  new Sprite ('tube',  require('./sprites/tube.png')),
  new Sprite ('fire',  require('./sprites/Fire.png'), [4,2]),
  new Sprite ('sk1',  require('./sprites/skinner-1-r.png'), [12,1]),
  new Sprite ('sk2',  require('./sprites/skinner-1-l.png'), [12,1]),
  new Sprite ('keypad',  require('./sprites/keypad.png')),
  new Sprite ('lightSwitch', require('./sprites/switch.jpg')),
  new Sprite ('lightSwitchFlipped', require('./sprites/switch-flip.jpg')),
]

var sounds = [
    new Sound('keypad beep', 'beep', require('./audio/zapsplat_household_dehumidifier_on_off_select_beep_single_49226.mp3' )),
    new Sound('keypad correct tone', 'correct-tone', require('./audio/zapsplat_multimedia_correct_tone_beep_17736.mp3' )),
    new Sound('keypad wrong tone', 'wrong-tone', require('./audio/zapsplat_multimedia_game_error_tone_001_24919.mp3' )),
    new Sound('footstep1','step1', require('./audio/zapsplat_foley_footstep_single_shoe_soft_girls_carpet_007_36951.mp3')),
    new Sound('footstep2','step2', require('./audio/zapsplat_foley_footstep_single_shoe_soft_girls_carpet_015_36959.mp3')),
    new Sound('typewriter number', 'typeNum', require('./audio/zapsplat_office_typewriter_number_single_key_press_rear_close_vintage_1960_lemair_helvetia_001_41002.mp3')),
    new Sound('typewriter key', 'typeKey', require('./audio/zapsplat_office_typewriter_single_key_press_medium_typebar_rear_close_vintage_1960_lemair_helvetia_001_41017.mp3')),
    new Sound('typewriter enter bell', 'typeEnterBell', require('./audio/zapsplat_office_typewriter_carriage_return_vintage_1960_lemair_helvetia_001_40994.mp3')),
    new Sound('typewriter space', 'typeSpace', require('./audio/zapsplat_office_typewriter_spacebar_key_press_typebar_rfront_close_vintage_1960_lemair_helvetia_001_41037.mp3')),
    new Sound('typewriter enter', 'typeEnter', require('./audio/zapsplat_office_typewriter_carriage_return_margin_bell_vintage_1960_lemair_helvetia_001_40992.mp3')),
    new Sound('typewriter tab', 'typeTab', require('./audio/zapsplat_office_typewriter_tab_single_key_press_rear_close_vintage_1960_lemair_helvetia_004_41045.mp3')),
]

var music = {

}

var characterModels = {
    mario : new Character.Model ({
        wait: {
            right: [ ['m',0,0] ],
            left : [ ['m',2,1] ],
        },
        walk: {
            right:[ ['m',0,0],['m',1,0],['m',2,0]  ],
            left: [ ['m',2,1],['m',1,1],['m',0,1]  ]
        },
        dance: [ ['m',0,0],['m',1,0],['m',0,0],['m',1,0], ['m',2,1],['m',1,1]  ,['m',0,0],['m',1,0],['m',2,0]  ]
    },{

    }),

    billy : new Character.Model ({
            wait: [[0,0,0]],
            waveFlag: [['bf',0,1],['bf',1,1],['bf',2,1]],
            raiseFlag: [[0,0,0],['bfr',0,0],['bfr',0,0]],
            lowerFlag: [['bfr',0,0],['bfr',0,0],[0,0,0]],
            talk: [[0,0,0],[2,0,0],],
            walk: {
                up       : [[0,0,1],[0,1,1],[0,2,1],[0,3,1]  ],
                down  : [[0,0,0],[0,1,0],[0,2,0],[0,3,0]  ],
                left  : [[0,0,2],[0,1,2],[0,2,2],[0,3,2]  ],
                right : [[0,0,3],[0,1,3],[0,2,3],[0,3,3]  ],
            }
    },{

    }),    

    jane : new Character.Model ({
        wait : {
            up    : [ ['w',0,0] ],
            left  : [ ['w',0,1] ],
            down  : [ ['w',0,2] ],
            right : [ ['w',0,3] ],
        },
        walk : {
            up    : [ ['w',0,0],['w',1,0,'step1'],['w',2,0],['w',3,0,'step2'], ['w',4,0],['w',5,0,'step1'],['w',6,0],['w',7,0,'step2'], ['w',8,0] ],
            left  : [ ['w',0,1],['w',1,1,'step1'],['w',2,1],['w',3,1,'step2'], ['w',4,1],['w',5,1,'step1'],['w',6,1],['w',7,1,'step2'], ['w',8,1] ],
            down  : [ ['w',0,2],['w',1,2,'step1'],['w',2,2],['w',3,2,'step2'], ['w',4,2],['w',5,2,'step1'],['w',6,2],['w',7,2,'step2'], ['w',8,2] ],
            right : [ ['w',0,3],['w',1,3,'step1'],['w',2,3],['w',3,3,'step2'], ['w',4,3],['w',5,3,'step1'],['w',6,3],['w',7,3,'step2'], ['w',8,3] ] ,
            
        },
        talk : {
            up    : [ ['w',0,0], ['w2',0,0], ['w2',1,0],['w2',2,0] ],
            left  : [ ['w',0,1], ['w2',0,1], ['w2',1,1],['w2',2,1] ],
            down  : [ ['w',0,2], ['w2',0,2], ['w2',1,2],['w2',2,2] ],
            right : [ ['w',0,3], ['w2',0,3], ['w2',1,3],['w2',2,3] ] ,
        },
        wave : 
            [ ['w-wave',0,0], ['w-wave',1,0],['w-wave',2,0],['w-wave',0,0], ['w-wave',1,0],['w-wave',2,0] ]
        ,
    },{

    }),

    skinner : new Character.Model ({
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
            right : [ ['sk1',9,0],['sk1',8,0],['sk1',9,0],['sk1',9,0],['sk1',8,0],['sk1',9,0],['sk1',9,0],['sk1',8,0],['sk1',9,0],['sk1',9,0],['sk1',8,0],['sk1',9,0],['sk1',9,0],['sk1',8,0],['sk1',9,0] ],
            left : [ ['sk2',2,0],['sk2',3,0],['sk2',2,0],['sk2',2,0],['sk2',3,0],['sk2',2,0] ,['sk2',2,0],['sk2',3,0],['sk2',2,0] ,['sk2',2,0],['sk2',3,0],['sk2',2,0],['sk2',2,0],['sk2',3,0],['sk2',2,0]   ],
        },
    },{

    }),
}

var worldItemModels = {
    door: new WorldItem.Model ({
        closed: [ ['door',0,0]  ],
        open:   [ ['door',2,0]  ],
        opening:   [ ['door',0,0],['door',1,0],['door',2,0]  ],
        closing:   [ ['door',2,0],['door',1,0],['door',0,0]  ]
    }),
    bucket:  new WorldItem.Model ({
        neutral: [ ['bucket',0,0]  ],
    }),
    stairs: new WorldItem.Model ({   
        neutral: [ ['stairs',0,0]  ],
    }),
    tube: new WorldItem.Model ({   
        neutral: [ ['tube',0,0]  ],
    }),
    fire: new WorldItem.Model ({
        burning: [ ['fire',0,0],['fire',1,0],['fire',2,0],['fire',3,0],  ],
        extinguishing: [ ['fire',0,1],['fire',1,1],['fire',2,1],['fire',3,1],['fire',2,1],['fire',3,1],['fire',2,1],['fire',3,1],  ],
        out: [ ['fire',2,1],  ],
    }),
    platform: new WorldItem.Model ({
        neutral: [ ['platform',0,0]  ],
    }),
    keypad: new WorldItem.Model ({
        neutral: [ ['keypad',0,0]  ],
    }),
    lightSwitch: new WorldItem.Model ({
        off: [ ['lightSwitch',0,0]  ],
        on: [ ['lightSwitchFlipped',0,0]  ],
    }),
};


var makeCharacters = function() {return [
    new Character ('Jane',[375,10,3],characterModels.jane,
    {
        baseWidth: 50,
        baseHeight: 80,
        speechColor: 'white',
    }),
    new Character ('Billy',[200,10,0],characterModels.billy,{scale:3}),
    new Character ('Luigi',[125,10,1],characterModels.mario,{scale:2.5}),
    new Character ('Skinner',[100,140,3],characterModels.skinner,{
        baseHeight: 80,
        baseWidth: 60,
    })
]}

var makeRooms = function(){ return [

    new Room ('swamp', require("./rooms/bg1.png"), 800, 250, {
    worldItems:[
        new WorldItem ('lake',[400,40,20,-20],800,50),
        new WorldItem ('overlook path',[0,0],150,150,null,{
            name:'path back to house',
        }),
        new WorldItem ('house',[725,0],150,150,null,{
            name:'path back to house',
        }),
        new WorldItem ('bucket',[250,20],40,40,worldItemModels.bucket),
        new WorldItem ('big bucket',[80,20],40,40,worldItemModels.bucket,{
            removed: true, 
            scale: 1.5
        }),
        new WorldItem ('fire',[145,20,20,0],40,40,worldItemModels.fire,{
            initialCycle:'burning',
        }),
    ],
    obstacles:[
        new RectZone (200,40,400,50,true)
    ],
    screenScrollX:2,
    }),

    new Room ('LIVING_ROOM', require("./rooms/bg2.jpg"), 400, 250,{
    name: 'Living room',
    worldItems : [
        new WorldItem ('door',[265,25,0,-20],50,100,worldItemModels.door,{
            name: 'wooden door',
            zAdjust:80,
            initialCycle: 'closed'
        }),
        new WorldItem ('window',[120,150,0,-140],100,145)
    ],
    obstacles:[
        new RectZone (200,32,400,200,true),
        new RectZone (135,20,200,200,true),
    ]}),

    new Room ('TEST_ROOM', require("./rooms/testroom.png"), 400, 300, {
    effectZones:[
        new EffectZone(
            new PolyZone ([ [184,90], [219,78],[206,60],[160,60],[150,78] ]),
            { filter:'sepia(100%) brightness(60%)'
        }),
        new EffectZone(
            new RectZone (0,0,400,200),
            { scale:function(){return 1.5- this.y/200} 
        }),
    ],
    obstacles:[
        new PolyZone ([ [0,0],[83,126],[83,251],[0,300]  ]),
        new RectZone (83,126, 296-83 ,120 ,false),
        new PolyZone ([ [275,35], [305,35], [290,90]  ]),
        new PolyZone ([ [296,130], [296,250], [400,300], [400,0] ]),
    ],
    foregrounds:[
        new Foreground(require("./rooms/tree.png"),[-70,0],[220,200], {opacity:1,filter:'blur(1px)'}),
    ]}),

    new Room ('Gallery', require("./rooms/testroom3.png"), 400,300, {
        name: 'The Overlook',
        filter: {
            brightness: 100,
        },
        worldItems: [
            new WorldItem ('platform', [200,0],400,130,worldItemModels.platform,{noZoneScaling:true, unclickable:true, zAdjust:80}),
            new WorldItem ('gate', [300,170,0,-15],50,50,null,{
                noZoneScaling:true,
                name: 'forbidding gate'
            }),
            new WorldItem ('tube1', [140,140],25,50,worldItemModels.tube,{
                name: 'tube',
            }),
            new WorldItem ('tube2', [80,140],25,50,worldItemModels.tube, {
                name: 'tube',
            }),
            new WorldItem ('keypad', [140,180,0,-30],20,20,worldItemModels.keypad,{
                name: 'electric keypad',
            }),
            new WorldItem ('keypad_door',[165,170,0,-20],50,100,worldItemModels.door,{
                name: 'security door',
                zAdjust:80,
                initialCycle:'closed',
            }),
            new WorldItem ('light switch',[10,140,70,-100],25,25,worldItemModels.lightSwitch,{
                initialCycle:'on',
                zAdjust:80,
            }),
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


var makeInventoryItems = function() { return  [
    new InventoryItem('bucket', require('./items/bucket.png'),{} ),
    new InventoryItem('sock', require('./items/sock.png'),{startWith: true, background:{shape:'diamond', color:'blue'}}),
    new InventoryItem('nail', {
        1: require('./items/nail.png'),
        2: require('./items/twonails.png'),
        3: require('./items/threenails.png'),
        4: require('./items/manynails.jpg')
    }, {startWith: true, quantity: 2, pluralName: 'nails'}),
    new InventoryItem('stick', require('./items/stick.jpg'),{startWith: true, name:'small wooden stick'}),
    new InventoryItem('shoe', require('./items/shoe.jpg'),{startWith: true, name: 'big red shoe'}),
    new InventoryItem('hammer', require('./items/hammer.jpg')),
]};


export { sprites, sounds, music, makeCharacters, makeRooms, makeInventoryItems}