export default function(thing) {
    if (this.gameStatus !== 'LIVE') {return false}
  
    let thingType;
    switch (thing.id.substring( thing.id.length-2)) {
      case "_I" : thingType = "InventoryItem"; break;
      case "_W" : thingType = "WorldItem"; break;
      case "_C" : thingType = "Character"; break;
    }

    this.subject = thing
    this.object = null
    this.verb = null

    if (thing.recommendedVerb) {
      if (typeof thing.recommendedVerb === 'string' ) this.verb = this.verbsAsObject[thing.recommendedVerb] || null
    } else if (this.config.defaultVerb) {
      if (typeof this.config.defaultVerb === 'string' ) this.verb = this.verbsAsObject[this.config.defaultVerb] || null
      if (typeof this.config.defaultVerb === 'object' &&  this.config.defaultVerb[thingType]) this.verb = this.verbsAsObject[this.config.defaultVerb[thingType]] || null
    }



    if (this.haveCompleteCommand) {this.handleCommand();}

	
  }