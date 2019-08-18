export default function (command) {
    if (!command) {command = {verb: this.verb, subject: this.subject, object: this.object};}
    
    var interactionDone = false, failedCondition = false;
    //find array of conditions/response object matching the command
    var thirdParam = command.object? command.object.id : 'intransitive';
    var matchingList = [];
    if (this.interactionMatrix[command.verb.id] && this.interactionMatrix[command.verb.id][command.subject.id] ) {
      matchingList = this.interactionMatrix[command.verb.id][command.subject.id][thirdParam] || [];
    }

    //perform the first reponse on the list for which the condition tests pass
    for (var i=0; i< matchingList.length; i++) {
      failedCondition = false;
      
      // test for matchingList[i].conditions being satisfied, if not skip to next 
      for (var j=0; j<matchingList[i].conditions.length; j++) {
        if (matchingList[i].conditions[j].apply(this,[]) == false) {
          failedCondition = true;
          break;
        }
      }
      if (failedCondition) {continue}
          
      matchingList[i].response.apply(this,[]);
      interactionDone = true;
      break;
    }

    var defaultResponse = {
      "WALK" : function() {this.getThings('pc').goTo(this.getThings(command.subject.id).walkToPoint)},
      "LOOK" : function() {
        if (command.subject.id.endsWith('W')) {
          this.getThings('pc').say(`It looks like a normal ${command.subject.name} to me.`);
        } else {
          this.getThings('pc').say(`I don't see anything special about ${command.subject.name}.`);
        }
      },
      "misc" : function() {this.getThings('pc').say('I will not do that.');} 
    };


    if (!interactionDone) {
      if (defaultResponse[command.verb.id]) {
        defaultResponse[command.verb.id].apply(this,[])				
      } else {
        defaultResponse["misc"].apply(this,[])				
      }
    }

    this.subject = null; 
    this.object = null;
    this.verb = this.verbList[0];
    this.$refs.VerbMenu.reset(); 
  }