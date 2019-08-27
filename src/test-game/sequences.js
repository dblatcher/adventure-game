
function starting () {

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


export default { starting };