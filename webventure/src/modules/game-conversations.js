
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
			};
			this.script.push(groupOfLines);
		} else {
			this.script.push(parseScriptLine(script[i]))	
		}
		
	}
	
	this.consequence = config.consequence || null;
	this.canOnlySayOnce = config.canOnlySayOnce || false;
	this.ends = config.ends || false;
	this.changesBranch = config.changesBranch || false;
	
	
	function parseScriptLine(line) {
		if (typeof line === 'object') {return line};
		
		var parsedLine = {orderType:'say', options:{}};
		
		var separatorIndex=false;
		if (line.indexOf('::') != -1) {
			parsedLine.orderType = 'say';
			separatorIndex = line.indexOf('::');
		} else if (line.indexOf('##') != -1) {
			parsedLine.orderType = 'doAction';
			separatorIndex = line.indexOf('##');
		};
		
		if (separatorIndex) {
			parsedLine.actor = line.substring(0,separatorIndex);
			parsedLine.text = line.substring(separatorIndex + 2);			
		} else {
			parsedLine.actor = 'pc';
			parsedLine.text = line;
		};
		
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


function Conversation (label, firstBranch) {
	this.label = label;
	this.branches = {};
	this.firstBranch = firstBranch;
	this.currentBranch = firstBranch;
};
Conversation.prototype.addBranch = function (dialogBranch) {
	this.branches[dialogBranch.label] = dialogBranch;
	dialogBranch.conversation = this;
}
Conversation.prototype.getOptions = function () {
	return this.branches[this.currentBranch].choices;
}


var conversations = {};

conversations.withLuigi = new Conversation ('Talking to Luigi','start');

conversations.withLuigi.addBranch (new DialogBranch(
	'start', [
		new DialogChoice ('Who are you?',
			['npc::Green Mario...','npc::...also called Luigi.'],
			{canOnlySayOnce:true}),
		new DialogChoice ('Do you have a hammer?',
			['npc::Sure.','npc::Take it'],
			{canOnlySayOnce:true,
			consequence:function(theApp,choice){
				theApp.inventoryItems.filter(function(a){return a.id=='HAMMER_I'})[0].have = true;
			}}),
		new DialogChoice ('Do you know anything about plumbing?',
			['npc::what do you want to know?'],
			{changesBranch:'plumbing'}),
		new DialogChoice ('can you dance?',
			['npc::Just watch!','npc##dance']),
		new DialogChoice ('Let\'s play rock paper scissors',[],{changesBranch:'rockPaperScissors'}),
		new DialogChoice ('Goodbye',
			['npc::Bye Bye','npc##walk'], 
			{ends:true})
	]
));

conversations.withLuigi.addBranch (new DialogBranch(
	'plumbing', [
		new DialogChoice ('What is a ballcock?',
			['pc::What is a ball...','npc::ballcock? its the thing that tells the toilet if it\'s ready to flush.'],
			{canOnlySayOnce:true,firstLineUnsaid:true}),
		new DialogChoice ('Never mind about plumbing...',
			[], 
			{changesBranch:'start'})
	]
));

conversations.withLuigi.addBranch (new DialogBranch(
	'rockPaperScissors', [
		new DialogChoice ('rock',
			[ ['pc::rock','npc::scissors'] ,'pc::I win!'],
			{firstLineUnsaid:true}),
		new DialogChoice ('paper',
			[ ['pc::paper','npc::scissors'],'pc::you win!'],
			{firstLineUnsaid:true}),
		new DialogChoice ('scissors',
			[['pc::scissors','npc::scissors'],['pc::a draw!','npc::a draw!']],
			{firstLineUnsaid:true}),
		new DialogChoice ('no more.',
			[], 
			{changesBranch:'start'})
	]
));


export {conversations}