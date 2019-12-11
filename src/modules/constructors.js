
import resetObject from "./resetObject"

function Sprite (id, url, dims, frameSize ) {
	if (!dims) {dims = [1,1]}
	if (!frameSize) {frameSize = [1,1,0,0]}

	this.id = id;
	this.url=url
	this.col = dims[0];
	this.row = dims[1];
	this.relativeWidth  = frameSize[0];
	this.relativeHeight = frameSize[1];	
	this.xOffset = frameSize[2] || 0;
	this.yOffset = frameSize[3] || 0;
}

function WorldItem (id, name, coords ,width,height,initialCycle, model,config={}) {
	
	this.id = id.toUpperCase() + "_W";
	this.name = name;
	this.x = coords[0] || 0;
	this.y = coords[1] || 0;
	this.scale = config.scale || 1;
	this.unclickable = config.unclickable || false;
	this.noZoneScaling = config.noZoneScaling || false;
	this.zAdjust = config.zAdjust || 0;
	this.removed = config.removed || false;
	
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
WorldItem.prototype.isDataObject = true;
WorldItem.prototype.reset = resetObject;
WorldItem.prototype.setRemoval = function (input) {
	this.removed =!!input
	return this
}
WorldItem.prototype.setStatus = function (input) {
	if (this.cycles[input]) {this.status = input}
	return this;
}
WorldItem.prototype.returnState = function() {
	return {
		name: this.name,
		x:this.x,
		y:this.y,
		scale: this.scale,
		removed: this.removed,
		status: this.status,
	}
};


function Room (id, name, url, width,height, contents) {
	this.id = this.id = id.toUpperCase()+"_R";
	this.name = name;
	this.url= url;
	this.width = width;
	this.height = height;
	this.worldItems = contents.worldItems || [];
	this.obstacles = contents.obstacles || [];
	this.effectZones = contents.effectZones || [];
	this.foregrounds = contents.foregrounds || [];

	this.worldItems.forEach(item => {item.roomId = this.id});
}
Room.prototype.returnState = function () {
	let state = {name:this.name, worldItems:[]};
	this.worldItems.forEach ( (item) => {
		state.worldItems.push ( item.returnState() );
	});

	return state;
}


function EffectZone (zone,effect) {
	this.zone = zone,
	this.effect = effect;
}

function Foreground (url, coords, size, style) {
	this.url= url;
	this.x=coords[0];
	this.y=coords[1];
	this.width=size[0];
	this.height=size[1];
	this.style = style || {};
}

function Verb (description, id, preposition) {
	this.description = description;
	this.id = id;
	this.preposition = preposition || '[NO PREPOSITION]';
	this.transitive = !!(preposition);
}

class InventoryItem  {

	constructor(id, name, url, config={}) {
		this.id = id.toUpperCase() + "_I";
		this.name=name;
	
		if (typeof url === 'object') {
			this.picture = {};
			Object.keys(url).forEach( (key) => {
				this.picture[key] = url[key];
			});
		} else {
			this.picture = {
				1: url
			}
		}
		
		this.background = config.bg;
	
		this.have=!!config.startWith;
		this.quantified = typeof config.quantity === 'number' ? true  : false;
		if (this.quantified) {
			this.quantity = config.quantity;
			this.pluralName = config.pluralName || name;
		}
	}

	returnState() {
		return{
			name : this.name,
			have: this.have,
			quantity:this.quantity,
		}
	}

	add(target, options = {}) {
		let quantity = options.quantity;
		if (!quantity) {quantity = 1}

		if (this.quantified) {
		  if (this.have) {
			this.quantity += quantity;
		  } else {
			this.quantity = quantity;
			this.have = true;
		  }
		  return this.quantity;
		}
	
		this.have = true;
		return true;
	}

	loose(target, options = {}) {
		let quantity = options.quantity;
		if (!quantity) {quantity = 1}

		if (this.have === false) {return false};
	
		if (!this.quantified) {
			this.have = false;
			return true;
		};
	
		if (quantity === 'all') {
			this.quantity = 0;
			this.have = false;
		};
	
		this.quantity -= quantity;
		if (this.quantity <= 0) {this.have = false};
		return this.quantity;
	}
}


 function WorldItemModel ( input ) {
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

export {
	Sprite, 
	WorldItem,
	Room,
	EffectZone,
	Foreground,
	Verb,
	InventoryItem,
	WorldItemModel,
}