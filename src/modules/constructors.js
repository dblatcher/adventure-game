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

class Room {
	constructor (id, url, width,height, config={}) {
		this.id = id.toUpperCase().replace(/[^\w]/g, "_")+"_R";
		this.url= url;
		this.width = width;
		this.height = height;
		this.name = config.name || id;
		this.screenScrollX = config.screenScrollX || 1
		this.bgm = config.bgm || null
		this.worldItems = config.worldItems || [];
		this.worldItems.forEach(item => {item.roomId = this.id});
		this.obstacles = config.obstacles || [];
		this.effectZones = config.effectZones || [];
		this.foregrounds = config.foregrounds || [];
		this.filter = Room.filterDefaults
		if (config.filter) {
			for (let key in this.filter) {
				if (typeof config.filter[key]  === 'number') { 
					this.filter[key] = config.filter[key]
				}
			}
		}
	}

	static get filterDefaults() {
		return { blur: 0, brightness:100, contrast: 100, grayscale: 0, hueRotate: 0, invert: 0, opacity: 100, saturate: 100,sepia:0}
	}
	static get filterProperties() {
		return [
			{name: 'blur', unit: "px"},
			{name: 'brightness', unit: "%"},
			{name: 'contrast', unit: "%"},
			{name: 'grayscale', unit: "%"},
			{name: 'hue-rotate', unit: "deg"},
			{name: 'invert', unit: "%"},
			{name: 'opacity', unit: "%"},
			{name: 'saturate', unit: "%"},
			{name: 'sepia', unit: "%"},
		]
	}

	get filterString () {
		const {filter} = this;
		const validFilterProperties = Room.filterProperties

		let output = ""
		Object.keys(filter).forEach (key => {
			let keyIndex = validFilterProperties.map(item => item.name).indexOf(key)
			if (key === 'hueRotate') {keyIndex = 4}
			if (keyIndex === -1) {return}
			if (filter[key] === Room.filterDefaults[key]) {return}
			output += `${validFilterProperties[keyIndex].name}(${filter[key]}${validFilterProperties[keyIndex].unit}) `
		})
		return output
	}

	returnState () {
		let state = {name:this.name, worldItems:[]};
		this.worldItems.forEach ( (item) => {
			state.worldItems.push ( item.returnState() );
		});
		return state;
	}
}

class EffectZone {
	constructor (zone,effect) {
		this.zone = zone;
		this.effect = effect;
	}
}

class Foreground { 
	constructor (url, coords, size, style) {
	this.url= url;
	this.x=coords[0];
	this.y=coords[1];
	this.width=size[0];
	this.height=size[1];
	this.style = style || {};
	}

	getStyleObject(measure) {
		return Object.assign(this.style, {
			backgroundSize: '100% 100%',
			position:'absolute',
			width:  (this.width  * measure.scale) + measure.unit,
			height: (this.height * measure.scale) + measure.unit,
			left: (this.x * measure.scale) + measure.unit,
			bottom: (this.y * measure.scale) + measure.unit,
			zIndex: this.zIndex || 100,
			backgroundImage: `url(${this.url})`,
			pointerEvents: 'none',
		})
	}
}

class Verb {
	constructor (id, config={}) {
		this.id = id;
		this.description = config.description || id.toLowerCase();
		this.preposition = config.preposition || '[NO PREPOSITION]';
		this.transitive = !!(config.preposition);

		this.icon = config.icon
		this.showOnInventoryBox = config.showOnInventoryBox
		this.usesSelectedItem = config.usesSelectedItem
	}
	get isVerb() {return true}
}

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