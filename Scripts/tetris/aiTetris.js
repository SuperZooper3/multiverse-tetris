
    // creating the canvas 
    
            
class aiTetrus {

    constructor(b, c, h){
        this.board = b;
        this.c = c;
        this.hObject = h;
        this.stop = false;
        this.aa = 0
        this.bb = 0
        this.cc = 0
        this.dd = 0
        this.ee = 0;
        this.ff = 0;
        this.gg = 0;
    }
    
        

        // move the boxes left, right, or down
    aiMoveTile(event,object ){
        let cObject = object;
        let keyPressed = event
                        
        for(let i = cObject.length-1; i >= 0 ; i--){
            if(cObject[i].row < 0){
                return false;
            }
        }
        

        switch (keyPressed){
            case 1://change to move left                    
            // check that all the boxes in the current object can move left
            if( this.canMoveLeft(cObject)){
                
                for(let i = 0; i < object.length; i++){
                    cObject[i].column -= 1
                    
                }
                return true;
            }
                break;

            case 2:
            // check that all the boxes in the current object can move right
            if(this.canMoveRight(cObject)){
                for(let i = cObject.length-1; i >= 0 ; i--){
                    cObject[i].column += 1
                }
                return true;
            } 
                break;
            case 4:  // change to move down
                if(this.aiMoveUp(cObject)){
                    return true;
                }
            break;                    
            case 5:
                this.aiSwapHold();
                return true;
            break;                    
            case 3:
                                        
                if(this.aiRotate(cObject)){
                    return true;
                }                        
            break;
        }
        return false;
    }

    canMoveLeft(object){
        let cObject = object;
        let count = 0;
        for(let i = 0; i < object.length; i++){

            let row = cObject[i].row;
            let column = cObject[i].column;
            if(column > 0){
                if(this.board[((row) * 10 + column - 1 )].box == undefined || object.includes(this.board[((row) * 10 + column - 1 )].box) || this.c.includes(this.board[((row) * 10 + column - 1 )].box)){
                    count++;                        
                }                    
            }
        }                
        if(count == cObject.length){
            return true;
        }
        return false
    }

    canMoveRight(object){
        let cObject = object;
        let count = 0;
        for(let i = 0; i < cObject.length; i++){
            let row = cObject[i].row;
            let column = cObject[i].column;

            if(column < 9){
                if(this.board[((row) * 10 + column + 1 )].box == undefined || object.includes(this.board[((row) * 10 + column + 1 )].box ) || this.c.includes(this.board[((row) * 10 + column + 1 )].box )){
                    count++;
                }                        
            }
        }
        if(count == cObject.length){
            return true;
        }
        return false;
    }          

    aimoveDown(currentObject){         
    
        let count = 0;
        
        let length = currentObject.length
        for(let objectSpot = 0; objectSpot < length; objectSpot++){
            let row = currentObject[objectSpot].row;
            let column = currentObject[objectSpot].column;
            if(row < 19){
                if(this.board[((row+1) * 10 + column )].box == undefined  || currentObject.includes(this.board[((row + 1) * 10 + column )].box) || this.c.includes(this.board[((row + 1) * 10 + column )].box)){
                    count++;
                } 
            }
        }
    
        if(count == currentObject.length){
            for(let i = length - 1; i >= 0; i--){
                for(let j = length - 1; j >= 0; j--){
                    if(currentObject[j].blockPosition == i){
                        currentObject[j].row += 1
                    }
                }
            }
            return true
        }
        return false       
    }

