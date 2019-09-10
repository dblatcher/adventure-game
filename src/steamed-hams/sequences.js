
function starting () {
   const game = this;
   let skinner = game.getThings('pc');

   return new Promise (function (resolve) {
        game.setGameStatus('CUTSCENE');
        skinner.say('I thought I\'d never get out of that superMarket!')
        .then( ()=> { return skinner.say('I\'d better glaze this ham and get it in the oven before Superintendent Chalmers arrives')})
        .then( ()=> { return skinner.say('also, I need an ice bucket...')})
        .then( ()=> {
            game.setGameStatus('LIVE');
            resolve({success:true});
        });
   })

}

function pourSandInBush (bushId = 'BUSH_W') {
    const game = this;

    return new Promise (function (resolve) {
        
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


function chalmersAtDoor () {
    const game = this;
    return new Promise (function(resolve,reject) {
        game.setGameStatus('CUTSCENE');
        let skinner = game.getThings('pc');

        skinner.say('The doorbell!')
        .then( ()=> {
            game.setGameStatus('LIVE');
            game.allCharacters.forEach(char => {
                if (char.id === 'CHALMERS_C') { game.characterRoomChange(char, 0,100,10)};
                resolve ({success:true});
            });
        })

    })
}

function chalmersComesIn () {
    const game = this;
    return new Promise (function(resolve, reject) {
        game.setGameStatus('CUTSCENE');
        let skinner = game.getThings('pc');
        let chalmers = game.getThings('CHALMERS_C');
        let door = game.getThings('FRONT_DOOR_W');

        chalmers.goTo(door.walkToPoint)
        .then( ()=> {
            chalmers.changeRoom(1,100,10);
            return skinner.say('phew...');
        } )
        .then ( ()=> {
            return skinner.goTo(door.walkToPoint)
        } )
        .then ( ()=> {
            game.changeRoom(1,120,40);
            game.allRoomItemData.KITCHEN_R.OVEN_W.status.cycle="smoking";
            game.setGameStatus('LIVE');
            resolve ({success:true});
        })

    })
}

function seeBurningRoast () {
    const game = this;
    let skinner = game.getThings('pc');
    game.gameVars.haveSeenBurningRoast = true;

    return new Promise (function(resolve) {
        game.changeRoom('KITCHEN_R',100,10)
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
            chalmers.changeRoom(1,100,10)
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
    return new Promise (function (resolve, reject) {
        let skinner = game.getThings('pc');
        let chalmers = game.getThings('CHALMERS_C');
        let agnes;
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
            //skinner.goTo(wayOut)
            return chalmers.goTo(wayOut)
        } )
        .then( ()=> { return chalmers.changeRoom(0,129,10) })
        .then( ()=> { return game.changeRoom(0,144,25) })
        .then( ()=> { 
            game.getThings('CHALMERS_C').char.behaviour_direction = 'right';
            return game.getThings('CHALMERS_C').say('Well Seymour, you are an odd fellow')
        })
        .then( ()=> { return game.getThings('CHALMERS_C').say('But I must admit - you steam a good ham.') })
        .then( ()=> { return game.getThings('CHALMERS_C').goTo({x:90,y:10}) })
        
        .then( ()=> {
            agnes = game.getThings('AGNES_C');
            return agnes.say('Seymour! the house is on fire!')
        })
        .then( ()=> { return game.getThings('CHALMERS_C').goTo({x:100,y:10}) })
        .then( ()=> {
         game.setGameStatus('LIVE');
            resolve({success:true});
        });
    })

}

export default { starting,fire, pourSandInBush, goToKrustyBurger, chalmersComesIn, chalmersAtDoor, seeBurningRoast };