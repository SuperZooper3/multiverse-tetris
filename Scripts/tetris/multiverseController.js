class MultiverseController {
    constructor(numberOfBoards) {
        this.numberOfBoards = numberOfBoards;
        this.boards = [];
        
        for (let i = 0; i < this.numberOfBoards; i++) {
            this.boards.push(this.createBoard());
        }
    }

    createBoard() {
        let id = this.boards.length;
        let tetrisContainer = $(`
            <div id="tetrisContainer-${id}" class="game">
                <div id="buttonBox-${id}">
                    <button class="tetrisButton" id="tetrisStart-${id}">Start Game</button>
                    <button class="tetrisButton" id="tetrisAIStart-${id}">Start AI</button>    
                </div>
                <canvas id="tetris-${id}"></canvas>
            </div>
        `);

        $(".gameHolder").append(tetrisContainer);
        console.log("Created board with id: " + id);
        return new TetrisController(id);
    }
}

new MultiverseController(2);