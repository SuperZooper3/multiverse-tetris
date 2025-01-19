const REQUIRED_STEPS_TO_CLEAR = 10;
const DISTURBANCE_MIN_TIME = 300;
const DISTURBANCE_MAX_TIME = 1000;

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
    multiverseController.tilesCleared = 0;
    this.isActive = null;
    this.tetrisCanvas = null;
    this.tetris = null;
    this.state = "normal";
    this.disturbanceCountdown = chooseDisturbanceCountdown();
    this.disturbanceClearCounter = 0;
    this.bigCanvas = null;
    this.setup();
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
    if ([40, 39, 38, 37, 13, 32].includes(keyPressed) && this.aiRunning) {
      event.preventDefault();
    }
    if (this.gameRunning && !this.aiRunning && this.isActive) {
      this.moveTile(keyPressed);
    }
  }

  moveTile(event) {
    const keyPressed = event;
    switch (keyPressed) {
      case 1:
      case 65: // a
      case 37: // left
        this.tetris.moveLeft();
        break;
      case 2:
      case 68: // d
      case 39: // right
        this.tetris.moveRight();
        break;
      case 4:
      case 83: // s
      case 40: // down
        this.tetris.moveDown();
        break;
      case 5:
      case 32: // space
        this.tetris.dropPiece();
        break;
      case 3: // cancel
      case 87: // w
      case 38: // up
        this.tetris.rotate();
        break;
      case 6:
      case 13: // enter
      case 67: // c
        this.tetris.swapHold();
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
    if (!this.isDisturbed()) {
        this.startAI();
    }
  }

  startGame() {
    if (!this.gameRunning) {
      this.setSelfActive();
      //this.tilesCleared = 0;
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

  disableAI() {
    this.aiRunning = false;
    this.isActive = false;
    clearInterval(this.gameInterval);
    this.gameInterval = setInterval(() => this.runGame(), 800);
  }

  runGame() {
    this.moveTile(4);
    if (this.isDisturbed() && this.isActive) {
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
      this.multiverseController.tilesCleared++;
      if (this.tetris.createObject(0) === false) {
        this.gameRunning = false;
        this.aiRunning = false;
        clearInterval(this.gameInterval);
      }
      this.moveTile();
    }
  }

  ai(game) {
    if(this.aiRunning) {
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
        this.multiverseController.tilesCleared++;
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

  disturbanceSpeed() {
    this.state = "confused";
    console.log("Disturbance speed");
    this.tetris.tetrisObject.addUnusedOption();
    // dissable the AI but leave it to keep falling idilly until you come and help
    this.disableAI();
  }
}
