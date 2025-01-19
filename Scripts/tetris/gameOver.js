function showGameOver(score) {
    document.getElementById('finalScore').textContent = `Your Score: ${score}`;
    document.getElementById('gameOverScreen').style.display = 'flex';
  }

function restartGame() {
  document.getElementById('gameOverScreen').style.display = 'none';
  console.log('Game Restarted');
  location.reload(); // Reloads the current page
}
