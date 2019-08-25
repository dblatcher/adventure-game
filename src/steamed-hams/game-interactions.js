import { Interaction, doorFunction,pcSays } from "../modules/interaction-constructor";


var interactions =[
	new Interaction(['LOOK','GARAGE_W'],[],pcSays('I admire car owners. I aspire to be one after I\'ve reimbursed mother for the food I ate as a child.',2500)),

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