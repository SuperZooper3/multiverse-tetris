function showGameOver(score) {
    document.getElementById('finalScore').textContent = `Your Score: ${score}`;
    document.getElementById('gameOverScreen').style.display = 'flex';
  }

  function restartGame() {
    document.getElementById('gameOverScreen').style.display = 'none';
    console.log('Game Restarted');
    location.reload(); // Reloads the current page
  }


  function checkGameOverCondition() {
    const gameOver = true; 
    const finalScore = 123; 
    if (gameOver) {
      showGameOver(finalScore);
      console.log('Game Over');
    }
  }

  setTimeout(checkGameOverCondition, 1);