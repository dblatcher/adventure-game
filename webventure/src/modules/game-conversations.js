import {Conversation, DialogBranch, DialogChoice} from './conversation-constructors';


function makeConversations() {

	var conversations = {};
	conversations.withLuigi = new Conversation ('Talking to Luigi', "LUIGI_C",'start');

	conversations.withLuigi.addBranch (new DialogBranch(
		'start', [
			new DialogChoice ('Who are you?',
				['npc::Green Mario...','npc::...also called Luigi.'],
				{canOnlySayOnce:true}),
			new DialogChoice ('Do you have a hammer?',
				['npc::Sure.','npc::swap it for the shoe.'],
				{canOnlySayOnce:true, disabled:false, addItems:'HAMMER_I', removeItems:'SHOE_I'}),
			new DialogChoice ('Do you know anything about plumbing?',
				['npc::what do you want to know?'],
				{changesBranch:'plumbing'}),
			new DialogChoice ('can you dance?',
				['npc::Just watch!','npc##dance']),
			new DialogChoice ('Let\'s play rock paper scissors',[],{changesBranch:'rockPaperScissors'}),
			new DialogChoice ('Goodbye',
				['npc::Bye Bye','pc##wave','npc##walk'], 
				{ends:true})
		]
	));

	conversations.withLuigi.addBranch (new DialogBranch(
		'plumbing', [
			new DialogChoice ('What is a ballcock?',
				['pc::What is a ball...','npc::ballcock? its the thing that tells the toilet if it\'s ready to flush.'],
				{canOnlySayOnce:true,firstLineUnsaid:true}),
			new DialogChoice ('Never mind about plumbing...',
				['pc##wave'], 
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

	return conversations
}

export {makeConversations}