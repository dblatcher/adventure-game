
import resetObject from "./resetObject"

class WorldItem {
    constructor (id, name, coords ,width,height,initialCycle, model,config={}) {
        this.id = id.toUpperCase() + "_W";
        this.name = name;
        this.x = coords[0] || 0;
        this.y = coords[1] || 0;
        this.scale = config.scale || 1;
        this.unclickable = config.unclickable || false;
        this.noZoneScaling = config.noZoneScaling || false;
        this.zAdjust = config.zAdjust || 0;
        this.removed = config.removed || false;
        this.recommendedVerb = config.recommendedVerb || null;
        
        this.roomId = 'undefined';

        Object.defineProperty(this,'fullId',{
            get() {return this.roomId ? this.roomId+'_'+this.id : undefined}
        })

        this.walkOffsetX =  coords[2] || 0;
        this.walkOffsetY =  coords[3] || 0;
        
        this.baseWidth = width || 20;
        this.baseHeight = height || 20;
        this.status = initialCycle||'neutral';
        this.queue = [];
        
        if (model) {
            Object.assign(this, model);
        } else {
            this.spritesUsed = [];
            this.cycles = {neutral:[]};
        }
        
        this.initialState = Object.freeze(Object.assign({model:model},this));
    }

    get isDataObject() {return true}
    get dataType() {return 'WorldItem'}

    setRemoval (input) {
        this.removed =!!input
        return this
    }

    setStatus (input) {
        if (this.cycles[input]) {this.status = input}
        return this;
    }

    returnState () {
        return {
            name: this.name,
            x:this.x,
            y:this.y,
            scale: this.scale,
            removed: this.removed,
            status: this.status,
        }
    }

    static Model( input ) {
        var cycles = input;
        this.cycles = cycles;
        var cycleNames = Object.keys(cycles);
        var spritesUsed = [];
        var cycle;
    
        for (var i=0; i<cycleNames.length; i++) {
            cycle = cycles[cycleNames[i]];	
            for (var j=0; j<cycle.length; j++) {
                if (!spritesUsed.includes(cycle[j][0])) {
                    spritesUsed.push(cycle[j][0])
                }
            } 
        }
        this.spritesUsed = spritesUsed;
    }
}

WorldItem.prototype.reset = resetObject;





export default WorldItem