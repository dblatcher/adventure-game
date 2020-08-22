
import resetObject from "./resetObject"
import {Model} from "./models.js"

class WorldItem {
    constructor (id, coords ,width,height, model=null, config={}) {
        this.id = id.toUpperCase() + "_W";
        this.x = coords[0] || 0;
        this.y = coords[1] || 0;
        this.walkOffsetX =  coords[2] || 0;
        this.walkOffsetY =  coords[3] || 0;
        this.baseWidth = width || 20;
        this.baseHeight = height || 20;

        this.name = config.name || id;
        this.scale = config.scale || 1;
        this.unclickable = config.unclickable || false;
        this.noZoneScaling = config.noZoneScaling || false;
        this.zAdjust = config.zAdjust || 0;
        this.removed = config.removed || false;
        this.recommendedVerb = config.recommendedVerb || null;
        this.status = config.initialCycle || 'neutral';

        this.roomId = 'undefined';


        this.queue = [];

        if (model) {
            this.model = model
        } else {
            this.model = new Model({},{})
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
        if (this.model.cycles[input]) {this.status = input}
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

}

WorldItem.prototype.reset = resetObject;
WorldItem.Model = Model




export default WorldItem