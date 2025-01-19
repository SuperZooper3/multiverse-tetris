class MultiverseController {
  constructor(numberOfBoards) {
    this.numberOfBoards = numberOfBoards;
    this.boards = [];
    this.activeBoard = null;

    for (let i = 0; i < this.numberOfBoards; i++) {
      this.boards.push(this.createBoard());
    }

    this.activeBoard = 0;
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
    this.activeBoard = boardID;
    this.injectBigBoard(boardID);
    this.boards[boardID].actuallyGoActive();
  }

  removeActive() {
      if (this.activeBoard != null) {
          this.boards[this.activeBoard].startAI();
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
  }

const controller = new MultiverseController(5);