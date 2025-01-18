 //astetics for the game
 
 const boxHeight = boxWidth;
 const lineHeight = 1;

function resizeButtons(){
    let width = $("#tetris").width()/20
    let height = $("#tetris").height()/10
    $("#tetrisStart").css("left",  $("#tetrisContainer").width()/24);
    $("#tetrisAIStart").css("right", $("#tetrisContainer").width()/15);
    $("#tetrisStart").css("font-size",   Math.round(width) + "px");
    $("#tetrisAIStart").css("font-size", Math.round(width)+ "px");
    $("#tetrisStart").css("bottom",   height + "px");
    $("#tetrisAIStart").css("bottom", height+ "px");
}

window.addEventListener("load", resizeButtons);
window.addEventListener("resize", resizeButtons);

 $(window).bind("load", function () {
     
    var tetrisCanvas = new TetrisCanvas(lineHeight,boxHeight,boxWidth);
    var tetris = new Tetris();
    var tilesCleared = 0;
    tetrisCanvas.draw(tetris.predictLanding(),tetris.getGame(),tilesCleared);

    $("#tetrisStart").click(function(){
        startGame();
    });

    $("#tetrisAIStart").click(function(){
        startAI();
    });

    let gameRunning = false;
    let aiRunning = false;
    let gameInterval;

    document.addEventListener("keydown",keyPress);       

    function keyPress(event){
        let keyPressed = event.keyCode;
        if(keyPressed == 40 || keyPressed == 39 || keyPressed == 38 || keyPressed == 37 || keyPressed == 13 || keyPressed == 32){
            event.preventDefault();
        }
        if(gameRunning || aiRunning){
            moveTile(keyPressed)
        }
    }

    function moveTile(event ){
        let keyPressed = event
        switch (keyPressed){
            case 1:
            case 65:
            case 37:  
                tetris.moveLeft()
                break;
            case 2:
            case 68:
            case 39: //change to move right
                // check that all the boxes in the current object can move right
                tetris.moveRight()
                break;
            case 4:
            case 83:
            case 40:  // change to move down
                tetris.moveDown()
            break;    
            case 5:
            case 65:
            case 32:
                tetris.swapHold();
                break;
            case 3:
            case 87:
            case 38:
                tetris.rotate()
                break;
            case 6:
            case 13:
                tetris.dropPiece();
                break;
            case 7:
                ai(tetris.getGame());
                break
        }
        tetrisCanvas.draw(tetris.predictLanding(),tetris.getGame(),tilesCleared);
    }

    function startGame(){
        
        if(!gameRunning){
            tilesCleared = 0;
            setTimeout(function(){ 
                tetris.reset();
                moveTile()
            }, 500);  
            
            setTimeout(function(){ 
                gameInterval = setInterval(function(){ runGame(); }, 800);
            }, 600);  
            gameRunning = true;
            aiRunning = false
        }else{
            clearInterval(gameInterval);
            gameRunning = false;
        }
    }

    function startAI(){
        if(!aiRunning){
            gameRunning = true
            startGame();
            tetris.reset();
            moveTile()       
            aiRunning = true;
            tilesCleared = 0;
            ai(tetris.getGame());
        }
    }
    function runGame(){
        moveTile(4);
        if(!tetris.checkCurrent()){
            tilesCleared++;
            if(tetris.createObject(0) === false){
                gameRunning = false;
                aiRunning = false;
                clearInterval(gameInterval);
            }
            moveTile()
        }
    }

    function ai(game){   
        if(game[1] != undefined){        
            let copyBoard = JSON.parse(JSON.stringify(game[0]));
            let copyCurrentObject = JSON.parse(JSON.stringify(game[1]));
            let copyHoldObject = JSON.parse(JSON.stringify(game[2]));

            for(let i = 0; i < copyCurrentObject.length; i++){
                copyBoard[copyCurrentObject[i].column + (copyCurrentObject[i].row * 10)].box = undefined;
            }
            
            let tetrus = new aiTetrus(copyBoard,copyCurrentObject,copyHoldObject);
            let result = tetrus.placeOneObject();
            if(result === false){
                // do gameOver function 
            }else if(result[1].length > 0){
                if(result[4]){
                    tetris.swapHold();              
                }
                takeMoves(result[1]);      
            }else{ 
                // do gameOver function
            }    
        }    
    }

    function takeMoves(moves){     
        for(let i = moves.length - 1; i > 0; i--){            
                let action;
                if(moves[i] == 1){
                    action = 2;
                }else if (moves[i] == 2){
                    action = 1;
                }else{
                    action = moves[i];
                }           
                setTimeout(function(){ 
                    moveTile(action);
                }, (10 * (moves.length - i)));    
        }

        let loop = moves[0];
        for(let i = 0; i < loop; i++){
                setTimeout(function(){ 
                    moveTile(4);   
                }, (10 * (i + moves.length)));     
        }
    
        setTimeout(function(){
            if(tetris.checkForRow()){
                tilesCleared++;
                tetris.createObject(0);
                if(!gameRunning){
                    ai(tetris.getGame());
                } 
            }
        }, (10 * (loop + moves.length))); 
                
    }
});   