class GameBoard{
    constructor(){
        for(let i = 0; i < 200; i++){
            this[i] = {
                box: undefined
            }
        }
    }

    addToBoard(object){
        for(let i = 0; i < object.length; i++){
           this[object[i].column + (object[i].row * 10)].box = object[i]
        }
    }

    removeFromBoard(object){
        for(let i = 0; i < object.length; i++){
            this[object[i].column + (object[i].row * 10)].box = undefined;
         }
    }
}