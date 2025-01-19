class MultiverseController {
    constructor(numberOfBoards) {
        this.numberOfBoards = numberOfBoards;
        this.boards = [];
        this.activeBoard = null;
        
        
        for (let i = 0; i < this.numberOfBoards; i++) {
            this.boards.push(this.createBoard());
        }

    }

    createBoard() {
        let id = this.boards.length;
        let tetrisContainer = $(`
            <div id="tetrisContainer-${id}" class="game">
                <div id="buttonBox-${id}">
                    <button class="tetrisButton" id="tetrisStart-${id}">Set Active</button>
                    <button class="tetrisButton" id="tetrisAIStart-${id}">Manual Mode</button>    
                </div>
                <canvas id="tetris-${id}"></canvas>
            </div>
        `);

        $(".gameHolder").append(tetrisContainer);
        console.log("Created board with id: " + id);
        return new TetrisController(id, this);
    }

    removeActive() {
        if (this.activeBoard != null) {
            this.boards[this.activeBoard].startAI();
        }
    }
    
    activeDisturbance() {
        this.disturbance = false;
        this.boards.forEach((board, index) => {
            let state = board.getState();

            if (state === "disturbed") {
                this.disturbance = true;
                console.log(`Board ${index} is disturbed.`);
            } else {
                console.log(`Board ${index} is normal.`);
            }
        });

        return this.disturbance;
    }
}

const controller = new MultiverseController(3);
controller.activeDisturbance();
