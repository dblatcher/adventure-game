
export default class InventoryItem  {

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
