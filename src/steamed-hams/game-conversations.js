import {Conversation, DialogBranch, DialogChoice} from '../modules/conversation-constructors';


function makeConversations() {

	var conversations = {};

	conversations.hamburgers = new Conversation('hamburgers','CHALMERS_C','start');

	conversations.hamburgers.addBranch(new DialogBranch('start',[
		new DialogChoice('Sorry, to keep you waiting...',
		['CHALMERS_C::hmm.'],
		{canOnlySayOnce: true}),
		new DialogChoice('Superintendent, I hope you\'re ready for mouthwatering hamburgers.',
		[
			'CHALMERS_C:: I thought we were having steamed clams.',
		],
		{changesBranch:'iThought'}),
	]));
	
	conversations.hamburgers.addBranch(new DialogBranch('iThought',[
		new DialogChoice('Clams? What makes you think that?',
		['CHALMERS_C::You did, Skinner.',
		'CHALMERS_C::not five minutes ago, in that kitchen, you said we were having steamed clams.'],
		{canOnlySayOnce:true}),
	
		new DialogChoice('D\'oh, no. I said steamed hams!',
		['pc::That\'s what I call hamburgers!',
		'CHALMERS_C::You call hamburgers \"steamed hams?\"',
		'pc::Yes. It\'s a regional dialect!',
		'CHALMERS_C::Uh-huh..',
		'CHALMERS_C::What region?',
		{order:['HAMBURGERS_W','setStatus','three']},
		{order:['CHALMERS_C','setDefaultWait','wait_with_ham']},
		{order:['CHALMERS_C','setDefaultTalk','talk_with_ham']},
		],
		{changesBranch:'dialects',}
		),

	]));
	
	conversations.hamburgers.addBranch(new DialogBranch('dialects',[
		new DialogChoice('Upstate New York.',
			[
			'CHALMERS_C:: Really? Well, I\'m from Utica, and I\'ve never heard anyone use the phrase \"steamed hams.\"',
			'pc::Oh, not in Utica, no. It\'s an Albany expression.',
			'CHALMERS_C::You know, these hamburgers are quite similar to the ones they have at Krusty Burger.',
			{order:['HAMBURGERS_W','setStatus','two']}
			],
			{changesBranch:'similar'}
		),
		new DialogChoice('Louisiana.',
			[
			'CHALMERS_C:: Is that so? And where exactly did you pick up a Louisiana dialect, Seymour?',
			'pc::I was born and bred there on the mean streets of New Orleans.',
			'CHALMERS_C::I see. I fact which your personnel file somehow fails to mention',
			'CHALMERS_C::You know, these hamburgers are quite similar to the ones they have at Krusty Burger.',
			{order:['HAMBURGERS_W','setStatus','two']}
			],
			{changesBranch:'similar'}
		),
		new DialogChoice('Mekon Delta, Vietnam.',
			['pc::Not that I ever ate any steamed hams there, myself...',
			'pc::I spent three years in a POW camp, forced to subsist on a thin stew made of fish, vegetables, prawns, coconut milk, and four kinds of rice.',
			'pc::I came close to madness trying to find it here in the States, but they just can\'t get the spices right!',
			'CHALMERS_C::uh - huh...',
			'CHALMERS_C::You know, these hamburgers are quite similar to the ones they have at Krusty Burger.',
			{order:['HAMBURGERS_W','setStatus','two']}
			],
			{changesBranch:'similar'}
		),
	]));

	conversations.hamburgers.addBranch(new DialogBranch('similar',[
		new DialogChoice('Oh no, patented skinnerburgers.',
			['pc:: old family recipe',
			'CHALMERS_C:: for steamed-hams.',
			'pc:: Yes.',
			'CHALMERS_C:: Yeah, so you call them "steamed hams" despite the fact they are obviously grilled.',
			'pc:: Ye- hey- you know, the- one thing I should- excuse me for one second.',
			'CHALMERS_C:: Of course.',
			{order:['GAME','runSequence','fire']}]
		),
	]));


	conversations.arrival = new Conversation('arival', 'CHALMERS_C','start');

	conversations.arrival.addBranch(new DialogBranch('start', [
		new DialogChoice('I hope you\'re prepared for an unforgettable luncheon.',
			['CHALMERS_C::hmmm'],
			{canOnlySayOnce:true,}
		),
		new DialogChoice('Damn you, Chalmers -  there was nothing wrong with my directions',
		['pc::...'],
		{canOnlySayOnce:true, firstLineUnsaid:true}),

		new DialogChoice('Come in.',
		['[sequence]chalmersComesIn'],
		),

	]));

	conversations.iWasJust = new Conversation('iWasJust','CHALMERS_C','start');

	conversations.iWasJust.addBranch(new DialogBranch('start',[
		new DialogChoice('just stretching my calves on the windowsill.',
		['pc::Isometric exercise. Care to join me?',
		'pc##isometric_exercise',
		'pc##isometric_exercise',
		'[wait]100',
		'[sequence]goToKrustyBurger'],
		),
		
		new DialogChoice('just examining these new italian loafers for signs of wear.',
		['pc::A principal must always be wary of his shoes!',
		'pc##isometric_exercise',
		'pc##isometric_exercise',
		'[wait]100',
		'[sequence]goToKrustyBurger'],
		),

		new DialogChoice('stomping on a troublesome termite.',
		[
		'[wait]100',
		'pc##stomp',
		'pc::take that!',
		'[wait]100',
		'[sequence]goToKrustyBurger'],
		),
	]))


	 conversations.houseIsOnFire = new Conversation ('houseIsOnFire','CHALMERS_C','start');

	 conversations.houseIsOnFire.addBranch(new DialogBranch('start',[

		new DialogChoice('No, mother, it\'s just the Northern Lights.',
		['[sequence]ending'],
		),

	 ]))


	return conversations
}

export {makeConversations}