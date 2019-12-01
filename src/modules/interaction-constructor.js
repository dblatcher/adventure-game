import { isArray } from "util";

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



function parseOrderString(oString, options) {
	function arrayParse (input) {
		let output = input.split(',')
		output = output.map( (item) => {
			return isNaN(item) ? item : Number(item);
		})
		return output;
	}
	
	function emptyObject () {
		return {};
	}

	const actionCodes = {
		CHARACTER: {
			say: 		{code: '::'},
			doAction: 	{code: '##'},
			goTo: 		{code: '>>', targetParser: arrayParse},
			turnTo: 	{code: '^^', targetParser: arrayParse},
			goToRoom: 	{code: '}}', targetParser: arrayParse},
		},
		INVENTORYITEM: {
			add: 		{code: '++'},
			loose:	 	{code: '--'},
		},
		GAME: {
			setGameStatus: 		{code: '[status]'},
			setGameVar: 		{code: '[var]', targetParser: emptyObject},
			changeRoom: 		{code: '[room]', targetParser: arrayParse },
			teleportCharacter: 	{code: '[teleport]', targetParser: arrayParse },
			getInventoryItem: 	{code: '[get]'},
			looseInventoryItem: {code: '[loose]'},
			runSequence:		{code: '[sequence]'},
			wait:				{code: '[wait]'},
		}
	}

	let actorType, actorId,action,target;

	Object.keys(actionCodes.GAME).forEach((key)=>{
		if (action) {return};
		let code = actionCodes.GAME[key].code
		if (oString.substring(0,code.length).toLowerCase() === code) {
			actorType = 'GAME';
			actorId = 'GAME';
			action = key;
			target = oString.substring(code.length);
		}
	})
	
	if (!actorType) {
		Object.keys(actionCodes.CHARACTER).forEach((key)=>{
			if (action) {return};
			let code = actionCodes.CHARACTER[key].code
			let codePos = oString.indexOf(code) 
			if (codePos !== -1) {
				actorType = 'CHARACTER';
				action = key;
				actorId = oString.substring(0, codePos)
				target = oString.substring(codePos + code.length);
			}
		})
	}

	if (!actorType) {
		Object.keys(actionCodes.INVENTORYITEM).forEach((key)=>{
			if (action) {return};
			let code = actionCodes.INVENTORYITEM[key].code
			let codePos = oString.indexOf(code) 
			if (codePos !== -1) {
				actorType = 'INVENTORYITEM';
				action = key;
				actorId = oString.substring(0, codePos)
				target = oString.substring(codePos + code.length);
			}
		})
	}

	
	if (target && actionCodes[actorType][action].targetParser) {
		target = actionCodes[actorType][action].targetParser(target)
	}

	return {
		actorId, action, target, options, oString
	} ;
}

function StandardOrder (actorIdOrOrderString, actionOrOptions, target, options={}) {
	if (arguments.length < 3 ) {
		Object.assign(this, parseOrderString(actorIdOrOrderString, actionOrOptions))
	} else {
		this.actorId = actorIdOrOrderString;
		this.action  = actionOrOptions;
		this.target  = target;
		this.options = options;
	}
}
StandardOrder.prototype.isStandardOrder = true;

function StandardCondition (actorId, property, operator, comparitor) {
	this.actorId = actorId;
	this.property = property;
	this.operator = operator;
	this.comparitor = comparitor;
}
StandardCondition.prototype.isStandardCondition = true;


class ConditionalOrder {
	constructor (conditions, orderIfTrue, orderIfFalse) {

		this.conditions = conditions.map( condition => {
			return new StandardCondition(...condition)
		})

		this.orderIfTrue = orderIfTrue ? 
		new StandardOrder(...orderIfTrue) : null;

		this.orderIfFalse = orderIfFalse ? 
		new StandardOrder(...orderIfFalse) : null;

	}

	get isConditionalOrder() {return true}
}


function doorFunction (doorId, destination) {	
	return function () {
		this.getThings('pc').goTo(this.getThings(doorId).walkToPoint,{wasManual:true})
		.then( (feedback) => {
			if (feedback.finished) {this.changeRoom(destination,{});}
		} );
	}
}
	
function takeFunction (worldItemId, inventoryItemId, worldItemStays=false) {	
	return function () {
		this.getThings('pc').goTo(this.getThings(worldItemId).walkToPoint,{wasManual:true})
		.then( (feedback) => {
			if (feedback.finished) {
				this.getInventoryItem(inventoryItemId);
				if (!worldItemStays) {this.getThings(worldItemId).item.removed = true}
			}
		} );
	}
}


export { Interaction, StandardOrder, StandardCondition, ConditionalOrder, doorFunction, takeFunction }