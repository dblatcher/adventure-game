import { Interaction } from "../modules/interaction-constructor";

function doorFunction (doorId, destination) {	
	return function () {
		this.getThings('pc').goTo(this.getThings(doorId).walkToPoint)
		.then( (feedback) => {
			if (feedback.finished) {this.changeRoom(destination[0],destination[1],destination[2],{});}
		} );
	}
}
function pcSays(text) {
	return function() { this.getThings('pc').say(text);}	
}

var interactions =[
	new Interaction(['LOOK','WINDOW_W'],[],pcSays('It\'s a nice window')),
	
	new Interaction(['OPEN','DOOR_W'],[
		function(){return this.getThings('DOOR_W').item.status.cycle == 'closed'},
	],function(){
		this.getThings('pc').say("ok")
		.then ( (r)=> {
			return this.getThings('pc').goTo(this.getThings('DOOR_W').walkToPoint)
		} )
		.then( (r)=> { if (r.finished) {
			return this.getThings('DOOR_W').setStatus('opening','open')
		} });
	}),
	
	new Interaction(['OPEN','DOOR_W'],[],pcSays("It's not closed!")),

	new Interaction(['WALK','DOOR_W'],
	[function(){return this.getThings('DOOR_W').item.status.cycle == 'open'}],
	doorFunction('DOOR_W',['SWAMP_R',375,10])
	),

	new Interaction(['SHUT','DOOR_W'],
	[function(){return this.getThings('DOOR_W').item.status.cycle == 'open'}],
	function(){

		this.getThings('pc').say("ok");
		this.getThings('pc').goTo(this.getThings('DOOR_W').walkToPoint)
		.then( (r)=> { if (r.finished) {
			this.getThings('DOOR_W').setStatus('closing','closed')
		} });
	
	}),
	
	new Interaction(['SHUT','DOOR_W'],[],pcSays('It\'s already closesd.')),
	
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
	
	new Interaction (['WALK','HOUSE_W'],[],
		doorFunction('HOUSE_W',['LIVING_ROOM_R',260,15])
	),
	
	new Interaction(['USE','SHOE_I'],[],pcSays("It doesn't fit me")),
	
	new Interaction(['USE','BUCKET_I','FIRE_W'],
	[function(){return this.getThings('FIRE_W').item.status.cycle == 'burning'}],
	function() {
		this.gameStatus = 'CUT'
		
		var fire = this.getThings('FIRE_W');
		var house = this.getThings('HOUSE_W');
		var billy = this.getThings('BILLY_C');
		var pc = this.getThings('pc');
		var theApp = this;
		
		pc.say ("put out fire?")
		.then ( (r) => {return pc.say("okay")})
		.then ( (r) => {return pc.goTo(fire.walkToPoint)})
		.then ( (r) => {return fire.setStatus('extinguishing','out' )})
		.then ( (r) => {return billy.say('hey!')})	
		.then ( (r) => {return billy.say("That was my fire!")} )			
		.then ( (r) => {return billy.goTo(house.walkToPoint)} )			
		.then ( (r) => {		
			billy.changeRoom(1,20,5);
			fire.name = 'sticks';
			theApp.gameStatus = 'LIVE'		
		});
		
	}),
	
	new Interaction(['USE','BUCKET_I','FIRE_W'],[],pcSays("It's out already.")),
	
	new Interaction(['TALK','LUIGI_C'],[],
	function() {
		this.gameStatus = "CONVERSATION";
		this.conversation = 'withLuigi';
	}),

	new Interaction(['LOOK',"NAIL_I"],[],
	function() {
		this.getThings('pc').say(`I have ${this.inventoryAsObject.NAIL_I.quantity} nails.`);
	}),
	
	new Interaction(['USE',"NAIL_I","WINDOW_W"],[],
	function() {
		this.gameVars.wantsHammer = true;
		this.getThings('pc').say(`I'll need a hammer!`);

	}),

	new Interaction(['WALK','GATE_W'],[],
	doorFunction('GATE_W',['SWAMP_R',100,10])
	),
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