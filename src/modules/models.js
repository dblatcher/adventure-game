
class Model {
    constructor(cycles,config={}) {
        this.cycles = cycles;

        var cycleNames = Object.keys(cycles);
        var cycle, cycleDirections, validDirections = [], spritesUsed=[];
        if (config.defaultDirection) {validDirections.push(config.defaultDirection)}
        
        for (var i=0; i<cycleNames.length; i++) {
            cycle = cycles[cycleNames[i]];	
            if (Array.isArray(cycle)) {
                for (var j=0; j<cycle.length; j++) {
                    if (!spritesUsed.includes(cycle[j][0])) {
                        spritesUsed.push(cycle[j][0])
                    }
                }
            } else {
                cycleDirections = Object.keys(cycle);
                cycleDirections.forEach( (direction) => {
                    if (!validDirections.includes(direction)) {
                        validDirections.push(direction);
                    }
                    for (var j=0; j<cycle[direction].length; j++) {
                        if (!spritesUsed.includes(cycle[direction][j][0])) {
                            spritesUsed.push(cycle[direction][j][0]);
                        }
                    }
                });
            }
        }
        
        this.spritesUsed = spritesUsed;
        this.validDirections = validDirections;

    }
}

class CharacterModel extends Model {

    constructor(cycles,config = {}) {
        super (cycles,config)
        this.speechBubbleDown = config.speechBubbleDown || .2
        this.speechBubbleIn = config.speechBubbleIn || .25
        
    }

}

export {Model, CharacterModel}