export default function(thing) {
    if (this.gameStatus !== 'LIVE') {return false}


    if (this.verb && this.verb.usesSelectedItem && !this.subject) {
      if (thing.id.endsWith('_I')) {
        this.selectedInventoryItem = thing
        this.subject = thing
        return true
      } 
      else {return false}
    }

    //deselect items by clicking again
    if (thing.id.endsWith('_I') && thing === this.subject) {
      this.subject = null;
      this.selectedInventoryItem = null
      return false;
    }

    //can't walk to inventory!
    if (this.verb.id === 'WALK' && thing.id.endsWith('_I')) {return false}

    if (!this.subject) {
      this.subject = thing;
    } else if (!this.haveCompleteCommand && thing !== this.subject) {
      this.object = thing;
    }

    if (this.haveCompleteCommand) {this.handleCommand();}		
  }