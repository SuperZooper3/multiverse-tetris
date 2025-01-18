class MultiverseController {
  constructor(numberOfBoards) {
    this.numberOfBoards = numberOfBoards;
    this.boards = [];

    for (let i = 0; i < this.numberOfBoards; i++) {
      this.boards.push(this.createBoard());
    }

    this.activeBoard = 0;
  }

  createBoard() {
    let id = this.boards.length;
    let tetrisContainer = $(`
        <div id="tetrisContainer-${id}" class="thing">
            <div id="buttonBox-${id}">
                <button class="tetrisButton" id="tetrisStart-${id}">Set Active</button>
                <button class="tetrisButton" id="tetrisAIStart-${id}">Manual Mode</button>    
            </div>
            <canvas id="tetris-${id}"></canvas>
        </div>
    `);

    $(".gameHolder").append(tetrisContainer);
    console.log("Created board with id: " + id);
    return new TetrisController(id);
  }
}

new MultiverseController(3);
