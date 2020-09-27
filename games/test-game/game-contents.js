const rawGameContentsData = {
    inventoryItems : [
        ['bucket', 'bucket.png', {}],
        ['sock', 'sock.png', {startWith: true, background:{shape:'diamond', color:'blue'}}],
        ['nail', {
            1: 'nail.png',
            2: 'twonails.png',
            3: 'threenails.png',
            4: 'manynails.jpg'
        }, {startWith: true, quantity: 2, pluralName: 'nails'}],
        ['stick', 'stick.jpg',{startWith: true, name:'small wooden stick'}],
        ['shoe', 'shoe.jpg',{startWith: true, name: 'big red shoe'}],
        ['hammer', 'hammer.jpg'],
    ],
    sprites : [
        ['b0', 'boy.png', [4,4]],
        ['b2', 'boy2.png',[4,4]],
        ['bf', 'boy-flag.png', [3,1], [1,2]],
        ['bfr',  'boy-flag-raise.png',[1,1],[2,1]],
        ['m',  'mario.png',[3,2] ],
        ['w',  'woman.png', [9,4]],
        ['w2',  'woman2b.png', [3,4]],
        ['w-wave',  'womanWave.png', [3,1]],
        ['door',  'door.png', [3,1]],
        ['bucket',  'bucket.png', [1,1]],
        ['stairs',  'stairs.png', [1,1]],
        ['platform',  'testroom3platform.png', [1,1]],
        ['tube',  'tube.png'],
        ['fire',  'Fire.png', [4,2]],
        ['sk1',  'skinner-1-r.png', [12,1]],
        ['sk2',  'skinner-1-l.png', [12,1]],
        ['keypad',  'keypad.png'],
        ['lightSwitch', 'switch.jpg'],
        ['lightSwitchFlipped', 'switch-flip.jpg'],
    ],
    sounds : [
        ['keypad beep', 'beep', 'zapsplat_household_dehumidifier_on_off_select_beep_single_49226.mp3'],
        ['keypad correct tone', 'correct-tone', 'zapsplat_multimedia_correct_tone_beep_17736.mp3'],
        ['keypad wrong tone', 'wrong-tone', 'zapsplat_multimedia_game_error_tone_001_24919.mp3'],
        ['footstep1','step1', 'zapsplat_foley_footstep_single_shoe_soft_girls_carpet_007_36951.mp3'],
        ['footstep2','step2', 'zapsplat_foley_footstep_single_shoe_soft_girls_carpet_015_36959.mp3'],
        ['typewriter number', 'typeNum', 'zapsplat_office_typewriter_number_single_key_press_rear_close_vintage_1960_lemair_helvetia_001_41002.mp3'],
        ['typewriter key', 'typeKey', 'zapsplat_office_typewriter_single_key_press_medium_typebar_rear_close_vintage_1960_lemair_helvetia_001_41017.mp3'],
        ['typewriter enter bell', 'typeEnterBell', 'zapsplat_office_typewriter_carriage_return_vintage_1960_lemair_helvetia_001_40994.mp3'],
        ['typewriter space', 'typeSpace', 'zapsplat_office_typewriter_spacebar_key_press_typebar_rfront_close_vintage_1960_lemair_helvetia_001_41037.mp3'],
        ['typewriter enter', 'typeEnter', 'zapsplat_office_typewriter_carriage_return_margin_bell_vintage_1960_lemair_helvetia_001_40992.mp3'],
        ['typewriter tab', 'typeTab', 'zapsplat_office_typewriter_tab_single_key_press_rear_close_vintage_1960_lemair_helvetia_004_41045.mp3'],
    ],
    music : [

    ],
    characterModels : {
        mario : [{
            wait: {
                right: [ ['m',0,0] ],
                left : [ ['m',2,1] ],
            },
            walk: {
                right:[ ['m',0,0],['m',1,0],['m',2,0]  ],
                left: [ ['m',2,1],['m',1,1],['m',0,1]  ]
            },
            dance: [ ['m',0,0],['m',1,0],['m',0,0],['m',1,0], ['m',2,1],['m',1,1]  ,['m',0,0],['m',1,0],['m',2,0]  ]
        },{}],

        billy : [{
                wait: [['b0',0,0]],
                waveFlag: [['bf',0,1],['bf',1,1],['bf',2,1]],
                raiseFlag: [['b0',0,0],['bfr',0,0],['bfr',0,0]],
                lowerFlag: [['bfr',0,0],['bfr',0,0],['b0',0,0]],
                talk: [['b0',0,0],['b2',0,0],],
                walk: {
                    up    : [['b0',0,1],['b0',1,1],['b0',2,1],['b0',3,1]  ],
                    down  : [['b0',0,0],['b0',1,0],['b0',2,0],['b0',3,0]  ],
                    left  : [['b0',0,2],['b0',1,2],['b0',2,2],['b0',3,2]  ],
                    right : [['b0',0,3],['b0',1,3],['b0',2,3],['b0',3,3]  ],
                }
        },{}],

        jane : [{
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
        },{}],

        skinner : [{
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
        },{}],
    },
    worldItemModels: {
        door: [{
            closed: [ ['door',0,0]  ],
            open:   [ ['door',2,0]  ],
            opening:   [ ['door',0,0],['door',1,0],['door',2,0]  ],
            closing:   [ ['door',2,0],['door',1,0],['door',0,0]  ]
        }],
        bucket:  [{
            neutral: [ ['bucket',0,0]  ],
        }],
        stairs: [{
            neutral: [ ['stairs',0,0]  ],
        }],
        tube: [{
            neutral: [ ['tube',0,0]  ],
        }],
        fire: [{
            burning: [ ['fire',0,0],['fire',1,0],['fire',2,0],['fire',3,0],  ],
            extinguishing: [ ['fire',0,1],['fire',1,1],['fire',2,1],['fire',3,1],['fire',2,1],['fire',3,1],['fire',2,1],['fire',3,1],  ],
            out: [ ['fire',2,1],  ],
        }],
        platform: [{
            neutral: [ ['platform',0,0]  ],
        }],
        keypad: [{
            neutral: [ ['keypad',0,0]  ],
        }],
        lightSwitch: [{
            off: [ ['lightSwitch',0,0]  ],
            on: [ ['lightSwitchFlipped',0,0]  ],
        }],
    },
    characters: [
        {
            id: "Jane",
            coords:[375,10,3], 
            model:"jane", 
            config: {
                baseWidth: 50,
                baseHeight: 80,
                speechColor: 'white',
            }
        },
        {
            id: 'Billy',
            coords: [200,10,0],
            model: "billy",
            config: {scale:3},
        },
        {
            id: 'Luigi',
            coords: [125,10,1],
            model: "mario",
            config: {scale:2.5}
        },
        {
            id: 'Skinner',
            coords: [100,140,3],
            model: "skinner",
            config: {
                baseHeight: 80,
                baseWidth: 60
            }
        },
    ],
    rooms: [
        [
            'swamp', 'bg1.png', 800, 250, {
                worldItems: [
                    ['lake', [400, 40, 20, -20], 800, 50],
                    ['overlook path', [0, 0], 150, 150, null, {
                        name: 'path back to house',
                    }],
                    ['house', [725, 0], 150, 150, null, {
                        name: 'path back to house',
                    }],
                    ['bucket', [250, 20], 40, 40, 'bucket'],
                    ['big bucket', [80, 20], 40, 40, 'bucket', {
                        removed: true,
                        scale: 1.5
                    }],
                    ['fire', [145, 20, 20, 0], 40, 40, 'fire', {
                        initialCycle: 'burning',
                    }],
                ],
                obstacles: [
                    ['RectZone', 200, 40, 400, 50, true]
                ],
                screenScrollX: 2,
            }
        ],
        
        [
            'LIVING_ROOM', 'bg2.jpg', 400, 250, {
                name: 'Living room',
                worldItems: [
                    ['door', [265, 25, 0, -20], 50, 100, 'door', {
                        name: 'wooden door',
                        zAdjust: 80,
                        initialCycle: 'closed'
                    }],
                    ['window', [120, 150, 0, -140], 100, 145]
                ],
                obstacles: [
                    ['RectZone', 200, 32, 400, 200, true],
                    ['RectZone', 135, 20, 200, 200, true],
                ]
            }
        ],
        
        [
            'TEST_ROOM', 'testroom.png', 400, 300, {
                effectZones: [
                    [
                        ['PolyZone', [[184, 90], [219, 78], [206, 60], [160, 60], [150, 78]]],
                        { filter: 'sepia(100%) brightness(60%)' }
                    ],
                    [
                        ['RectZone', 0, 0, 400, 200],
                        { scale: function () { return 1.5 - this.y / 200 } }
                    ]
                ],
                obstacles: [
                    ['PolyZone', [[0, 0], [83, 126], [83, 251], [0, 300]]],
                    ['RectZone', 83, 126, 296 - 83, 120, false],
                    ['PolyZone', [[275, 35], [305, 35], [290, 90]]],
                    ['PolyZone', [[296, 130], [296, 250], [400, 300], [400, 0]]],
                ],
                foregrounds: [
                    ['tree.png', [-70, 0], [220, 200], { opacity: 1, filter: 'blur(1px)' }]
                ]
            }
        ],
        
        [
            'Gallery', 'testroom3.png', 400, 300, {
                name: 'The Overlook',
                filter: {
                    brightness: 100,
                },
                worldItems: [
                    ['platform', [200, 0], 400, 130, 'platform', { noZoneScaling: true, unclickable: true, zAdjust: 80 }],
                    ['gate', [300, 170, 0, -15], 50, 50, null, {
                        noZoneScaling: true,
                        name: 'forbidding gate'
                    }],
                    ['tube1', [140, 140], 25, 50, 'tube', {
                        name: 'tube',
                    }],
                    ['tube2', [80, 140], 25, 50, 'tube', {
                        name: 'tube',
                    }],
                    ['keypad', [140, 180, 0, -30], 20, 20, 'keypad', {
                        name: 'electric keypad',
                    }],
                    ['keypad_door', [165, 170, 0, -20], 50, 100, 'door', {
                        name: 'security door',
                        zAdjust: 80,
                        initialCycle: 'closed',
                    }],
                    ['light switch', [10, 140, 70, -100], 25, 25, 'lightSwitch', {
                        initialCycle: 'on',
                        zAdjust: 80,
                    }],
                ],
                obstacles: [
                    ['RectZone', 45, 165, 315, 100],
                    ['PolyZone', [[360, 165], [400, 140], [400, 165]]],
                    ['PolyZone', [[50, 165], [20, 145], [0, 145], [0, 165]]],
                    ['RectZone', 0, 0, 40, 300],
                    ['RectZone', 0, 65, 360, 20],
                    ['RectZone', 380, 65, 40, 20],
                ],
                effectZones: [
                    [
                        ['RectZone', 0, 0, 400, 80],
                        { scale: "3 - this.y/200"  }
                    ],
                    [
                        ['RectZone', 0, 80, 400, 90],
                        { 
                            scale: ".75 - (this.y - 85) / 300"
                        },
                    ],
                ],
            }
        ]


    ]
}

export { rawGameContentsData }
