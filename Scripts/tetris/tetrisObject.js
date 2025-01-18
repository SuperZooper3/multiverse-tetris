class TetrisObject{
    

    constructor(){
        this.bag = [];
    }

    randomGenerator() {                    
        if (this.bag.length === 0) {
            this.bag = [1, 2, 3, 4, 5, 6, 7];
            this.bag.sort(() => Math.random() - 0.5);
        }
        return this.bag.pop();
    }

    getObject(objectNumber){
        let randomNumber
        if(objectNumber == 0){
            randomNumber = this.randomGenerator();
        }else if(objectNumber != 0){
           
            randomNumber = objectNumber
        }
        return this.createObject(randomNumber);
    }

    createBox(){
        let boxObject = new Box();
        return boxObject;
    }

    newObject(currentObject,nextObject, objectNumber){
        if(nextObject != undefined){
            currentObject = nextObject;
        }
        nextObject = this.getObject(objectNumber);
        if(currentObject == undefined){
            
            currentObject = nextObject;
            nextObject = this.getObject(objectNumber)
        }
        return [currentObject,nextObject];
    }

    createObject(randomNumber){
        let object;
        
        if(randomNumber == 1){
            object =  this.createIBlock();
        }else if( randomNumber == 2){
            object =  this.createOBlock();
        }else if (randomNumber == 3){
            object = this.createTBlock();
        }else if (randomNumber == 4){
            object = this.createSBlock();
        }else if(randomNumber == 5){
            object = this.createZBlock();
        }else if(randomNumber == 6){
            object = this.createJBlock();
        }else if(randomNumber == 7){
            object = this.createLBlock();
        }
     
        return object;
    }

    createIBlock(){
        let color = "rgb(0,247,245)"
        let boxes = []
        for(let i = 0; i < 4; i++){
            boxes[i] = this.createBox()
            boxes[i].blockType = 1;
            boxes[i].column = i+3;
            boxes[i].blockPosition = i
            boxes[i].color = color;
            boxes[i].maxRotation = 2;
        }
        return boxes;
    }
    
    createOBlock(){
        let color = "rgb(233,248,0)";
        let boxes = [];
    
        for(let i = 0; i < 2; i++){
            boxes[i] = this.createBox();
            boxes[i].blockType = 2;
            boxes[i].column = i+4;
            boxes[i].row = 0;
            boxes[i].blockPosition = 2 + i;
            boxes[i].color = color;
        }
        for(let i = 2; i < 4; i++){
            boxes[i] = this.createBox()
            boxes[i].blockType = 2;
            boxes[i].blockPosition = i 
            boxes[i].column = i+2;
            boxes[i].row = 1;
            boxes[i].color = color;
        }
    
        return boxes;
    }
    
    createTBlock(){
        let color = "rgb(186,0,242)"
        let boxes = [];    
    
        for(let i = 0; i < 3; i++){
            boxes[i] = this.createBox()
            boxes[i].blockType = 3;
            boxes[i].column = i+3;
            boxes[i].row = 0;
            boxes[i].color = color;
            boxes[i].maxRotation = 4;
        }
    
        boxes[1].blockPosition = 2;
        boxes[0].blockPosition = 1;
        boxes[2].blockPosition = 0;
    
        boxes[3] = this.createBox()
        boxes[3].blockType = 3;
        boxes[3].column = 4;
        boxes[3].row = 1;
        boxes[3].color = color;
        boxes[3].blockPosition = 3;
        boxes[3].maxRotation = 4
    
        return boxes;
    }
    
    createSBlock(){
        let color = "rgb(0,255,25)"
        let boxes = []
    
        for(let i = 0; i < 2; i++){
            boxes[i] = this.createBox()
            boxes[i].blockType = 4;
            boxes[i].column = i+4;
            boxes[i].row = 0;
            boxes[i].color = color;
            boxes[i].maxRotation = 2;
        }
        boxes[0].blockPosition = 0;
        boxes[1].blockPosition = 3;
        for(let i = 2; i < 4; i++){
            boxes[i] = this.createBox()
            boxes[i].blockType = 4;
            boxes[i].column = i+1;
            boxes[i].row = 1;
            boxes[i].blockPosition = i - 1;
            boxes[i].color = color;
            boxes[i].maxRotation = 2;
        }
    
        return boxes;
    }
    
    createZBlock(){
        let color = "rgb(255,0,0)"
        let boxes = []
    
        for(let i = 0; i < 2; i++){
            boxes[i] = this.createBox()
            boxes[i].blockType = 5;
            boxes[i].column = i+4;
            boxes[i].row = 0;
            boxes[i].color = color;
            boxes[i].blockPosition = i;
            boxes[i].maxRotation = 2;
        }
        for(let i = 2; i < 4; i++){
            boxes[i] = this.createBox()
            boxes[i].blockType = 5;
            boxes[i].column = i+3;
            boxes[i].row = 1;
            boxes[i].blockPosition = i;
            boxes[i].color = color;
            boxes[i].maxRotation = 2;
        }
    
        return boxes;
    }
    
    createJBlock(){
        let color = "rgb(65,0,243)"
        let boxes = []  ;
        
        boxes[3] = this.createBox()
        boxes[3].blockType = 6;
        boxes[3].column = 5;
        boxes[3].row = 1;
        boxes[3].color = color;
        boxes[3].maxRotation = 4;
                      
        for(let i = 0; i < 3; i++){
            boxes[i] = this.createBox()
            boxes[i].blockType = 6;
            boxes[i].column = i+3;
            boxes[i].row = 0;
            boxes[i].color = color;
            boxes[i].maxRotation = 4;
        }       
        return boxes;
    }
    
    createLBlock(){
        let color = "rgb(252,159,0)"
        let boxes = [];

        boxes[3] = this.createBox()
        boxes[3].blockType = 7;
        boxes[3].column = 3;
        boxes[3].row = 1;
        boxes[3].color = color;
        boxes[3].maxRotation = 4;
           
        for(let i = 0; i < 3; i++){
            boxes[i] = this.createBox()
            boxes[i].blockType = 7;
            boxes[i].column = i+3;
            boxes[i].row = 0;
            boxes[i].color = color;
            boxes[i].maxRotation = 4;
        }    
        return boxes;
    }
}