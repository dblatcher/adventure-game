import { Graph, astar } from "../../modules/astar";
import { RectZone} from "../../modules/zone";

function findPath (startPoint, endPoint) {
    var i, obstacles = this.rooms[this.roomNumber].obstacles, directPath = true;
    for (i=0; i < obstacles.length; i++) {
      if (obstacles[i].intersectsLineSegment(startPoint, endPoint)){
        directPath = false;
        break;
      }
    }
    if (directPath) {return [{x:endPoint.x, y:endPoint.y}]}

    var g = new Graph(this.grid,{diagonal:true}); 
    var cellSize = 3;
    var sx = Math.floor (startPoint.x / cellSize); 
    var sy = Math.floor (startPoint.y / cellSize); 
    var ex = Math.floor (endPoint.x / cellSize); 
    var ey = Math.floor (endPoint.y / cellSize); 

    // TO DO if start or end is not accessible, find closest open point?
    // To DECIDE what is open? what is closest

    var gridPath = astar.search (g,g.grid[sy][sx],g.grid[ey][ex]); 
    function getPointFromNode(node) {
      return { // don't know why coord are reversed. It seems to work.
      x: (node.y*cellSize) + cellSize/2, 
      y : (node.x*cellSize) + cellSize/2, 
      }
    }

    //i defined above
    var path = [],l,dx,dy, dxn,dyn;
    for (i=0; i< gridPath.length; i++) { 
      path.push(getPointFromNode(gridPath[i]));		
      l = path.length-1;
      if (l >= 2 && i < gridPath.length-1 ) {
        dx = path[l-2].x - path[l-1].x;
        dy = path[l-2].y - path[l-1].y;
        dxn = path[l-1].x - path[l].x;
        dyn = path[l-1].y - path[l].y;
        
        if (dx === dxn && dy === dyn) {
          path.pop();
        }
      }
    }
    return path;
  }

function makeGrid() {
    var obstacles = this.rooms[this.roomNumber].obstacles;
    var cellSize = 3;	
    var columns = Math.ceil(this.rooms[this.roomNumber].width/cellSize), 
    rows = Math.ceil(this.rooms[this.roomNumber].height/cellSize),x,y, grid = [];
    function cellValue(x,y){
      var cell = new RectZone (x*cellSize, y*cellSize, cellSize, cellSize, false), i;
      for (i=0; i<obstacles.length; i++) {
        if (obstacles[i].overlapsRectangle(cell)) {return 0}
      }
      return 1;
    }
    
    for (y = 0; y < rows; y++) {
      grid.push([]);
      for (x = 0; x < columns; x++) {
        grid[y].push( cellValue (x,y));
      }	
    }		
    return grid;	
    
  }

  export {findPath, makeGrid }