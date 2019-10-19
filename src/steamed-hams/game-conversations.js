import {Conversation, DialogBranch, DialogChoice} from '../modules/conversation-constructors';


function makeConversations() {

	var conversations = {};

	conversations.hamburgers = new Conversation('hamburgers','CHALMERS_C','start');

	conversations.hamburgers.addBranch(new DialogBranch('start',[
		new DialogChoice('Sorry, to keep you waiting...',
		['npc::hmm.'],
		{canOnlySayOnce: true}),
		new DialogChoice('Superintendent, I hope you\'re ready for mouthwatering hamburgers.',
		[
			'npc:: I thought we were having steamed clams.',
		],
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
		{
		changesBranch:'dialects',
		consequence: function(game) { 
			game.getThings('HAMBURGERS_W').setStatus('three');
			game.getThings().CHALMERS_C.setDefaultWait('wait_with_ham'); 
			game.getThings().CHALMERS_C.setDefaultTalk('talk_with_ham'); 
		}
		}
		),

	]));
	
	conversations.hamburgers.addBranch(new DialogBranch('dialects',[
		new DialogChoice('Upstate New York.',
			[
			'npc:: Really? Well, I\'m from Utica, and I\'ve never heard anyone use the phrase \"steamed hams.\"',
			'pc::Oh, not in Utica, no. It\'s an Albany expression.',
			'npc::You know, these hamburgers are quite similar to the ones they have at Krusty Burger.',
			],
			{changesBranch:'similar', consequence:function(game){
				game.getThings('HAMBURGERS_W').setStatus('two');
			}}
		),
		new DialogChoice('Louisiana.',
			[
			'npc:: Is that so? And where exactly did you pick up a Louisiana dialect, Seymour?',
			'pc::I was born and bred there on the mean streets of New Orleans.',
			'npc::I see. I fact which your personnel file somehow fails to mention',
			'npc::You know, these hamburgers are quite similar to the ones they have at Krusty Burger.',
			],
			{changesBranch:'similar', consequence:function(game){
				game.getThings('HAMBURGERS_W').setStatus('two');
			}}
		),
		new DialogChoice('Mekon Delta, Vietnam.',
			['pc::Not that I ever ate any steamed hams there, myself...',
			'pc::I spent three years in a POW camp, forced to subsist on a thin stew made of fish, vegetables, prawns, coconut milk, and four kinds of rice.',
			'pc::I came close to madness trying to find it here in the States, but they just can\'t get the spices right!',
			'npc::uh - huh...',
			'npc::You know, these hamburgers are quite similar to the ones they have at Krusty Burger.',
			],
			{changesBranch:'similar', consequence:function(game){
				game.getThings('HAMBURGERS_W').setStatus('two');
			}}
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
			{consequence: function(game,choice){
				game.runSequence('fire');
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
		{consequence: function(game,choice){
			game.runSequence('chalmersComesIn');
		}}),

	]));


	conversations.iWasJust = new Conversation('iWasJust','CHALMERS_C','start');

	function iWasJust_1(firstLines){
		if (typeof firstLines === 'string') {firstLines = [firstLines]}
		for (var i=0; i< firstLines.length; i++) {
			firstLines[i] = {orderType: "say", options: {action:'window_talk'}, actor: "pc", text: firstLines[i]}
		}
		let base= [
		'npc::Why is there smoke coming out of your oven, Seymour?',
		'pc::Oh, no! That isn\'t smoke.',
		'pc::It\'s steam.',
		'pc::Steam from the steamed clams we\'re having.',
		'pc::Mmm, steamed clams.'
		];
		return firstLines.concat(base);
	}

	conversations.iWasJust.addBranch(new DialogBranch('start',[
		new DialogChoice('just stretching my calves on the windowsill.',
		iWasJust_1('Isometric exercise. Care to join me?'),
		{consequence: function(game,choice){
			game.runSequence('goToKrustyBurger',choice);
		}}),
		new DialogChoice('just examining these new italian loafers for signs of wear.',
		iWasJust_1('A principal must always be wary of his shoes!'),
		{consequence: function(game,choice){
			game.runSequence('goToKrustyBurger',choice);
		}}),
		new DialogChoice('stomping on an troublesome termite.',
		iWasJust_1('take that!'),
		{consequence: function(game,choice){
			game.runSequence('goToKrustyBurger',choice);
		}}),
	]))


	 conversations.houseIsOnFire = new Conversation ('houseIsOnFire','CHALMERS_C','start');

	 conversations.houseIsOnFire.addBranch(new DialogBranch('start',[

		new DialogChoice('No, mother, it\'s just the Northern Lights.',
		[
			{orderType: "say", options: {}, actor: "CHALMERS_C", text: 'Well Seymour, you are an odd fellow, but I must admit...'},
			{orderType: "say", options: {}, actor: "CHALMERS_C", text: 'You steam a good ham'},
		],
		{consequence: function(game,choice){
			game.runSequence('ending',choice);
		}}
		),

	 ]))


	return conversations
}

export {makeConversations}