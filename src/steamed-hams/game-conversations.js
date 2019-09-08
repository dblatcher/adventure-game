import {Conversation, DialogBranch, DialogChoice} from '../modules/conversation-constructors';

function makeConversations() {

	var conversations = {};

	conversations.hamburgers = new Conversation('hamburgers','CHALMERS_C','start');

	conversations.hamburgers.addBranch(new DialogBranch('start',[
		new DialogChoice('-SKIP-',
		[],
		{consequence: function(theApp,choice){
			theApp.sequences.fire.apply(theApp,[choice]);
		}}),
		new DialogChoice('Sorry, to keep you waiting...',
		['npc::hmm.'],
		{canOnlySayOnce: true}),
		new DialogChoice('Superintendent, I hope you\'re ready for mouthwatering hamburgers.',
		['npc:: I thought we were having steamed clams.',],
		{changesBranch:'iThought'}),
	]));
	
	conversations.hamburgers.addBranch(new DialogBranch('iThought',[
		new DialogChoice('Clams? What makes you think that?',
		['npc::You did, Skinner.',
		'npc::not five minutes ago, in that kitchen, you said we were having steamed clams.'],
		{canOnlySayOnce:true}),
	
		new DialogChoice('D\'oh, no. I said steamed hams!',
		['pc::That\'s what I call hamburgers!',
		'npc::You call hamburgers \"steamed hams?\"',
		'pc::Yes. It\'s a regional dialect!',
		'npc::Uh-huh..',
		'npc::What region?'],
		{changesBranch:'dialects'})
	]));
	
	conversations.hamburgers.addBranch(new DialogBranch('dialects',[
		new DialogChoice('Upstate New York.',
			['npc:: Really? Well, I\'m from Utica, and I\'ve never heard anyone use the phrase \"steamed hams.\"',
			'pc::Oh, not in Utica, no. It\'s an Albany expression.',
			'npc::I see.', 'npc::You know, these hamburgers are quite similar to the ones they have at Krusty Burger.'],
			{changesBranch:'similar'}
		),
		new DialogChoice('Louisiana.',
			['npc:: Is that so? And where exactly did you pick up a Louisiana dialect, Seymour?',
			'pc::I was born and bred there on the mean streets of New Orleans.',
			'npc::I see. I fact which your personnel file somehow fails to mention',
			'npc::You know, these hamburgers are quite similar to the ones they have at Krusty Burger.'],
			{changesBranch:'similar'}
		),
		new DialogChoice('Mekon Delta, Vietnamm.',
			['pc::Not that I ever ate any steamed hams there, myself...',
			'pc::I spent three years in a POW camp, forced to subsist on a thin stew made of fish, vegetables, prawns, coconut milk, and four kinds of rice.',
			'pc::I came close to madness trying to find it here in the States, but they just can\'t get the spices right!',
			'npc::uh - huh...',
			'npc::You know, these hamburgers are quite similar to the ones they have at Krusty Burger.'],
			{changesBranch:'similar'}
		),
	]));

	conversations.hamburgers.addBranch(new DialogBranch('similar',[
		new DialogChoice('Oh no, patented skinnerburgers.',
			['pc:: old family recipe',
			'npc:: for steamed-hams.',
			'pc:: Yes.',
			'npc:: Yeah, so you call them \"steamed hams\" despite the fact they are obviously grilled.',
			'pc:: Ye- hey- you know, the- one thing I should- excuse me for one second.',
			'npc:: Of course.',],
			{consequence: function(theApp,choice){
				theApp.sequences.fire.apply(theApp,[choice]);
			}}
		),
	]));


	conversations.arrival = new Conversation('arival', 'CHALMERS_C','start');

	conversations.arrival.addBranch(new DialogBranch('start', [
		new DialogChoice('I hope you\'re prepared for an unforgettable luncheon.',
			['npc::hmmm'],
			{canOnlySayOnce:true,}
		),
		new DialogChoice('Damn you, Chalmers -  there was nothing wrong with my directions',
		['pc::...'],
		{canOnlySayOnce:true, firstLineUnsaid:true}),

		new DialogChoice('Come in.',
		[],
		{consequence: function(theApp,choice){
			theApp.sequences.chalmersComesIn.apply(theApp,[choice]);
		}}),

	]));


	conversations.iWasJust = new Conversation('iWasJust','CHALMERS_C','start');

	conversations.iWasJust.addBranch(new DialogBranch('start',[
		new DialogChoice('just stretching my calves on the windowsill.',
		['pc::Isometric exercise. Care to join me?'],
		{}),
	]))

	return conversations
}

export {makeConversations}