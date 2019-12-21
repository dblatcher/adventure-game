export default function(thing) {
    if (this.gameStatus !== 'LIVE') {return false}
    this.subject = thing
    this.object = null
    const verbBeforeClick = this.verb;
    this.verb = this.recommendedVerb
    if (this.haveCompleteCommand) {this.handleCommand()}

    if (!this.verb) { // if recommendedVerb fails, need to reset the command 
      console.warn(`failed to get recommended verb for for ${thing.id || thing.ident} or default verb for ${thing.dataType}. If these are set, check they are valid verb ids`)
      this.subject = null
      this.verb = verbBeforeClick;
    }
  }