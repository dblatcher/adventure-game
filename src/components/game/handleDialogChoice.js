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
    if (that.gameStatus === 'CUTSCENE') { that.setGameStatus(choice.ends ? "LIVE" : "CONVERSATION"); }
  })

}