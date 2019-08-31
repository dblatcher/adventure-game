import { Interaction, doorFunction,pcSays } from "../modules/interaction-constructor";


var interactions =[
	new Interaction(['LOOK','GARAGE_W'],[],pcSays('I admire car owners. I aspire to be one after I\'ve reimbursed mother for the food I ate as a child.',2500)),
	new Interaction(['LOOK','ROAST_I'],[],pcSays('Yes, this should be a reasonable quantity of meat to serve Superintendent Chalmers.',2000)),
	new Interaction(['LOOK','BUCKET_FOIL_I'],[],pcSays('This should suffice. I can hardly see the foil',2000)),
	new Interaction(['LOOK','BUCKET_SAND_I'],[],pcSays('Hmmm, this could serve as an ice bucket if it were empty and silver colored.',2000)),
	new Interaction(['LOOK','BUCKET_EMPTY_I'],[],pcSays('If only I could change it\'s color somehow.',2000)),
	new Interaction(['LOOK','FOIL_I'],[],pcSays('Shiny, metallic and used for wrapping things.',2000)),

	new Interaction(['USE','FOIL_I','BUCKET_SAND_I'],[],pcSays('I need to get rid of this sand first.',2000)),
	new Interaction(['USE','FOIL_I','BUCKET_FOIL_I'],[],pcSays('It\s already wrapped.',1500)),
	
	new Interaction(['USE','BUCKET_SAND_I','BUSH_W'],[],function(){
		let pc = this.getThings('pc');
		this.getInventoryItem('BUCKET_EMPTY_I');
		this.looseInventoryItem('BUCKET_SAND_I');
		this.setGameStatus('CUTSCENE');
		let game=this;

		pc.goTo(this.getThings('BUSH_W').walkToPoint)
		.then( (r) => {return pc.doAction('pour_sand')})
		.then( (r) => {return pc.say('There!') } )
		.then( (r) => {return pc.say('I suppose its wrong to use fire-fighting equipment improperly...') } )
		.then( (r) => {return pc.say('But what are the chances of a fire in the next half hour?',{action:'ponder'}) } )
		.then( (r) => { game.setGameStatus('LIVE') })

	}),

	new Interaction(['USE','FOIL_I','BUCKET_EMPTY_I'],[],function(){
		let pc = this.getThings('pc');
		this.getInventoryItem('BUCKET_FOIL_I');
		this.looseInventoryItem('BUCKET_EMPTY_I');

		pc.doAction('pour_sand')
		.then( (r) => {return pc.say('There!') } )
		.then( (r) => {return pc.say('It looks like a real ice bucket.') } )

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
	
	new Interaction(['SHUT','FRONT_DOOR_W'],[],pcSays('It\'s already closesd.')),

	new Interaction(['TALK','CHALMERS_C'],[],
	function() {
		this.setGameStatus('CONVERSATION');
		this.conversation = 'hamburgers';
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