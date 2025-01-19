class MultiverseController {
  constructor(numberOfBoards) {
    this.numberOfBoards = numberOfBoards;
    this.boards = [];
    this.activeBoard = null;
    this.points = 0;
    for (let i = 0; i < this.numberOfBoards; i++) {
      this.boards.push(this.createBoard());
    }

    for (let i = 0; i < this.numberOfBoards; i++) {
      if (i !== 0) {
        this.boards[i].startAI();
      } else {
        this.boards[i].startGame();
      }
    }
  }

  createBoard() {
    let id = this.boards.length;
    let tetrisContainer = $(`
        <div id="tetrisContainer-${id}" class="thing">
            <canvas id="tetris-${id}"></canvas>
        </div>
    `);

    $(".gameHolder").append(tetrisContainer);
    console.log("Created board with id: " + id);
    return new TetrisController(id, this);
  }

  injectBigBoard(boardID) {
    let id = `focus-${boardID}`;
    let tetrisContainer = $(`
        <div id="tetrisContainer-${id}" class="thing">
            <canvas id="tetris-${id}"></canvas>
        </div>
    `);

    $("#me").html(tetrisContainer);
    console.log("Created big board with id: " + id);
  }

  setActive(boardID) {
    this.removeActive();
    console.log("Setting active board to " + boardID);
    this.activeBoard = boardID;
    this.injectBigBoard(boardID);
    console.log(this.boards);
    this.boards[boardID].actuallyGoActive();
  }

  removeActive() {
    if (this.activeBoard !== null) {
      this.boards[this.activeBoard].deactivate();
      this.activeBoard = null;
    }
  }

  addBoard() {
    let newBoard = this.createBoard();
    this.boards.push(newBoard);
    this.numberOfBoards++;
    newBoard.startAI();
  }
}

const multiverseController = new MultiverseController(1);

// make a loop that adds 1 more boards every 10 seconds for a total of 5
let i = 0;
let interval = setInterval(() => {
  if (i < 5) {
    multiverseController.addBoard();
    i++;
  } else {
    clearInterval(interval);
  }
}, 1000);