    // move all the boxes down every "turn"
    aiMoveUp(object){
        let cObject = object
        let count = 0;
        
        for(let i = 0; i < cObject.length; i++){
            let row = cObject[i].row;
            let column = cObject[i].column;
            if(row > 0){
                if(this.board[((row-1) * 10 + column )].box == undefined || cObject.includes(this.board[((row - 1) * 10 + column )].box) || this.c.includes(this.board[((row - 1) * 10 + column )].box)){
                    count++;
                } 
            }
        }        
        if(count == cObject.length){
            for(let i = cObject.length - 1; i >= 0; i--){
                cObject[i].row -= 1
            }
            
            return true;
        }   
        return false;
    }    
    aiScoreRow(currentObject){
        let total = 0;
        let countToTen = 0;
        let counter = 0
        for(let i = 199; i >= 0; i--){

            for(let j = currentObject.length - 1; j >= 0; j--){

                if(i == ((currentObject[j].row * 10) + currentObject[j].column)){
                    counter++
                }
            }
            if(gameBoard[i].box != undefined){
                counter++;
            }
            if(counter == 10){
                total++;
                counter = 0
            }

            countToTen++

            if(countToTen > 9){
                countToTen = 0;
                counter = 0;
            }
        }
        return total;
    }
    aiSwapHold(){
        if(this.hObject == undefined){
            for(let i = 0; i < this.c.length; i++){
                this.board[(this.c[i].row * 10) + this.c[i].column].box = undefined;
            }
            this.hObject = this.aiCreateObject(this.c[0].blockType);
            this.c = undefined
            this.aiCreateObject(0);

        }else{
            let temp = this.c;
            for(let i = 0; i < this.c.length; i++){
                this.board[this.c[i].row * 10 + this.c[i].column].box = undefined;
            }

            this.c = this.hObject;

            for(let i = 0; i < this.c.length; i++){
                this.board[this.c[i].row * 10 + this.c[i].column].box = this.c[i];
            }
            this.hObject = this.aiCreateObject(temp[0].blockType);   
        }
    }
    aiRotate(object){
        let box = object[0]
        let count = 0;
        let column = box.column;
        let row = box.row;

        if(box.blockType == 1){
            
            if(box.rotation == 0 || box.rotation == 2){
                for(let i = 0; i < object.length; i++){
                    if(box.row < 17){
                        if(this.board[(box.row + i) * 10 + box.column].box == undefined || object.includes(this.board[(box.row + i) * 10 + box.column].box) || this.c.includes(this.board[(box.row + i) * 10 + box.column].box)){
                            count++;
                        }
                    }   
                }                    
                if(count == object.length){
                    for(let i = 0; i < object.length; i++){
                        object[i].row += i;
                        object[i].column = box.column;   
                    }
                    box.rotation -= 1;
                    if(box.rotation < 0){
                        box.rotation = 3;
                    }
                    return true;
                }                   
            }else{
                if(box.column < 7){
                    for(let i = 0; i < object.length; i++){
                        if(this.board[(box.row) * 10 + box.column + i].box == undefined || object.includes(this.board[(box.row) * 10 + box.column + i].box) || this.c.includes(this.board[(box.row) * 10 + box.column + i].box)){
                            count++;
                        }   
                    }
                    if(count == object.length){

                        for(let i = 0; i < object.length; i++){
                            object[i].column += i;
                            object[i].row = box.row;
                        }
                        box.rotation -= 1;
                        if(box.rotation < 0){
                            box.rotation = 3;
                        }
                        return true;
                    }
                }
            }
        }else if(box.blockType == 3){
            
            if(box.rotation == 1 || box.rotation == 2 ) {                    
                if(box.row < 19){                        
                    let peice 
                    let spot;
                    if(box.rotation == 2){
                        peice = 3;
                        spot = (column + 1) + (10 * (row + 1)); 
                    }else{
                        peice = 2;
                        spot = (column + 2) + (10 * (row)); 
                    }                        
                    if(this.board[spot].box == undefined || object.includes(this.board[spot].box) || this.c.includes(this.board[spot].box)){
                        object[peice].row = Math.floor(spot / 10);
                        object[peice].column = spot % 10;
                        
                        box.rotation -= 1;
                        if(box.rotation < 0){
                            box.rotation = 3;
                        }
                        return true;   
                    }
                }   
            }else{
                if(box.row > 0 && box.column < 8){
                    let spot1;
                    let spot2;
                    
                    if(box.rotation == 3){
                        spot1 = (column + 1) + (10 * (row - 1));
                        spot2 = (column + 2) + (10 * (row)); 
                    
                    }else{
                        spot1 = (column) + (10 * (row - 1));
                        spot2 = (column) + (10 * (row + 1));  
                    }            
                    return this.aiSwap2(box,spot1,spot2,2,3,object);
                }                 
            }
        }else if(box.blockType == 4){
                
            let spot1;
            let spot2;
            if(box.rotation == 0 || box.rotation == 2){
                if(box.row < 18 && box.row > 0){
                    spot1 = (column - 1) + (10 * (row));
                    spot2 = (column) + (10 * (row + 2)); 
                    return this.aiSwap2(box,spot1,spot2,0,1,object);
                }
            }else{
                if(box.column < 8 ){
                    spot1 = (column + 1) + (10 * (row));
                    spot2 = (column + 2) + (10 * (row));  
                    return this.aiSwap2(box,spot1,spot2,0,1,object);
                }
            }
        }else if(box.blockType == 5){
                let spot1;
                let spot2;
                if(box.rotation == 0 || box.rotation == 2){
                    if(box.row < 18){
                        spot1 = (column) + (10 * (row + 1));
                        spot2 = (column) + (10 * (row + 2)); 
                        return this.aiSwap2(box,spot1,spot2,0,3,object);
                    }  
                }else{
                    if(box.column < 8){
                        spot1 = (column) + (10 * (row - 1));
                        spot2 = (column + 2) + (10 * (row));  
                        return this.aiSwap2(box,spot1,spot2,0,3,object);
                    }
                }        
        }else if(box.blockType == 6){               
            let spot1;
            let spot2;
            let spot3;
            if(box.rotation == 1){
                if(box.column < 8){
                    spot1 = (column) + (10 * (row - 2));
                    spot2 = (column + 2) + (10 * (row - 2));
                    spot3 = (column + 2) + (10 * (row - 1));                            
                    if(this.aiSwap3(box,spot1,spot2,spot3,0,2,3,object)){
                        return true;
                    }
                }
            }else if(box.rotation == 2){
                if(box.row < 18 ){
                    spot1 = (column) + (10 * (row + 2));
                    spot2 = (column + 1) + (10 * (row));
                    spot3 = (column + 1) + (10 * (row + 2));
                    return this.aiSwap3(box,spot1,spot2,spot3,0,1,3,object);
                }
            }else if(box.rotation == 3){
                if(box.column < 8){
                    spot1 = (column + 1) + (10 * (row + 1));
                    spot2 = (column + 2) + (10 * (row + 1));
                    if(this.aiSwap2(box,spot1,spot2,1,3,object)){
                        return true
                    }      
                }
            }else if(box.rotation == 0){
                if(box.row < 18 ){
                    spot1 = (column) + (10 * (row + 1));
                    spot2 = (column) + (10 * (row + 2));    
                    if(this.aiSwap2(box,spot1,spot2,2,3,object)){
                        return true;
                    }                        
                }  
            }
        }else if(box.blockType == 7){               
            let spot1;
            let spot2;
            let spot3;
            if(box.rotation == 0){
                if(box.row < 18){
                    spot1 = (column ) + (10 * (row + 2));
                    spot2 = (column + 1) + (10 * (row + 2));
                    if(this.aiSwap2(box,spot1,spot2,2,1,object)){
                        object[1].row -= 1;
                        object[3].row += 1;
                        object[1].column -= 1;
                        object[3].column += 1;
                        return true;
                    } 
                }
            }else if(box.rotation == 1){
                if(box.column < 8){
                    spot1 = (column + 2) + (10 * (row));
                    spot2 = (column ) + (10 * (row + 1));
                    if(this.aiSwap2(box,spot1,spot2,2,3,object)){
                        return true;
                    }
                }
            }else if(box.rotation == 2){
                if(box.row < 18){
                    spot1 = (column - 2) + (10 * (row));
                    spot2 = (column - 1) + (10 * (row));
                    spot3 = (column - 1) + (10 * (row + 2));
                    return this.aiSwap3(box,spot1,spot2,spot3,0,1,3,object);
                }
            }else if(box.rotation == 3){
                if(box.column < 8){
                    spot1 = (column + 2) + (10 * (row));
                    spot2 = (column + 1) + (10 * (row + 1));
                    spot3 = (column + 2) + (10 * (row + 1));
                    return this.aiSwap3(box,spot1,spot2,spot3,0,2,3,object);
                }   
            }
        }            
        return false;
    }

