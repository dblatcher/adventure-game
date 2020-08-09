function setInputsOptionsAfterCommand () {
  const {verbList, config} = this.$store.state.gameData

  if (this.selectedInventoryItem && !this.selectedInventoryItem.have) {
    this.selectedInventoryItem = null
  }

  if (config.resetVerbAfterEachCommand) {
    this.subject = null;
    this.object = null;
    this.verb = verbList[0];
  } else {
    this.object = null;

    if (this.verb.usesSelectedItem && !this.selectedInventoryItem) {
      this.verb = verbList[0]
      this.subject = null
    } 
    else if (this.verb.usesSelectedItem && this.selectedInventoryItem) {
    } 
    else {
      this.subject = null
    }
    
  }

}

export default function (command) {
    const {interactionMatrix, defaultResponses} = this.$store.state.gameData
    if (!command) {command = {verb: this.verb, subject: this.subject, object: this.object};}
    let failedCondition = false, condition, passed, response=null, execution=null;

    //find array of interactions  matching the command from the InteractionMatrix
    var thirdParam = command.object? command.object.id : 'intransitive';
    var matchingList = [];
    if (interactionMatrix[command.verb.id] && interactionMatrix[command.verb.id][command.subject.id] ) {
      matchingList = interactionMatrix[command.verb.id][command.subject.id][thirdParam] || [];
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
        this.$emit('interaction-start',command)
        break;
      }
    }

    // use a default response if no scripted response passed its conditions
    if (!response) {
      let defaultResponseFunction = defaultResponses[command.verb.id] 
      || defaultResponses["misc"] 
      || function(){ return []}
      response = defaultResponseFunction(command)
      this.$emit('default-response-start',command)
    }


    // execute the response
    if (typeof response ===  'function') {
      execution = response.apply(this,[]);
    } else if ( Array.isArray(response)) {
      execution= this.runSequence(response) 
    } else if (typeof response === 'string' && this.gameData.sequences[response]) {
      execution =  this.runSequence( this.gameData.sequences[response] )
    } else {
      this.$store.commit('debugMessage', `Bad response, neither function, array, nor name of sequence: ${response && response.toString ? response.toString() : response}`)
    }

    this.lastCommand.verb = this.verb;
    this.lastCommand.subject = this.subject;
    this.lastCommand.object = this.object;
    this.lastCommand.inProgress = true

    if (execution && execution.then) {
      execution.then ( r => {
        this.lastCommand.inProgress = false
        setInputsOptionsAfterCommand.apply(this,[])
        this.$emit('auto-save')
      } ) 
    } else {
      this.lastCommand.inProgress = false
      setInputsOptionsAfterCommand.apply(this,[])
      this.$emit('auto-save')
    }

  }