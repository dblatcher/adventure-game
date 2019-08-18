export default function (choice) {
    var theApp = this, script = choice.script;
    theApp.gameStatus = 'CUTSCENE';
    
    executeScriptItem(0)

    function executeScriptItem (index) {
      var actorId;
      
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
        if (typeof choice.consequence === 'function' ) {choice.consequence(theApp,choice)}
        
        theApp.gameStatus = choice.ends ? "LIVE" : "CONVERSATION";
      }

      function nextItemOrEnd () {
        if (index === script.length-1) {
          handleEndOfScript();
        } else {
          executeScriptItem(index+1);
        }
      }
      
      if (Array.isArray(script[index])) {
        var promiseSet = [];
        for (var j=0; j< script[index].length; j++){
          actorId = findActorId(script[index][j]);
          promiseSet.push(
            theApp.getThings(actorId)[script[index][j].orderType](script[index][j].text)
          );
        }
        Promise.all(promiseSet)
        .then( nextItemOrEnd  )
        
      } else {
        actorId = findActorId(script[index]);
        theApp.getThings(actorId)[script[index].orderType](script[index].text)
        .then( nextItemOrEnd );	
      }	

    }
    
    
  }