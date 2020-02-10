
class Sprite {
	constructor (id, url, dims, config = {} ) {
		if (!dims) {dims = [1,1]}
		const frameSize = config.frameSize || [1,1]
		const offset = config.offset || [0,0]

		this.id  = id;
		this.url = url
		this.col = dims[0];
		this.row = dims[1];
		this.relativeWidth  = frameSize[0] || 1;
		this.relativeHeight = frameSize[1] || 1;	
		this.xOffset = offset[0] || 0;
		this.yOffset = offset[1] || 0;
	}


}


function Room (id, name, url, width,height, contents, config={}) {
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

	this.bgm = config.bgm || null
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

function Verb (description, id, preposition, config={}) {
	this.description = description;
	this.id = id;
	this.preposition = preposition || '[NO PREPOSITION]';
	this.transitive = !!(preposition);

	this.icon = config.icon
}
Verb.prototype.isVerb = true;

class Sound {

	constructor(description, id, path) {
		this.description =description
		this.id = id
		this.path = path
	}

}

export {
	Sprite,
	Sound, 
	Room,
	EffectZone,
	Foreground,
	Verb,
}