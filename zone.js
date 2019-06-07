function Zone (x1,y1,x2,y2) {

	this.x = x1 < x2 ? x1 : x2;
	this.y = y1 < x2 ? y1 : y2;
	this.width = Math.abs(x1-x2);
	this.height = Math.abs(y1-y2);

	Object.defineProperties(this, {
		center : {
			get: function(){
				return {x : this.x + this.width/2, y:this.y+this.height/2}
			}
		}
	});
	
	this.contains = function (x,y) {	
		return ((this.x <= x && this.x + this.width >= x ) && (this.y <= y && this.y + this.height >= y));  
	};
	
	this.overlaps = function (otherZone) {
		return !(otherZone.x > this.x+this.width || 
				 otherZone.x+otherZone.width < this.x || 
				 otherZone.y+otherZone.height <= this.y ||
				 otherZone.y >= this.y+this.height);
		
	};
	
}
