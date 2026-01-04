document.addEventListener("DOMContentLoaded", function () {
  const tiles = document.querySelectorAll(".tile");

  const cover = document.getElementById("cover");
  const countdownOverlay = document.getElementById("countdownOverlay");
  const countdownNumber = document.getElementById("countdownNumber");

  const gameContainer = document.getElementById("gameContainer");
  const hiScoreEl = document.getElementById("hiScoreValue");
  const scoreEl = document.getElementById("scoreValue");
  const timeEl = document.getElementById("timeValue");

  const barInner = document.getElementById("pointBarInner");

  const endOverlay = document.getElementById("endOverlay");
  const endTitle = document.getElementById("endTitle");
  const finalScoreEl = document.getElementById("finalScore");
  const messageEl = document.getElementById("message");
  const playAgainEl = document.getElementById("playAgain");

  const BOARD_SIZE = 16;
  const BLACK_COUNT = 3;
  const START_TIME = 10;
  const MAX_POINT = 10;

  let isPlaying = false;
  let timeLeft = START_TIME;
  let score = 0;

  let timerId = null;
  let barId = null;

  let currentPoint = MAX_POINT;
  let blackList = [];

  updateHiScoreUI();

  cover.addEventListener(
    "click",
    function () {
      cover.style.display = "none";
      startCountdown();
    },
    { once: true }
  );

  tiles.forEach(function (tile) {
    tile.addEventListener("click", function () {
      if (!isPlaying) return;
      if (!tile.classList.contains("black")) return;
      handleBlackClick(tile);
    });
  });

  function startCountdown() {
    let countdownValue = 3;
    countdownNumber.textContent = countdownValue;
    countdownOverlay.classList.remove("hidden");

    const countdownInterval = setInterval(function () {
      countdownValue--;
      if (countdownValue > 0) {
        countdownNumber.textContent = countdownValue;
      } else {
        clearInterval(countdownInterval);
        countdownOverlay.classList.add("hidden");
        startGame();
      }
    }, 1000);
  }

  function startGame() {
    gameContainer.classList.remove("hidden");

    isPlaying = true;
    timeLeft = START_TIME;
    score = 0;

    scoreEl.textContent = score;
    timeEl.textContent = timeLeft;

    endOverlay.classList.add("hidden");
    endTitle.classList.remove("hiscore");

    resetTiles();

    blackList = [];
    placeStartBlacks();

    startTimer();
    resetPointBar();
  }

  function resetTiles() {
    tiles.forEach(function (tile) {
      tile.classList.remove("black", "clicked-green");
      tile.style.opacity = "1";

      const pointsSpan = tile.querySelector(".points");
      pointsSpan.textContent = "";
      pointsSpan.style.opacity = "0";
      pointsSpan.style.top = "55%";
    });
  }

  function startTimer() {
    clearInterval(timerId);
    timerId = setInterval(function () {
      timeLeft--;
      if (timeLeft < 0) timeLeft = 0;
      timeEl.textContent = timeLeft;

      if (timeLeft === 0) {
        clearInterval(timerId);
        finishGame();
      }
    }, 1000);
  }

  function placeStartBlacks() {
    while (blackList.length < BLACK_COUNT) {
      const index = Math.floor(Math.random() * BOARD_SIZE);
      if (!blackList.includes(index)) blackList.push(index);
    }

    blackList.forEach(function (index) {
      tiles[index].classList.add("black");
      tiles[index].style.opacity = "1";
    });
  }

  function handleBlackClick(tile) {
    const clickedIndex = Number(tile.dataset.index);

    score += currentPoint;
    scoreEl.textContent = score;

    blackList = blackList.filter(function (index) {
      return index !== clickedIndex;
    });

    tile.classList.remove("black");
    tile.classList.add("clicked-green");

    const pointsSpan = tile.querySelector(".points");
    pointsSpan.textContent = "+" + currentPoint;
    pointsSpan.style.opacity = "1";
    pointsSpan.style.top = "55%";

    setTimeout(function () {
      pointsSpan.style.opacity = "0";
      pointsSpan.style.top = "40%";
      tile.style.transition = "background 0.3s ease";
      tile.classList.remove("clicked-green");
    }, 500);

    spawnNewBlack(clickedIndex);

    resetPointBar();
  }

  function spawnNewBlack(previousIndex) {
    let newIndex = Math.floor(Math.random() * BOARD_SIZE);
    while (blackList.includes(newIndex) || newIndex === previousIndex) {
      newIndex = Math.floor(Math.random() * BOARD_SIZE);
    }

    blackList.push(newIndex);

    const newTile = tiles[newIndex];
    newTile.classList.add("black");
    newTile.style.opacity = "0";
    newTile.style.transition = "opacity 0.4s ease";
    
    requestAnimationFrame(function() {
      setTimeout(function() {
        newTile.style.opacity = "1";
      }, 10);
    });
  }

function resetPointBar() {
  if (barId !== null) {
    clearInterval(barId);
    barId = null;
  }

  currentPoint = MAX_POINT;
  updatePointBar();

  barId = setInterval(function () {
    currentPoint = currentPoint - 1;

    if (currentPoint <= 0) {
      currentPoint = 0;
      updatePointBar();
      clearInterval(barId);
      barId = null;
      return;
    }

    updatePointBar();
  }, 100);
}


  function updatePointBar() {
    const percent = (currentPoint / MAX_POINT) * 100;
    barInner.style.width = percent + "%";
  }

  function finishGame() {
    isPlaying = false;
    clearInterval(barId);

    const storedHighScore = Number(localStorage.getItem("tilesHiScore") || 0);
    const isNewHighScore = score > storedHighScore;

    if (isNewHighScore) {
      localStorage.setItem("tilesHiScore", String(score));
      updateHiScoreUI();

      endTitle.textContent = "New High Score";
      endTitle.classList.add("hiscore");
      finalScoreEl.textContent = score;

      playConfettiFor3s();
    } else {
      endTitle.textContent = "Time is up";
      endTitle.classList.remove("hiscore");
      finalScoreEl.textContent = score;
    }

    endOverlay.classList.remove("hidden");
    playAgainEl.classList.add("blinking");
  }

  function updateHiScoreUI() {
    const highScore = Number(localStorage.getItem("tilesHiScore") || 0);
    hiScoreEl.textContent = highScore;
  }

  function playConfettiFor3s() {
    if (typeof confetti !== "function") return;

    const endTime = Date.now() + 3000;

    (function shootConfetti() {
      confetti({ 
        particleCount: 8, 
        angle: 60, 
        spread: 55, 
        origin: { x: 0 },
        colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']
      });
      confetti({ 
        particleCount: 8, 
        angle: 120, 
        spread: 55, 
        origin: { x: 1 },
        colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']
      });

      if (Date.now() < endTime) {
        requestAnimationFrame(shootConfetti);
      }
    })();
  }
});
