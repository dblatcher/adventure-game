//interamatrix depens on the verbList array - consider this when modularising 
// or change so it doens't use it - can create the first level based on the Interactions' verbs


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
		this.getThings('pc').promiseSay("I like this window")
	}),
	

	new Interaction(['OPEN','DOOR_W'],[
		function(){return this.getThings('DOOR_W').item.status.cycle == 'closed'},
	],function(){
		this.getThings('pc').promiseSay("ok");
		this.getThings('DOOR_W').setStatus('opening','open');
	}),
	
	new Interaction(['OPEN','DOOR_W'],[],function(){
		this.getThings('pc').promiseSay("It's not closed!");
	}),

	
	new Interaction(['WALK','DOOR_W'],
	[function(){return this.getThings('DOOR_W').item.status.cycle == 'open'}],
	function(){
		var ref = Number(new Date);
		this.getThings('pc').goTo(this.getThings('DOOR_W').walkToPoint,{ref:ref})
		
		this.$once('mile-stone:'+ref, function(){
			this.changeRoom(0);			
		})
	}),

	new Interaction(['SHUT','DOOR_W'],
	[function(){return this.getThings('DOOR_W').item.status.cycle == 'open'}],
	function(){
		this.getThings('pc').promiseSay("ok");
		this.getThings('DOOR_W').setStatus('closing','closed');
	}),
	
	new Interaction(['SHUT','DOOR_W'],[],function(){
		this.getThings('pc').promiseSay("It's already closed.");
	}),
	
	new Interaction(['TAKE','BUCKET_W'],[],function(){
		var ref1 = 'one_'+Number(new Date);
		
		this.gameStatus = 'CUT'
		this.inventoryItems.filter(function(a){return a.id=='BUCKET_I'})[0].have = true;
		this.removeThing('BUCKET_W');
		
		var billy = this.getThings('BILLY_C');
		
		if (billy) {	
			billy.promiseSay('Hey, that\'s my bucket!')
			.then ( 
				billy.promiseSay('I am not happy.')
			)
			.then( (r) =>{
				billy.goTo({x:100,y:10},{ref:ref1});
			} )
		
			this.$once('mile-stone:'+ref1,function(){
				this.gameStatus = 'LIVE';
			})		
		} else {this.gameStatus = 'LIVE';}
	}),
	
	new Interaction (['WALK','HOUSE_W'],[],function(){
		var ref = Number(new Date);
		this.getThings('pc').promiseGoTo(this.getThings('HOUSE_W').walkToPoint)
		.then( (feedback)=> {
			console.log(feedback.message);
			if (feedback.reached) {
				this.changeRoom(1);			
				
			};
		});
		
	}),
	
	new Interaction(['USE','SHOE_I'],[],function(){
		this.getThings('pc').promiseSay("It doesn't fit me");
	}),
	
	new Interaction(['USE','BUCKET_I','FIRE_W'],
	[function(){return this.getThings('FIRE_W').item.status.cycle == 'burning'}],
	function() {
		var ref2 = 'two_'+Number(new Date);
		var ref3 = 'three_'+Number(new Date);
		this.gameStatus = 'CUT'
		
		var fire = this.getThings('FIRE_W');
		var billy = this.getThings('BILLY_C');
		var pc = this.getThings('pc');
		var theApp = this;
		
		pc.promiseSay ("put out fire?")
		.then (pc.promiseSay("okay"))
		.then ( function() { 
			pc.goTo(fire.walkToPoint,{ref:ref2}) 
		});
				
		this.$once('mile-stone:'+ref2, function(){
			fire.setStatus('extinguishing',{cycle:'out', ref:ref3} );
		});
		this.$once('mile-stone:'+ref3, function(){
			billy.promiseSay('hey!')
			.then( billy.promiseSay ('That was my fire!'))
			.then (function() {
				
				fire.name = 'sticks';
				theApp.gameStatus = 'LIVE'
				
			});
			
		});

		
	}),
	
	new Interaction(['USE','BUCKET_I','FIRE_W'],[],
	function() {
		this.getThings('pc').promiseSay("It's out already.");
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
