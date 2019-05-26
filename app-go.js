var vm = new Vue({
  el:'#app',

  data: {
    sprites : [
      {id:0, url: 'boy.png', row:4, col:4},
      {id:2, url: 'boy2.png', row:4, col:4},
      {id:'m', url: 'mario.png', row:2, col:3},
    ],
	characters : [
		{id:'pc', name:'Billy', speechColor: 'red',
		spritesUsed:[2,0],
		validDirections : ['down','left','right','up'],
		baseHeight:50,baseWidth:50,
		startX:10,startY:10,
		cycles : {
			wait: [[0,0,0]],
			talk: [[0,0,0],[2,0,0]],
			walk: {
				up 	  : [[0,0,1],[0,1,1],[0,2,1],[0,3,1]  ],
				down  : [[0,0,0],[0,1,0],[0,2,0],[0,3,0]  ],
				left  : [[0,0,2],[0,1,2],[0,2,2],[0,3,2]  ],
				right : [[0,0,3],[0,1,3],[0,2,3],[0,3,3]  ],
			}
		},
		},
		
		{id:'npc', name:'Mario', speechColor: 'blue', 
		spritesUsed:['m'],
		validDirections : ['right','left'],
		baseHeight:75,baseWidth:50,
		startX:20,startY:30,
		cycles : {
			wait: {
				right: [ ['m',0,0] ],
				left : [ ['m',2,1] ],
			},
			walk: {
				right:[ ['m',0,0],['m',1,0],['m',2,0]  ],
				left: [ ['m',2,1],['m',1,1],['m',0,1]  ]
			}
		},
		}
	],
	rooms: [
		{id:'swamp', url: "bg1.png", width:400, height:300}
	],
	message: 'blank message'
  },
  methods : {
	logEvent: function(event) {
		console.log(event);
	}  
  },

  mounted: function () {

	var room = this.$children[0];  
	var pc = getChildByIdent('pc',room);
	pc.say('Hello, World. I am the player character.')
	
	marchRightThenLeft( getChildByIdent('npc',room) );
	 
	this.$on('get-report',function(component,data){
		var now = new Date();
		this.message = `${now.getHours()}:${now.getMinutes()}.${now.getSeconds()} : message from ${component.name}: ${data}.`
	});
	
	this.$on('clicked', function (component,type,event){
		
		if (type === 'room') {
			
			//TO DO -  generate path of steps to navigate around obsticles to closest valid point  
			var order = {
				y: (event.target.offsetHeight - event.clientY + event.target.offsetTop),
				x: (event.clientX - event.target.offsetLeft),
				action: 'walk'
			};
			
			var horizontal = order.x > pc.x ? 'right' : 'left';
			var vertical   = order.y > pc.y ? 'up' : 'down';
			
			var direction = Math.abs(order.x - pc.x) > Math.abs(order.y - pc.y) ? 
				horizontal:
				(pc.char.validDirections.includes(vertical) ? vertical : horizontal );
			
			order.direction = direction;
			
			
			
			console.log(order);
			pc.destinationQueue = [order];
		}
		
	});
	
  }

})

var room = vm.$children[0];
var pc = getChildByIdent('pc',room);
var npc = getChildByIdent('npc',room);

function stop (character) {
	character.destinationQueue = [];
	character.act('wait');
}

function marchRightThenLeft(character) {
	
	var goLeftThenTurn = function () {
		this.destinationQueue.push({x:character.x-150, y:character.y, action:'walk', direction: 'left'});
		this.say(' ',100);
		this.say('going left!');
		this.$once('reached-destination', goRightThenTurn);
	};
	
	var goRightThenTurn = function () {
		this.destinationQueue.push({x:character.x+150, y:character.y,action:'walk', direction: 'right'});
		this.say(' ',100);
		this.say('going right!');
		this.$once('reached-destination', goLeftThenTurn);
	};
	
	goRightThenTurn.apply(character,[]);

}

function getChildByIdent (ident,instance = vm) {
  var rightChild = null ;
  instance.$children.forEach((child) => {
    if ( child.ident === ident ) {rightChild = child}
  })
  return rightChild;
}
