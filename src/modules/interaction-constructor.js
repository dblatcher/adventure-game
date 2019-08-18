
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


export { Interaction }