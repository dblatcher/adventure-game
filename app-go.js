var vm = new Vue({
  el:'#app',

  data: {
    sprites : [
      {id:0, url: 'boy.png', row:4, col:4},
      {id:2, url: 'boy2.png', row:4, col:4},
      {id:'m', url: 'mario.png', row:2, col:3},
    ],
	characters : [
		{id:'npc', name:'Billy', speechColor: 'red',
		spritesUsed:[2,0],
		validDirections : ['down','left','right','up'],
		baseHeight:50,baseWidth:50,
		startX:10,startY:150,
		cycles : {
			wait: [[0,0,0]],
			talk: [[0,0,0],[2,0,0]],
			walk: [[0,0,1],[0,1,1],[0,2,1],[0,3,1]  ]
		},
		},
		
		{id:'pc', name:'Mario', speechColor: 'blue', 
		spritesUsed:['m'],
		validDirections : ['right','left'],
		baseHeight:75,baseWidth:50,
		startX:20,startY:300,
		cycles : {
			wait: {
				right: [ ['m',0,0]  ],
				left: [ ['m',2,1] ],
			},
			walk: {
				right:[ ['m',0,0],['m',1,0],['m',2,0]  ],
				left: [ ['m',2,1],['m',1,1],['m',0,1]  ]
			}
		},
		}
	],
	message: 'blank message'
  },
  methods : {
	logEvent: function(event) {
		console.log(event);
	}  
  },

  mounted: function () {
	this.$on('get-report',function(component,data){
		var now = new Date();
		this.message = `${now.getHours()}:${now.getMinutes()}.${now.getSeconds()} : message from ${component.name}: ${data}.`
	})
  }

})

var pc = getChildByIdent('pc');
var npc = getChildByIdent('npc');


function getChildByIdent (ident,instance = vm) {
  var rightChild = null ;
  instance.$children.forEach((child) => {
    if ( child.ident === ident ) {rightChild = child}
  })
  return rightChild;
}
