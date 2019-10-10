import { Interaction, StandardOrder, doorFunction,takeFunction,pcSays } from "../modules/interaction-constructor";


var interactions =[

    //CHARACTER
    new Interaction(
        ['TALK','CHALMERS_C'],
        [function() {return this.rooms[this.roomNumber].id === 'FRONT_R'}],
        function() { this.runSequence('greetChalmers'); }
    ),

    //ITEM BASED
    new Interaction(['LOOK','ROAST_I'],[],pcSays('Yes, this should be a reasonable quantity of meat to serve Superintendent Chalmers.',3000)),
    new Interaction(['LOOK','ROAST_GLAZED_I'],[],pcSays('Glazed and ready for the oven!',2000)),
    new Interaction(['LOOK','BUCKET_FOIL_I'],[],pcSays('This should suffice. Better put it on the table',3000)),
    new Interaction(['LOOK','BUCKET_SAND_I'],[],pcSays('Hmmm, this could serve as an ice bucket if it were empty and silver colored.',3000)),
    new Interaction(['LOOK','BUCKET_EMPTY_I'],[],pcSays('If only I could make it silver colored somehow.',2000)),
    new Interaction(['LOOK','FOIL_I'],[],pcSays('Shiny, metallic and used for wrapping things.',2000)),

    new Interaction(['USE','FOIL_I','BUCKET_SAND_I'],[],pcSays('I need to get rid of this sand first. I should dump it somewhere outside.',2000)),
    new Interaction(['USE','FOIL_I','BUCKET_FOIL_I'],[],pcSays('It\'s already wrapped.',1500)),

    new Interaction(['USE','HAMBURGER_BAG_I','PLATTER_I'],[],
    function(){
        let pc = this.getThings('pc');
        this.getInventoryItem('HAMBURGER_PLATTER_I');
        this.looseInventoryItem('HAMBURGER_BAG_I');
        this.looseInventoryItem('PLATTER_I');
        pc.doAction('arrange_burgers')
    }
    ),

    new Interaction(['USE','PLATTER_I','HAMBURGER_BAG_I'],[],
    function(){
        let pc = this.getThings('pc');
        this.getInventoryItem('HAMBURGER_PLATTER_I');
        this.looseInventoryItem('HAMBURGER_BAG_I');
        this.looseInventoryItem('PLATTER_I');
        pc.doAction('arrange_burgers')
    }
    ),

    new Interaction(['USE','FOIL_I','BUCKET_EMPTY_I'],[],function(){
        let pc = this.getThings('pc');
        this.getInventoryItem('BUCKET_FOIL_I');
        this.looseInventoryItem('BUCKET_EMPTY_I');
        this.looseInventoryItem('FOIL_I');

        pc.doAction('wrap_bucket')
        .then( () => {return pc.say('There!') } )
        .then( () => {return pc.say('It looks like a real ice bucket.') } )
    }),

    new Interaction(['USE','BOURBON_I','ROAST_I'],[],function(){
        let pc = this.getThings('pc');
        this.getInventoryItem('ROAST_GLAZED_I');
        this.looseInventoryItem('ROAST_I');
        this.looseInventoryItem('BOURBON_I');

        pc.doAction('glaze_roast')
        .then( () => {return pc.say('Well glazed, Seymour, well glazed') } )

    }),

    new Interaction(['LOOK','TODO_I'],[function(){return this.gameVars.roastIsInOven && this.gameVars.iceBucketIsOnTable}],
        pcSays('No need for the list now! The Superintendent is here!')
    ),

    new Interaction(['LOOK','TODO_I'],[],function(){

        let roastComment = this.gameVars.roastIsInOven ?
            'done.' :  this.allRoomItemData.KITCHEN_R.OVEN_W.status.cycle === 'open_ham_inside' ?
            'better close the oven and turn it up to maximum heat!' : this.allInventoryItemsAsObject.ROAST_GLAZED_I.have ?
            'hmm... better get this in the oven. The bourbon is dropping all over the floor.' : 'What can I use to glaze this roast?'

        let bucketComment = this.gameVars.iceBucketIsOnTable ?
            'done.' : this.allInventoryItemsAsObject.BUCKET_FOIL_I.have ?
            'I have the bucket ready, it just needs to go on the table.' : this.allInventoryItemsAsObject.BUCKET_EMPTY_I.have ?
            'I have a bucket, but it\'s not shiny enough.' : this.allInventoryItemsAsObject.BUCKET_SAND_I.have ?
            'This fire bucket is the right size, but It\'s full of sand and not shiny.' : 'there must be a bucket around here somewhere.';

        this.runSequence([
            new StandardOrder('pc', 'say', '1. Buy roast... done'),
            new StandardOrder('pc', 'say', '2. Glaze roast and place in oven... '),
            new StandardOrder('pc', 'say', roastComment),
            new StandardOrder('pc', 'say', '3. Put ice bucket on table...'),
            new StandardOrder('pc', 'say', bucketComment),
        ])

    }),

    //FRONT OF HOUSE
    new Interaction(['LOOK','GARAGE_W'],[],pcSays('I admire car owners. I aspire to be one after I\'ve reimbursed mother for the food I ate as a child.',4000)),

    new Interaction(['USE','BUCKET_SAND_I','BUSH_W'],[],function(){
        this.setGameStatus('CUTSCENE')
        Promise.resolve(true)
        .then( ()=>{ return this.getThings('pc').goTo(this.getThings('BUSH_W').walkToPoint) } )
        .then( ()=>{ return this.runSequence('pourSandInBush') } )
    }),
    
    new Interaction(['USE','BUCKET_SAND_I','BUSH_2_W'],[],function(){
        this.setGameStatus('CUTSCENE')
        Promise.resolve(true)
        .then( ()=>{ return this.getThings('pc').goTo(this.getThings('BUSH_2_W').walkToPoint) } )
        .then( ()=>{ return this.runSequence('pourSandInBush') } )
    }),
    
    new Interaction(['USE','BUCKET_SAND_I','BUSH_3_W'],[],function(){
        this.setGameStatus('CUTSCENE')
        Promise.resolve(true)
        .then( ()=>{ return this.getThings('pc').goTo(this.getThings('BUSH_3_W').walkToPoint) } )
        .then( ()=>{ return this.runSequence('pourSandInBush') } )
    }),

    new Interaction(['OPEN','FRONT_DOOR_W'],
    [function(){return this.getThings('FRONT_DOOR_W').item.status.cycle == 'closed'},],
    function(){
        this.getThings('pc').goTo(this.getThings('FRONT_DOOR_W').walkToPoint)
        .then( (r)=> { if (r.finished) {
            return this.getThings('FRONT_DOOR_W').setStatus('opening','open')
        } });
    }),

    new Interaction(['OPEN','FRONT_DOOR_W'],[],pcSays("It's not closed!")),

    new Interaction(['WALK','FRONT_DOOR_W'],
    [function(){return this.getThings('FRONT_DOOR_W').item.status.cycle == 'open'}],
    doorFunction('FRONT_DOOR_W',['DINING_R',50,50])
    ),

    new Interaction(['SHUT','FRONT_DOOR_W'],
    [function(){return this.getThings('FRONT_DOOR_W').item.status.cycle == 'open'}],
    function(){
        this.getThings('pc').goTo(this.getThings('FRONT_DOOR_W').walkToPoint)
        .then( (r)=> { if (r.finished) {
            this.getThings('FRONT_DOOR_W').setStatus('closing','closed')
        } });
    }),
    
    new Interaction(['SHUT','FRONT_DOOR_W'],[],pcSays('It\'s already closed.')),




    //DINING ROOM

    new Interaction(['USE','BUCKET_FOIL_I','TABLE_W'],[],function(){
        let pc = this.getThings('pc');
        this.looseInventoryItem('BUCKET_FOIL_I');
        this.setGameStatus('CUTSCENE');

        pc.goTo(this.getThings('TABLE_W').walkToPoint)
        .then( (r) => {return pc.say('Here we are') } )
        .then( (r) => {
            this.allRoomItemData.DINING_R.ICE_BUCKET_W.removed = false;
            this.setGameStatus('LIVE');
		 } )
		 .then ( ()=> {
			this.gameVars.iceBucketIsOnTable = true;
			if (this.gameVars.roastIsInOven && this.gameVars.iceBucketIsOnTable) {
				this.runSequence('chalmersAtDoor');
			}
        })

    }),


    new Interaction(['WALK','DINING_WAYOUT_W'],[],
    doorFunction('DINING_WAYOUT_W',['FRONT_R',146,27])),

    new Interaction(['OPEN','DINING_KITCHENDOOR_W'],[
        function(){return this.getThings('DINING_KITCHENDOOR_W').item.status.cycle == 'closed'},
    ],function(){
        this.getThings('pc').goTo(this.getThings('DINING_KITCHENDOOR_W').walkToPoint)
        .then( (r)=> { if (r.finished) {
            return this.getThings('DINING_KITCHENDOOR_W').setStatus('opening','open')
        } });
    }),

    new Interaction(['OPEN','DINING_KITCHENDOOR_W'],
    [function(){return this.getThings('DINING_KITCHENDOOR_W').item.status.cycle == 'open'}],
    pcSays("It's not closed!")),


	new Interaction(['WALK','DINING_KITCHENDOOR_W'],
	[
		function(){return this.allRoomItemData.KITCHEN_R.OVEN_W.status.cycle==="smoking"},
		function(){return !this.gameVars.haveSeenBurningRoast},
		function(){return this.getThings('DINING_KITCHENDOOR_W').item.status.cycle == 'open'}
	],
   	function() { 
        this.getThings('pc').goTo(this.getThings('DINING_KITCHENDOOR_W').walkToPoint)
        .then( (r)=> { if (r.finished) {
            return this.changeRoom(['FRONT_R',146,27])
            .then( ()=> { this.runSequence('seeBurningRoast') } )
        } });
    }),


    new Interaction(['WALK','DINING_KITCHENDOOR_W'],
    [function(){return this.getThings('DINING_KITCHENDOOR_W').item.status.cycle == 'open'}],
    doorFunction('DINING_KITCHENDOOR_W',['KITCHEN_R',120,10])
    ),


    new Interaction(['SHUT','DINING_KITCHENDOOR_W'],
    [function(){return this.getThings('DINING_KITCHENDOOR_W').item.status.cycle == 'open'}],
    function(){
        this.getThings('pc').goTo(this.getThings('DINING_KITCHENDOOR_W').walkToPoint)
        .then( (r)=> { if (r.finished) {
            this.getThings('DINING_KITCHENDOOR_W').setStatus('closing','closed')
        } });
    }),

    new Interaction(['SHUT','DINING_KITCHENDOOR_W'],[],pcSays('It\'s already closed.')),


    //KITCHEN

    new Interaction(['WALK','KITCHEN_DININGDOOR_W'],[
        function() {return this.getThings('OVEN_W').item.status.cycle==='smoking'}, 
        function() {return this.allInventoryItemsAsObject.HAMBURGER_PLATTER_I.have === true}, 
       ],
        function() {
            this.getThings('pc').goTo(this.getThings('KITCHEN_DININGDOOR_W').walkToPoint)
            .then( (feedback) => {
                if (feedback.finished) {
                    this.setGameStatus('CUTSCENE');
                    this.changeRoom(['DINING_R',300,50])
                        .then( ()=> { return this.getThings('DINING_KITCHENDOOR_W').setStatus('closing','closed') } )
                        .then( ()=> { return this.getThings('pc').goTo({x:220, y:45})  } )
                        .then( ()=> {
                            this.allRoomItemData.DINING_R.HAMBURGERS_W.removed=false;
                            this.getThings('CHALMERS_C').char.behaviour_direction='right';
                            return this.getThings('pc').goTo({x:214, y:12})
                        })
                        .then(()=>{this.setGameStatus('CONVERSATION','hamburgers')})
                }
            } )
        }
       ),
   

       new Interaction(['WALK','KITCHEN_DININGDOOR_W'],[
        function() {return this.getThings('OVEN_W').item.status.cycle==='smoking'}, 
        function() {return this.allInventoryItemsAsObject.HAMBURGER_BAG_I.have === true}, 
       ],pcSays('I can\'t serve the hamburgers like this! I need to disguise them as my own cooking somehow...')
       ),

    new Interaction(['WALK','KITCHEN_DININGDOOR_W'],[
     function() {return this.getThings('OVEN_W').item.status.cycle==='smoking'}, 
     function() {return this.allInventoryItemsAsObject.HAMBURGER_PLATTER_I.have === false}, 
    ],pcSays('I can\'t go back there! I don\'t have any food for the Superintendent!')
    ),

    new Interaction(['WALK','KITCHEN_DININGDOOR_W'],
    [],
    doorFunction('KITCHEN_DININGDOOR_W',['DINING_R',300,50])
    ),

    new Interaction(['OPEN','OVEN_W'],
    [function(){return this.getThings('OVEN_W').item.status.cycle == 'closed'}],
    function(){
        this.getThings('pc').goTo(this.getThings('OVEN_W').walkToPoint)
        .then( (r)=> {
            this.getThings('OVEN_W').setStatus('open');
        } )
    }),

    new Interaction(['SHUT','OVEN_W'],
    [function(){return this.getThings('OVEN_W').item.status.cycle == 'open'}],
    function(){
        this.getThings('pc').goTo(this.getThings('OVEN_W').walkToPoint)
        .then( (r)=> {
            this.getThings('OVEN_W').setStatus('closed');
        } )
    }),
    new Interaction(['USE','ROAST_I','OVEN_W'],[],
    pcSays('I need to glaze it first.')
    ),
    new Interaction(['USE','ROAST_GLAZED_I','OVEN_W'],
    [function(){return this.getThings('OVEN_W').item.status.cycle == 'open'}],
    function(){
        this.getThings('pc').goTo(this.getThings('OVEN_W').walkToPoint)
        .then( (r)=> {
            this.getThings('OVEN_W').setStatus('open_ham_inside');
            this.looseInventoryItem('ROAST_GLAZED_I');
        } )
    }),
    new Interaction(['USE','ROAST_GLAZED_I','OVEN_W'],
    [function(){return this.getThings('OVEN_W').item.status.cycle == 'closed'}],
    function(){
        this.getThings('pc').goTo(this.getThings('OVEN_W').walkToPoint)
        .then( ()=> {
            this.getThings('OVEN_W').setStatus('open','open_ham_inside');
            this.looseInventoryItem('ROAST_GLAZED_I');
        } )
    }),
    new Interaction(['SHUT','OVEN_W'],
    [function(){return this.getThings('OVEN_W').item.status.cycle == 'open_ham_inside'}],
    function(){
        this.getThings('pc').goTo(this.getThings('OVEN_W').walkToPoint)
        .then( ()=> {
            return this.getThings('OVEN_W').setStatus('closed_ham_inside');
        } )
        .then( ()=> {
            return this.getThings('pc').say('I\'ll just turn this on...');
        } )
        .then ( ()=> {
			this.gameVars.roastIsInOven = true;
			if (this.gameVars.roastIsInOven && this.gameVars.iceBucketIsOnTable) {
				this.runSequence('chalmersAtDoor');
			}
        })
    }),


    new Interaction(['SHUT','OVEN_W'],
    [function(){return this.getThings('OVEN_W').item.status.cycle.substring(0,6) == 'closed'}],
    pcSays('It\'s already closed.')),

    new Interaction(['OPEN','OVEN_W'],
    [function(){return this.getThings('OVEN_W').item.status.cycle.substring(0,4) == 'open'}],
    pcSays('It\'s already open.')),

    new Interaction(['OPEN','OVEN_W'],
    [function(){return this.getThings('OVEN_W').item.status.cycle == 'closed_ham_inside'}],
    pcSays('No, I\'d better leave it to get as cooked as possible.')),

    new Interaction(['TAKE','FOIL_W'],[],
    takeFunction('FOIL_W','FOIL_I')), 

    new Interaction(['OPEN','CUPBOARD_W'],
    [function(){return !this.gameVars.cupboardEmpty}],
    function(){
        this.runSequence([
            new StandardOrder('GAME','setGameStatus','CUTSCENE'),
            new StandardOrder('pc','goTo',this.getThings('CUPBOARD_W').walkToPoint),
            new StandardOrder('pc','say','Let\'s see...'),
            new StandardOrder('GAME','getInventoryItem','BUCKET_SAND_I'),
            new StandardOrder('pc','say','...the old fire bucket...'),
            new StandardOrder('GAME','getInventoryItem','PLATTER_I'),
            new StandardOrder('pc','say','...the serving platter...'),
            new StandardOrder('GAME','getInventoryItem','BOURBON_I'),
            new StandardOrder('pc','say','...and a bottle of bourbon?! What\'s that doing here?'),
            new StandardOrder('GAME','setGameStatus','LIVE'),
        ])
    }),

    new Interaction(['OPEN','CUPBOARD_W'],[],
    pcSays('There was nothing else in there.')),

    new Interaction(['WALK', 'KRUSTYBURGER_W'],
    [function() {return this.getThings('OVEN_W').item.status.cycle==='smoking'}, 
    function() {return this.allInventoryItemsAsObject.HAMBURGER_PLATTER_I.have === false},],
    function () {
        let skinner = this.getThings('pc');
        let window = this.getThings('KRUSTYBURGER_W').walkToPoint;
        this.runSequence([
            new StandardOrder ('GAME', 'setGameStatus','CUTSCENE'),
            new StandardOrder ('pc', 'say','But what if I were to  purchase fast food and disguise it as my own cooking?',{time:2500}),
            new StandardOrder ('pc', 'say','Delightfully devilish, Seymour!'),
            new StandardOrder ('pc', 'goTo',window),
        ])
        .then(()=>{ 
            skinner.char.behaviour_action='window_wait';
            skinner.char.behaviour_actframe=0;
            return this.teleportCharacter(['CHALMERS_C', 'KITCHEN_R', 100, -20])
        })
        .then(()=>{ 
            return this.runSequence([
                new StandardOrder ('CHALMERS_C','goTo',{x:95, y:20}),
                new StandardOrder ('CHALMERS_C','goTo',{x:105, y:20}),
                new StandardOrder ('CHALMERS_C','say','Seymour!'),
                new StandardOrder ('pc', 'say','Superintendent, I was just- uh...',{time:2500, action:'window_talk'}),
                new StandardOrder ('GAME', 'setGameStatus','CONVERSATION','iWasJust'),
            ])
        })
    }
    )

]

var defaultResponses = {
    "WALK" : function(command) {this.getThings('pc').goTo(this.getThings(command.subject.id).walkToPoint)},
    "LOOK" : function(command) {
        if (command.subject.id.endsWith('W')) {
            this.getThings('pc').say(`It looks like a normal ${command.subject.name} to me.`);
        } else {
        this.getThings('pc').say(`I don't see anything special about ${command.subject.name}.`);
        }
    },
    "OPEN" : function(command) {
        this.getThings('pc').say(`The ${command.subject.name} doesn't open.`);
    },
    "misc" : function(command) {this.getThings('pc').say(`I can't do that.`);} 
};


var interactionMatrix = Interaction.makeMatrix(interactions);
export { interactionMatrix, defaultResponses }