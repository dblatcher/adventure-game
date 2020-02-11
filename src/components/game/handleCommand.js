export default function (command) {
    if (!command) {command = {verb: this.verb, subject: this.subject, object: this.object};}
    let failedCondition = false, condition, passed, response=null, execution=null;
    
    //find array of interactions  matching the command from the InteractionMatrix
    var thirdParam = command.object? command.object.id : 'intransitive';
    var matchingList = [];
    if (this.interactionMatrix[command.verb.id] && this.interactionMatrix[command.verb.id][command.subject.id] ) {
      matchingList = this.interactionMatrix[command.verb.id][command.subject.id][thirdParam] || [];
    }

    //loop over the list of Interactions
    for (var i=0; i< matchingList.length; i++) {
      failedCondition = false;

      // evaluate each condition of the Interaction, breaking if one fails 
      for (var j=0; j<matchingList[i].conditions.length; j++) {
        condition = matchingList[i].conditions[j];
        if (condition.isStandardCondition) { passed = condition.evaluate(this) } 
        else { passed = condition.apply(this,[]) }
        if (passed == false) {
          failedCondition = true;
          break;
        }
      }
  
      //if all the condtions pass, record the response for the interaction and end the loop 
      if (!failedCondition) {
        response = matchingList[i].response;
        break;
      }
    }

    // use a default response if no scripted response passed its conditions
    if (!response) {
      let defaultResponseFunction = this.defaultResponses[command.verb.id] 
      || this.defaultResponses["misc"] 
      || function(){ return []}
      response = defaultResponseFunction(command)
    }


    // execute the response
    if (typeof response ===  'function') {
      execution = response.apply(this,[]);
    } else if ( Array.isArray(response)) {
      execution= this.runSequence(response) 
    } else if (typeof response === 'string' && this.sequences[response]) {
      execution =  this.runSequence( this.sequences[response] )
    } else {
      console.warn('bad response, neither function, array, nor name of sequence', response)
    }

    this.lastCommand.verb = this.verb;
    this.lastCommand.subject = this.subject;
    this.lastCommand.object = this.object;
    this.lastCommand.inProgress = true

    if (execution.then) {
      execution.then ( r => {
        this.lastCommand.inProgress = false
        this.$emit('auto-save')
      } ) 
    } else {
      this.lastCommand.inProgress = false
      this.$emit('auto-save')
    }

    this.subject = null; 
    this.object = null;
   // this.verb = this.verbList[0];
  }