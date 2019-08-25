
function Interaction (command,conditions,response) {
	this.command = {
		verb: command[0],
		subject: command[1],
		object: command[2] || false
	}
	this.conditions = conditions;
	this.response = response;
}

Interaction.makeMatrix = function (interactions) {
	var interactionMatrix = {};

	interactions.forEach (interaction => {
		
		if (!interactionMatrix[interaction.command.verb]) {interactionMatrix[interaction.command.verb] = {}}
		
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
	return interactionMatrix;
}

function doorFunction (doorId, destination) {	
	return function () {
		this.getThings('pc').goTo(this.getThings(doorId).walkToPoint)
		.then( (feedback) => {
			if (feedback.finished) {this.changeRoom(destination[0],destination[1],destination[2],{});}
		} );
	}
}

function pcSays(text,time) {
	return function() { this.getThings('pc').say(text,{time:time});}	
}

export { Interaction, doorFunction, pcSays }