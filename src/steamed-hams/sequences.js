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

export default { starting,fire };