
import {  setDefaultWait, setDefaultWalk, setDefaultTalk } from "./cycleFunctions";
import resetObject from "./resetObject"

export default class Character {

    constructor (id,name,coords,speechColor,model,config={}) {
        this.id = id.toLowerCase() === 'pc' ? 'pc' : id.toUpperCase()+"_C";
        this.name = name;
        this.x = coords[0];
        this.y = coords[1];
        this.room = coords[2];
        this.speechColor= speechColor;
        Object.assign(this,model);

        this.scale = config.scale || 1;
        this.zAdjust = config.zAdjust || 0;

        this.saying = '';
        this.sayingCountDown = 0;
        this.sayingQueue = [];
        this.actionQueue = [];
        this.destinationQueue = [];

        this.waitCycle = config.waitCycle || 'wait';
        this.talkCycle = config.talkCycle || 'talk';
        this.walkCycle = config.walkCycle || 'walk';

        this.behaviour_action = config.waitCycle || 'wait';
        this.behaviour_actFrame = '0';
        this.behaviour_direction = this.validDirections[0];

        this.idleAnimations = config.idleAnimations || false;

        this.initialState = Object.freeze(Object.assign({},this));
    }

    get isDataObject(){return true}

    goTo (target, options={}, game) {
        if (typeof this.room !== 'number') {return false}    
        let destination = game.resolveDestination(target)
        console.log(target, destination);
        if (!destination) {return false}
        let obstaclesContainDestination = game.rooms[this.room].obstacles.map (obstacle=>{return obstacle.containsPoint(destination) })
        if (obstaclesContainDestination.includes(true)) {return false}
        this.x = destination.x;
        this.y = destination.y;
        return true;
    }

    goToRoom (target,options,game){
        game.teleportCharacter ([this].concat(target), options)
    }

    returnState () {
        return {
            name: this.name,
            x: this.x,
            y: this.y,
            room: this.room,
            waitCycle: this.waitCycle,
            walkCycle: this.walkCycle,
            talkCycle: this.talkCycle,
            behaviour_action: this.behaviour_action,
            behaviour_direction:this.behaviour_direction,
            behaviour_actFrame:this.behaviour_actFrame,
            saying: this.saying,
            sayingCountDown: this.sayingCountDown,
        }
    }
    
    static Model (baseWidth,baseHeight, cycles,defaultDirection=false, options={}) {
        this.baseWidth=baseWidth;
        this.baseHeight=baseHeight;
        this.cycles=cycles;
        
        var cycleNames = Object.keys(cycles);
        var cycle, cycleDirections, validDirections = [], spritesUsed=[];
        if (defaultDirection) {validDirections.push(defaultDirection)}
        
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
    
        this.speechBubbleDown = options.speechBubbleDown || .2
        this.speechBubbleIn = options.speechBubbleIn || .25
    
    }

}

Character.prototype.setDefaultTalk = setDefaultTalk;
Character.prototype.setDefaultWalk = setDefaultWalk;
Character.prototype.setDefaultWait = setDefaultWait;
Character.prototype.reset = resetObject;

