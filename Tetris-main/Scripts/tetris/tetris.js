


class Tetris{

    constructor(){
        this.currentObject = undefined
        this.nextObject = undefined;
        this.holdObject = undefined;
        this.tetrisObject = new TetrisObject();
        this.gameBoard = new GameBoard();  
        this.createObject(0);
        this.swapHold();
    }    

    reset(){
        this.currentObject = undefined
        this.nextObject = undefined;
        this.holdObject = undefined;
        this.tetrisObject = new TetrisObject();
        this.gameBoard = new GameBoard();  
        this.createObject(0);
        this.swapHold();
    }

    getGame(){
        return [this.gameBoard,this.currentObject,this.holdObject,this.nextObject];
    }

    moveLeft(){
        for(let i = 0; i < this.currentObject.length; i++){
            let row = this.currentObject[i].row;
            let column = this.currentObject[i].column;
            if(column <= 0) return;
            if(!(this.gameBoard[((row) * 10 + column - 1 )].box == undefined || this.currentObject.includes(this.gameBoard[((row) * 10 + column - 1 )].box))) return; 
        }
        for(let i = 0; i < this.currentObject.length; i++){
            let row = this.currentObject[i].row;
            let column = this.currentObject[i].column;
            this.gameBoard[((row) * 10 + column  - 1)].box = this.currentObject[i];
            this.gameBoard[row * 10 + column].box = undefined
            this.currentObject[i].column -= 1
        }
    }

    moveRight(){
        for(let i = 0; i < this.currentObject.length; i++){
            let row = this.currentObject[i].row;
            let column = this.currentObject[i].column;
            if(column >= 9) return;
            if(!(this.gameBoard[((row) * 10 + column + 1 )].box == undefined || this.currentObject.includes(this.gameBoard[((row) * 10 + column + 1 )].box) )) return      
        }
        for(let i = this.currentObject.length-1; i >= 0 ; i--){
            let row = this.currentObject[i].row;
            let column = this.currentObject[i].column;
            this.gameBoard[((row) * 10 + column  + 1)].box = this.currentObject[i];
            this.gameBoard[row * 10 + column].box = undefined
            this.currentObject[i].column += 1
        }
    }

    moveDown(){   
        let count = 0;                
        for(let i = 0; i < this.currentObject.length; i++){
            let row = this.currentObject[i].row;
            let column = this.currentObject[i].column;
            if(row < 19){
                if(this.gameBoard[((row+1) * 10 + column )].box == undefined || this.currentObject.includes(this.gameBoard[((row + 1) * 10 + column )].box)){
                    count++;
                } 
            }
        }        
        if(count == this.currentObject.length){
            for(let i = this.currentObject.length - 1; i >= 0; i--){
                for(let j = this.currentObject.length - 1; j >= 0; j--){
                    if(this.currentObject[j].blockPosition == i){
                        let row = this.currentObject[j].row;
                        let column = this.currentObject[j].column;
                        this.gameBoard[((row+1) * 10 + column )].box = this.currentObject[j];
                        this.gameBoard[row * 10 + column].box = undefined
                        this.currentObject[j].row += 1
                    }
                }
            }
        }   
        this.checkForRow();
        this.checkCurrent();
    }

    moveAllDown(row){
        for(let i = (row * 10) - 1; i >= 0; i--){   
            if(this.gameBoard[i + 10].box == undefined && this.gameBoard[i].box != undefined){ 
                this.gameBoard[i + 10].box = this.gameBoard[i].box
                this.gameBoard[i].box = undefined
                this.gameBoard[i+10].box.row += 1;
            }  
        }
    }

    dropPiece(){
        let r = this.predictLanding();
        this.gameBoard.removeFromBoard(this.currentObject);
        for(let i = this.currentObject.length-1; i >= 0 ; i--){
            this.currentObject[i].row += r;
        }
        this.gameBoard.addToBoard(this.currentObject);
    }

