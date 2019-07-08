function RectZone (x,y,width,height, definedByMidPoint) {
	
	// for RectZone defined by opposite corners
	// this.x = x1 < x2 ? x1 : x2;
	// this.y = y1 < x2 ? y1 : y2;
	// this.width = Math.abs(x1-x2);
	// this.height = Math.abs(y1-y2);
	this.height=height;
	this.width =width;	
	this.y = y;
	this.x = definedByMidPoint ? x - width/2 : x;
}

Object.defineProperties(RectZone.prototype, {
	center : {
		get: function(){ return {x : this.x + this.width/2, y:this.y+this.height/2} }
	},
	base : {
		get: function () { return {x:this.x + this.width/2, y:this.y} }
	},
	top    : { get: function () { return this.y+this.height; } } ,
	bottom : { get: function () { return this.y; } },
	left   : { get: function () { return this.x; } },
	right  : { get: function () { return this.x+this.width; } },
});

RectZone.prototype.containsPoint = function () {
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

RectZone.prototype.overlapsRectangle = function (rectangle) {
	return !(rectangle.x > this.x+this.width || 
			 rectangle.x+rectangle.width < this.x || 
			 rectangle.y+rectangle.height <= this.y ||
			 rectangle.y >= this.y+this.height);
};

RectZone.prototype.intersectsLineSegment = function (point1, point2) {
	if (this.containsPoint(point1)) {return true};
	if (this.containsPoint(point2)) {return true};
	
	var topLeft = 	{x:this.x , y:this.y},
	topRight = 		{x:this.x+this.width , y:this.y },
	bottomLeft = 	{x:this.x , y:this.y+this.height }
	bottomRight =	{x:this.x+this.width , y:this.y+this.height };
	
	if (Point.doLineSegmentsIntersect (point1, point2, topLeft, topRight)) {return true};
	if (Point.doLineSegmentsIntersect (point1, point2, topRight, bottomRight)) {return true};
	if (Point.doLineSegmentsIntersect (point1, point2, bottomRight, bottomLeft)) {return true};
	if (Point.doLineSegmentsIntersect (point1, point2, bottomLeft, topLeft)) {return true};
	return false;
}

function Point () {
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
	};
	
	
	this.x = x;
	this.y = y;
}

Point.doLineSegmentsIntersect = function  (p1, q1, p2, q2) {
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




function PolyZone (corners) {
	var vertices = [];
	for (var i=0; i<corners.length; i++) {
		vertices.push (new Point (corners[i][0], corners[i][1]))
	}
	this.corners = vertices;
};

PolyZone.prototype.containsPoint = function () {

	var point = new Point (...arguments);

    var n = this.corners.length;
    if (n<3) {return false}; 
    var extreme = {y:point.y, x:1000000};
    var intersections = 0;

    for (var c=0; c < n; c++ ) {
        if (Point.doLineSegmentsIntersect(point, extreme, this.corners[c], this.corners[c + 1 < n.length ? c+1 : 0] ) ) {intersections++}
    };

    //if a line from the point to the extreme crosses lines of the polygon an odd number of time, the point is inside
    if (intersections%2) {return true;}
    return false;

};


Object.defineProperty(PolyZone.prototype, 'boundingRect',{
	get: function() {
		var c = this.corners;
		var left=c[0].x, right=c[0].x,
		top=c[0].y, bottom=c[0].y;
		for (var i=1; i<c.length; i++) {
			left  = c[i].x < left  ? c[i].x : left;
			right = c[i].x > right ? c[i].x : right;
			bottom= c[i].y < bottom? c[i].y : bottom;	
			top   = c[i].y > top   ? c[i].y : top;
		};
		return {
			left:left, right:right, top:top, bottom:bottom
		};
	},
});

PolyZone.prototype.overlapsRectangle = function (rectangle) {
	if (this.boundingRect.left > rectangle.right ||
	this.boundingRect.right < rectangle.left ||
	this.boundingRect.top < rectangle.bottom ||
	this.boundingRect.bottom > rectangle.top) {
		return false;
	}; 
		
	for (var i= 0; i< this.corners.length; i++) {
		if ( rectangle.containsPoint(this.corners[i]) ) {return true;}
	};
	
	var rCorners = [ new Point (rectangle.left, rectangle.top), new Point (rectangle.right,rectangle.top), new Point (rectangle.right, rectangle.bottom), new Point (rectangle.left, rectangle.bottom)
	];
	
	
	
	// test crossing sides
	var n = this.corners.length;
	
	for (var i=0; i < n; i++ ) {
		for (var j=0; j < 4; j++ ) {	
			if (Point.doLineSegmentsIntersect(
			this.corners[i], this.corners[i + 1 < n.length ? i+1 : 0] , 
			rCorners[j], rCorners[j + 1 < 4 ? j+1 : 0]
			) ) {return true}
		}
    };
	
	
	for (var i= 0; i< rCorners.length; i++) {
		if ( this.containsPoint(rCorners[i]) ) {return true;}
	};
	
	return false;
}

PolyZone.prototype.intersectsLineSegment = function (point1, point2) {
	if (this.containsPoint(point1)) {return true};
	if (this.containsPoint(point2)) {return true};
	

	var n = this.corners.length;
	
	for (var i=0; i < n; i++ ) {
		if (Point.doLineSegmentsIntersect (
		point1,
		point2,
		this.corners[i], 
		this.corners[i + 1 < n.length ? i+1 : 0])) {
			return true
		};
	
	}
	
	return false;
}