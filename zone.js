function Zone (xMid,yBase,width,height) {
	
	// for Zone defined by opposite corners
	// this.x = x1 < x2 ? x1 : x2;
	// this.y = y1 < x2 ? y1 : y2;
	// this.width = Math.abs(x1-x2);
	// this.height = Math.abs(y1-y2);

	this.height=height;
	this.width =width;
	
	this.y = yBase;
	this.x = xMid - width/2;
	
	Object.defineProperties(this, {
		center : {
			get: function(){
				return {x : this.x + this.width/2, y:this.y+this.height/2}
			}
		},
		base : {
			get: function () {
				return {x:this.x + this.width/2, y:this.y}
			}
		}
	});
		
}

Zone.prototype.containsPoint = function () {
	var x,y;
	if (arguments.length >= 2 ) {
		if (typeof arguments[0] === 'number' && typeof arguments[1] === 'number') {
			x = arguments[0];
			y = arguments[1];
		}
	};
	if ( typeof arguments[0] === 'object' ) {
		x = arguments[0].x;
		y = arguments[0].y;
	}
	return ((this.x <= x && this.x + this.width >= x ) && (this.y <= y && this.y + this.height >= y));  
};

Zone.prototype.overlaps = function (otherZone) {
	return !(otherZone.x > this.x+this.width || 
			 otherZone.x+otherZone.width < this.x || 
			 otherZone.y+otherZone.height <= this.y ||
			 otherZone.y >= this.y+this.height);
};

Zone.prototype.intersectsLineSegment = function (point1, point2) {
	if (this.containsPoint(point1)) {return true};
	if (this.containsPoint(point2)) {return true};
	
	// The main function that returns true if line segment 'p1q1' and 'p2q2' intersect. 
	function lineSegmentsIntersect (p1, q1, p2,q2) {
		// Given three colinear points p, q, r, the function checks if 
		// point q lies on line segment 'pr' 
		function onSegment(p,q,r) { 
			if (q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) &&  q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y)) {
				 return true; 
			}  
			return false; 
		} 

		// To find orientation of ordered triplet (p, q, r). 
		// The function returns following values 
		// 0 --> p, q and r are colinear 
		// 1 --> Clockwise 
		// 2 --> Counterclockwise 
		function orientation(p,q,r) { 
				var val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y); 
				if (val == 0) return 0;  // colinear 
				return (val > 0)? 1: 2; // clock or counterclock wise 
		} 

		// Find the four orientations needed for general and 
		// special cases 
		var o1 = orientation(p1, q1, p2); 
		var o2 = orientation(p1, q1, q2); 
		var o3 = orientation(p2, q2, p1); 
		var o4 = orientation(p2, q2, q1); 
	
		// General case 
		if (o1 != o2 && o3 != o4) {return true};
	
		// Special Cases 
		// p1, q1 and p2 are colinear and p2 lies on segment p1q1 
		if (o1 == 0 && onSegment(p1, p2, q1)) {return true}; 
	
		// p1, q1 and q2 are colinear and q2 lies on segment p1q1 
		if (o2 == 0 && onSegment(p1, q2, q1)) {return true}; 
	
		// p2, q2 and p1 are colinear and p1 lies on segment p2q2 
		if (o3 == 0 && onSegment(p2, p1, q2)) {return true}; 
	
		 // p2, q2 and q1 are colinear and q1 lies on segment p2q2 
		if (o4 == 0 && onSegment(p2, q1, q2)) {return true}; 
	
		return false; // Doesn't fall in any of the above cases 
	} 
	
	var topLeft = 	{x:this.x , y:this.y},
	topRight = 		{x:this.x+this.width , y:this.y },
	bottomLeft = 	{x:this.x , y:this.y+this.height }
	bottomRight =	{x:this.x+this.width , y:this.y+this.height };
	
	if (lineSegmentsIntersect (point1, point2, topLeft, topRight)) {return true};
	if (lineSegmentsIntersect (point1, point2, topRight, bottomRight)) {return true};
	if (lineSegmentsIntersect (point1, point2, bottomRight, bottomLeft)) {return true};
	if (lineSegmentsIntersect (point1, point2, bottomLeft, topLeft)) {return true};
	return false;
}