    predictLanding(){
        let rowsDown = [];                           
        for(let j = 0; j < this.currentObject.length; j++){
            let count = 0;
            let spot = this.currentObject[j].column;
            for(let i = this.currentObject[j].row + 1; i < (20); i++){
                if(this.gameBoard[spot + (i * 10)].box == undefined || this.currentObject.includes(this.gameBoard[spot + ( i * 10)].box)){
                    count++;
                }else{
                    break;
                }
            }
            rowsDown[j] = count;   
        }
        return Math.min.apply(Math,rowsDown);
    }  

    checkForRow(){
        let countToTen = 0;
        let counter = 0
        let rowsDeleted = [];
        for(let i = 199; i >= 0; i--){
            for(let j = this.currentObject.length - 1; j >= 0; j--){
                if(this.gameBoard[i].box == this.currentObject[j]){
                    if(this.checkCurrent()){
                        counter-- 
                    }
                }
            }
            if(this.gameBoard[i].box != undefined){                 
                counter++;
            }
            if(counter == 10){
                rowsDeleted[rowsDeleted.length] = (i / 10);
                counter = 0
                for(let j = 0; j < 10; j++){
                    this.gameBoard[i + j].box = undefined

                }
            }
            countToTen++

            if(countToTen > 9){
                countToTen = 0;
                counter = 0;
            }
        }
        for(let i = rowsDeleted.length; i > 0;i--){
            this.moveAllDown(rowsDeleted[i-1]) 
        }
        return true;
    }
   
    //check to see if the current peice being moves can fall farther
    checkCurrent(){
        for(let i = 0; i < this.currentObject.length; i++){
            let row = this.currentObject[i].row;
            let column = this.currentObject[i].column;
            if(row >= 19) return false
            if(this.gameBoard[((row+1) * 10 + column )].box != undefined && !this.currentObject.includes(this.gameBoard[((row + 1) * 10 + column )].box)) return false   
        }
        return true;
    }

    createObject(method){
        let object; 
        if(method == 0){
            let objects = this.tetrisObject.newObject(this.currentObject,this.nextObject,method);
            this.currentObject = objects[0];
            this.nextObject = objects[1];
            for(let i = 0; i < this.currentObject.length; i++){
                if(this.gameBoard[this.currentObject[i].column + (this.currentObject[i].row * 10)].box != undefined){
                    return false;
                }
            }
            
            this.gameBoard.addToBoard(this.currentObject);
        }else{
            object = this.tetrisObject.createObject(method)
        }
        return object
    }      

    swapHold(){
        if(this.holdObject == undefined){                
            this.gameBoard.removeFromBoard(this.currentObject);
            this.holdObject = this.createObject(this.currentObject[0].blockType);
            this.currentObject = undefined
            this.createObject(0);
        }else{
            let temp = this.currentObject;
            this.gameBoard.removeFromBoard(this.currentObject)
            this.currentObject = this.holdObject;
            this.gameBoard.addToBoard(this.currentObject);
            this.holdObject = this.createObject(temp[0].blockType);
        }
    }

