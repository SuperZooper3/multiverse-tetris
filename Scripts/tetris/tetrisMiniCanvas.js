class TetrisMiniCanvas{

    constructor(lineHeight){
        this.cvs = document.getElementById("tetris");
        this.ctx = this.cvs.getContext("2d");
        this.offsetLeft = 7 * boxSize - lineHeight * 6;
        this.offsetTop = 3.66 * boxSize;
        this.lineHeight = lineHeight;

        this.heightPixels = 25 * boxSize;
        this.widthPixels = 24 * boxSize;
        this.boxSize = 2.5;
    }

    draw(rowsBelow, game, tilesCleared){
        this.ctx.canvas.height  = this.heightPixels;
        this.ctx.canvas.width  = this.widthPixels;

        //clearing the canvas
        this.ctx.fillStyle = `#${Math.floor(Math.random()*16777215).toString(16)}`;
        this.ctx.fillRect(0,0,28 * boxSize,29 * boxSize);
    }
}