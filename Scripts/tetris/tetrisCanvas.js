const pixleRatio = window.devicePixelRatio || 1
// Note, the canvas is still a size fixed somewhere else, but the pixel ratio is used to scale the canvas
const boxSize = 40 * pixleRatio
const lineHeight = 1;

class TetrisCanvas{

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
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(0,0,28 * boxSize,29 * boxSize);

        //drawing the grid
        this.ctx.fillStyle = "grey";
        for(let verticalLineNumber = 1; verticalLineNumber <= 19; verticalLineNumber++){
            this.ctx.fillRect(this.offsetLeft, (this.offsetTop + boxSize * verticalLineNumber) + (this.lineHeight * verticalLineNumber), 10 * boxSize + 10, this.lineHeight);
        }

        for(let horizontalLineNumber = 0; horizontalLineNumber <= 10; horizontalLineNumber++){
            this.ctx.fillRect(this.offsetLeft + (boxSize * horizontalLineNumber) + (this.lineHeight * horizontalLineNumber),this.offsetTop,this.lineHeight,20 * boxSize + 20)
        }

        //drawing the border
        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle="rgba(0,0,0,1)";
        this.ctx.strokeRect(this.offsetLeft + 0.75 ,this.offsetTop + 1.5 , 10 * boxSize + 11.5 ,20 * boxSize + 20);

