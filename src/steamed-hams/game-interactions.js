import { Interaction, doorFunction,takeFunction,pcSays } from "../modules/interaction-constructor";


var interactions =[
	new Interaction(['LOOK','GARAGE_W'],[],pcSays('I admire car owners. I aspire to be one after I\'ve reimbursed mother for the food I ate as a child.',2500)),
	new Interaction(['LOOK','ROAST_I'],[],pcSays('Yes, this should be a reasonable quantity of meat to serve Superintendent Chalmers.',2000)),
	new Interaction(['LOOK','ROAST_GLAZED_I'],[],pcSays('Glazed and ready for the oven!.',2000)),
	new Interaction(['LOOK','BUCKET_FOIL_I'],[],pcSays('This should suffice. I can hardly see the foil',2000)),
	new Interaction(['LOOK','BUCKET_SAND_I'],[],pcSays('Hmmm, this could serve as an ice bucket if it were empty and silver colored.',2000)),
	new Interaction(['LOOK','BUCKET_EMPTY_I'],[],pcSays('If only I could change it\'s color somehow.',2000)),
	new Interaction(['LOOK','FOIL_I'],[],pcSays('Shiny, metallic and used for wrapping things.',2000)),



	new Interaction(['USE','FOIL_I','BUCKET_SAND_I'],[],pcSays('I need to get rid of this sand first.',2000)),
	new Interaction(['USE','FOIL_I','BUCKET_FOIL_I'],[],pcSays('It\s already wrapped.',1500)),
	
	new Interaction(['USE','BUCKET_SAND_I','BUSH_W'],[],function(){
		this.sequences.pourSandInBush.apply(this,['BUSH_W']);
	}),

	new Interaction(['USE','BUCKET_SAND_I','BUSH_2_W'],[],function(){
		this.sequences.pourSandInBush.apply(this,['BUSH_2_W']);
	}),

	new Interaction(['USE','BUCKET_SAND_I','BUSH_3_W'],[],function(){
		this.sequences.pourSandInBush.apply(this,['BUSH_3_W']);
	}),

	new Interaction(['USE','FOIL_I','BUCKET_EMPTY_I'],[],function(){
		let pc = this.getThings('pc');
		this.getInventoryItem('BUCKET_FOIL_I');
		this.looseInventoryItem('BUCKET_EMPTY_I');

		pc.doAction('wrap_bucket')
		.then( (r) => {return pc.say('There!') } )
		.then( (r) => {return pc.say('It looks like a real ice bucket.') } )
	}),

	new Interaction(['USE','BUCKET_FOIL_I','TABLE_W'],[],function(){
		let pc = this.getThings('pc');
		this.looseInventoryItem('BUCKET_FOIL_I');
		this.setGameStatus('CUTSCENE');

		pc.goTo(this.getThings('TABLE_W').walkToPoint)
		.then( (r) => {return pc.say('Here we are') } )
		.then( (r) => {
			this.allRoomItemData.DINING_R.ICE_BUCKET_W.removed = false;
			this.setGameStatus('LIVE');
		 } )

	}),


	new Interaction(['USE','BOURBON_I','ROAST_I'],[],function(){
		let pc = this.getThings('pc');
		this.getInventoryItem('ROAST_GLAZED_I');
		this.looseInventoryItem('ROAST_I');

		pc.doAction('glaze_roast')
		.then( (r) => {return pc.say('Well glazed, Seymour, well glazed') } )

	}),

	new Interaction(['OPEN','FRONT_DOOR_W'],[
		function(){return this.getThings('FRONT_DOOR_W').item.status.cycle == 'closed'},
	],function(){
		this.getThings('pc').say("ok")
		.then ( (r)=> {
			return this.getThings('pc').goTo(this.getThings('FRONT_DOOR_W').walkToPoint)
		} )
		.then( (r)=> { if (r.finished) {
			return this.getThings('FRONT_DOOR_W').setStatus('opening','open')
		} });
	}),
	
	new Interaction(['OPEN','FRONT_DOOR_W'],[],pcSays("It's not closed!")),

	new Interaction(['WALK','FRONT_DOOR_W'],
	[function(){return this.getThings('FRONT_DOOR_W').item.status.cycle == 'open'}],
	doorFunction('FRONT_DOOR_W',['DINING_R',50,50])
	),

	new Interaction(['SHUT','FRONT_DOOR_W'],
	[function(){return this.getThings('FRONT_DOOR_W').item.status.cycle == 'open'}],
	function(){

		this.getThings('pc').say("ok");
		this.getThings('pc').goTo(this.getThings('FRONT_DOOR_W').walkToPoint)
		.then( (r)=> { if (r.finished) {
			this.getThings('FRONT_DOOR_W').setStatus('closing','closed')
		} });
	
	}),
	
	new Interaction(['SHUT','FRONT_DOOR_W'],[],pcSays('It\'s already closed.')),


	new Interaction(['WALK','DINING_WAYOUT_W'],[],
	doorFunction('DINING_WAYOUT_W',['FRONT_R',146,27])),
	
	new Interaction(['OPEN','DINING_KITCHENDOOR_W'],[
		function(){return this.getThings('DINING_KITCHENDOOR_W').item.status.cycle == 'closed'},
	],function(){
		this.getThings('pc').goTo(this.getThings('DINING_KITCHENDOOR_W').walkToPoint)
		.then( (r)=> { if (r.finished) {
			return this.getThings('DINING_KITCHENDOOR_W').setStatus('opening','open')
		} });
	}),
	
	new Interaction(['OPEN','DINING_KITCHENDOOR_W'],
	[function(){return this.getThings('DINING_KITCHENDOOR_W').item.status.cycle == 'open'}],
	pcSays("It's not closed!")),

	new Interaction(['WALK','DINING_KITCHENDOOR_W'],
	[function(){return this.getThings('DINING_KITCHENDOOR_W').item.status.cycle == 'open'}],
	doorFunction('DINING_KITCHENDOOR_W',['KITCHEN_R',120,10])
	),

	new Interaction(['SHUT','DINING_KITCHENDOOR_W'],
	[function(){return this.getThings('DINING_KITCHENDOOR_W').item.status.cycle == 'open'}],
	function(){
		this.getThings('pc').goTo(this.getThings('DINING_KITCHENDOOR_W').walkToPoint)
		.then( (r)=> { if (r.finished) {
			this.getThings('DINING_KITCHENDOOR_W').setStatus('closing','closed')
		} });
	
	}),
	
	new Interaction(['SHUT','DINING_KITCHENDOOR_W'],[],pcSays('It\'s already closed.')),


	new Interaction(['WALK','KITCHEN_DININGDOOR_W'],
	[],
	doorFunction('KITCHEN_DININGDOOR_W',['DINING_R',300,50])
	),


	new Interaction(['OPEN','OVEN_W'],
	[function(){return this.getThings('OVEN_W').item.status.cycle == 'closed'}],
	function(){
		this.getThings('pc').goTo(this.getThings('OVEN_W').walkToPoint)
		.then( (r)=> {
			this.getThings('OVEN_W').setStatus('open');
		} )
	}),
	
	new Interaction(['SHUT','OVEN_W'],
	[function(){return this.getThings('OVEN_W').item.status.cycle == 'open'}],
	function(){
		this.getThings('pc').goTo(this.getThings('OVEN_W').walkToPoint)
		.then( (r)=> {
			this.getThings('OVEN_W').setStatus('closed');
		} )
	}),
	new Interaction(['USE','ROAST_I','OVEN_W'],[],
	pcSays('I need to glaze it first.')
	),
	new Interaction(['USE','ROAST_GLAZED_I','OVEN_W'],
	[function(){return this.getThings('OVEN_W').item.status.cycle == 'open'}],
	function(){
		this.getThings('pc').goTo(this.getThings('OVEN_W').walkToPoint)
		.then( (r)=> {
			this.getThings('OVEN_W').setStatus('open_ham_inside');
			this.looseInventoryItem('ROAST_GLAZED_I');
		} )
	}),
	new Interaction(['SHUT','OVEN_W'],
	[function(){return this.getThings('OVEN_W').item.status.cycle == 'open_ham_inside'}],
	function(){
		this.getThings('pc').goTo(this.getThings('OVEN_W').walkToPoint)
		.then( (r)=> {
			this.getThings('OVEN_W').setStatus('closed_ham_inside');
		} )
		.then( (r)=> {
			this.getThings('pc').say('I\'ll just turn this on...');
		} )
	}),


	new Interaction(['SHUT','OVEN_W'],
	[function(){return this.getThings('OVEN_W').item.status.cycle.substring(0,6) == 'closed'}],
	pcSays('It\'s already closed.')),

	new Interaction(['OPEN','OVEN_W'],
	[function(){return this.getThings('OVEN_W').item.status.cycle.substring(0,4) == 'open'}],
	pcSays('It\'s already open.')),

	new Interaction(['OPEN','OVEN_W'],
	[function(){return this.getThings('OVEN_W').item.status.cycle == 'closed_ham_inside'}],
	pcSays('No, I\'d better leave it to get as cooked as possible.')),

	new Interaction(['TAKE','FOIL_W'],[],
	takeFunction('FOIL_W','FOIL_I')), 

	new Interaction(['OPEN','CUPBOARD_W'],
	[function(){return !this.gameVars.cupboardEmpty}],
	function(){
		let pc = this.getThings('pc');
		this.setGameStatus('CUTSCENE');

		pc.goTo(this.getThings('CUPBOARD_W').walkToPoint)
		.then( (r) => {return pc.say('Let\'s see...') } )
		.then( (r) => {
			this.getInventoryItem('BOURBON_I');
			return pc.say('... a bottle of bourbon?! What\'s that doing here?') 
		} )
		.then( (r) => {
			this.gameVars.cupboardEmpty = true;
			this.setGameStatus('LIVE');
		 } )
	}),

	new Interaction(['OPEN','CUPBOARD_W'],[],
	pcSays('There was nothing else in there.')),

	new Interaction(['TALK','CHALMERS_C'],[],
	function() {
		this.setGameStatus('CUTSCENE');
		let chalmers = this.getThings('CHALMERS_C');
		let skinner = this.getThings('pc');
		chalmers.say('Well Seymour, I made it.')
		.then( ()=> {return chalmers.say('dispite your directions.')} )
		.then( ()=> {return skinner.say('Superintendent Chalmers!')} )
		.then( ()=> {return skinner.say('Welcome!')} )
		.then( ()=> {
			this.setGameStatus('CONVERSATION','arrival');
		})
		

	
	}),

]

var defaultResponses = {
	"WALK" : function(command) {this.getThings('pc').goTo(this.getThings(command.subject.id).walkToPoint)},
	"LOOK" : function(command) {
		if (command.subject.id.endsWith('W')) {
			this.getThings('pc').say(`It looks like a normal ${command.subject.name} to me.`);
		} else {
		this.getThings('pc').say(`I don't see anything special about ${command.subject.name}.`);
		}
	},
	"OPEN" : function(command) {
		this.getThings('pc').say(`The ${command.subject.name} doesn't open.`);
	},
	"misc" : function(command) {this.getThings('pc').say(`I can't do that.`);} 
};


var interactionMatrix = Interaction.makeMatrix(interactions);
export { interactionMatrix, defaultResponses }