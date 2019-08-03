<template>
	<main class="room"
	v-on:click="clickHandler($event)"
	v-bind:style="styleObject">
		<slot></slot>
		<div  v-for="fg in foregrounds":key="fg.id"
		v-bind:style="fg.style">
		</div>
	</main>
</template>

<script>
export default {
	name:'Room',
		props: ['room','measure'],
	data: function() { return {
		
	}},
	methods : {
		clickHandler : function (event) {
			this.$parent.$emit('clicked-room', event);	
		},
		resize : function (event) {
			let widthRatio  = this.$el.parentElement.clientWidth  / this.$el.offsetWidth;
			let heightRatio = this.$el.parentElement.clientHeight / this.$el.offsetHeight;
			this.$parent.roomMeasure.scale *= Math.min(widthRatio, heightRatio);
		}
	},
	computed: {
		ident: function() {
			return this.room.id;
		},
		name: function() {
			return this.room.name;
		},
		styleObject : function() {
			return {
				width:  (this.room.width  * this.measure.scale) + this.measure.unit,
				height: (this.room.height * this.measure.scale) + this.measure.unit,
				backgroundSize: '100% 100%',
				backgroundImage: `url(${this.room.url})`,
			}
		},
		foregrounds : function() {
			var list=[], rData = this.room.foregrounds;
			
			for (var i=0; i< rData.length; i++) {
				list.push( 
				{ id:i,	style:Object.assign( rData[i].style, {
					backgroundSize: '100% 100%',
					position:'absolute',
					width:  (rData[i].width  * this.measure.scale) + this.measure.unit,
					height: (rData[i].height * this.measure.scale) + this.measure.unit,
					left: (rData[i].x * this.measure.scale) + this.measure.unit,
					bottom: (rData[i].y * this.measure.scale) + this.measure.unit,
					zIndex: rData[i].zIndex || 5000,
					backgroundImage: `url(${rData[i].url})`,
				})
				}
				
				)
			};
			
			return list;
		},
	},

	created() {
		console.log('room created');
		window.addEventListener("resize", this.resize);
	},
	destroyed() {
		console.log('room destoryed')
		window.removeEventListener("resize", this.resize);
	},
	mounted() {
		this.resize();
	}



}
</script>