    aiSwap2(box,spot1, spot2, peice1, peice2,object){
        if((this.board[spot1].box == undefined && this.board[spot2].box == undefined ) || this.c.includes(this.board[spot1].box) || this.c.includes(this.board[spot2].box)){

            object[peice1].row = Math.floor(spot1 / 10);
            object[peice1].column = spot1 % 10;

            object[peice2].row = Math.floor(spot2 / 10);
            object[peice2].column = spot2 % 10;

            box.rotation -= 1;
            if(box.rotation < 0){
                box.rotation = 3;
            }
            return true;
        }
    }

    aiSwap3(box,spot1,spot3,spot4,peice1,peice3,peice4,object){            
        if((this.board[spot1].box == undefined && this.board[spot3].box == undefined && this.board[spot4].box == undefined) || this.c.includes(this.board[spot1].box) || this.c.includes(this.board[spot3].box) || this.c.includes(this.board[spot4].box)){
            
            object[peice1].row = Math.floor(spot1 / 10);
            object[peice1].column = spot1 % 10;
            object[peice3].row = Math.floor(spot3 / 10);
            object[peice3].column = spot3 % 10;                
            object[peice4].row = Math.floor(spot4 / 10);
            object[peice4].column = spot4 % 10;
            box.rotation -= 1;
            if(box.rotation < 0){
                box.rotation = 3;
            }
            return true;            
        }
    }
    //done
    getRowScore(copyObject,currentObject,row){
        let score = 0;
        let length = copyObject.length
        for(let objectSpot = 0; objectSpot < length; objectSpot++){
            score += (currentObject[objectSpot].row + row)  ;
            copyObject[objectSpot].row = currentObject[objectSpot].row + row 
        }            
        return score;
    }
    //done
    addToBoard(currentObject){
        let board = JSON.parse(JSON.stringify(this.board));
        let length = currentObject.length
        for(let objectSpot = 0; objectSpot < length; objectSpot++){
            board[currentObject[objectSpot].row * 10 + currentObject[objectSpot].column].box = currentObject[objectSpot];
        }
        return board
    }
    // done
    checkForEmptyBelow(copyObject){
        let score = 0;
        let board = this.addToBoard(copyObject)
        let length = copyObject.length
        for(let objectSpot = 0; objectSpot < length; objectSpot++){
            if(copyObject[objectSpot].row < 19){
                let spot = (copyObject[objectSpot].row * 10) + 10 + copyObject[objectSpot].column;
                if(board[spot].box == undefined){
                        score += 1;  
                }
            }
        }
        return score;
    }

    
  
