
Vue.component('character-c', {

	props:['char'],
	data: function() {		
		var spriteSet = [];		
		var fullSet = this.$parent.$data.sprites;
		for (var i=0; i< fullSet.length; i++) {		
			if (this.char.spritesUsed.includes(fullSet[i].id)) {spriteSet.push ( Object.assign({}, fullSet[i], {p:this} ) )	}
		};
		
		return {
		spriteSet : spriteSet,
		ident: this.char.id,
		name: this.char.name,
		x: this.char.startX ? Number (this.char.startX) : 0, 
		y: this.char.startY ? Number (this.char.startY) : 0,
		scale:this.char.initialScale || 1,
		baseHeight: this.char.baseHeight || 100,
		baseWidth: this.char.baseWidth || 100,
		saying:'', sayingQueue :[],
		action:'wait', actFrame:0, actionOnLoop:true,
		direction:this.char.validDirections[0],
		destinationQueue:[]
		}
	},
	computed :{
		scaledHeight : function() {return this.scale * this.baseHeight;},
		scaledWidth : function() {return this.scale * this.baseWidth;},
		isTalking : {
			get: function() {return this.saying !== ''},
			set: function(v) {if (v===false){this.saying=''; this.sayingQueue=[]}}
		},
		frame : function() {			
			var directionNeeded = !Array.isArray(this.char.cycles[this.action]);
			var v = directionNeeded ? 
				this.char.cycles[this.action][this.direction][this.actFrame]:
				this.char.cycles[this.action][this.actFrame];
			
			return {sprite: v[0], fx:v[1], fy:v[2]}
		}
	},
	methods : {
		move : function () {
			if (this.destinationQueue.length === 0) {return false};
			
			var d = {x: this.destinationQueue[0].x - this.x, y:this.destinationQueue[0].y - this.y};
			//console.log(d);
			var speed = 5;
			
			if (d.x === 0) {
				
			} 
			
			
		},
		act : function (action, options = {}, callBack) {
			if (typeof action  !== 'string') {return false;}
			if (!this.char.cycles[action]) {return false;}
			
			if (options.direction) {
				if (this.char.validDirections.includes(options.direction)) {
					this.direction = options.direction;
				}
			};
			
			var directionNeeded = !Array.isArray(this.char.cycles[action]);		
			if (directionNeeded) {
				var availableDirections = Object.keys(this.char.cycles[action]);				
				this.direction = availableDirections.includes(this.direction) ? this.direction : availableDirections[0];
			}
			
			this.actionOnLoop = options.loop || false;
			this.action = action; this.actFrame = 0;
		},
		showNextFrame : function () {
			var directionNeeded = !Array.isArray(this.char.cycles[this.action]);
			var cycle = directionNeeded ? 
				this.char.cycles[this.action][this.direction] :
				this.char.cycles[this.action] ;

			var onLastFrame = !(cycle.length > this.actFrame+1);
			this.actFrame = onLastFrame ? 0: this.actFrame + 1;
			
			if (onLastFrame && !this.actionOnLoop) {
				this.$root.$emit('get-report',this,'last frame');
				this.action = 'wait';
				this.actionOnLoop = true;
			}
		},
		say : function (text, time) {
			if (typeof time !== 'number') {time = 1000}
			var that = this;
			
			if (that.isTalking === false) {
				that.saying = text;
				setTimeout(endOfLine,time);
			} else {
				that.sayingQueue.push({text:text, time:time});
			};
			
			function endOfLine () {
				if (that.sayingQueue.length) {
					var newLine = that.sayingQueue.shift();
					that.saying = newLine.text;
					setTimeout(endOfLine,newLine.time);
				} else {
					that.saying = '';
				}	
			};
		}
	},
	mounted : function() {
		this.say('Hello world, I am '+this.name+'.')
		
		var that = this;
		setInterval (function(){
			that.showNextFrame();
			that.move();
		},250);
	},
	template: `
	
	<article>
		<div v-bind:style="{
			position: 'absolute',
			height: scaledHeight+'px',
			width: scaledWidth+'px',
			bottom: y+'px',
			left: x+'px'}">
			<sprite-image v-for="sprite in this.spriteSet":key="sprite.id"
				v-bind:sprite="sprite"
				v-bind:fx="sprite.p.frame.fx" 
				v-bind:fy="sprite.p.frame.fy"
				v-bind:height="sprite.p.scaledHeight"
				v-bind:width="sprite.p.scaledWidth"
				v-bind:index="sprite.p.frame.sprite"
				></sprite-image>
		</div>
		
		<speech-line v-bind:style="{
				position: 'absolute',
				bottom: (y+scaledHeight)+'px',
				left: x+'px'}"
			v-bind:text="saying"
			v-bind:color="char.speechColor"
		></speech-line>				
		
	</article>
	`
})

