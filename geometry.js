
//point {x:int , y:int}
// polygon [points] (ordered clockwise?)

function isPointInsidePolygon(point, polygon) {
    var n = polygon.length;
    if (n<3) {return false}; 
    var extreme = {y:point.y, x:1000000};
    var intersections = 0;

    for (var c=0; c < n; c++ ) {
        if (doLineSegmentsIntersect(point, extreme, polygon[c], polygon[c + 1 < n.length ? c+1 : 0] ) ) {intersections++}
    };

    //if a line from the point to the extreme crosses lines of the polygon an odd number of time, the point is inside
    if (intersections%2) {return true;}
    return false;
}

function doesLineSegmentInterSectPolygon(p1,p2,polygon) {
    var n = polygon.length;
    if (n<3) {return false}; 

    //if either point is inside the polygon, is intersecting
    if (isPointInsidePolygon(p1, polygon) ) {return true};
    if (isPointInsidePolygon(p2, polygon) ) {return true};

    //if the line segment crosses any edge of the polygon, is intersecting

    for (var c=0; c < n; c++ ) {
        if (doLineSegmentsIntersect(p1, p2, polygon[c], polygon[c + 1 < n.length ? c+1 : 0] ) ) {return true}
    };

    return false;
}

function doLineSegmentsIntersect (p1, q1, p2, q2) {
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