    score(copyObject,currentObject,row){
        let moveScore = 0;
        moveScore += this.getRowScore(copyObject,currentObject,row) * 1;
        moveScore -= this.checkForEmptyBelow(copyObject) * 3.5;
        moveScore -= this.aiColumns(copyObject) * 1;
        moveScore -= this.aiblockSky(copyObject) * 1.5;
        return moveScore;
    }      

    

    aiColumns(currentObject){
        let board = this.addToBoard(currentObject);
        let counter = 0
        for(let j = 0; j < 20; j++){
            for(let i = 1; i < 10; i++){                    
                let thisbox =  board[i + (j * 10)].box 
                let lastbox =  board[i - 1 + (j * 10)].box 
                if(thisbox == undefined ){
                    if(lastbox != undefined){
                        counter++;
                    }
                }else{
                    if(lastbox == undefined){
                        counter++;
                    }
                } 
            }
        }
        return counter;
    }

    aiblockSky(currentObject){
        let board = this.addToBoard(currentObject);
        let countSkyBlocks = 0
        for(let column = 0; column < 10; column++){
            for(let row = 1; row < 20; row++){              
                let thisbox =  board[column + (row * 10)].box 
                let lastbox =  board[column + ((row - 1) * 10)].box 
                if(thisbox == undefined ){
                    if(lastbox != undefined){
                        countSkyBlocks++;
                    }
                }else{
                    if(lastbox == undefined){
                        countSkyBlocks++;
                    }
                }                      
            }
        }
        return countSkyBlocks;
    }

    aiSpacesAbove(currentObject){
        let rowsDown = [];
        for(let j = 0; j < currentObject.length; j++){
            let count = 0;
            let spot = currentObject[j].column
            for(let i = currentObject[j].row - 1; i >= 0; i--){
                if(i >= 0 && (this.board[spot + (i * 10)].box == undefined || currentObject.includes(this.board[spot + ( i * 10)].box) || this.c.includes(this.board[spot + ( i * 10)].box))){
                    count++;
                }else{
                    break;
                }
            }
            rowsDown[j] = count;   
        }
        return Math.min.apply(Math,rowsDown);
    }

