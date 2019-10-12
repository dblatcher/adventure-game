import { StandardOrder } from "../modules/interaction-constructor";

function oldstarting () {

   const game = this;
    
   return new Promise (function (resolve, reject) {
        game.setGameStatus('CUTSCENE');
        game.getThings('pc').say('This is the starting sequence')
       .then (r => {
           return game.getThings('pc').doAction('wave');
       })
       .then (r => {
        game.setGameStatus('LIVE');
           resolve({success:true});
       });
   })

}

const starting = [
    new StandardOrder ('[status]CUTSCENE'),
    new StandardOrder ('pc::This is the starting sequence'),
    new StandardOrder ('pc##wave'),
    new StandardOrder ('pc::Hello World'),
    new StandardOrder ('[status]LIVE'),
]

export default { starting };