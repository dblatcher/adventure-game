export default function (choice) {
    var theApp = this, script = choice.script;
    
    theApp.setGameStatus('CUTSCENE')
    
    theApp.runSequence(script)
    .then( ()=>{
      handleEndOfScript()
    })
    


    function handleEndOfScript() {

      var currentConversation = theApp.conversations[theApp.conversation];

      if (choice.canOnlySayOnce) {
        choice.disabled = true;
      }
      if (choice.addItems) {
          choice.addItems.forEach ( (itemId) => {
              theApp.inventoryItems.filter(function(a){return a.id==itemId})[0].have = true;
          })
      }
      if (choice.removeItems) {
          choice.removeItems.forEach ( (itemId) => {
              theApp.inventoryItems.filter(function(a){return a.id==itemId})[0].have = false;
          })
      }
      if (choice.changesBranch) {
        currentConversation.currentBranch = choice.changesBranch;
      } 
      
      theApp.setGameStatus(choice.ends ? "LIVE" : "CONVERSATION");
      if (typeof choice.consequence === 'function' ) {choice.consequence(theApp,choice)}
    }


    
  }