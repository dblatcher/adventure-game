
class Model {
    constructor(cycles,config={}) {
        this.cycles = cycles;

        var cycleNames = Object.keys(cycles);
        var cycle, cycleDirections, validDirections = [], spritesUsed=[];
        this.defaultDirection = config.defaultDirection
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

        this.soundLoops = config.soundLoops || {}

    }

    correctOrder(order) {
        var directionNeeded = !Array.isArray(this.cycles[order.action]);
        if (directionNeeded && !this.cycles[order.action][order.direction] ) {
            console.warn (`Character model for  ${'this.char.name'} has no cycle for : ${order.action} ${order.direction}!`);
            let firstKey = Object.keys( this.char.cycles[order.action] )[0] ;
            order.direction = firstKey;
        }
    }

    getCycle(order) {
        const {cycles, defaultDirection} = this
        const {action, direction} = order
        if (Array.isArray( cycles[action])) {
            return cycles[action]
        } 
        else {
            if (cycles[action][direction]) {
                return cycles[action][direction]
            }
            else if (defaultDirection && cycles[action][defaultDirection]) {
                return cycles[action][defaultDirection]
            }
            else {
                return cycles[action][Object.keys(cycles[action])[0]]
            }
        }     
    }

    getCycleSoundLoop(cycleName) {
        return this.soundLoops[cycleName]
    }

    getFrame (order) {
        const cycle = this.getCycle(order)
        // prevent error from actFrame higher than number of frames 
        if (order.actFrame > cycle.length) {return cycle[0]}
        return cycle[order.actFrame]
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