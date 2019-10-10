import { StandardOrder } from "../modules/interaction-constructor";

const starting = [
    new StandardOrder ('GAME', 'setGameStatus','CUTSCENE'),
    new StandardOrder ('SKINNER_C', 'say','I thought I\'d never get out of that superMarket!'),
    new StandardOrder ('SKINNER_C', 'say','I\'d better glaze this ham and get it in the oven before Superintendent Chalmers arrives',{time:500}),
    new StandardOrder ('SKINNER_C', 'say','also, I need an ice bucket...'),
    new StandardOrder ('GAME', 'setGameStatus','LIVE'),
]

const pourSandInBush = [
    new StandardOrder ('SKINNER_C', 'doAction','pour_sand'),
    new StandardOrder ('SKINNER_C', 'say','There!'),
    new StandardOrder ('SKINNER_C', 'say','I suppose its wrong to use fire-fighting equipment improperly...'),
    new StandardOrder ('SKINNER_C', 'say','But what are the chances of a fire in the next half hour?'),
    new StandardOrder ('GAME', 'getInventoryItem','BUCKET_EMPTY_I'),
    new StandardOrder ('GAME', 'looseInventoryItem','BUCKET_SAND_I'),
    new StandardOrder ('GAME', 'setGameStatus','LIVE'),
]

const chalmersAtDoor = [
    new StandardOrder ('GAME', 'setGameStatus','CUTSCENE'),
    new StandardOrder ('SKINNER_C', 'say','The doorbell!'),
    new StandardOrder ('SKINNER_C', 'say','Superintendent Chalmers is outside!'),
    new StandardOrder ('GAME', 'teleportCharacter',['CHALMERS_C', 'FRONT_R',100,10]),
    new StandardOrder ('GAME', 'setGameStatus','LIVE'),
];

const greetChalmers = [
    new StandardOrder('GAME','setGameStatus','CUTSCENE'),
    new StandardOrder('CHALMERS_C','say','Well Seymour, I made it.'),
    new StandardOrder('CHALMERS_C','say','dispite your directions.'),
    new StandardOrder('pc','say','Superintendent Chalmers!'),
    new StandardOrder('pc','say','Welcome!'),
    new StandardOrder('GAME','setGameStatus','CONVERSATION','arrival'),
];

const chalmersComesIn = [
    new StandardOrder ('GAME', 'setGameStatus','CUTSCENE'),
    new StandardOrder ('CHALMERS_C', 'goToRoom',['DINING_R',100,10]),
    new StandardOrder ('SKINNER_C', 'say','phew...'),
    new StandardOrder ('SKINNER_C', 'goTo',{x:146,y:20}),
    new StandardOrder ('KITCHEN_R.OVEN_W', 'setStatus',"smoking"),
    new StandardOrder ('GAME', 'changeRoom',['DINING_R',120,40]),
    new StandardOrder ('GAME', 'setGameStatus','LIVE'),
];

function seeBurningRoast () {
    const game = this;
    let skinner = game.getThings('pc');
    game.gameVars.haveSeenBurningRoast = true;

    return new Promise (function(resolve) {
        game.changeRoom(['KITCHEN_R',100,10])
        .then( ()=> { skinner.say('Egads! My roast is ruined!')} )
        .then( ()=> { resolve ({sucess: true})} )
    })
}

function goToKrustyBurger() {
    const game = this;
    let skinner = game.getThings('pc');
    let server = game.getThings('SERVER_C');
    let chalmers = game.getThings('CHALMERS_C');
    game.getInventoryItem('HAMBURGER_BAG_I');
    game.gameVars.beenToKrustyBurger = true;

    return new Promise (function(resolve,reject) {
        game.setGameStatus('CUTSCENE');

        chalmers.goTo({ x:100, y:-20})
        .then( () =>{
            chalmers.goToRoom(['DINING_R',100,10])
            skinner.char.x=200;
            skinner.char.y=75;
            return skinner.goTo({x:220,y:90});
        })
        .then( () => {return skinner.say('Four hamburgers, quickly!') } )
        .then( () => {return server.say('uhhhh...') } )
        .then( () => {return server.say('would you like fries with that?') } )
        .then( () => {return skinner.say('Fries... yes, two large fries. Hurry!') } )
        .then( () => {return server.say('that\'ll be $12.97, please.') } )
        .then( () => {return skinner.goTo({x:200,y:73}) } )
        .then( () => {
            skinner.char.x=220;
            skinner.char.y=30;
            server.say('I don\'t think he\'s coming back...')
            game.setGameStatus('LIVE'); 
            resolve ({success:true});
        } )
    })
}

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
            return door.setStatus('opening_fire','closing_fire','closed_glowing')
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