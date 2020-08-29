
export default class InventoryItem  {

	constructor(id, url, config={}) {
		this.id = id.toUpperCase().replace(/[^\w]/g, "_") + "_I";
		this.name= config.name || id;
	
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
		
		this.recommendedVerb = config.recommendedVerb || null;
		this.background = config.background;
	
		this.have=!!config.startWith;
		this.quantified = typeof config.quantity === 'number' ? true  : false;
		if (this.quantified) {
			this.quantity = config.quantity;
			this.pluralName = config.pluralName || name;
		}
	}

	get dataType() {return 'InventoryItem'}

	get rightPicture() {
		
		if(!this.quantified) {return this.picture[1]}

		let numberToUse = this.quantity;
		let keyList = Object.keys(this.picture).map(item => Number(item) );

		if (!keyList.includes(numberToUse)) {
			for (let index = keyList.length; index > 0; index--) {
				if (numberToUse > keyList[index] ) {
					numberToUse = keyList[index];
					break;
				}
			}
		}

		return this.picture[numberToUse];
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

		if (this.have === false) {return false}
	
		if (!this.quantified) {
			this.have = false;
			return true;
		}
	
		if (quantity === 'all') {
			this.quantity = 0;
			this.have = false;
		}
	
		this.quantity -= quantity;
		if (this.quantity <= 0) {this.have = false}
		return this.quantity;
	}
}
