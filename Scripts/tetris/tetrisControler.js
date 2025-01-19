const REQUIRED_STEPS_TO_CLEAR = 10;
const DISTURBANCE_MIN_TIME = 500;
const DISTURBANCE_MAX_TIME = 3000;

function chooseDisturbanceCountdown() {
  return Math.floor(
    Math.random() * (DISTURBANCE_MAX_TIME - DISTURBANCE_MIN_TIME) +
      DISTURBANCE_MIN_TIME
  );
}
class TetrisController {
  constructor(id, multiverseController) {
    this.multiverseController = multiverseController;
    this.boardUUID = Math.floor(Math.random() * 1000000000);
    this.boardID = id;
    this.lineHeight = 1;
    this.gameRunning = false;
    this.aiRunning = false;
    this.gameInterval = null;
    this.tilesCleared = 0;
    this.isActive = null;
    this.tetrisCanvas = null;
    this.tetris = null;
    this.state = "normal";
    this.disturbanceCountdown = chooseDisturbanceCountdown();
    this.disturbanceClearCounter = 0;
    this.bigCanvas = null;
    this.setup();
    this.startAI();
  }

  setup() {
    this.tetrisCanvas = new TetrisMiniCanvas(this.boardID, this.lineHeight);
    this.tetris = new Tetris();
    this.draw();

    $(`#tetris-${this.boardID}`).click(() => this.startGame());

    document.addEventListener("keydown", (event) => this.keyPress(event));
  }

  draw() {
    this.tetrisCanvas.draw(this);
    if (this.bigCanvas !== null) {
      this.bigCanvas.draw(this);
    }
  }

  keyPress(event) {
    const keyPressed = event.keyCode;
    if ([40, 39, 38, 37, 13, 32].includes(keyPressed)) {
      event.preventDefault();
    }
    if (this.gameRunning && !this.aiRunning) {
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
    this.draw();
  }

  actuallyGoActive() {
    console.log(`focus-${this.boardID}`);
    this.bigCanvas = new TetrisCanvas(`focus-${this.boardID}`, this.lineHeight);
    this.aiRunning = false;
    this.isActive = true;
    this.gameRunning = true;
    console.log("Actually going active");
  }

  setSelfActive() {
    this.multiverseController.setActive(this.boardID);
  }

  deactivate() {
    this.bigCanvas = null;
    this.boards[this.activeBoard].startAI();
  }

  startGame() {
    if (!this.gameRunning) {
      this.setSelfActive();
      this.tilesCleared = 0;
      setTimeout(() => {
        //this.tetris.reset();
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
      //this.tetris.reset();
      this.moveTile();
      this.aiRunning = true;
      //this.tilesCleared = 0;
      this.ai(this.tetris.getGame());
    }
  }

  runGame() {
    this.moveTile(4);
    if (this.isDisturbed()) {
      if (this.disturbanceClearCounter >= REQUIRED_STEPS_TO_CLEAR) {
        this.clearDisturbance();
        this.disturbanceClearCounter = 0;
      } else {
        this.disturbanceClearCounter++;
        console.log(
          "Working on clearing disturbance",
          this.disturbanceClearCounter
        );
      }
    }

    if (this.isDisturbed()) {
      if (this.disturbanceClearCounter >= REQUIRED_STEPS_TO_CLEAR) {
        this.clearDisturbance();
        this.disturbanceClearCounter = 0;
      } else {
        this.disturbanceClearCounter++;
        console.log(
          "Working on clearing disturbance",
          this.disturbanceClearCounter
        );
      }
    }

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
        copyBoard[
          copyCurrentObject[i].column + copyCurrentObject[i].row * 10
        ].box = undefined;
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
      this.checkState();
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

  checkState() {
    if (this.aiRunning && this.state === "normal") {
      if (this.disturbanceCountdown > 0) {
        this.disturbanceCountdown--;
      } else {
        const disturbances = [
          this.disturbanceNoise,
          this.disturbanceBlock,
          this.disturbanceSpeed,
        ];
        // pick a random disturbance from the array
        const disturbance =
          disturbances[Math.floor(Math.random() * disturbances.length)];
        disturbance.call(this);
      }
    }
    return this.state;
  }

  isDisturbed() {
    return this.state !== "normal";
  }

  clearDisturbance() {
    this.state = "normal";
    this.disturbanceCountdown = chooseDisturbanceCountdown();
    console.log("Cleared disturbance");
  }

  disturbanceNoise() {
    this.state = "noise";
    console.log("Disturbance noise");
  }

  disturbanceBlock() {
    this.state = "block";
    console.log("Disturbance block");
  }

  disturbanceSpeed() {
    this.state = "confused";
    console.log("Disturbance speed");
  }
}