        //drawing boxes
        this.drawBoxes(rowsBelow,game[0],game[1]);
        this.drawHold(game[2]);
        this.drawNext(game[3]);
        this.drawTitle();
        this.drawLabels();
        this.drawScore(tilesCleared)
        return true;
    }

    drawBox(x, y, color, size, lineSize){
        // x is this.offsetLeft + (column) * (width + line) + line
        // y is this.offsetTop + (row) * (height + line )+ line

        // draw the box itself
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, size, size)

        // draw a black border around the box
        this.ctx.fillStyle = "black"
        this.ctx.fillRect(x, y, size, lineSize)
        this.ctx.fillRect(x, y, lineSize, size)
        this.ctx.fillRect(x, y + size, size, lineSize)
        this.ctx.fillRect(x + size, y, lineSize, size)
    }

    drawTitle(){
        let factor = 2;
        let width = boxSize / factor;
        let height = boxSize / factor;
        let line = this.lineHeight / factor;
        
        let t = [[0,0],[0,1],[0,2],[1,1],[2,1],[3,1],[4,1]];
        let e = [[0,0],[0,1],[0,2],[1,0],[2,0],[2,1],[3,0],[4,0],[4,1],[4,2]];
        let r = [[0,0],[0,1],[0,2],[1,0],[1,3],[2,0],[2,1],[2,2],[2,3],[3,0],[3,2],[4,0],[4,3]];
        let i = [[0,1],[1,1],[2,1],[3,1],[4,1]];
        let s = [[0,0],[0,1],[0,2],[1,0],[2,1],[3,2],[4,0],[4,1],[4,2]];
        let colors = ["rgb(255,0,0)","rgb(252,159,0)","rgb(233,248,0)","rgb(0,255,25)","rgb(0,247,245)","rgb(186,0,242)"];
        let tetrisName = [t,e,t,r,i,s];
        for(let j = 0; j < tetrisName.length; j++){
            let letter = tetrisName[j];
            for(let i = 0; i < letter.length; i++){
                let column = letter[i][1] + (j * 4) - 1  ;
                if(j == tetrisName.length - 1){
                    column -= 1;
                }
                let row = letter[i][0] - 6;
                this.drawBox(this.offsetLeft + (column) * (width + line) + line, this.offsetTop + (row) * (height + line )+ line,colors[j],height, line)
            }
        }  
    }

    drawScore(score){
        this.ctx.fillStyle = "black";
        this.ctx.font = boxSize * 1.25 + "px VT323";;
        this.ctx.textAlign = "right";
        const zeroPad = (num, places) => String(num).padStart(places, '0')
        this.ctx.fillText(zeroPad(score, 7), this.offsetLeft + 16 * boxSize + 12 * this.lineHeight  , this.offsetTop - .5 * boxSize);
    }

    drawLabels(){
        this.ctx.fillStyle = "black";
        this.ctx.font = boxSize * 1.25 + "px VT323";
        this.ctx.textAlign = "center";
        this.ctx.fillText("Hold",this.offsetLeft - boxSize * 3.5 ,boxSize * 9);
        this.ctx.fillText("Next",this.offsetLeft + boxSize * 13.5 + 12 * this.lineHeight,boxSize * 9);
    }

    // draw all the boxes
    drawBoxes(rowsBelow,gameBoard,currentObject){
        for(let i = 199; i >= 0; i--){
            if(gameBoard[i].box != undefined){
                let box = gameBoard[i].box
                let column = box.column;
                let row = box.row;
                this.drawBox(
                    this.offsetLeft + (column) * (boxSize + this.lineHeight) + this.lineHeight, 
                    this.offsetTop + (row) * (boxSize + this.lineHeight )+ this.lineHeight,box.color,
                    boxSize, 
                    this.lineHeight
                )
            }
        }

        // draw the ghost piece on the bottom
        let rowAdded = rowsBelow
        for(let i = 0; i < currentObject.length; i++){
            let box = currentObject[i]
            let row = box.row + rowAdded
            let column = box.column;
            this.drawBox(this.offsetLeft + (column) * (boxSize + this.lineHeight) + this.lineHeight, this.offsetTop + (row) * (boxSize + this.lineHeight) + this.lineHeight, "rgb(229, 229, 229)", boxSize, this.lineHeight + 2)
        } 
    }

    // used to draw the next object and the hold object
    drawUIBlock(object, x, y) {
        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle="rgba(0,0,0,1)";
        this.ctx.strokeRect(this.offsetLeft + boxSize * 11 + 12 * this.lineHeight, this.offsetTop + 1.5,boxSize * 5 ,boxSize * 4);
        let blockType = object[0].blockType
        let r; 
        let c;
        if(blockType == 1){
            r = -1/2;
            c = 3;
        }else if(blockType == 2){
            r = 0
            c = 3;
        }else if(blockType == 5){
            r = 0
            c = 3.5 
        }else{
            r = 0
            c = 2.5
        }
       
        for(let i = 0; i < object.length; i++){
                let box = object[i]
                let column = box.column - 2;
                let row = box.row;
                this.drawBox(
                    this.offsetLeft + boxSize * (13.5 + column - c) + 12 * this.lineHeight, 
                    boxSize * (4.5 - r + row), 
                    box.color,
                    boxSize, 
                    this.lineHeight
                )
        }
    }

    drawNext(nextObject){
        this.drawUIBlock(nextObject, this.offsetLeft + boxSize * 13.5, this.offsetTop)
        // this.ctx.lineWidth = 3;
        // this.ctx.strokeStyle="rgba(0,0,0,1)";
        // this.ctx.strokeRect(this.offsetLeft + boxSize * 11 + 12 * this.lineHeight, this.offsetTop + 1.5,boxSize * 5 ,boxSize * 4);
        // let blockType = nextObject[0].blockType
        // let r; 
        // let c;
        // if(blockType == 1){
        //     r = -1/2;
        //     c = 3;
        // }else if(blockType == 2){
        //     r = 0
        //     c = 3;
        // }else if(blockType == 5){
        //     r = 0
        //     c = 3.5 
        // }else{
        //     r = 0
        //     c = 2.5
        // }
       
        // for(let i = 0; i < nextObject.length; i++){
        //         let box = nextObject[i]
        //         let column = box.column - 2;
        //         let row = box.row;
        //         this.drawBox(
        //             this.offsetLeft + boxSize * (13.5 + column - c) + 12 * this.lineHeight, 
        //             boxSize * (4.5 - r + row), 
        //             box.color,
        //             boxSize, 
        //             this.lineHeight
        //         )
        // }
    }

    drawHold(holdObject){
        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle="rgba(0,0,0,1)";
        this.ctx.strokeRect(this.offsetLeft - boxSize * 6, this.offsetTop + 1.5 ,boxSize * 5, boxSize * 4);
        if(holdObject != undefined){
            let blockType = holdObject[0].blockType
            let r; 
            let c;
            if(blockType == 1){
                r = -1/2;
                c = 3;
            }else if(blockType == 2){
                r = 0
                c = 3;
            }else if(blockType == 5){
                r = 0
                c = 3.5 
            }else{
                r = 0
                c = 2.5
            }
            for(let i = 0; i < holdObject.length; i++){
                let box = holdObject[i]
                let column = box.column - 2;
                let row = box.row;
                this.ctx.fillStyle = box.color;
                this.ctx.fillRect(boxSize * (3.5 + column - c),    boxSize * (4.5 - r + row),     boxSize,boxSize)

                this.ctx.fillStyle = "black"
                this.ctx.fillRect(boxSize * (3.5 + column - c),     boxSize * (4.5  - r + row),     boxSize + 2.5 ,2.5)
                this.ctx.fillRect(boxSize * (3.5 + column - c),     boxSize * (4.5  - r + row),     2.5,boxSize + 2.5)
                this.ctx.fillRect(boxSize * (3.5 + column - c),     boxSize * (4.5  - r + row + 1), boxSize + 2.5,2.5)
                this.ctx.fillRect(boxSize * (3.5 + column + 1 - c), boxSize * (4.5  - r + row),     2.5,boxSize + 2.5)
            }
       }
    }
}