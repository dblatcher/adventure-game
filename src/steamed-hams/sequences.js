import { StandardOrder } from "../modules/interaction-constructor";

const starting = [
    new StandardOrder ('[Status]CUTSCENE'),
    new StandardOrder ('pc::I thought I\'d never get out of that superMarket!'),
    new StandardOrder ('pc::I\'d better glaze this ham and get it in the oven before Superintendent Chalmers arrives',{time:3000}),
    new StandardOrder ('pc::also, I need an ice bucket...'),
    new StandardOrder ('[Status]LIVE'),
]

const pourSandInBush = [
    new StandardOrder ('SKINNER_C', 'doAction','pour_sand'),
    new StandardOrder ('SKINNER_C', 'say','There!'),
    new StandardOrder ('SKINNER_C', 'say','I suppose its wrong to use fire-fighting equipment improperly...'),
    new StandardOrder ('SKINNER_C', 'say','But what are the chances of a fire in the next half hour?'),
    new StandardOrder ('[get]BUCKET_EMPTY_I'),
    new StandardOrder ('[Loose]BUCKET_SAND_I'),
    new StandardOrder ('GAME', 'setGameStatus','LIVE'),
]

const chalmersAtDoor = [
    new StandardOrder ('GAME', 'setGameStatus','CUTSCENE'),
    new StandardOrder ('SKINNER_C', 'say','The doorbell!'),
    new StandardOrder ('SKINNER_C', 'say','Superintendent Chalmers is outside!'),
    new StandardOrder ('[Teleport]CHALMERS_C,FRONT_R,130,10'),
    new StandardOrder ('GAME', 'setGameStatus','LIVE'),
];

const greetChalmers = [
    new StandardOrder('GAME','setGameStatus','CUTSCENE'),
    new StandardOrder('CHALMERS_C^^pc'),
    new StandardOrder('CHALMERS_C','say','Well Seymour, I made it.'),
    new StandardOrder('CHALMERS_C','say','dispite your directions.'),
    new StandardOrder('pc','say','Superintendent Chalmers!'),
    new StandardOrder('pc','say','Welcome!'),
    new StandardOrder('[Status]CONVERSATION','arrival'),
];

const chalmersComesIn = [
    new StandardOrder ('GAME', 'setGameStatus','CUTSCENE'),
    new StandardOrder ('CHALMERS_C>>FRONT_DOOR_W'),
    new StandardOrder ('CHALMERS_C}}DINING_R,100,10'),
    new StandardOrder ('SKINNER_C', 'say','phew...'),
    new StandardOrder ('SKINNER_C>>146, 20'),
    new StandardOrder ('KITCHEN_R.OVEN_W', 'setStatus',"smoking"),
    new StandardOrder ('[room]DINING_R,120,40'),
    new StandardOrder ('GAME', 'setGameStatus','LIVE'),
];

const seeBurningRoast = [
    new StandardOrder ('GAME', 'setGameStatus','CUTSCENE'),
    new StandardOrder ('GAME', 'changeRoom',['KITCHEN_R',100,10]),
    new StandardOrder ('[var]',{haveSeenBurningRoast:true}),
    new StandardOrder ('SKINNER_C','say','Egads! My roast is ruined!'),
    new StandardOrder ('GAME', 'setGameStatus','LIVE'),
];

const goToKrustyBurger = [
    
    new StandardOrder('CHALMERS_C::Why is there smoke coming out of your oven, Seymour?'),
    new StandardOrder('pc::Oh, no! That isn\'t smoke.'),
    new StandardOrder('pc::It\'s steam.'),
    new StandardOrder('pc::Steam from the steamed clams we\'re having.'),
    new StandardOrder('pc::Mmm, steamed clams.'),
    new StandardOrder ('pc', 'setDefaultWait','wait'),
    new StandardOrder ('pc', 'setDefaultTalk','talk'),
    new StandardOrder ('CHALMERS_C','goToRoom',['DINING_R',100,10]),
    new StandardOrder ('GAME','teleportCharacter',['SKINNER_C','KITCHEN_R',200,75]),
    new StandardOrder ('SKINNER_C','goTo',{x:220, y:90}),
    new StandardOrder ('SKINNER_C','say','Four hamburgers, quickly!'),
    new StandardOrder ('SERVER_C','say','uhhhh...'),
    new StandardOrder ('SERVER_C','say','would you like fries with that?'),
    new StandardOrder ('SKINNER_C','say','Fries... yes, two large fries. Hurry!'),
    new StandardOrder ('SERVER_C','say','that\'ll be $21.97, please.'),
    new StandardOrder ('GAME', 'getInventoryItem','HAMBURGER_BAG_I'),
    new StandardOrder ('SKINNER_C','goTo',{x:200, y:73}),
    new StandardOrder ('GAME','teleportCharacter',['SKINNER_C','KITCHEN_R',220,30]),
    new StandardOrder ('SERVER_C','say','I don\'t think he\'s coming back...'),
    new StandardOrder ('GAME', 'setGameStatus','LIVE'),
];

