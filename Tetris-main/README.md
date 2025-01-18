# Tetris with AI

This is an implementation of the classic Tetris game, along with an AI algorithm that can automatically play the game. The game can be played online at https://jonmenard.github.io/games.html.
<p align="center">
  <a href = "https://jonmenard.github.io/games.html">
    <img width="783" alt="image" src="https://user-images.githubusercontent.com/55707155/222996005-3c12b962-378b-4dc6-a60f-749ee78f3fb1.png">
  </a>
</p>


## How to play
This implementation of Tetris uses the classic rules of the game, where the player must move and rotate falling blocks to create complete rows of blocks, which are then removed from the screen. 
You can play the game manually using the arrow keys on your keyboard. 'A' and 'S' to move. W to rotate. Space to swap. Enter to fast drop.
To play Tetris with the AI, simply click the "Start AI" button in the game's control panel. The AI algorithm will start a new game automatically.

## AI Solver
The AI algorithm is based on a simple heuristic that evaluates each possible move based on the height of the blocks on the board, the number of holes in the board, and the number of completed rows. The algorithm then chooses the move with the highest score and plays it.

## Technologies used
The game is implemented using HTML, CSS, and JavaScript, and can be played in any modern web browser.
