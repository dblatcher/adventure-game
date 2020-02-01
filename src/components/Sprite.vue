<template>
  <div class="sprite">
    <div v-bind:style="styleObject"></div>
  </div>
</template>

<script>
export default {
  name: 'Sprite',
  props: ['width','height','sprite','fx','fy','index','measure'],
  computed :{	
	  styleObject: function(){
	  const {scale, unit} = this.measure
	  const {sprite} = this

	  if(this.index != sprite.id ) {return {
		  display:'none'
	  }}
	  

	  var rH = (sprite.relativeHeight || 1);
	  var rW = (sprite.relativeWidth || 1);
	  var backgroundSizeWidth       = rW * sprite.col*this.width* scale;
	  var backgroundSizeHeight      = rH * sprite.row*this.height* scale;
	  var backgroundPositionXOffset = -this.fx*this.width * rW * scale;
	  var backgroundPositionYOffset = -this.fy*this.height* rH * scale;
	  
	  var xShift = (sprite.xOffset) + '%';
	  var yShift = (sprite.yOffset) + '%';

	  return {
		display: 'block',
		backgroundImage: `url(${sprite.url})`,
        height: ( rH * this.height * scale) + unit,
        width:  ( rW * this.width  * scale) + unit,
        backgroundSize: `${backgroundSizeWidth}${unit} ${backgroundSizeHeight}${unit}`,
        backgroundPosition: `${backgroundPositionXOffset}${unit} ${backgroundPositionYOffset}${unit}`,
		position: 'absolute',
		margin: '0',
		bottom: yShift,
		left: xShift,
      }
    }
  },
}
</script>





