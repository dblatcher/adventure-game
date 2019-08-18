
function DialogChoice (optionText,script,config={}) {
	this.optionText = optionText;
	
	if (!config.firstLineUnsaid) {
		script.unshift(optionText);
	}
	this.script = []; 
	var groupOfLines; 
	for (var i=0; i< script.length; i++) {
		
		if (Array.isArray(script[i])) {
			groupOfLines = [];
			for (var j=0; j< script[i].length; j++) {
				groupOfLines.push ( parseScriptLine(script[i][j]) );
			}
			this.script.push(groupOfLines);
		} else {
			this.script.push(parseScriptLine(script[i]))	
		}
		
	}
	
	if (typeof config.addItems === 'string' ) { config.addItems = [config.addItems] }
	if (typeof config.removeItems === 'string' ) { config.removeItems = [config.removeItems] }
	
	if (typeof config.condition === 'function') {this.condition = config.condition}

	this.consequence = config.consequence || null;
	this.canOnlySayOnce = config.canOnlySayOnce || false;
	this.ends = config.ends || false;
	this.changesBranch = config.changesBranch || false;
	this.disabled = config.disabled || false;
	this.addItems = config.addItems || false;
	this.removeItems = config.removeItems || false;
	
	
	function parseScriptLine(line) {
		if (typeof line === 'object') {return line}
		
		var parsedLine = {orderType:'say', options:{}};
		
		var separatorIndex=false;
		if (line.indexOf('::') != -1) {
			parsedLine.orderType = 'say';
			separatorIndex = line.indexOf('::');
		} else if (line.indexOf('##') != -1) {
			parsedLine.orderType = 'doAction';
			separatorIndex = line.indexOf('##');
		}
		
		if (separatorIndex) {
			parsedLine.actor = line.substring(0,separatorIndex);
			parsedLine.text = line.substring(separatorIndex + 2);			
		} else {
			parsedLine.actor = 'pc';
			parsedLine.text = line;
		}
		
		return parsedLine;
	}
}


function DialogBranch (label, choices) {
	this.label = label;
	for (var i=0; i<choices.length; i++){choices[i].dialogBranch=this}
	
	this.choices = choices;
	this.originalChoices = [].concat(choices);
}
DialogBranch.prototype.reset = function () {
	this.choices = [].concat(this.originalChoices);
}


function Conversation (label,npc, firstBranch) {
	this.label = label;
	this.npc = npc;
	this.branches = {};
	this.firstBranch = firstBranch;
	this.currentBranch = firstBranch;
}
Conversation.prototype.addBranch = function (dialogBranch) {
	this.branches[dialogBranch.label] = dialogBranch;
	dialogBranch.conversationLabel = this.label;
}
Conversation.prototype.getOptions = function () {
	return this.branches[this.currentBranch].choices;
}
Conversation.prototype.getEnabledOptions = function () {
	return this.branches[this.currentBranch].choices.filter( (choice) => {return !choice.disabled} );
}
Conversation.prototype.returnState =function () {
	const that = this;

	let state = {
		currentBranch : this.currentBranch,
		branches : {}
	}

	let branchLabels = Object.keys (this.branches);

	branchLabels.forEach ( (label) => {
		state.branches[label] = {
			choices : that.branches[label].choices.map( (v) => { return {
				disabled: v.disabled,
			} } ) 
		}; 
	})

	return state;
}

export {Conversation, DialogBranch, DialogChoice}