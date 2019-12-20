
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
Verb.prototype.isVerb = true;



export {
	Sprite, 
	Room,
	EffectZone,
	Foreground,
	Verb,
}