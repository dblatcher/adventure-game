import { gameName } from '../gameName'
var gamePath = gameName; 
// can't use imported value in require statement.

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


function Sprite (id, fileName, dims, frameSize=[1,1] ) {
	this.id = id;
	this.url= require(`../${gamePath}/sprites/${fileName}`);
	this.col = dims[0];
	this.row = dims[1];
	this.relativeWidth  = frameSize[0];
	this.relativeHeight = frameSize[1];
	
}

function Character(id,name,coords,speechColor,model,scale=1) {
	this.id = id.toLowerCase() === 'pc' ? 'pc' : id.toUpperCase()+"_C";
	this.name = name;
	this.x = coords[0];
	this.y = coords[1];
	this.room = coords[2];
	this.speechColor= speechColor;
	Object.assign(this,model);
	this.scale = scale;

	this.saying = '';
	this.sayingQueue = [];
	this.actionQueue = [];
	this.destinationQueue = [];

	this.behaviour_action = 'wait',
	this.behaviour_actFrame = '0',
	this.behaviour_direction = this.validDirections[0],

	this.initialState = Object.freeze(Object.assign({},this));
}
Character.prototype.reset = resetObject;
Character.prototype.returnState = function () {
	return {
		name: this.name,
		x: this.x,
		y: this.y,
		room: this.room,
		behaviour_action: this.behaviour_action,
		behaviour_direction:this.behaviour_direction,
		behaviour_actFrame:this.behaviour_actFrame,
	}
}

function WorldItem (id, name, coords ,width,height,initialCycle, model,config={}) {
	this.id = id.toUpperCase() + "_W";
	this.name = name;
	this.x = coords[0] || 0;
	this.y = coords[1] || 0;
	this.scale = config.scale || 1;

	this.unclickable = config.unclickable || false;

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
WorldItem.prototype.returnState = function() {
	return new WorldItem (
		this.id.substring(0, this.id.length-2),
		this.name,
		[this.x, this.y, this.walkOffsetX, this.walkOffsetY],
		this.baseWidth,
		this.baseHeight,
		this.status.cycle,
		this.initialState.model,
		this.scale
	)
};

var recreateWorldItemFromState = function(plainObject) {
	return new WorldItem (
		plainObject.id.substring(0, plainObject.id.length-2),
		plainObject.name,
		[plainObject.x, plainObject.y, plainObject.walkOffsetX, plainObject.walkOffsetY],
		plainObject.baseWidth,
		plainObject.baseHeight,
		plainObject.status.cycle,
		plainObject.initialState.model,
		plainObject.scale
	);
}

function Room (id, name, fileName, width,height, contents) {
	this.id = this.id = id.toUpperCase()+"_R";
	this.name = name;
	this.url= require(`../${gamePath}/rooms/${fileName}`);
	this.width = width;
	this.height = height;
	this.worldItems = contents.worldItems || [];
	this.obstacles = contents.obstacles || [];
	this.effectZones = contents.effectZones || [];
	this.foregrounds = contents.foregrounds || [];
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

function Foreground (fileName, coords, size, style) {
	this.url= require(`../${gamePath}/rooms/${fileName}`);
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

function InventoryItem (id, name, fileName, startWith=false) {
	this.id = id.toUpperCase() + "_I";
	this.name=name;
	this.url= require(`../${gamePath}/items/${fileName}`);
	this.have=startWith;
}
InventoryItem.prototype.returnState = function(){
	return {
		name : this.name,
		have: this.have,
	}
}

function CharacterModel (baseWidth,baseHeight, cycles,defaultDirection=false) {
	this.baseWidth=baseWidth;
	this.baseHeight=baseHeight;
	this.cycles=cycles;
	
	var cycleNames = Object.keys(cycles);
	var cycle, cycleDirections, validDirections = [], spritesUsed=[];
	if (defaultDirection) {validDirections.push(defaultDirection)};
	
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
				};
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
window.WorldItemC = WorldItem;
export {Sprite,
	 Character,
	  WorldItem,
	   Room, EffectZone, Foreground, Verb, InventoryItem, CharacterModel,
	   recreateWorldItemFromState }