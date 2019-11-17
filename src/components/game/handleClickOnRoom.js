export default function (event){
    if (this.gameStatus !== 'LIVE') {return false}
    var pc = this.getThings('pc');
    var room = this.$refs.room;		
    var clickCoordinPx = {x: (event.offsetX),y: (room.$el.offsetHeight - event.offsetY)};

    if (event.target !== room.$el ) {
      clickCoordinPx.x += event.target.getClientRects()[0].x;
      clickCoordinPx.x -= room.$el.getClientRects()[0].x;	
      clickCoordinPx.y -= event.target.getClientRects()[0].y;
      clickCoordinPx.y += room.$el.getClientRects()[0].y;
    }

    var clickCoord = {
      x : clickCoordinPx.x * room.room.width  / room.$el.clientWidth,
      y : clickCoordinPx.y * room.room.height / room.$el.clientHeight,
    };

    this.$refs.coordinateDisplay.innerText = `[${Math.round(clickCoord.x)} , ${Math.round(clickCoord.y)}]`
    this.getThings('pc').goTo ( {x:clickCoord.x, y:clickCoord.y}, {wasManual: true});
  }