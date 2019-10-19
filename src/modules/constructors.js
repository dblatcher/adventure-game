
function resetObject() {
	var keyList = Object.keys(this.initialState);
	var namedProps = false;
	if (arguments.length) { namedProps = [...arguments] }
	keyList.forEach( (propName) => {
		if (namedProps && !namedProps.includes(propName)) {return}
		this[propName] = this.initialState[propName];
	});
	return this;
}


function Sprite (id, url, dims, frameSize ) {
	if (!dims) {dims = [1,1]}
	if (!frameSize) {frameSize = [1,1]}

	this.id = id;
	this.url=url
	this.col = dims[0];
	this.row = dims[1];
	this.relativeWidth  = frameSize[0];
	this.relativeHeight = frameSize[1];	
}

function Character(id,name,coords,speechColor,model,config={}) {
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

	this.initialState = Object.freeze(Object.assign({},this));
}
Character.prototype.reset = resetObject;
Character.prototype.returnState = function () {
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
	this.status = {cycle: initialCycle||'neutral'};
	this.queue = [];
	
	if (model) {
		Object.assign(this, model);
	} else {
		this.spritesUsed = [];
		this.cycles = {neutral:[]};
	}
	
	this.initialState = Object.freeze(Object.assign({model:model},this));
}
WorldItem.prototype.reset = resetObject;
WorldItem.prototype.setRemoval = function (input) {
	this.removed =!!input
	return this
}
WorldItem.prototype.setStatus = function (input) {
	if (this.cycles[input]) {this.status.cycle = input}
	return this;
}
WorldItem.prototype.returnState = function() {
	return {
		name: this.name,
		x:this.x,
		y:this.y,
		scale: this.scale,
		removed: this.removed,
		status: {cycle: this.status.cycle},
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

function InventoryItem (id, name, url, startWith=false, config={}) {
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
	
	this.have=startWith;
	this.quantified = typeof config.quantity === 'number' ? true  : false;
	if (this.quantified) {
		this.quantity = config.quantity;
		this.pluralName = config.pluralName || name;
	}
}
InventoryItem.prototype.returnState = function(){
	return {
		name : this.name,
		have: this.have,
		quantity:this.quantity,
	}
}

function CharacterModel (baseWidth,baseHeight, cycles,defaultDirection=false) {
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

export {Sprite,
	 Character,
	  WorldItem,
	   Room, EffectZone, Foreground, Verb, InventoryItem, CharacterModel, WorldItemModel,
	    }