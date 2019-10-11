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
    new StandardOrder ('[Teleport]CHALMERS_C,FRONT_R,100,10'),
    new StandardOrder ('GAME', 'setGameStatus','LIVE'),
];

const greetChalmers = [
    new StandardOrder('GAME','setGameStatus','CUTSCENE'),
    new StandardOrder('CHALMERS_C','say','Well Seymour, I made it.'),
    new StandardOrder('CHALMERS_C','say','dispite your directions.'),
    new StandardOrder('pc','say','Superintendent Chalmers!'),
    new StandardOrder('pc','say','Welcome!'),
    new StandardOrder('[Status]CONVERSATION','arrival'),
];

const chalmersComesIn = [
    new StandardOrder ('GAME', 'setGameStatus','CUTSCENE'),
    new StandardOrder ('CHALMERS_C', 'goToRoom',['DINING_R',100,10]),
    new StandardOrder ('SKINNER_C', 'say','phew...'),
    new StandardOrder ('SKINNER_C', 'goTo',[146, 20]),
    new StandardOrder ('KITCHEN_R.OVEN_W', 'setStatus',"smoking"),
    new StandardOrder ('GAME', 'changeRoom',['DINING_R',120,40]),
    new StandardOrder ('GAME', 'setGameStatus','LIVE'),
];

const seeBurningRoast = [
    new StandardOrder ('GAME', 'setGameStatus','CUTSCENE'),
    new StandardOrder ('GAME', 'changeRoom',['KITCHEN_R',100,10]),
    new StandardOrder ('GAME','setGameVar',{haveSeenBurningRoast:true}),
    new StandardOrder ('SKINNER_C','say','Egads! My roast is ruined!'),
    new StandardOrder ('GAME', 'setGameStatus','LIVE'),
];

const goToKrustyBurger = [
    new StandardOrder ('GAME', 'setGameStatus','CUTSCENE'),
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


function fire () {
    const game = this;
    return new Promise (function (resolve) {
        let skinner = game.getThings('pc');
        let chalmers = game.getThings('CHALMERS_C');
        let door = game.getThings().DINING_KITCHENDOOR_W;
        let wayOut = game.getThings().DINING_WAYOUT_W.walkToPoint;

        game.setGameStatus('CUTSCENE');
        skinner.goTo({x:250,y:45})
        .then (r => {
            return door.setStatus(['opening_fire','closing_fire','closed_glowing'])
        })
        .then (r => {
            skinner.goTo({x:240,y:23});
            return skinner.say('Well, that was wonderful. A good time was had by all, I\'m pooped.');
        })
        .then( ()=> { return chalmers.say('Yes, I suppose I should be... good lord, what is happening in there?!')})
        .then( ()=> { return skinner.say('Aurora borealis.') })
        .then( ()=> { return chalmers.say('Aurora borealis?') })
        .then( ()=> { return chalmers.goTo({x:140,y:16})} )
        .then( ()=> { return chalmers.say('at this time of year,') })
        .then( ()=> { return chalmers.say('at this time of day,') })
        .then( ()=> { return chalmers.goTo({x:150,y:16})} )
        .then( ()=> { return chalmers.say('in this part of the country') })
        .then( ()=> { return chalmers.say('localized entirely within your kitchen?') })
        .then( ()=> { return chalmers.goTo({x:160,y:16})} )
        .then( ()=> { return skinner.say('Yes.') })
        .then( ()=> { return chalmers.say('May I see it?') })
        .then( ()=> { return skinner.say('No.') })
        .then( ()=> { 
            return chalmers.goTo(wayOut)
        } )
        .then( ()=> { 
            chalmers.char.behaviour_direction='right';
            return chalmers.goToRoom(['FRONT_R',150,15]) })
        .then( ()=> { return game.changeRoom(['FRONT_R',160,25]) })
        .then( ()=> { return game.getThings('AGNES_C').say('Seymour! the house is on fire!') })
        .then( ()=> {
            game.setGameStatus('CONVERSATION', 'houseIsOnFire')
            resolve({success:true});
        });
    })

}

function ending () {
    const game = this;

    let skinner = game.getThings('pc');
    let chalmers = game.getThings('CHALMERS_C');
    let agnes = game.getThings('AGNES_C');
    let fire = game.allRoomItemData.FRONT_R.WINDOW_FIRE_W;

    console.log(agnes, new Date)

    return new Promise (function (resolve) {
        game.setGameStatus('CUTSCENE');
        fire.removed=false;
        chalmers.goTo({x:95,y:1})
        .then(()=> {   return agnes.say('help!',{time:200})        } )
        .then(()=> {   return agnes.say('heelp!',{time:200})       } )
        .then(()=> {   return agnes.say('heeelp!',{time:200})      } )
        .then(()=> {   return agnes.say('heeeelp!',{time:200})     } )
        .then(()=> {   return agnes.say('heeeeelp!',{time:2000})  } )
        .then(()=> {   return chalmers.goTo({x:100,y:1})           } )
        .then(()=> {   return skinner.doAction('thumbs_up')       } )
        .then(()=> {
            game.setGameStatus('COMPLETE')
            resolve();
        } )

    })
}


export default { starting, fire, pourSandInBush, goToKrustyBurger, chalmersComesIn, chalmersAtDoor, greetChalmers,seeBurningRoast,ending };