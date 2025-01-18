class TetrisController {
    constructor(containerId, config = {}) {
        // Default configuration
        this.config = {
            boxHeight: 44,
            boxWidth: 44,
            lineHeight: 1,
            gameSpeed: 800,
            ...config
        };

        // Initialize container and elements
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.setupGameContainer();
        
        // Game state
        this.tetrisCanvas = null;
        this.tetris = null;
        this.tilesCleared = 0;
        this.gameRunning = false;
        this.aiRunning = false;
        this.gameInterval = null;

        // Bind methods
        this.keyPress = this.keyPress.bind(this);
        this.startGame = this.startGame.bind(this);
        this.startAI = this.startAI.bind(this);
        
        // Initialize game components
        this.initializeGame();
        this.setupEventListeners();
    }

    setupGameContainer() {
        // Create game container structure
        this.container.innerHTML = `
            <div class="tetris-game">
                <button class="tetris-button start-game">Start Game</button>
                <button class="tetris-button start-ai">Start AI</button>
                <canvas class="tetris-canvas"></canvas>
            </div>
        `;

        // Store references to elements
        this.canvas = this.container.querySelector('.tetris-canvas');
        this.startButton = this.container.querySelector('.start-game');
        this.aiButton = this.container.querySelector('.start-ai');
    }

    initializeGame() {
        this.tetrisCanvas = new TetrisCanvas(
            this.config.lineHeight,
            this.config.boxHeight,
            this.config.boxWidth
        );
        this.tetris = new Tetris();
        this.updateDisplay();
    }

    setupEventListeners() {
        // Game controls
        document.addEventListener("keydown", this.keyPress);
        
        // Button listeners
        this.startButton.addEventListener("click", this.startGame);
        this.aiButton.addEventListener("click", this.startAI);

        // Resize handling
        window.addEventListener("resize", () => this.resizeGame());
        window.addEventListener("load", () => this.resizeGame());
    }
    isActive() {
        return this.container.classList.contains('active');
    }

    keyPress(event) {
        if (!this.isActive()) return;
        if (!this.gameRunning && !this.aiRunning) return;

        const keyPressed = event.keyCode;
        const preventDefaultKeys = [37, 38, 39, 40, 13, 32];
        
        if (preventDefaultKeys.includes(keyPressed)) {
            event.preventDefault();
        }

        this.moveTile(this.mapKeyToAction(keyPressed));
    }

    mapKeyToAction(keyCode) {
        const keyMap = {
            37: 1,  // Left arrow
            65: 1,  // A
            39: 2,  // Right arrow
            68: 2,  // D
            40: 4,  // Down arrow
            83: 4,  // S
            32: 5,  // Space
            38: 3,  // Up arrow
            87: 3,  // W
            13: 6   // Enter
        };
        return keyMap[keyCode];
    }

    moveTile(action) {
        if (!action) return;

        switch (action) {
            case 1: // Move left
                this.tetris.moveLeft();
                break;
            case 2: // Move right
                this.tetris.moveRight();
                break;
            case 3: // Rotate
                this.tetris.rotate();
                break;
            case 4: // Move down
                this.tetris.moveDown();
                break;
            case 5: // Swap hold
                this.tetris.swapHold();
                break;
            case 6: // Drop piece
                this.tetris.dropPiece();
                break;
            case 7: // AI move
                this.ai(this.tetris.getGame());
                break;
        }

        this.updateDisplay();
    }

    updateDisplay() {
        this.tetrisCanvas.draw(
            this.tetris.predictLanding(),
            this.tetris.getGame(),
            this.tilesCleared
        );
    }

    startGame() {
        if (this.gameRunning) {
            clearInterval(this.gameInterval);
            this.gameRunning = false;
            return;
        }

        this.tilesCleared = 0;
        this.gameRunning = true;
        this.aiRunning = false;

        setTimeout(() => {
            this.tetris.reset();
            this.moveTile();
        }, 500);

        setTimeout(() => {
            this.gameInterval = setInterval(() => this.runGame(), this.config.gameSpeed);
        }, 600);
    }

    startAI() {
        if (this.aiRunning) return;

        this.gameRunning = true;
        this.startGame();
        this.tetris.reset();
        this.moveTile();
        this.aiRunning = true;
        this.tilesCleared = 0;
        this.ai(this.tetris.getGame());
    }

    runGame() {
        this.moveTile(4);
        if (!this.tetris.checkCurrent()) {
            this.tilesCleared++;
            if (this.tetris.createObject(0) === false) {
                this.gameOver();
            }
            this.moveTile();
        }
    }

    gameOver() {
        this.gameRunning = false;
        this.aiRunning = false;
        clearInterval(this.gameInterval);
        // Could emit an event or call a callback here
    }

    ai(game) {
        if (!game[1]) return;

        const copyBoard = JSON.parse(JSON.stringify(game[0]));
        const copyCurrentObject = JSON.parse(JSON.stringify(game[1]));
        const copyHoldObject = JSON.parse(JSON.stringify(game[2]));

        for (let i = 0; i < copyCurrentObject.length; i++) {
            copyBoard[copyCurrentObject[i].column + (copyCurrentObject[i].row * 10)].box = undefined;
        }

        const tetrus = new aiTetrus(copyBoard, copyCurrentObject, copyHoldObject);
        const result = tetrus.placeOneObject();

        if (result === false) {
            this.gameOver();
        } else if (result[1].length > 0) {
            if (result[4]) {
                this.tetris.swapHold();
            }
            this.takeMoves(result[1]);
        } else {
            this.gameOver();
        }
    }

    takeMoves(moves) {
        // Execute moves with delays
        for (let i = moves.length - 1; i > 0; i--) {
            let action = moves[i];
            if (action === 1) action = 2;
            else if (action === 2) action = 1;

            setTimeout(() => {
                this.moveTile(action);
            }, 10 * (moves.length - i));
        }

        const loop = moves[0];
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

    resizeGame() {
        const availableWidth = window.innerWidth;
        const availableHeight = Math.min(window.innerHeight, availableWidth * 1.04);
        this.canvas.style.height = (availableHeight * 0.90) + "px";
        this.canvas.style.maxHeight = (availableHeight * 0.90) + "px";
        
        // Resize buttons
        const width = this.canvas.width / 20;
        const height = this.canvas.height / 10;
        const containerWidth = this.container.offsetWidth;
        
        this.startButton.style.fontSize = Math.round(width) + "px";
        this.aiButton.style.fontSize = Math.round(width) + "px";
        this.startButton.style.bottom = height + "px";
        this.aiButton.style.bottom = height + "px";
    }
    destroy() {
        // Clean up event listeners
        document.removeEventListener("keydown", this.keyPress);
        window.removeEventListener("resize", this.resizeGame);
        
        // Clear game interval
        if (this.gameInterval) {
            clearInterval(this.gameInterval);
        }
        
        // Clean up game state
        this.gameRunning = false;
        this.aiRunning = false;
        
        // Clean up references
        this.tetris = null;
        this.tetrisCanvas = null;
    }
    
}