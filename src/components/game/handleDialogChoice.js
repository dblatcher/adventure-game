export default function (choice) {
    var theApp = this, script = choice.script;
    theApp.setGameStatus('CUTSCENE');
    
    executeScriptItem(0)

    function executeScriptItem (index) {

      function findActorId(item){
        var id = item.actor;
        if (id === 'npc') {id = theApp.conversations[theApp.conversation].npc}
        return id;
      }
    
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

      function nextItemOrEnd () {
        if (index === script.length-1) {
          handleEndOfScript();
        } else {
          executeScriptItem(index+1);
        }
      }
      
      if (Array.isArray(script[index])) { // array of lines to be exectuted simultaneously
        var promiseSet = [];
        for (var j=0; j< script[index].length; j++){
          let actor = theApp.getThings ( findActorId(script[index][j]));
          promiseSet.push(
            actor[script[index][j].orderType](script[index][j].text, script[index][j].options)
          );
        }
        Promise.all(promiseSet)
        .then( nextItemOrEnd  )
        
      } else { // single line
        let actor = theApp.getThings ( findActorId(script[index]));
        actor[script[index].orderType](script[index].text,script[index].options)
        .then( nextItemOrEnd );	
      }

    }
    
    
  }