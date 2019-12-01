export default function (command) {
    if (!command) {command = {verb: this.verb, subject: this.subject, object: this.object};}
    
    var interactionDone = false, failedCondition = false, condition, passed;
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
        condition = matchingList[i].conditions[j];
        if (condition.isStandardCondition) { passed = condition.evaluate(this) } 
        else { passed = condition.apply(this,[]) }
        if (passed == false) {
          failedCondition = true;
          break;
        }
      }
      if (failedCondition) {continue}

      if (typeof matchingList[i].response ===  'function') {
        matchingList[i].response.apply(this,[]);
      } else if ( Array.isArray(matchingList[i].response)) {
        this.runSequence(matchingList[i].response) 
      } else if (typeof matchingList[i].response === 'string' && this.sequences[matchingList[i].response]) {
        this.runSequence( this.sequences[matchingList[i].response] )
      } else {
        console.warn('bad response, neither function, array, nor name of sequence', matchingList[i].response)
      }
      
      interactionDone = true;
      break;
    }

    // use defaultResponse if there is no scripted interaction with satisfied conditions
    // pc saying 'no' is a failsafe to prevent a crash if a game has no misc default response
    if (!interactionDone) {
      if (this.defaultResponses[command.verb.id]) {
        this.defaultResponses[command.verb.id].apply(this,[command])				
      } else {
        if (this.defaultResponses["misc"]) {
          this.defaultResponses["misc"].apply(this,[command])				
        } else {this.getThings('pc').say('no.')}
      }
    }

    this.subject = null; 
    this.object = null;
    this.verb = this.verbList[0];
  }