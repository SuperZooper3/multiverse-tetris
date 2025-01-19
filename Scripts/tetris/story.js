const MIN_SEC_BETWEEN_EVENTS = 5;

class StoryController {
    constructor(multiverseController) {
        this.multiverseController = multiverseController;
        this.storyProgress = 0;
        this.lastEventTime = Date.now();
        this.storyElement = $("#story-box");
        this.checkForPoints();
        // add a listener for keyboard events to call check cheatcode
        $(document).on("keydown", (event) => {
            this.checkCheatCode(event);
        });
    }

    setStoryText(text) {
        this.storyElement.html(text);
    }

    checkCheatCode(event) {
        // console.log(event, event.key, event.shiftKey);
        if (event.key === "T") {
            this.eventAddSecondBoard();
            this.storyProgress = 1;
        }
        if (event.key === "Y") {
            this.eventAddressFirstDisturbance();
            this.storyProgress = 2;
        }
        if (event.key === "U" && event.shiftKey) {
            this.eventAddThirdAndFourthBoard();
            this.storyProgress = 3;
        }
        if (event.key === "I" && event.shiftKey) {
            this.eventAddFifthAndSixthBoard();
            this.storyProgress = 4;
        }
    }

    checkForPoints() {
        // Skip if not enough time has passed
        if (Date.now() - this.lastEventTime < MIN_SEC_BETWEEN_EVENTS * 1000) {
            setTimeout(() => this.checkForPoints(), 1000);
            return;
        }

        // Define story steps in order
        const steps = [
            {
                check: () => this.multiverseController.points > 100,
                event: () => this.eventAddSecondBoard()
            },
            {
                check: () => this.multiverseController.points > 500,
                event: () => this.eventAddressFirstDisturbance()
            },
            {
                check: () => this.multiverseController.points > 5000,
                event: () => this.eventAddThirdAndFourthBoard()
            },
            {
                check: () => this.multiverseController.points > 10000,
                event: () => this.eventAddFifthAndSixthBoard()
            }
        ];

        // Execute the step if condition is met
        if (steps[this.storyProgress] && steps[this.storyProgress].check()) {
            steps[this.storyProgress].event();
            this.storyProgress++;
            this.lastEventTime = Date.now();
        }

        // Check again in 1 second
        setTimeout(() => this.checkForPoints(), 1000);
    }

    eventAddSecondBoard(){
        console.log("Adding second board");
        multiverseController.addBoard();
        this.setStoryText("You're doing great! We've got this new fangled AI technology, so now you can to manage two boards at once! What fun. Click on the board to switch between them.");
    }

    eventAddressFirstDisturbance(){
        this.multiverseController.forceDisturbance();
        this.setStoryText("Oh no! It looks like there's a disturbance on a board! There's a new piece the auto-AI has never seen before. Clear 2 lines manually to train the AI.");
    }

    eventAddThirdAndFourthBoard(){
        console.log("Adding third and fourth board");
        multiverseController.addBoard();
        setTimeout(() => {
            multiverseController.addBoard();
        }, 1000);
        this.setStoryText("You're a natural! We're going to add two more boards for you to manage. You're doing great! Keep it up! Don't mess up!");
    }

    eventAddFifthAndSixthBoard(){
        console.log("Adding fifth and sixth board");
        multiverseController.addBoard();
        setTimeout(() => {
            multiverseController.addBoard();
        }, 1000);
        this.setStoryText("You're in the big leagues now! You've been promoted to cheif Tetris Traffic Controller! Make us proud!");
    }
}

const storyController = new StoryController(multiverseController);
storyController.setStoryText("Welcome to your first day at Tetris Traffic Control! Your job is to manage the block traffic on this Tetris board by clearing rows.");