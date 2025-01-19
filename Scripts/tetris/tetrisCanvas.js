const pixleRatio = window.devicePixelRatio || 1;
// Note, the canvas is still a size fixed somewhere else, but the pixel ratio is used to scale the canvas
const boxSize = 40 * pixleRatio;
const lineHeight = 1;

function pickBoardColour(controller) {
  if (controller.isDisturbed()) {
    switch (controller.state) {
      case "noise":
        return "pink";
      case "block":
        return "yellow";
      case "confused":
        return "green";
      default:
        return "red";
    }
  }
  return controller.gameRunning
    ? "white"
    : controller.aiRunning
    ? "orange"
    : "grey";
}

class StandardTetrisCanvas {
  constructor(
    boardID,
    lineHeight,
    width = 20,
    height = 22,
    windowWidth = 800,
    windowHeight = 800
  ) {
    this.boardID = boardID;
    this.cvs = document.getElementById(`tetris-${boardID}`);
    this.ctx = this.cvs.getContext("2d");
    this.offsetLeft = boxSize - lineHeight * 6;
    this.offsetTop = boxSize;
    this.lineHeight = lineHeight;

    this.heightPixels = height * boxSize;
    this.widthPixels = width * boxSize;
    this.boxSize = 2.5;

    function resizeGame() {
      let avalibleWidth = windowWidth;
      let avalibleHeight = Math.min(windowHeight, avalibleWidth);
      document.getElementById(`tetris-${boardID}`).style.height =
        avalibleHeight * 0.9 + "px";
      document.getElementById(`tetris-${boardID}`).style.maxHeight =
        avalibleHeight * 0.9 + "px";
    }

    resizeGame();

    window.addEventListener("load", resizeGame);
    window.addEventListener("resize", resizeGame);
  }

  // pink indicates an error
  drawBoard(rowsBelow, game, bgColor = "pink", aiRunning = false) {
    this.ctx.canvas.height = this.heightPixels;
    this.ctx.canvas.width = this.widthPixels;

    //clearing the canvas
    this.ctx.fillStyle = bgColor;
    this.ctx.fillRect(0, 0, this.widthPixels, this.heightPixels);

    //drawing the grid
    this.ctx.fillStyle = "grey";
    for (
      let verticalLineNumber = 1;
      verticalLineNumber <= 19;
      verticalLineNumber++
    ) {
      this.ctx.fillRect(
        this.offsetLeft,
        this.offsetTop +
          boxSize * verticalLineNumber +
          this.lineHeight * verticalLineNumber,
        10 * boxSize + 10,
        this.lineHeight
      );
    }

    for (
      let horizontalLineNumber = 0;
      horizontalLineNumber <= 10;
      horizontalLineNumber++
    ) {
      this.ctx.fillRect(
        this.offsetLeft +
          boxSize * horizontalLineNumber +
          this.lineHeight * horizontalLineNumber,
        this.offsetTop,
        this.lineHeight,
        20 * boxSize + 20
      );
    }

    //drawing the border
    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = "rgba(0,0,0,1)";
    this.ctx.strokeRect(
      this.offsetLeft,
      this.offsetTop,
      10 * boxSize + 11 * this.lineHeight,
      20 * boxSize + 21 * this.lineHeight
    );

    //drawing boxes
    this.drawBoxes(rowsBelow, game[0], game[1]);

    return true;
  }

  drawBox(x, y, color, size, lineSize) {
    // draw the box itself
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, size, size);

