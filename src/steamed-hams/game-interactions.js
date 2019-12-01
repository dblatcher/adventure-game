import { Interaction, doorFunction,takeFunction } from "../modules/interaction-constructor";
import { StandardOrder } from "../modules/StandardOrder";
import { ConditionalOrder } from "../modules/ConditionalOrder";
import { StandardCondition } from "../modules/StandardCondition";



var interactions =[

    //CHARACTER
    new Interaction(
        ['TALK','CHALMERS_C'],
        [new StandardCondition('GAME', 'currentRoom', '===', 'PORCH_R')],
        'greetChalmers'
    ),

    //ITEM BASED    
    new Interaction(['LOOK','ROAST_I'],[],
    [
        new ConditionalOrder({
            conditions: [['GAME', 'currentRoom', '===', 'KITCHEN_R']],
            orderIfTrue:  ['pc::I\'d better glaze this and get it in the oven.'],
            orderIfFalse:  ['pc::Yes, this should be a reasonable quantity of meat to serve Superintendent Chalmers.']
        })
    ]),

    new Interaction(['LOOK','ROAST_GLAZED_I'],[],
    [new StandardOrder('pc::Glazed and ready for the oven!')]),

    new Interaction(['LOOK','BUCKET_FOIL_I'],[],
    [new StandardOrder('pc::This should suffice. Better put it on the table')]),

    new Interaction(['LOOK','BUCKET_SAND_I'],[],
    [new StandardOrder('pc::Hmmm, this could serve as an ice bucket if it were empty and silver colored.')]),

    new Interaction(['LOOK','BUCKET_EMPTY_I'],[],
    [new StandardOrder('pc::If only I could make it silver colored somehow.')]),

    new Interaction(['LOOK','FOIL_I'],[],
    [new StandardOrder('pc::Shiny, metallic and used for wrapping things.')]),

    new Interaction(['USE','FOIL_I','BUCKET_SAND_I'],[],
    [new StandardOrder('pc::I need to get rid of this sand first. I should dump it somewhere outside.')]),

    new Interaction(['USE','FOIL_I','BUCKET_FOIL_I'],[],
    [new StandardOrder('pc::It\'s already wrapped.')]),


    new Interaction(['USE','HAMBURGER_BAG_I','PLATTER_I'],[],
    [
      new StandardOrder ('[loose]PLATTER_I'),  
      new StandardOrder ('[loose]HAMBURGER_BAG_I'),  
      new StandardOrder ('[get]HAMBURGER_PLATTER_I'),
      new StandardOrder ('pc##arrange_burgers'),
    ]
    ),

    new Interaction(['USE','PLATTER_I','HAMBURGER_BAG_I'],[],
    [
        new StandardOrder ('[loose]PLATTER_I'),  
        new StandardOrder ('[loose]HAMBURGER_BAG_I'),  
        new StandardOrder ('[get]HAMBURGER_PLATTER_I'),
        new StandardOrder ('pc##arrange_burgers'),
      ]
    ),

    new Interaction(['USE','FOIL_I','BUCKET_EMPTY_I'],[],[
        new StandardOrder('[get]BUCKET_FOIL_I'),
        new StandardOrder('[loose]BUCKET_EMPTY_I'),
        new StandardOrder('[loose]FOIL_I'),
        new StandardOrder('pc::Looks like a real ice bucket!'),
    ]),

    new Interaction(['USE','BOURBON_I','ROAST_I'],[],[
        new StandardOrder('[get]ROAST_GLAZED_I'),
        new StandardOrder('[loose]ROAST_I'),
        new StandardOrder('[loose]BOURBON_I'),
        new StandardOrder('pc##glaze_roast'),
        new StandardOrder('pc::Well glazed, Seymour, well glazed'),
    ]),

    new Interaction(['LOOK','TODO_I'],
    [
        new StandardCondition('VAR','roastIsInOven','true'),
        new StandardCondition('VAR','iceBucketIsOnTable','true')
    ],
    [new StandardOrder('pc::No need for the list now! The Superintendent is here!')]
    ),

    new Interaction(['LOOK','TODO_I'],[],[
        new StandardOrder('pc', 'say', '1. Buy roast... done'),
        new StandardOrder('pc', 'say', '2. Glaze roast and place in oven... '),
        new ConditionalOrder({
            conditions: [['VAR','roastIsInOven','true']],
            orderIfTrue: ['pc::done!']
        }),
        new ConditionalOrder({
            conditions: [['KITCHEN_R.OVEN_W','status','===','open_ham_inside']],
            orderIfTrue: ['pc::better close the oven and turn it up to maximum heat!']
        }),
        new ConditionalOrder({
            conditions: [['ROAST_GLAZED_I','have','true']],
            orderIfTrue: ['pc::hmm... better get the roast in the oven. The bourbon is dropping all over the floor.']
        }),
        new ConditionalOrder({
            conditions: [
                ['ROAST_GLAZED_I','have','false'],
                ['VAR','roastIsInOven','false'], 
                ['KITCHEN_R.OVEN_W','status','!==','open_ham_inside'],
            ], 
            orderIfTrue: ['pc::hmm... What can I use to glaze this roast?']
        }),
        new StandardOrder('pc', 'say', '3. Put ice bucket on table...'),
        new ConditionalOrder({
            conditions: [['VAR','iceBucketIsOnTable','true']],
            orderIfTrue: ['pc::done!']
        }),
        new ConditionalOrder({
            conditions: [['BUCKET_FOIL_I','have','true']],
            orderIfTrue: ['pc::I have the bucket ready, it just needs to go on the table.']
        }),
        new ConditionalOrder({
            conditions: [['BUCKET_EMPTY_I','have','true']],
            orderIfTrue: ['pc::I have a bucket, but it\'s not shiny enough.']
        }),
        new ConditionalOrder({
            conditions: [['BUCKET_SAND_I','have','true']],
            orderIfTrue: ['pc::This fire bucket is the right size, but It\'s full of sand and not shiny.']
        }),
        new ConditionalOrder({
            conditions: [['VAR','cupboardEmpty','false']],
            orderIfTrue: ['pc::There must be a bucket around here somewhere.']
        }),
        ]),

    //FRONT OF HOUSE
    new Interaction(['LOOK','GARAGE_W'],[],[new StandardOrder('pc::I admire car owners. I aspire to be one after I\'ve reimbursed mother for the food I ate as a child.')]),


    new Interaction(['USE','BUCKET_SAND_I','BUSH_W'],[],[
        new StandardOrder ('[status]CUTSCENE'),
        new StandardOrder ('pc>>BUSH_W'),
        new StandardOrder('[sequence]pourSandInBush')
    ]),

    new Interaction(['USE','BUCKET_SAND_I','BUSH_2_W'],[],[
        new StandardOrder ('[status]CUTSCENE'),
        new StandardOrder ('pc>>BUSH_2_W'),
        new StandardOrder('[sequence]pourSandInBush')
    ]),

    new Interaction(['USE','BUCKET_SAND_I','BUSH_3_W'],[],[
        new StandardOrder ('[status]CUTSCENE'),
        new StandardOrder ('pc>>BUSH_3_W'),
        new StandardOrder('[sequence]pourSandInBush')
    ]),

    new Interaction(['USE','BUCKET_SAND_I','BUSH_4_W'],[],[
        new StandardOrder ('[status]CUTSCENE'),
        new StandardOrder ('pc>>BUSH_4_W'),
        new StandardOrder('[sequence]pourSandInBush')
    ]),

    new Interaction(['OPEN','FRONT_DOOR_W'],
    [new StandardCondition('FRONT_DOOR_W','status','===','closed')],
    function(){
        this.getThings('pc').goTo(this.getThings('FRONT_DOOR_W').walkToPoint)
        .then( (r)=> { if (r.finished) {
            return this.getThings('FRONT_DOOR_W').setStatus(['opening','open'])
        } });
    }),

    new Interaction(['OPEN','FRONT_DOOR_W'],[],[new StandardOrder("pc::It's not closed!")]),


    new Interaction(['WALK','FRONT_DOOR_W'],
    [new StandardCondition('FRONT_DOOR_W','status','===','open')],
    doorFunction('FRONT_DOOR_W',['DINING_R',50,50])
    ),

    new Interaction(['SHUT','FRONT_DOOR_W'],
    [new StandardCondition('FRONT_DOOR_W','status','===','open')],
    function(){
        this.getThings('pc').goTo(this.getThings('FRONT_DOOR_W').walkToPoint)
        .then( (r)=> { if (r.finished) {
            this.getThings('FRONT_DOOR_W').setStatus(['closing','closed'])
        } });
    }),

    new Interaction(['SHUT','FRONT_DOOR_W'],[],[new StandardOrder('pc::It\'s already closed.')]),



    //DINING ROOM

    new Interaction(['USE','BUCKET_FOIL_I','TABLE_W'],[
       new StandardCondition('VAR','roastIsInOven','true')
    ],
    [
        new StandardOrder('pc>>TABLE_W'),
        new StandardOrder('[loose]BUCKET_FOIL_I'),
        new StandardOrder('pc::There...'),
        new StandardOrder('DINING_R.ICE_BUCKET_W', 'setRemoval', false),
        new StandardOrder('[var]',{iceBucketIsOnTable:true}),
        new StandardOrder('[sequence]chalmersWalkingAlong'),
        new StandardOrder ('GAME','changeRoom',['DINING_R'], {pcNotMoving:true}),
        new StandardOrder('[sequence]chalmersAtDoor')
    ]),

    new Interaction(['USE','BUCKET_FOIL_I','TABLE_W'],[],
    [
        new StandardOrder('pc>>TABLE_W'),
        new StandardOrder('[loose]BUCKET_FOIL_I'),
        new StandardOrder('pc::There...'),
        new StandardOrder('DINING_R.ICE_BUCKET_W', 'setRemoval', false),
        new StandardOrder('[var]',{iceBucketIsOnTable:true}),
    ]
    ),

    new Interaction(['WALK','DINING_WAYOUT_W'],[],
    doorFunction('DINING_WAYOUT_W',['PORCH_R',265,86])),



    new Interaction(['OPEN','DINING_KITCHENDOOR_W'],
    [new StandardCondition('DINING_KITCHENDOOR_W','status','===','closed')],
    function(){
        this.getThings('pc').goTo(this.getThings('DINING_KITCHENDOOR_W').walkToPoint)
        .then( (r)=> { if (r.finished) {
            return this.getThings('DINING_KITCHENDOOR_W').setStatus(['opening','open'])
        } });
    }),

    new Interaction(['OPEN','DINING_KITCHENDOOR_W'],
    [new StandardCondition('DINING_KITCHENDOOR_W','status','===','open')],
    [new StandardOrder("pc::It's not closed!")]),



	new Interaction(['WALK','DINING_KITCHENDOOR_W'],
	[
        new StandardCondition('KITCHEN_R.OVEN_W','status','===','smoking'),
        new StandardCondition('VAR','haveSeenBurningRoast','false'),
        new StandardCondition('DINING_KITCHENDOOR_W','status','===','open'),
	],
   	function() { 
        this.getThings('pc').goTo(this.getThings('DINING_KITCHENDOOR_W').walkToPoint)
        .then( (r)=> { if (r.finished) {
            return this.changeRoom(['KITCHEN_R',146,27])
            .then( ()=> { this.runSequence('seeBurningRoast') } )
        } });
    }),


    new Interaction(['WALK','DINING_KITCHENDOOR_W'],
    [function(){return this.getThings('DINING_KITCHENDOOR_W').item.status == 'open'}],
    doorFunction('DINING_KITCHENDOOR_W',['KITCHEN_R',120,10])
    ),


    new Interaction(['SHUT','DINING_KITCHENDOOR_W'],
    [function(){return this.getThings('DINING_KITCHENDOOR_W').item.status == 'open'}],
    function(){
        this.getThings('pc').goTo(this.getThings('DINING_KITCHENDOOR_W').walkToPoint)
        .then( (r)=> { if (r.finished) {
            this.getThings('DINING_KITCHENDOOR_W').setStatus(['closing','closed'])
        } });
    }),

    new Interaction(['SHUT','DINING_KITCHENDOOR_W'],[],
    [new StandardOrder('pc::It\'s already closed.')]),



    //KITCHEN

    new Interaction(['WALK','KITCHEN_DININGDOOR_W'],[
        function() {return this.getThings('OVEN_W').item.status==='smoking'}, 
        function() {return this.allInventoryItemsAsObject.HAMBURGER_PLATTER_I.have === true}, 
       ],
        function() {
            this.getThings('pc').goTo(this.getThings('KITCHEN_DININGDOOR_W').walkToPoint)
            .then( (feedback) => {
                if (feedback.finished) {

                    this.runSequence([
                        new StandardOrder('[status]CUTSCENE'),
                        new StandardOrder('GAME','changeRoom',['DINING_R',300,50]),
                        new StandardOrder('DINING_KITCHENDOOR_W','setStatus',['closing','closed']),
                        new StandardOrder('pc>>220,45'),
                        new StandardOrder('DINING_R.HAMBURGERS_W','setRemoval',false),
                        new StandardOrder('CHALMERS_C^^pc'),
                        new StandardOrder('pc>>214,12'),
                        new StandardOrder('[status]CONVERSATION', 'hamburgers'),
                    ])

                }
            } )
        }
       ),
   

       new Interaction(['WALK','KITCHEN_DININGDOOR_W'],[
        function() {return this.getThings('OVEN_W').item.status==='smoking'}, 
        function() {return this.allInventoryItemsAsObject.HAMBURGER_BAG_I.have === true}, 
       ],
       [new StandardOrder('pc::I can\'t serve the hamburgers like this! I need to disguise them as my own cooking somehow...')]

       ),

    new Interaction(['WALK','KITCHEN_DININGDOOR_W'],[
     function() {return this.getThings('OVEN_W').item.status==='smoking'}, 
     function() {return this.allInventoryItemsAsObject.HAMBURGER_PLATTER_I.have === false}, 
    ],
    [new StandardOrder('pc::I can\'t go back there! I don\'t have any food for the Superintendent!')]

    ),

    new Interaction(['WALK','KITCHEN_DININGDOOR_W'],
    [],
    doorFunction('KITCHEN_DININGDOOR_W',['DINING_R',300,50])
    ),

    new Interaction(['OPEN','OVEN_W'],
    [function(){return this.getThings('OVEN_W').item.status == 'closed'}],
    function(){
        this.runSequence([
            new StandardOrder('pc>>OVEN_W'),
            new StandardOrder('OVEN_W','setStatus','open'),
        ])
    }),

    new Interaction(['SHUT','OVEN_W'],
    [function(){return this.getThings('OVEN_W').item.status == 'open'}],
    function(){
        this.runSequence([
            new StandardOrder('pc>>OVEN_W'),
            new StandardOrder('OVEN_W','setStatus','closed'),
        ])
    }),

    new Interaction(['USE','ROAST_I','OVEN_W'],[],
    [new StandardOrder('pc::I need to glaze it first.')]
    ),


    new Interaction(['USE','ROAST_GLAZED_I','OVEN_W'],
    [
        new StandardCondition('OVEN_W','status','open')
    ],
    [
        new StandardOrder('[status]CUTSCENE'),
        new StandardOrder('pc>>OVEN_W'),
        new StandardOrder('OVEN_W', 'setStatus', 'open_ham_inside'),
        new StandardOrder('[loose]ROAST_GLAZED_I'),
        new StandardOrder('[status]LIVE'),
    ]),
    new Interaction(['USE','ROAST_GLAZED_I','OVEN_W'],
    [
        new StandardCondition('OVEN_W','status','closed')
    ],
    [
        new StandardOrder('[status]CUTSCENE'),
        new StandardOrder('pc>>OVEN_W'),
        new StandardOrder('OVEN_W', 'setStatus', 'open'),
        new StandardOrder('OVEN_W', 'setStatus', 'open_ham_inside'),
        new StandardOrder('[loose]ROAST_GLAZED_I'),
        new StandardOrder('[status]LIVE'),
    ]),


    new Interaction(['SHUT','OVEN_W'],
    [function(){return this.getThings('OVEN_W').item.status == 'open_ham_inside'}, function(){return this.gameVars.iceBucketIsOnTable}],
    [
        new StandardOrder('[status]CUTSCENE'),
        new StandardOrder('pc>>OVEN_W'),
        new StandardOrder('OVEN_W','setStatus','closed_ham_inside'),
        new StandardOrder('pc::I\'ll just turn this on...'),
        new StandardOrder('[var]',{roastIsInOven:true}),
        new StandardOrder('[sequence]chalmersWalkingAlong'),
        new StandardOrder ('GAME','changeRoom',['KITCHEN_R'], {pcNotMoving:true}),
        new StandardOrder('[sequence]chalmersAtDoor')
    ]),

    new Interaction(['SHUT','OVEN_W'],
    [function(){return this.getThings('OVEN_W').item.status == 'open_ham_inside'}],
    [
        new StandardOrder('[status]CUTSCENE'),
        new StandardOrder('pc>>OVEN_W'),
        new StandardOrder('OVEN_W','setStatus','closed_ham_inside'),
        new StandardOrder('pc::I\'ll just turn this on...'),
        new StandardOrder('[var]',{roastIsInOven:true}),
        new StandardOrder('[status]LIVE'),
    ]),


    new Interaction(['SHUT','OVEN_W'],
    [function(){return this.getThings('OVEN_W').item.status.substring(0,6) == 'closed'}],
    [new StandardOrder('pc::It\'s already closed.')]),


    new Interaction(['OPEN','OVEN_W'],
    [function(){return this.getThings('OVEN_W').item.status.substring(0,4) == 'open'}],
    [new StandardOrder('pc::It\'s already open.')]),


    new Interaction(['OPEN','OVEN_W'],
    [function(){return this.getThings('OVEN_W').item.status == 'closed_ham_inside'}],
    [new StandardOrder('pc::No, I\'d better leave it to get as cooked as possible.')]),


    new Interaction(['TAKE','FOIL_W'],[],
    takeFunction('FOIL_W','FOIL_I')), 

    new Interaction(['OPEN','CUPBOARD_W'],
    [function(){return !this.gameVars.cupboardEmpty}],
    [new StandardOrder('GAME','setGameStatus','CUTSCENE'),
    new StandardOrder('[var]',{cupboardEmpty:true}),
    new StandardOrder('pc','goTo','CUPBOARD_W'),
    new StandardOrder('pc','say','Let\'s see...'),
 //   new StandardOrder('GAME','getInventoryItem','BUCKET_SAND_I'),
    new StandardOrder('BUCKET_SAND_I','add',0),
    new StandardOrder('pc','say','...the old fire bucket...'),
 //   new StandardOrder('GAME','getInventoryItem','PLATTER_I'),
    new StandardOrder('PLATTER_I++',),
    new StandardOrder('pc','say','...the serving platter...'),
 //   new StandardOrder('GAME','getInventoryItem','BOURBON_I'),
    new StandardOrder('BOURBON_I','add',0),
    new StandardOrder('pc','say','...and a bottle of bourbon?! What\'s that doing here?'),
    new StandardOrder('GAME','setGameStatus','LIVE'),]
    ),

    new Interaction(['OPEN','CUPBOARD_W'],[],
    [new StandardOrder('pc::There was nothing else in there.')]),


    new Interaction(['WALK', 'KRUSTYBURGER_W'],
    [function() {return this.getThings('OVEN_W').item.status==='smoking'}, 
    function() {return this.allInventoryItemsAsObject.HAMBURGER_PLATTER_I.have === false},],
    function () {
        this.runSequence([
            new StandardOrder ('GAME', 'setGameStatus','CUTSCENE'),
            new StandardOrder ('pc', 'say','But what if I were to  purchase fast food and disguise it as my own cooking?',{time:2500}),
            new StandardOrder ('pc', 'say','Delightfully devilish, Seymour!'),
            new StandardOrder ('pc', 'goTo','KRUSTYBURGER_W'),
            new StandardOrder ('pc', 'setDefaultWait','window_wait'),
            new StandardOrder ('pc', 'setDefaultTalk','window_talk'),
            new StandardOrder ('GAME','teleportCharacter',['CHALMERS_C', 'KITCHEN_R', 100, -20]),
            new StandardOrder ('CHALMERS_C','goTo',{x:95, y:20}),
            new StandardOrder ('CHALMERS_C','goTo',{x:105, y:20}),
            new StandardOrder ('CHALMERS_C','say','Seymour!'),
            new StandardOrder ('pc', 'say','Superintendent, I was just- uh...',{time:2500, action:'window_talk'}),
            new StandardOrder ('GAME', 'setGameStatus','CONVERSATION','iWasJust'),
        ]) }
    )

]

var defaultResponses = {
    "WALK" : function(command) {this.getThings('pc').goTo(this.getThings(command.subject.id).walkToPoint, {wasManual:true})},
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