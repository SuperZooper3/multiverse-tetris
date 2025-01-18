const tetrisCanvas = document.getElementById("tetris");

function resizeGame(){
    let avalibleWidth = window.innerWidth
    let avalibleHeight = Math.min(window.innerHeight, avalibleWidth * 1.04) ;
    tetrisCanvas.style.height = (avalibleHeight * .90) +"px"
    tetrisCanvas.style.maxHeight = (avalibleHeight * .90) +"px"
    resizeButtons()
}
window.addEventListener("load", resizeGame);
window.addEventListener("resize", resizeGame);

 class tetriscontroler {
    constructor() {
        this.boxHeight = boxWidth;
        this.lineHeight = 1;
        this.gameRunning = false;
        this.aiRunning = false;
        this.gameInterval = null;
        this.tilesCleared = 0;
        this.tetrisCanvas = null;
        this.tetris = null;

        this.init();
    }

    init() {
        window.addEventListener("load", () => this.setup());
        window.addEventListener("resize", () => this.resizeButtons());
    }

    resizeButtons() {
        let width = $("#tetris").width() / 20;
        let height = $("#tetris").height() / 10;
        $("#tetrisStart").css("left", $("#tetrisContainer").width() / 24);
        $("#tetrisAIStart").css("right", $("#tetrisContainer").width() / 15);
        $("#tetrisStart").css("font-size", Math.round(width) + "px");
        $("#tetrisAIStart").css("font-size", Math.round(width) + "px");
        $("#tetrisStart").css("bottom", height + "px");
        $("#tetrisAIStart").css("bottom", height + "px");
    }

    setup() {
        this.tetrisCanvas = new TetrisCanvas(this.lineHeight, this.boxHeight, boxWidth);
        this.tetris = new Tetris();
        this.tetrisCanvas.draw(this.tetris.predictLanding(), this.tetris.getGame(), this.tilesCleared);

        $("#tetrisStart").click(() => this.startGame());
        $("#tetrisAIStart").click(() => this.startAI());

        document.addEventListener("keydown", (event) => this.keyPress(event));
    }

    keyPress(event) {
        const keyPressed = event.keyCode;
        if ([40, 39, 38, 37, 13, 32].includes(keyPressed)) {
            event.preventDefault();
        }
        if (this.gameRunning || this.aiRunning) {
            this.moveTile(keyPressed);
        }
    }

    moveTile(event) {
        const keyPressed = event;
        switch (keyPressed) {
            case 1:
            case 65:
            case 37:
                this.tetris.moveLeft();
                break;
            case 2:
            case 68:
            case 39:
                this.tetris.moveRight();
                break;
            case 4:
            case 83:
            case 40:
                this.tetris.moveDown();
                break;
            case 5:
            case 65:
            case 32:
                this.tetris.swapHold();
                break;
            case 3:
            case 87:
            case 38:
                this.tetris.rotate();
                break;
            case 6:
            case 13:
                this.tetris.dropPiece();
                break;
            case 7:
                this.ai(this.tetris.getGame());
                break;
        }
        this.tetrisCanvas.draw(this.tetris.predictLanding(), this.tetris.getGame(), this.tilesCleared);
    }

    startGame() {
        if (!this.gameRunning) {
            this.tilesCleared = 0;
            setTimeout(() => {
                this.tetris.reset();
                this.moveTile();
            }, 500);

            setTimeout(() => {
                this.gameInterval = setInterval(() => this.runGame(), 800);
            }, 600);

            this.gameRunning = true;
            this.aiRunning = false;
        } else {
            clearInterval(this.gameInterval);
            this.gameRunning = false;
        }
    }

    startAI() {
        if (!this.aiRunning) {
            this.gameRunning = true;
            this.startGame();
            this.tetris.reset();
            this.moveTile();
            this.aiRunning = true;
            this.tilesCleared = 0;
            this.ai(this.tetris.getGame());
        }
    }

    runGame() {
        this.moveTile(4);
        if (!this.tetris.checkCurrent()) {
            this.tilesCleared++;
            if (this.tetris.createObject(0) === false) {
                this.gameRunning = false;
                this.aiRunning = false;
                clearInterval(this.gameInterval);
            }
            this.moveTile();
        }
    }

    ai(game) {
        if (game[1] !== undefined) {
            let copyBoard = JSON.parse(JSON.stringify(game[0]));
            let copyCurrentObject = JSON.parse(JSON.stringify(game[1]));
            let copyHoldObject = JSON.parse(JSON.stringify(game[2]));

            for (let i = 0; i < copyCurrentObject.length; i++) {
                copyBoard[copyCurrentObject[i].column + copyCurrentObject[i].row * 10].box = undefined;
            }

            let tetrus = new aiTetrus(copyBoard, copyCurrentObject, copyHoldObject);
            let result = tetrus.placeOneObject();
            if (result === false) {
                // game over logic
            } else if (result[1].length > 0) {
                if (result[4]) {
                    this.tetris.swapHold();
                }
                this.takeMoves(result[1]);
            } else {
                // game over logic
            }
        }
    }

    takeMoves(moves) {
        for (let i = moves.length - 1; i > 0; i--) {
            let action;
            if (moves[i] === 1) {
                action = 2;
            } else if (moves[i] === 2) {
                action = 1;
            } else {
                action = moves[i];
            }
            setTimeout(() => {
                this.moveTile(action);
            }, 10 * (moves.length - i));
        }

        let loop = moves[0];
        for (let i = 0; i < loop; i++) {
            setTimeout(() => {
                this.moveTile(4);
            }, 10 * (i + moves.length));
        }

        setTimeout(() => {
            if (this.tetris.checkForRow()) {
                this.tilesCleared++;
                this.tetris.createObject(0);
                if (!this.gameRunning) {
                    this.ai(this.tetris.getGame());
                }
            }
        }, 10 * (loop + moves.length));
    }
}

// Instantiate the game
const tetrisGame = new tetriscontroler();
