class StoryController {
    constructor(multiverseController) {
        this.multiverseController = multiverseController;
        this.storyElement = $("#story-box");
        console.log("StoryController created");
    
    }

    setStoryText(text) {
        this.storyElement.html(text);
    }
}

const storyController = new StoryController(multiverseController);
storyController.setStoryText("Welcome to the Tetris Multiverse! You are the controller of the Multiverse. You can switch between the different universes by clicking on the boards below.");