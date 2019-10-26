export default function(thing) {
    if (this.gameStatus !== 'LIVE') {return false}

    if (thing.id.endsWith('_I') && thing === this.subject) {
      this.subject = null;
      return false;
    }

    if (this.verb.id === 'WALK' && thing.id.endsWith('_I')) {return false}

    if (!this.subject) {
      this.subject = thing;
      if (this.verb.transitive) {
        if (this.interactionMatrix[this.verb.id] && this.interactionMatrix[this.verb.id][this.subject.id]  && this.interactionMatrix[this.verb.id][this.subject.id].intransitive ) {  // test for non transitive use of transitive verb, like 'use lever'
          this.needObject = false;
        } else {
          this.needObject = true;
        }		
      } else {
        this.needObject = false;
      }
    } else {
      if (!this.haveCompleteCommand && thing !== this.subject) {
        this.object = thing;
      }
    }

    if (this.haveCompleteCommand) {this.executeCommand();}		
  }