    testSpot(currentObject,swap){
        let temp = this.c;
        this.c = currentObject;
        let columns = [];
        let currentObjectClone = JSON.parse(JSON.stringify(currentObject));
        this.aimoveDown(currentObjectClone);  
        let blockType = currentObjectClone[0].blockType
        let max = 2;
        if(blockType == 3 || blockType == 6 || blockType == 7){
            max = 4
        }else if(blockType == 2){
            max = 1
        }            
        for(let z = 0; z < max; z++){
            let column = 0;
            let rotate = true;                
            while(this.aiMoveTile(1,currentObjectClone)){                   
                if(rotate){
                    rotate = !this.aiRotate(currentObjectClone)                            
                } 
            }  
            while(this.aiMoveTile(2,currentObjectClone)){
                if(column == 0){
                    this.aiMoveTile(1,currentObjectClone)
                }
                let k = 0
                for(let j = 0; j < currentObjectClone.length; j++){
                        if(currentObjectClone[j].row >= k){
                            k = currentObjectClone[j].row
                        }
                }
                testRows:
                for(let row = 19-k; row > 1; row--){                      
                    for(let j = 0; j < currentObjectClone.length; j++){
                        let spot = currentObjectClone[j].column;                            
                        if(this.board[spot + ((currentObjectClone[j].row + row) * 10)].box != undefined){
                            continue testRows;                               
                        }
                    }                       
                    let copyObject = JSON.parse(JSON.stringify(currentObjectClone));  
                    let copyBoard = JSON.parse(JSON.stringify(this.board));  
                    let length = copyObject.length
                    let emptyB = 0;
                    for(let objectSpot = 0; objectSpot < length; objectSpot++){
                        copyBoard[copyObject[objectSpot].row * 10 + copyObject[objectSpot].column].box = copyObject[objectSpot];
                    }
                    for(let k = 0; k < copyObject.length; k++){
                        if((copyObject[k].row + 1) <= 19){
                            if(copyBoard[(copyObject[k].row + 1) * 10 + copyObject[k].column].box == undefined){
                                emptyB++;
                            }
                        }
                    }

                    if(emptyB == length){
                        break;
                    }   
                    let score = this.score(copyObject,currentObjectClone,row)     
                    
                    if(columns[column] == null){
                        columns[column] = [row,score,copyObject,swap];
                        break;
                    }else{
                        if(columns[column][1] < score ){
                            let emptyBelow = 0;
                            for(let k = 0; k < copyObject.length; k++){
                                if((copyObject[k].row + 1) <= 19){
                                    if(this.board[(copyObject[k].row + 1) * 10 + copyObject[k].column].box == undefined){
                                        emptyBelow++;
                                    }
                                }
                            }
                            if(emptyBelow != copyObject.length){
                                columns[column] = [row,score,copyObject,swap];
                                break;
                            }                                
                        }
                    }   
                }
                column++
            }
        }
        this.c = temp;
        return columns;
    }

    placeOneObject(){

        this.aa = 0
        this.bb = 0
        this.cc = 0
        this.dd = 0
        this.ee = 0;
        this.ff = 0;
        this.gg = 0;

        let orignal = JSON.parse(JSON.stringify(this.c));
        let swap = JSON.parse(JSON.stringify(this.hObject));
        let orignal1 = JSON.parse(JSON.stringify(this.c));
        let swap1 = JSON.parse(JSON.stringify(this.hObject));
        let possibleSpots =  this.testSpot(orignal1,false);
        let possibleHoldSpots = this.testSpot(swap1,true);
        var combinedpossibleSpots = possibleSpots.concat(possibleHoldSpots);
        var remaining = []
        for(let i = 0; i < combinedpossibleSpots.length -1; i++){
            if(combinedpossibleSpots[i] == undefined || combinedpossibleSpots[i] == null){  
                combinedpossibleSpots.splice(i,1);
            }else{
                remaining[remaining.length] = combinedpossibleSpots[i];
            }
        }
        combinedpossibleSpots = remaining;
        if(combinedpossibleSpots.length == 0){
            return false;
        }
        combinedpossibleSpots.sort(([a, b, c, d], [e, f,g,h]) => f - b );

        for(let i = 0; i < combinedpossibleSpots.length -1; i++){
            if(combinedpossibleSpots[i][3]){
                this.c = swap;                   
            }else{
                this.c = orignal
            }            
            let returnValue = this.findPath(combinedpossibleSpots[i][2],0,0,0,0,0,0,combinedpossibleSpots[i][3])
            if(returnValue[0] == true){
                return returnValue;   
            }else{
            }
        }
        return false;            
    }

