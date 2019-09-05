import { pcId } from "./game-data";

function starting () {

   const game = this;
    
   return new Promise (function (resolve, reject) {
        game.setGameStatus('CUTSCENE');
        game.getThings('pc').doAction('walk')
       .then (r => {
        game.setGameStatus('LIVE');
           resolve({success:true});
       });
   })

}

function pourSandInBush (bushId = 'BUSH_W') {
    const game = this;

    return new Promise (function (resolve, reject) {
        
        let pc = game.getThings('pc');
		game.getInventoryItem('BUCKET_EMPTY_I');
		game.looseInventoryItem('BUCKET_SAND_I');
		game.setGameStatus('CUTSCENE');
		

		pc.goTo(game.getThings(bushId).walkToPoint)
		.then( (r) => {return pc.doAction('pour_sand')})
		.then( (r) => {return pc.say('There!') } )
		.then( (r) => {return pc.say('I suppose its wrong to use fire-fighting equipment improperly...') } )
		.then( (r) => {return pc.say('But what are the chances of a fire in the next half hour?',{action:'ponder'}) } )
		.then( (r) => { 
            game.setGameStatus('LIVE') 
            resolve ({success:true});
        })

    })

}

function goToKrustyBurger() {
    const game = this;
    let skinner = game.getThings('pc');
    let server = game.getThings('SERVER_C');
    game.getInventoryItem('HAMBURGER_BAG_I');
    game.gameVars.beenToKrustyBurger = true;

    return new Promise (function(resolve,reject) {
        game.setGameStatus('CUTSCENE');
        skinner.char.x=200;
        skinner.char.y=75;
        skinner.goTo({x:220,y:90})
        .then( (r) => {return skinner.say('Four hamburgers, quickly!') } )
        .then( (r) => {return server.say('uhhhh...') } )
        .then( (r) => {return server.say('would you like fries with that?') } )
        .then( (r) => {return skinner.say('Fries... yes, two large fries. Hurry!') } )
        .then( (r) => {return server.say('that\'ll be $12.97, please.') } )
        .then( (r) => {return skinner.goTo({x:200,y:73}) } )
        .then( (r) => {
            skinner.char.x=220;
            skinner.char.y=30;
            game.setGameStatus('LIVE'); 
            resolve ({success:true});
        } )
    })
}

function fire () {

    const game = this;

    return new Promise (function (resolve, reject) {
        
        let skinner = game.getThings('pc');
        let chalmers = game.getThings('CHALMERS_C');
        let door = game.getThings().DINING_KITCHENDOOR_W;


        game.setGameStatus('CUTSCENE');
        skinner.goTo({x:250,y:45})
        .then (r => {
            return door.setStatus('opening_fire','closing_fire','closed_glowing')
        })
        .then (r => {
            skinner.goTo({x:240,y:23});
            return skinner.say('Well, that was wonderful. A good time was had by all, I\'m pooped.');
        })
        .then (r => {
            return chalmers.say('Yes, I suppose I should be... good lord, what is happening in there?!')
        })
        .then (r => {
         game.setGameStatus('LIVE');
            resolve({success:true});
        });
    })

}

export default { starting,fire, pourSandInBush, goToKrustyBurger };