    rotate(){
        let box = this.currentObject[0]
        let column = box.column;
        let row = box.row;
        
        if(box.blockType == 1){
            if(box.rotation == 0 || box.rotation == 2){
                for(let i = 0; i < this.currentObject.length; i++){
                    if(box.row >= 17) return;   
                    if(this.gameBoard[(box.row + i) * 10 + box.column].box != undefined && !this.currentObject.includes(this.gameBoard[(box.row + i) * 10 + box.column].box)){
                        return;
                    }  
                }
                this.gameBoard.removeFromBoard(this.currentObject);
                for(let i = 0; i < this.currentObject.length; i++){
                    this.currentObject[i].row += i;
                    this.currentObject[i].column = box.column;
                    this.currentObject[i].rotation = ((this.currentObject[i].rotation + 1) % 4)
                }
                this.gameBoard.addToBoard(this.currentObject); 
            }else{
                if(box.column < 7){
                    for(let i = 0; i < this.currentObject.length; i++){
                        if(this.gameBoard[(box.row) * 10 + box.column + i].box != undefined && !this.currentObject.includes(this.gameBoard[(box.row) * 10 + box.column + i].box)){
                            return
                        }   
                    }
                    this.gameBoard.removeFromBoard(this.currentObject);
                    for(let i = 0; i < this.currentObject.length; i++){
                        this.currentObject[i].column += i;
                        this.currentObject[i].row = box.row;
                        this.currentObject[i].rotation = ((this.currentObject[i].rotation + 1) % 4)
                        
                    }
                    this.gameBoard.addToBoard(this.currentObject);  
                }
            }
        }else if(box.blockType == 3){
            if(box.rotation < 2 ) {
                if(box.row > 0 && box.column < 8){
                    let peice = box.rotation + 2;
                    let spot = (column + box.rotation + 1) + (10 * (row + box.rotation - 1));                     
                    if(this.gameBoard[spot].box == undefined){                
                        let oldspot = (this.currentObject[peice].row * 10) + this.currentObject[peice].column;
                        this.gameBoard[oldspot].box = undefined;
                        this.currentObject[peice].row = Math.floor(spot / 10);
                        this.currentObject[peice].column = spot % 10;
                        this.gameBoard[spot].box = this.currentObject[peice];
                        box.rotation = (box.rotation + 1) % 4
                    }
                }   
            }else if(box.rotation > 1){                
                let spot1;
                let spot2;
                if(box.rotation == 2){
                    spot1 = (column) + (10 * (row - 1));
                    spot2 = (column) + (10 * (row + 1)); 
                    
                }else{
                    spot1 = (column + 2) + (10 * (row));
                    spot2 = (column + 1) + (10 * (row + 1));  
                }
                
                this.swap2(box,spot1,spot2,2,3);              
            }
        }else if(box.blockType == 4){
                
            let spot1;
            let spot2;
            if(box.rotation == 0 || box.rotation == 2){
                
                spot1 = (column - 1) + (10 * (row));
                spot2 = (column) + (10 * (row + 2)); 
                this.swap2(box,spot1,spot2,0,1);
                
            }else{
                if(box.column < 8){
                    spot1 = (column + 1) + (10 * (row));
                    spot2 = (column + 2) + (10 * (row));  
                    this.swap2(box,spot1,spot2,0,1);
                }
            }

    
        }else if(box.blockType == 5){                
            let spot1;
            let spot2;
            if(box.rotation == 0 || box.rotation == 2){
                
                spot1 = (column) + (10 * (row + 1));
                spot2 = (column) + (10 * (row + 2)); 
                this.swap2(box,spot1,spot2,0,3);
                
            }else{
                if(box.column < 8){
                    spot1 = (column) + (10 * (row - 1));
                    spot2 = (column + 2) + (10 * (row));  
                    this.swap2(box,spot1,spot2,0,3);  
                }
            }                     
        }else if(box.blockType == 6){
            let spot1;
            let spot2;
            let spot3;
            if(box.rotation == 0){
                if(box.row < 18){
                    spot1 = (column) + (10 * (row + 2));
                    spot2 = (column + 1) + (10 * (row + 1));
                    spot3 = (column + 1) + (10 * (row + 2));
                    
                    this.swap3(box,spot1,spot2,spot3,0,2,3)
                }
        
            }else if(box.rotation == 1){
                if(box.column < 8 ){
                    spot1 = (column) + (10 * (row - 2));
                    spot2 = (column) + (10 * (row - 1));
                    spot3 = (column + 2) + (10 * (row - 1));
        
                    this.swap3(box,spot1,spot2,spot3,0,1,3)
                }
            }else if(box.rotation == 2){
                if(box.row < 18){
                    spot1 = (column + 1) + (10 * (row));
                    spot2 = (column) + (10 * (row + 2));
        
                    this.swap2(box,spot1,spot2,2,3);
                }
            }else if(box.rotation == 3){
                if(box.column < 8 ){
                    spot1 = (column + 2) + (10 * (row));
                    spot2 = (column + 2) + (10 * (row + 1));
        
                    this.swap2(box,spot1,spot2,1,3);
        
                    let box2Spot = this.currentObject[2].row * 10 + this.currentObject[2].column
                    let box1 = this.gameBoard[box2Spot + 1].box
        
                    this.currentObject[2].column += 1;
                    this.currentObject[1].column -= 1;
        
                    this.gameBoard[box2Spot + 1].box = this.gameBoard[box2Spot].box; 
                    this.gameBoard[box2Spot].box = box1;
                }
        
                
            }
        }else if(box.blockType == 7){
            
            let spot1;
            let spot2;
            let spot3;
            if(box.rotation == 0){
                if(box.row < 18){
                    spot1 = (column + 1) + (10 * (row + 1));
                    spot2 = (column + 1) + (10 * (row + 2));
                    
                    this.swap2(box,spot1,spot2,2,3)
                }
            }else if(box.rotation == 1){
                if(box.column < 8){
                    spot1 = (column) + (10 * (row + 1));
                    spot2 = (column + 2) + (10 * (row));
                    spot3 = (column + 2) + (10 * (row + 1));
        
                    this.swap3(box,spot1,spot2,spot3,1,0,3)
                }
            }else if(box.rotation == 2){
                if(box.row < 18){
                    spot1 = (column - 2) + (10 * (row));
                    spot2 = (column - 2) + (10 * (row + 2));
                    spot3 = (column - 1) + (10 * (row + 2));
        
                    this.swap3(box,spot1,spot2,spot3,0,2,3)
                }
            }else if(box.rotation == 3){
                if(box.column < 8){
                    spot1 = (column + 1) + (10 * (row));
                    spot2 = (column + 2) + (10 * (row));
        
                    this.swap2(box,spot1,spot2,3,2);
        
                    let box1Spot = this.currentObject[3].row * 10 + this.currentObject[3].column
                    let box3 = this.gameBoard[box1Spot + 9].box
        
                    this.currentObject[1].column += 1;
                    this.currentObject[3].column -= 1;
                    this.currentObject[1].row -= 1;
                    this.currentObject[3].row += 1;
        
                    this.gameBoard[box1Spot + 9].box = this.gameBoard[box1Spot].box; 
                    this.gameBoard[box1Spot].box = box3;
                }                   
            }
        } 
    }