    findPath(object,depthCount,left,right,rotate, last,lastr,swap){
        
      
        let currentObject = JSON.parse(JSON.stringify(object));;            
        let results = []
        let moves = [];
        let total = 0;
        results[0] = false;
      
        if(depthCount < 12 && right < 10 && left < 10 && rotate <= currentObject[0].maxRotation ){
            let correctPositions = 0;
            for(let i = 0; i < this.c.length; i++){
                if(this.c[i].row == currentObject[i].row && this.c[i].column == currentObject[i].column){
                    correctPositions++;
                }
            }            
            if(correctPositions != 4){
                // this.addToBoard();
                let spaceAbove;
                if(depthCount == 0){
                    spaceAbove = this.aiSpacesAbove(currentObject) - 2;
                    if(spaceAbove < 0){
                        spaceAbove = 0;
                    }
                    // this for loop moves the current block down all the extra space                        
                    for(let i = 0; i < currentObject.length; i++){
                        currentObject[i].row -= spaceAbove;                               
                    }                       
                }
                for(let i = 5; i >= 1; i--){
                    let myMoves = [];
                    let currentObjectClone = JSON.parse(JSON.stringify(currentObject));
                    let moveRight = 0;
                    let moveLeft = 0
                    let rotating = 0
                    if(i == 5){
                        let currentObjectClone2 = JSON.parse(JSON.stringify(currentObject));
                        let spaceAbove2 = this.aiSpacesAbove(currentObjectClone2);
                        if(spaceAbove2 < 0){
                            spaceAbove2 = 0;
                        }
                        // this for loop moves the current block down all the extra space
                        let j = 0;                        
                        if(depthCount == 0){
                            myMoves[0] = spaceAbove;
                            spaceAbove2++;
                            j = 1;
                        } 
                        
                        for(j; j < spaceAbove2; j++){
                            for(let i = 0; i < currentObjectClone2.length; i++){
                            currentObjectClone2[i].row -= 1; 
                            }
                            myMoves[j] = 4;
                        }
                        if(spaceAbove2 != 0){
                            
                            let res = this.findPath(currentObjectClone2,depthCount + 1,left + moveLeft,right + moveRight,rotate + rotating,i,0,false);
                            total += res[2];
                            if(res[0] == true){
                                res[1] = myMoves.concat(res[1]);
                                total += depthCount
                                res[2] = total;
                                res[4] = swap;
                                return res;
                            }
                        }                            
                    }else if( i != 5){
                        let lastRotate = 0;
                        if(i == 1){
                            if(last == 2){
                                continue;
                            }                                
                            moveLeft++
                        }else if(i == 2){
                            if(last == 1){
                                continue;
                            }
                            moveRight++;                                
                        }else if(i == 3){
                            if(lastr < currentObjectClone[0].maxRotation - 1){                               
                                rotating++
                                lastRotate = lastr + 1;
                            }else{
                                continue
                            }
                        }                            
                        if(depthCount >= 1){
                            myMoves[0] = i;                                
                        }else{
                            myMoves[0] = spaceAbove;
                            myMoves[1] = i;
                        }
                        if(this.aiMoveTile(i,currentObjectClone)){
                            
                            let res = this.findPath(currentObjectClone,depthCount + 1,left + moveLeft,right + moveRight,rotate + rotating, i,lastRotate,false);
                            total += res[2];
                            if(res[0] == true){
                                res[1] = myMoves.concat(res[1]);
                                total += depthCount
                                res[2] = total;
                                return res;
                            }
                        }
                    }    
                }                    
            }else{                    
                results[0] = true;  
            }
        }else{
            results[0] = false;   
        }
        results[1] = moves;
        results[2] = depthCount + total;
        results[3] = currentObject
        return results
    }
}              