const fire = [
    new StandardOrder ('[status]CUTSCENE'),
    new StandardOrder ('CHALMERS_C', 'setDefaultWait','wait'),
    new StandardOrder ('CHALMERS_C', 'setDefaultTalk','talk'),
    new StandardOrder ('pc>>250,45'),
    new StandardOrder ('DINING_KITCHENDOOR_W','setStatus',['opening_fire']),
    [
        new StandardOrder ('pc>>240,23'),
        new StandardOrder ('DINING_KITCHENDOOR_W','setStatus',['closing_fire','closed_glowing']),
    ],
    new StandardOrder ('pc::Well, that was wonderful. A good time was had by all, I\'m pooped.'),
    new StandardOrder( 'CHALMERS_C::Yes, I suppose I should be... good lord, what is happening in there?!'),
    new StandardOrder( 'pc::Aurora borealis.'),
    new StandardOrder( 'CHALMERS_C::Aurora borealis?'),
    new StandardOrder( 'CHALMERS_C>>125,14'),
    new StandardOrder( 'CHALMERS_C::at this time of year,') ,
    new StandardOrder( 'CHALMERS_C::at this time of day,') ,
    new StandardOrder( 'CHALMERS_C>>145,14'),
    new StandardOrder( 'CHALMERS_C::in this part of the country'),
    new StandardOrder( 'CHALMERS_C::localized entirely within your kitchen?'),
    new StandardOrder( 'CHALMERS_C>>165,14'),
    new StandardOrder( 'pc::Yes.'),
    new StandardOrder( 'CHALMERS_C::May I see it?') ,
    new StandardOrder( 'pc::No.') ,
    [
        new StandardOrder( 'CHALMERS_C>>DINING_WAYOUT_W'),
        new StandardOrder( 'pc>>75,45'),
    ],
    new StandardOrder('CHALMERS_C}}FRONT_R,150,15'),
    new StandardOrder('[room]FRONT_R,160,25'),
    new StandardOrder('CHALMERS_C^^pc'),
    new StandardOrder( 'AGNES_C::Seymour! the house is on fire!'),
    new StandardOrder('[status]CONVERSATION','houseIsOnFire'),
    
]


const ending = [
    new StandardOrder ('[status]CUTSCENE'),
    new StandardOrder ('CHALMERS_C::Well Seymour, you are an odd fellow, but I must admit...'),
    new StandardOrder ('CHALMERS_C::You steam a good ham.'),
    new StandardOrder ('FRONT_R.WINDOW_FIRE_W','setRemoval',false ),
    new StandardOrder ('CHALMERS_C>>95,1'),
    [
    new StandardOrder ('AGNES_C::help!',{time:200}),
    new StandardOrder ('CHALMERS_C^^pc')]
    ,
    new StandardOrder ('AGNES_C::heelp!',{time:200}),
    new StandardOrder ('AGNES_C::heeelp!',{time:200}),
    new StandardOrder ('AGNES_C::heeeelp!',{time:200}),
    new StandardOrder ('AGNES_C::heeeeelp!',{time:2000}),
    new StandardOrder ('pc##thumbs_up'),
    new StandardOrder ('[status]COMPLETE'),
]


const test = [
    new StandardOrder ('pc::talk test'),
    new StandardOrder ('pc::talk test two'),
    new StandardOrder ('pc>>100,10'),
    new StandardOrder ('pc>>150,15'),
    new StandardOrder ('pc##window_talk'),
    new StandardOrder ('pc##nonRealAction'),
    new StandardOrder ('pc##window_talk'),
    new StandardOrder ('pc>>150,0'),
    new StandardOrder ('pc::done'),
]


export default { starting, fire, pourSandInBush, goToKrustyBurger, chalmersComesIn, chalmersAtDoor, greetChalmers,seeBurningRoast,ending, test };