    swap2(box,spot1, spot2, peice1, peice2){
        if(this.gameBoard[spot1].box == undefined && this.gameBoard[spot2].box == undefined){

            let oldspot1 = (this.currentObject[peice1].row * 10) + this.currentObject[peice1].column;
            let oldspot2 = (this.currentObject[peice2].row * 10) + this.currentObject[peice2].column;
            
            this.gameBoard[oldspot1].box = undefined;
            this.gameBoard[oldspot2].box = undefined;

            this.currentObject[peice1].row = Math.floor(spot1 / 10);
            this.currentObject[peice1].column = spot1 % 10;

            this.currentObject[peice2].row = Math.floor(spot2 / 10);
            this.currentObject[peice2].column = spot2 % 10;

            this.gameBoard[spot1].box = this.currentObject[peice1];
            this.gameBoard[spot2].box = this.currentObject[peice2];

            box.rotation = (box.rotation + 1) % 4
            
        }
    }

    swap3(box,spot1,spot3,spot4,peice1,peice3,peice4){
        
        if(this.gameBoard[spot1].box == undefined && this.gameBoard[spot3].box == undefined && this.gameBoard[spot4].box == undefined){
            
            let oldspot1 = (this.currentObject[peice1].row * 10) + this.currentObject[peice1].column;
            let oldspot3 = (this.currentObject[peice3].row * 10) + this.currentObject[peice3].column;
            let oldspot4 = (this.currentObject[peice4].row * 10) + this.currentObject[peice4].column;
        
            this.gameBoard[oldspot1].box = undefined;
            
            this.gameBoard[oldspot3].box = undefined;
            this.gameBoard[oldspot4].box = undefined;

            this.currentObject[peice1].row = Math.floor(spot1 / 10);
            this.currentObject[peice1].column = spot1 % 10;

            this.currentObject[peice3].row = Math.floor(spot3 / 10);
            this.currentObject[peice3].column = spot3 % 10;
            
            this.currentObject[peice4].row = Math.floor(spot4 / 10);
            this.currentObject[peice4].column = spot4 % 10;

            this.gameBoard[spot1].box = this.currentObject[peice1];
            this.gameBoard[spot3].box = this.currentObject[peice3];
            this.gameBoard[spot4].box = this.currentObject[peice4];

            box.rotation = (box.rotation + 1) % 4
        }
    }
}      