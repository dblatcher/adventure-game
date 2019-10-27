export default function (choice) {

  if (choice.canOnlySayOnce) {
    choice.disabled = true;
  }
  if (choice.changesBranch) {
    this.conversations[this.conversation].currentBranch = choice.changesBranch;
  } 
  
  var that = this;
  this.setGameStatus('CUTSCENE')
  this.runSequence(choice.script)
  .then( ()=>{   
    
    // change gameStatus out of Cutscene after script...
    // and after consequences (if conseqences returns a promise)
    // this is fragile - choice.consequences may or may not return a value
    // and may or may not setGameStatus itself
    // consider removing consequence callbacks - only being used to run sequences, which can be part of the script

    let consequences = {};
    if (typeof choice.consequence === 'function' ) {
      consequences = choice.consequence(that,choice)
    }

    if (typeof consequences == 'object' && consequences.then) {
      consequences.then(() => {
        if (that.gameStatus === 'CUTSCENE') { that.setGameStatus(choice.ends ? "LIVE" : "CONVERSATION"); }
      } )
    } else {
      if (that.gameStatus === 'CUTSCENE') { that.setGameStatus(choice.ends ? "LIVE" : "CONVERSATION"); }
    }

    
  })
    
}