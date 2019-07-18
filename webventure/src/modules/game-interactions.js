//interamatrix depens on the verbList array - consider this when modularising 
// or change so it doens't use it - can create the first level based on the Interactions' verbs

import { verbList } from "./game-data";

function Interaction (command,conditions,response) {
	this.command = {
		verb: command[0],
		subject: command[1],
		object: command[2] || false
	}
	this.conditions = conditions;
	
	this.response = response;
}
var interactions =[
	new Interaction(['LOOK','WINDOW_W'],[],function(){
		this.getThings('pc').say("I like this window")
	}),
	

	new Interaction(['OPEN','DOOR_W'],[
		function(){return this.getThings('DOOR_W').item.status.cycle == 'closed'},
	],function(){
		this.getThings('pc').say("ok");
		this.getThings('pc').goTo(this.getThings('DOOR_W').walkToPoint)
		.then( (r)=> { if (r.finished) {
			this.getThings('DOOR_W').setStatus('opening','open')
		} });
	}),
	
	new Interaction(['OPEN','DOOR_W'],[],function(){
		this.getThings('pc').say("It's not closed!");
	}),

	new Interaction(['WALK','DOOR_W'],
	[function(){return this.getThings('DOOR_W').item.status.cycle == 'open'}],
	function(){
		
		this.getThings('pc').goTo(this.getThings('DOOR_W').walkToPoint)
		.then( (feedback) => {
			if (feedback.finished) {this.changeRoom(0);}
		} );
		
	}),

	new Interaction(['SHUT','DOOR_W'],
	[function(){return this.getThings('DOOR_W').item.status.cycle == 'open'}],
	function(){

		this.getThings('pc').say("ok");
		this.getThings('pc').goTo(this.getThings('DOOR_W').walkToPoint)
		.then( (r)=> { if (r.finished) {
			this.getThings('DOOR_W').setStatus('closing','closed')
		} });
	
	}),
	
	new Interaction(['SHUT','DOOR_W'],[],function(){
		this.getThings('pc').say("It's already closed.");
	}),
	
	new Interaction(['TAKE','BUCKET_W'],[],function(){
		
		this.gameStatus = 'CUT'
		this.inventoryItems.filter(function(a){return a.id=='BUCKET_I'})[0].have = true;
		this.removeThing('BUCKET_W');
		
		var billy = this.getThings('BILLY_C');
		
		if (billy) {	
			billy.say('Hey, that\'s my bucket!')
			.then((r) => { return billy.say('I am not happy.'); })
			.then((r) => { return billy.goTo({x:100,y:10}); })
			.then((r) => { this.gameStatus = 'LIVE'; });	
		} else {this.gameStatus = 'LIVE';}
	}),
	
	new Interaction (['WALK','HOUSE_W'],[],function(){
		this.getThings('pc').goTo(this.getThings('HOUSE_W').walkToPoint)
		.then( (feedback)=> { if (feedback.finished) {this.changeRoom(1);} });
	}),
	
	new Interaction(['USE','SHOE_I'],[],function(){
		this.getThings('pc').say("It doesn't fit me");
	}),
	
	new Interaction(['USE','BUCKET_I','FIRE_W'],
	[function(){return this.getThings('FIRE_W').item.status.cycle == 'burning'}],
	function() {
		this.gameStatus = 'CUT'
		
		var fire = this.getThings('FIRE_W');
		var billy = this.getThings('BILLY_C');
		var pc = this.getThings('pc');
		var theApp = this;
		
		pc.say ("put out fire?")
		.then ( (r) => {return pc.say("okay")})
		.then ( (r) => {return pc.goTo(fire.walkToPoint)})
		.then ( (r) => {return fire.setStatus('extinguishing','out' )})
		.then ( (r) => {return billy.say('hey!')})	
		.then ( (r) => {return billy.say("That was my fire!")} )			
		.then ( (r) => {		
			fire.name = 'sticks';
			theApp.gameStatus = 'LIVE'		
		});
		
	}),
	
	new Interaction(['USE','BUCKET_I','FIRE_W'],[],
	function() {
		this.getThings('pc').say("It's out already.");
	}),
	
	new Interaction(['TALK','LUIGI_C'],[],
	function() {
		this.gameStatus = "CONVERSATION";
		this.interlocutor = 'LUIGI_C';
		this.conversation = this.conversations.withLuigi;
	}),
]


var interactionMatrix = {};
verbList.forEach( verb => { interactionMatrix[verb.id]= {} }  );

interactions.forEach (interaction => {
	
	if (!interactionMatrix[interaction.command.verb][interaction.command.subject]) {
		interactionMatrix[interaction.command.verb][interaction.command.subject] = {}
	}
	
	var thirdParam = interaction.command.object || 'intransitive'; 

	if (!interactionMatrix[interaction.command.verb][interaction.command.subject][thirdParam]) {
		interactionMatrix[interaction.command.verb][interaction.command.subject][thirdParam] = []
	}
	
	var rightPlace = interactionMatrix[interaction.command.verb][interaction.command.subject][thirdParam];
	
	rightPlace.push ( {conditions:interaction.conditions, response: interaction.response} )
	
});

export { interactionMatrix }