    // draw a black border around the box
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(x, y, size, lineSize);
    this.ctx.fillRect(x, y, lineSize, size);
    this.ctx.fillRect(x, y + size, size, lineSize);
    this.ctx.fillRect(x + size, y, lineSize, size);
  }

  // draw all the boxes
  drawBoxes(rowsBelow, gameBoard, currentObject) {
    // draw the ghost piece on the bottom
    let rowAdded = rowsBelow;
    for (let i = 0; i < currentObject.length; i++) {
      let box = currentObject[i];
      let row = box.row + rowAdded;
      let column = box.column;
      this.drawBox(
        this.offsetLeft +
          column * (boxSize + this.lineHeight) +
          this.lineHeight,
        this.offsetTop + row * (boxSize + this.lineHeight) + this.lineHeight,
        "rgb(229, 229, 229)",
        boxSize,
        this.lineHeight + 2
      );
    }

    for (let i = 199; i >= 0; i--) {
      if (gameBoard[i].box != undefined) {
        let box = gameBoard[i].box;
        let column = box.column;
        let row = box.row;
        this.drawBox(
          this.offsetLeft +
            column * (boxSize + this.lineHeight) +
            this.lineHeight,
          this.offsetTop + row * (boxSize + this.lineHeight) + this.lineHeight,
          box.color,
          boxSize,
          this.lineHeight
        );
      }
    }
  }

  // used to draw the next object and the hold object
  drawUIBlock(object, x, y) {
    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = "rgba(0,0,0,1)";
    this.ctx.strokeRect(x, y, boxSize * 5, boxSize * 4);
    let blockType = object[0].blockType;
    let r;
    let c;
    if (blockType == 1) {
      r = -1 / 2;
      c = 3;
    } else if (blockType == 2) {
      r = 0;
      c = 3;
    } else if (blockType == 5) {
      r = 0;
      c = 3.5;
    } else {
      r = 0;
      c = 2.5;
    }

    for (let i = 0; i < object.length; i++) {
      let box = object[i];
      let column = box.column - 2;
      let row = box.row;
      this.drawBox(
        x + boxSize * (2.5 + column - c),
        y + boxSize * (1 - r + row),
        box.color,
        boxSize,
        this.lineHeight
      );
    }
  }
}

class TetrisCanvas extends StandardTetrisCanvas {
  draw(tetrisController) {
    let tetris = tetrisController.tetris;
    let game = tetris.getGame();

    super.drawBoard(
      tetrisController.tetris.predictLanding(),
      tetrisController.tetris.getGame(),
      pickBoardColour(tetrisController),
      tetrisController.aiRunning
    );

    this.drawHold(game[2]);
    this.drawNext(game[3]);
    this.drawLabels();
    this.drawScore(tetrisController.tilesCleared);
    return true;
  }

  drawScore(score) {
    this.ctx.fillStyle = "black";
    this.ctx.font = boxSize * 1.25 + "px VT323";
    const zeroPad = (num, places) => String(num).padStart(places, "0");
    this.ctx.fillText(
      zeroPad(score, 7),
      this.offsetLeft + 13.5 * boxSize,
      this.offsetTop + 15 * boxSize
    );
  }

  drawLabels() {
    this.ctx.fillStyle = "black";
    this.ctx.font = boxSize * 1.25 + "px VT323";
    this.ctx.textAlign = "center";
    this.ctx.fillText(
      "Next",
      this.offsetLeft + boxSize * 13.5,
      this.offsetTop + boxSize * 5.5
    );
    this.ctx.fillText(
      "Hold",
      this.offsetLeft + boxSize * 13.5,
      this.offsetTop + boxSize * 11.5
    );
  }

  drawNext(nextObject) {
    this.drawUIBlock(
      nextObject,
      this.offsetLeft + boxSize * 11,
      this.offsetTop
    );
  }

  drawHold(holdObject) {
    this.drawUIBlock(
      holdObject,
      this.offsetLeft + boxSize * 11,
      this.offsetTop + boxSize * 6
    );
  }
}

class TetrisMiniCanvas extends StandardTetrisCanvas {
  constructor(boardID, lineHeight = 1, width = 12, height = 22) {
    super(boardID, lineHeight, width, height, 400, 400);
  }

  draw(tetrisController) {
    // tetris.predictLanding(), this.tetris.getGame(), this.tilesCleared, this.aiRunning
    let tetris = tetrisController.tetris;
    super.drawBoard(
      tetris.predictLanding(),
      tetris.getGame(),
      pickBoardColour(tetrisController),
      tetrisController.aiRunning
    );
  }
}
