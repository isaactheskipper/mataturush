const player = document.getElementById("player");
const game = document.getElementById("game");
const scoreDisplay = document.getElementById("score");

let isJumping = false;
let gravity = 0.8;
let velocity = 0;
let position = 0;
let score = 0;
let gameOver = false;
let helbMode = false;

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !isJumping) {
    isJumping = true;
    velocity = -14;
  }
});

function jumpLoop() {
  if (isJumping) {
    position += velocity;
    velocity += gravity;

    if (position >= 0) {
      position = 0;
      isJumping = false;
    }

    player.style.bottom = 50 + position + "px";
  }

  requestAnimationFrame(jumpLoop);
}

function createObstacle() {
  const obstacle = document.createElement("div");
  obstacle.classList.add("obstacle");

  if (Math.random() > 0.5) obstacle.classList.add("exam");

  obstacle.style.left = "100%";
  game.appendChild(obstacle);

  let moveInterval = setInterval(() => {
    if (gameOver) return clearInterval(moveInterval);

    let left = parseInt(obstacle.style.left);
    if (left < -50) {
      obstacle.remove();
      clearInterval(moveInterval);
    } else {
      obstacle.style.left = left - (helbMode ? 6 : 4) + "px";

      // Collision detection
      const playerRect = player.getBoundingClientRect();
      const obsRect = obstacle.getBoundingClientRect();

      if (
        playerRect.left < obsRect.left + obsRect.width &&
        playerRect.left + playerRect.width > obsRect.left &&
        playerRect.top < obsRect.top + obsRect.height &&
        playerRect.height + playerRect.top > obsRect.top
      ) {
        endGame();
      }
    }
  }, 20);
}

function createHelb() {
  const helb = document.createElement("div");
  helb.classList.add("helb");
  helb.style.left = "100%";
  game.appendChild(helb);

  let moveInterval = setInterval(() => {
    if (gameOver) return clearInterval(moveInterval);

    let left = parseInt(helb.style.left);
    if (left < -50) {
      helb.remove();
      clearInterval(moveInterval);
    } else {
      helb.style.left = left - 4 + "px";

      // Collision detection with HELB
      const playerRect = player.getBoundingClientRect();
      const helbRect = helb.getBoundingClientRect();

      if (
        playerRect.left < helbRect.left + helbRect.width &&
        playerRect.left + playerRect.width > helbRect.left &&
        playerRect.top < helbRect.top + helbRect.height &&
        playerRect.height + playerRect.top > helbRect.top
      ) {
        activateHelbMode();
        helb.remove();
        clearInterval(moveInterval);
      }
    }
  }, 20);
}

function activateHelbMode() {
  helbMode = true;
  game.style.background = "#ffb347"; // Color change
  setTimeout(() => {
    helbMode = false;
    game.style.background = "linear-gradient(to top, #444, #87ceeb)";
  }, 7000);
}

function updateScore() {
  if (!gameOver) {
    score++;
    scoreDisplay.textContent = `Score: ${score}`;
  }
}

function endGame() {
  gameOver = true;
  alert(`💸 Game Over!\nYour HELB Score: ${score}`);
  location.reload(); // restart
}

jumpLoop();
setInterval(updateScore, 100);

// Spawn obstacles every 1.5s
setInterval(() => {
  if (!gameOver) createObstacle();
}, 1500);

// Spawn HELB every 7–12 seconds
setInterval(() => {
  if (!gameOver) createHelb();
}, 7000 + Math.random() * 5000);
