class MultiverseController {
  constructor(numberOfBoards) {
    this.numberOfBoards = numberOfBoards;
    this.boards = [];
    this.activeBoard = null;
    this.tilesCleared = 0;
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

  activeDisturbance() {
    this.disturbance = false;
    this.boards.forEach((board, index) => {
      let state = board.state;
      if (state !== "normal") {
        this.disturbance = true;
        console.log(`Board ${index} is disturbed.`);
      } else {
        console.log(`Board ${index} is normal.`);
      }
    });
    return this.disturbance;
  }
/*
  countActiveBoards() {
    const activeCount = Array.from(this.boardStates.values())
      .filter(state => state === "active")
      .length;
    return activeCount;
  }

  logActiveBoards() {
    const activeCount = this.countActiveBoards();
    console.log("Number of Active Boards:", activeCount);
  }
  */
}

const controller = new MultiverseController(6);