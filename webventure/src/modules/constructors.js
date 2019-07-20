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


function Sprite (id, url, dims, frameSize=[1,1] ) {
	this.id = id;
	this.url = url;
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
	this.speechColor= speechColor;
	Object.assign(this,model);
	this.scale = scale;
	this.initialState = Object.freeze(Object.assign({},this));
}
Character.prototype.reset = resetObject;

function WorldItem (id, name, coords ,width,height,initialCycle, model,scale=1) {
	this.id = id.toUpperCase() + "_W";
	this.name = name;
	this.x = coords[0] || 0;
	this.y = coords[1] || 0;
	this.scale = scale || 1;
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
	
	this.initialState = Object.freeze(Object.assign({},this));
}
WorldItem.prototype.reset = resetObject;


function Room (id, name, backgroundUrl, width,height, contents) {
	this.id = this.id = id.toUpperCase()+"_R";
	this.name = name;
	this.url = backgroundUrl;
	this.width = width;
	this.height = height;
	this.characters = contents.characters || [];
	this.worldItems = contents.worldItems || [];
	this.obstacles = contents.obstacles || [];
	this.effectZones = contents.effectZones || [];
	this.foregrounds = contents.foregrounds || [];
}

function EffectZone (zone,effect) {
	this.zone = zone,
	this.effect = effect;
}

function Foreground (url, coords, size, style) {
	this.url=url;
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

function InventoryItem (id, name, url, startWith=false) {
	this.id = id.toUpperCase() + "_I";
	this.name=name;
	this.url='assets/items/'+url;
	this.have=startWith;
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

export {Sprite, Character, WorldItem, Room, EffectZone, Foreground, Verb, InventoryItem, CharacterModel }