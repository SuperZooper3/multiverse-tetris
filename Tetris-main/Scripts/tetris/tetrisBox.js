class Box{
    constructor(boxWidth,boxHeight){
        this.width = boxWidth;
        this.height= boxHeight;
        this.row= 0;
        this.column= undefined;
        this.blockType= null;
        this.blockPosition= 0;
        this.color= undefined;
        this.rotation= 0;
        this.maxRotation = 0;
    }
}