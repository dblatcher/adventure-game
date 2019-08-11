<template>
    <canvas id="canvas"
		v-bind:height="room.height" 
		v-bind:width="room.width" 
    > </canvas>
</template>

<script>
export default {
    name: 'CanvasOverLay',
    props: ['room'],
    methods : {

	plotZone : function (zone, color,fill) {
        let ctx = this.$el.getContext('2d');
        let h = this.room.height;
		ctx.beginPath();
	
		if (zone.type === 'PolyZone') {
			ctx.moveTo(zone.corners[0].x, h - zone.corners[0].y);
			for (var i=1; i<zone.corners.length; i++) {
				ctx.lineTo(zone.corners[i].x, h- zone.corners[i].y);
			}
			ctx.closePath();			
		};
	
		if (zone.type === 'RectZone') {
			ctx.moveTo(zone.left,h-zone.top);
			ctx.lineTo(zone.right,h-zone.top);
			ctx.lineTo(zone.right,h-zone.bottom);
			ctx.lineTo(zone.left,h-zone.bottom);
		};

		ctx.strokeStyle = fill ? 'white' : color || 'red';
		ctx.stroke();
		
		ctx.fillStyle = fill ?  color || 'red' :'rgba(100,100,100,0.1)';
		ctx.fill();
	},
	

    },
    mounted: function() {
        window.overlay = this;
        window.ctx = this.$el.getContext('2d');
    },
}
</script>

<style scoped>
    canvas {
        height:100%;
        width: 100%;
    }
</style>

