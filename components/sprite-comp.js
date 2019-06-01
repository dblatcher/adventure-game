Vue.component('sprite-image',{

  props: ['width','height','sprite','fx','fy','index'],
  computed :{	
    styleObject: function(){
      return {
		display: this.index == this.sprite.id ? 'block' : 'none',
		backgroundImage: `url(${this.sprite.url})`,
        height: this.height +'px',
        width:  this.width + 'px',
        backgroundSize: `${this.sprite.col*this.width}px ${this.sprite.row*this.height}px`,
        backgroundPosition: `${-this.fx*this.width}px ${-this.fy*this.height}px`,
		position: 'absolute',
		margin: '0',
		bottom:'0',
		left:'0',
      }
    }
  },
  template: `
    <div class="sprite">
      <div v-bind:style="styleObject"></div>
    </div>
  `
});