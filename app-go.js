var vm = new Vue({
  el:'#app',

  data: {
    sprites : [
      {id:0, url: 'boy.png', row:4, col:4},
      {id:'m', url: 'mario.png', row:2, col:3},
      {id:2, url: 'boy2.png', row:4, col:4},
    ],
	characters : [
		{id:'npc', name:'Billy', speechColor: 'red',
		spritesUsed:[2,0], initialFrame:"0,0",
		baseHeight:50,baseWidth:50,
		startX:10,startY:150,
		cycles : {
			talk: [[0,0,0],[2,0,0]],
			walk: [[0,0,1],[0,1,1],[0,2,1],[0,3,1]  ]
		}},
		
		{id:'pc', name:'Mario', speechColor: 'blue', 
		spritesUsed:['m'],
		baseHeight:75,baseWidth:50,
		startX:20,startY:300,
		cycles : {
			walk: [ ['m',0,0],['m',1,0],['m',2,0]  ]
		}}
	]
  },

  mounted: function () {
  
  }

})

var pc = getChildByIdent('pc');
var npc = getChildByIdent('npc');
pc.say('Hi');
pc.say('I am '+pc.char.name);
pc.say('I have some dialogue');
pc.say('I have done.');

function getChildByIdent (ident,instance = vm) {
  var rightChild = null ;
  instance.$children.forEach((child) => {
    if ( child.ident === ident ) {rightChild = child}
  })
  return rightChild;
}
