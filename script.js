document.addEventListener("DOMContentLoaded", function () {
  let audioContext = null;
  
  function getLocalStorageItem(key, defaultValue) {
    try {
      const value = localStorage.getItem(key);
      return value !== null ? value : defaultValue;
    } catch (error) {
      console.warn('localStorage getItem failed:', error);
      return defaultValue;
    }
  }

  function setLocalStorageItem(key, value) {
    try {
      localStorage.setItem(key, String(value));
      return true;
    } catch (error) {
      console.warn('localStorage setItem failed:', error);
      return false;
    }
  }

  let soundEnabled = getLocalStorageItem('soundEnabled', 'true') !== 'false';

  function initAudioContext() {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    return audioContext;
  }

  function safePlaySound(soundFunction) {
    if (!soundEnabled) return;
    try {
      const ctx = initAudioContext();
      if (ctx) {
        soundFunction(ctx);
      }
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  }

  function playClickSound() {
    safePlaySound(function(ctx) {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.1);
    });
  }

  function playSuccessSound() {
    safePlaySound(function(ctx) {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.setValueAtTime(600, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.2);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.2);
    });
  }

  function playErrorSound() {
    safePlaySound(function(ctx) {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.setValueAtTime(300, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.3);
      oscillator.type = 'sawtooth';
      
      gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.3);
    });
  }

  function playComboSound(combo) {
    if (!soundEnabled || combo < 2) return;
    safePlaySound(function(ctx) {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      const frequency = 400 + (combo * 50);
      oscillator.frequency.value = Math.min(frequency, 1200);
      oscillator.type = 'square';
      
      gainNode.gain.setValueAtTime(0.25, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.15);
    });
  }

  function playPowerUpSound() {
    safePlaySound(function(ctx) {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.setValueAtTime(500, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
      oscillator.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.2);
      oscillator.type = 'triangle';
      
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.2);
    });
  }

  function playApplauseSound() {
    if (!soundEnabled) return;
    const ctx = initAudioContext();
    if (!ctx) return;
    
    for (let i = 0; i < 5; i++) {
      setTimeout(function() {
        try {
          const oscillator = ctx.createOscillator();
          const gainNode = ctx.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(ctx.destination);
          
          const baseFreq = 400 + Math.random() * 200;
          oscillator.frequency.value = baseFreq;
          oscillator.type = 'square';
          
          const delay = i * 0.1;
          const duration = 0.15;
          
          gainNode.gain.setValueAtTime(0, ctx.currentTime + delay);
          gainNode.gain.linearRampToValueAtTime(0.15, ctx.currentTime + delay + 0.05);
          gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + delay + duration);
          
          oscillator.start(ctx.currentTime + delay);
          oscillator.stop(ctx.currentTime + delay + duration);
        } catch (error) {
          console.warn('Applause sound failed:', error);
        }
      }, i * 100);
    }
  }

  function playVictoryFanfare() {
    if (!soundEnabled) return;
    const ctx = initAudioContext();
    if (!ctx) return;
    
    const notes = [
      { freq: 523, time: 0, duration: 0.2 },
      { freq: 659, time: 0.2, duration: 0.2 },
      { freq: 784, time: 0.4, duration: 0.3 },
      { freq: 1047, time: 0.7, duration: 0.4 }
    ];
    
    notes.forEach(function(note) {
      try {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.frequency.value = note.freq;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, ctx.currentTime + note.time);
        gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + note.time + 0.05);
        gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + note.time + note.duration);
        
        oscillator.start(ctx.currentTime + note.time);
        oscillator.stop(ctx.currentTime + note.time + note.duration);
      } catch (error) {
        console.warn('Victory fanfare note failed:', error);
      }
    });
    
    setTimeout(function() {
      playApplauseSound();
    }, 1200);
  }

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
  const MAX_POINT = 10;

  const DIFFICULTY_SETTINGS = {
    easy: { time: 15, blackCount: 2 },
    medium: { time: 10, blackCount: 3 },
    hard: { time: 7, blackCount: 4 }
  };

  let currentDifficulty = getLocalStorageItem('difficulty', 'medium');
  if (!DIFFICULTY_SETTINGS[currentDifficulty]) {
    currentDifficulty = 'medium';
  }
  let BLACK_COUNT = DIFFICULTY_SETTINGS[currentDifficulty].blackCount;
  let START_TIME = DIFFICULTY_SETTINGS[currentDifficulty].time;

  let isPlaying = false;
  let timeLeft = START_TIME;
  let score = 0;

  let timerId = null;
  let barId = null;
  let comboTimeoutId = null;
  let powerUpSpawnId = null;
  let slowMotionActive = false;
  let slowMotionTimeoutId = null;

  let currentPoint = MAX_POINT;
  let blackList = [];
  let comboCount = 0;
  const COMBO_TIMEOUT = 2000;
  const POWERUP_SPAWN_INTERVAL = 8000;
  const SLOW_MOTION_DURATION = 5000;
  const SLOW_MOTION_SPEED = 0.5;

  updateHiScoreUI();

  const settingsBtn = document.getElementById('settingsBtn');
  const settingsMenu = document.getElementById('settingsMenu');
  const settingsOverlay = document.getElementById('settingsOverlay');
  const closeSettingsBtn = document.getElementById('closeSettings');
  const soundToggleCheckbox = document.getElementById('soundToggleCheckbox');

  if (soundToggleCheckbox) {
    soundToggleCheckbox.checked = soundEnabled;
    soundToggleCheckbox.addEventListener('change', function() {
      soundEnabled = this.checked;
      setLocalStorageItem('soundEnabled', soundEnabled);
      if (soundEnabled) {
        playClickSound();
      }
    });
  }

  const difficultyButtons = document.querySelectorAll('.difficulty-btn');
  const difficultyOptionButtons = document.querySelectorAll('.difficulty-option-btn');
  
  function updateDifficultyButtons(selectedDifficulty) {
    difficultyButtons.forEach(function(btn) {
      if (btn.dataset.difficulty === selectedDifficulty) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    
    difficultyOptionButtons.forEach(function(btn) {
      if (btn.dataset.difficulty === selectedDifficulty) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
  
  function handleDifficultyChange(difficulty) {
    currentDifficulty = difficulty;
    setLocalStorageItem('difficulty', currentDifficulty);
    BLACK_COUNT = DIFFICULTY_SETTINGS[currentDifficulty].blackCount;
    START_TIME = DIFFICULTY_SETTINGS[currentDifficulty].time;
    updateDifficultyButtons(currentDifficulty);
    playClickSound();
  }

  difficultyButtons.forEach(function(btn) {
    if (btn.dataset.difficulty === currentDifficulty) {
      btn.classList.add('active');
    }
    
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      handleDifficultyChange(btn.dataset.difficulty);
    });
  });

  difficultyOptionButtons.forEach(function(btn) {
    if (btn.dataset.difficulty === currentDifficulty) {
      btn.classList.add('active');
    }
    
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      handleDifficultyChange(btn.dataset.difficulty);
    });
  });

  let isPaused = false;
  let pausedTimeLeft = 0;

  function openSettings() {
    if (settingsMenu && settingsOverlay) {
      if (isPlaying && !isPaused) {
        isPaused = true;
        pausedTimeLeft = timeLeft;
        if (timerId !== null) {
          clearInterval(timerId);
          timerId = null;
        }
        if (barId !== null) {
          clearInterval(barId);
          barId = null;
        }
      }
      
      settingsMenu.classList.remove('hidden');
      settingsOverlay.classList.remove('hidden');
      requestAnimationFrame(function() {
        settingsMenu.classList.add('show');
        settingsOverlay.classList.add('show');
      });
    }
  }

  function closeSettings() {
    if (settingsMenu && settingsOverlay) {
      settingsMenu.classList.remove('show');
      settingsOverlay.classList.remove('show');
      setTimeout(function() {
        settingsMenu.classList.add('hidden');
        settingsOverlay.classList.add('hidden');
        
        if (isPlaying && isPaused) {
          isPaused = false;
          timeLeft = pausedTimeLeft;
          requestAnimationFrame(function() {
            timeEl.textContent = timeLeft;
          });
          startTimer();
          if (typeof currentPoint !== 'undefined' && currentPoint > 0 && currentPoint < MAX_POINT) {
            resetPointBar();
          }
        }
      }, 300);
    }
  }

  if (settingsBtn) {
    settingsBtn.addEventListener('click', function() {
      openSettings();
      playClickSound();
    });
  }

  if (closeSettingsBtn) {
    closeSettingsBtn.addEventListener('click', function() {
      closeSettings();
      playClickSound();
    });
  }

  if (settingsOverlay) {
    settingsOverlay.addEventListener('click', function() {
      closeSettings();
    });
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && settingsMenu && !settingsMenu.classList.contains('hidden')) {
      closeSettings();
    }
  });

  cover.addEventListener(
    "click",
    function () {
      initAudioContext();
      cover.style.display = "none";
      startCountdown();
    },
    { once: true }
  );

  const playAgainBtn = document.getElementById('playAgainBtn');
  if (playAgainBtn) {
    playAgainBtn.addEventListener('click', function() {
      location.reload();
    });
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'F5' || (e.key === 'r' && (e.ctrlKey || e.metaKey))) {
      if (!endOverlay.classList.contains('hidden')) {
        e.preventDefault();
        location.reload();
      }
    }
  });

  tiles.forEach(function (tile) {
    tile.addEventListener("click", function () {
      if (!isPlaying) return;
      if (tile.classList.contains("powerup-slow")) {
        playPowerUpSound();
        activateSlowMotion();
        removePowerUp(tile);
        return;
      }
      if (tile.classList.contains("powerup-time")) {
        playPowerUpSound();
        activateExtraTime();
        removePowerUp(tile);
        return;
      }
      if (!tile.classList.contains("black")) {
        playErrorSound();
        return;
      }
      playClickSound();
      handleBlackClick(tile);
    });
  });

  function startCountdown() {
    let countdownValue = 3;
    requestAnimationFrame(function() {
      countdownNumber.textContent = countdownValue;
      countdownOverlay.classList.remove("hidden");
    });

    const countdownInterval = setInterval(function () {
      countdownValue--;
      if (countdownValue > 0) {
        requestAnimationFrame(function() {
          countdownNumber.textContent = countdownValue;
        });
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
    isPaused = false;
    timeLeft = START_TIME;
    score = 0;
    comboCount = 0;
    slowMotionActive = false;
    clearTimeout(comboTimeoutId);
    clearTimeout(slowMotionTimeoutId);
    clearTimeout(powerUpSpawnId);
    clearInterval(timerId);
    clearInterval(barId);

    requestAnimationFrame(function() {
      scoreEl.textContent = score;
      scoreEl.classList.remove('score-update');
      timeEl.textContent = timeLeft;
    });
    updateComboDisplay(0, 0);
    hidePowerUpNotification();

    endOverlay.classList.add("hidden");
    endTitle.classList.remove("hiscore");

    resetTiles();

    blackList = [];
    placeStartBlacks();

    startTimer();
    resetPointBar();
    startPowerUpSpawner();
  }

  function resetTiles() {
    tiles.forEach(function (tile) {
      tile.classList.remove("black", "clicked-green", "powerup-slow", "powerup-time");
      tile.style.opacity = "1";

      const pointsSpan = tile.querySelector(".points");
      pointsSpan.textContent = "";
      pointsSpan.style.opacity = "0";
      pointsSpan.style.top = "55%";
    });
  }

  function startTimer() {
    clearInterval(timerId);
    requestAnimationFrame(function() {
      timeEl.textContent = timeLeft;
    });
    
    timerId = setInterval(function () {
      timeLeft--;
      if (timeLeft < 0) timeLeft = 0;
      requestAnimationFrame(function() {
        timeEl.textContent = timeLeft;
        
        if (timeLeft <= 3 && timeLeft > 0) {
          timeEl.style.animation = 'pulse 0.5s ease-in-out';
          setTimeout(function() {
            requestAnimationFrame(function() {
              timeEl.style.animation = '';
            });
          }, 500);
        }
      });

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
      requestAnimationFrame(function() {
        tiles[index].classList.add("black");
        tiles[index].style.opacity = "1";
      });
    });
  }

  function handleBlackClick(tile) {
    const clickedIndex = Number(tile.dataset.index);

    comboCount++;
    clearTimeout(comboTimeoutId);
    
    let baseScore = currentPoint;
    let comboBonus = 0;
    
    if (comboCount > 1) {
      comboBonus = Math.floor(comboCount / 2) * 2;
    }
    
    const totalScore = baseScore + comboBonus;
    score += totalScore;
    
    animateScoreUpdate(scoreEl, totalScore);
    
    if (comboCount > 1) {
      playComboSound(comboCount);
    } else {
      playSuccessSound();
    }
    
    updateComboDisplay(comboCount, comboBonus);
    
    comboTimeoutId = setTimeout(function() {
      comboCount = 0;
      updateComboDisplay(0, 0);
    }, COMBO_TIMEOUT);

    blackList = blackList.filter(function (index) {
      return index !== clickedIndex;
    });

    tile.classList.remove("black");
    tile.classList.add("clicked-green");

    const pointsSpan = tile.querySelector(".points");
    requestAnimationFrame(function() {
      pointsSpan.textContent = "+" + currentPoint;
      pointsSpan.style.opacity = "1";
      pointsSpan.style.top = "55%";
    });

    setTimeout(function () {
      requestAnimationFrame(function() {
        pointsSpan.style.opacity = "0";
        pointsSpan.style.top = "40%";
        pointsSpan.style.transform = "translate(-50%, -50%) translateZ(0) scale(0.8)";
        tile.style.transition = "background 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)";
        tile.classList.remove("clicked-green");
      });
    }, 600);

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
    newTile.style.transform = "scale(0.8) translateZ(0)";
    newTile.style.transition = "opacity 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)";
    
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        newTile.style.opacity = "1";
        newTile.style.transform = "scale(1) translateZ(0)";
      });
    });
  }

function resetPointBar() {
  if (barId !== null) {
    clearInterval(barId);
    barId = null;
  }

  currentPoint = MAX_POINT;
  updatePointBar();

  const intervalSpeed = slowMotionActive ? 100 / SLOW_MOTION_SPEED : 100;

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
  }, intervalSpeed);
}


  function updatePointBar() {
    requestAnimationFrame(function() {
      const percent = (currentPoint / MAX_POINT) * 100;
      barInner.style.width = percent + "%";
    });
  }

  function finishGame() {
    isPlaying = false;
    isPaused = false;
    clearInterval(timerId);
    clearInterval(barId);
    clearTimeout(comboTimeoutId);
    clearTimeout(powerUpSpawnId);
    clearTimeout(slowMotionTimeoutId);
    comboCount = 0;
    slowMotionActive = false;
    updateComboDisplay(0, 0);
    hidePowerUpNotification();

    const storedHighScore = Number(getLocalStorageItem("tilesHiScore", "0"));
    const isNewHighScore = score > storedHighScore;

    if (isNewHighScore) {
      setLocalStorageItem("tilesHiScore", score);
      updateHiScoreUI();

      endTitle.textContent = "New High Score";
      endTitle.classList.add("hiscore");
      finalScoreEl.textContent = score;

      playConfettiFor3s();
      setTimeout(function() {
        playVictoryFanfare();
      }, 500);
    } else {
      endTitle.textContent = "Time is up";
      endTitle.classList.remove("hiscore");
      finalScoreEl.textContent = score;
      
      setTimeout(function() {
        playApplauseSound();
      }, 500);
    }

    endOverlay.classList.remove("hidden");
    playAgainEl.classList.add("blinking");
    
    const playAgainBtn = document.getElementById('playAgainBtn');
    if (playAgainBtn) {
      playAgainBtn.focus();
    }
  }

  function updateHiScoreUI() {
    const highScore = Number(getLocalStorageItem("tilesHiScore", "0"));
    requestAnimationFrame(function() {
      hiScoreEl.textContent = highScore;
    });
  }

  function animateScoreUpdate(scoreElement, pointsAdded) {
    if (!scoreElement) return;
    
    requestAnimationFrame(function() {
      scoreElement.textContent = score;
      scoreElement.classList.add('score-update');
      scoreElement.style.setProperty('--points-added', pointsAdded);
      
      const glowColor = comboCount > 1 ? '#fbbf24' : '#10b981';
      scoreElement.style.setProperty('--glow-color', glowColor);
    });
    
    setTimeout(function() {
      requestAnimationFrame(function() {
        scoreElement.classList.remove('score-update');
      });
    }, 600);
    
    if (pointsAdded > 0) {
      showScorePopup(scoreElement, pointsAdded);
    }
  }

  function showScorePopup(scoreElement, points) {
    const popup = document.createElement('div');
    popup.className = 'score-popup';
    popup.textContent = '+' + points;
    
    const rect = scoreElement.getBoundingClientRect();
    popup.style.left = (rect.left + rect.width / 2) + 'px';
    popup.style.top = (rect.top - 10) + 'px';
    
    document.body.appendChild(popup);
    
    requestAnimationFrame(function() {
      popup.classList.add('animate');
    });
    
    setTimeout(function() {
      popup.remove();
    }, 1000);
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

  function updateComboDisplay(combo, bonus) {
    const comboEl = document.getElementById('comboDisplay');
    const comboBonusEl = document.getElementById('comboBonus');
    
    requestAnimationFrame(function() {
      if (combo > 1) {
        comboEl.textContent = combo + 'x COMBO!';
        comboEl.style.opacity = '1';
        comboEl.style.transform = 'scale(1.1) translateZ(0)';
        
        if (bonus > 0) {
          comboBonusEl.textContent = '+' + bonus + ' bonus';
          comboBonusEl.style.opacity = '1';
        } else {
          comboBonusEl.style.opacity = '0';
        }
        
        setTimeout(function() {
          requestAnimationFrame(function() {
            comboEl.style.transform = 'scale(1) translateZ(0)';
          });
        }, 200);
      } else {
        comboEl.style.opacity = '0';
        comboEl.style.transform = 'scale(0.8) translateZ(0)';
        comboBonusEl.style.opacity = '0';
      }
    });
  }

  function startPowerUpSpawner() {
    function spawnPowerUp() {
      if (!isPlaying) return;
      
      const availableTiles = [];
      tiles.forEach(function(tile, index) {
        if (!tile.classList.contains("black") && 
            !tile.classList.contains("powerup-slow") && 
            !tile.classList.contains("powerup-time") &&
            !blackList.includes(index)) {
          availableTiles.push(index);
        }
      });

      if (availableTiles.length === 0) return;

      const randomIndex = availableTiles[Math.floor(Math.random() * availableTiles.length)];
      const powerUpTile = tiles[randomIndex];
      
      const powerUpType = Math.random() < 0.5 ? "slow" : "time";
      powerUpTile.classList.add("powerup-" + powerUpType);
      powerUpTile.style.opacity = "0";
      powerUpTile.style.transition = "opacity 0.4s ease";
      
      requestAnimationFrame(function() {
        setTimeout(function() {
          powerUpTile.style.opacity = "1";
        }, 10);
      });

      setTimeout(function() {
        if (powerUpTile.classList.contains("powerup-" + powerUpType)) {
          removePowerUp(powerUpTile);
        }
      }, 5000);

      powerUpSpawnId = setTimeout(spawnPowerUp, POWERUP_SPAWN_INTERVAL);
    }

    powerUpSpawnId = setTimeout(spawnPowerUp, POWERUP_SPAWN_INTERVAL);
  }

  function removePowerUp(tile) {
    tile.classList.remove("powerup-slow", "powerup-time");
    tile.style.opacity = "1";
  }

  function activateSlowMotion() {
    if (slowMotionActive) return;
    
    slowMotionActive = true;
    showPowerUpNotification("⏱️ Slow Motion Active!");
    
    resetPointBar();
    
    slowMotionTimeoutId = setTimeout(function() {
      slowMotionActive = false;
      hidePowerUpNotification();
      resetPointBar();
    }, SLOW_MOTION_DURATION);
  }

  function activateExtraTime() {
    timeLeft += 3;
    requestAnimationFrame(function() {
      timeEl.textContent = timeLeft;
    });
    showPowerUpNotification("⏰ +3 Seconds!");
    
    setTimeout(function() {
      hidePowerUpNotification();
    }, 2000);
  }

  function showPowerUpNotification(message) {
    const notification = document.getElementById('powerUpNotification');
    notification.textContent = message;
    requestAnimationFrame(function() {
      notification.style.opacity = '1';
      notification.style.transform = 'translate(-50%, 0) translateZ(0)';
    });
  }

  function hidePowerUpNotification() {
    const notification = document.getElementById('powerUpNotification');
    requestAnimationFrame(function() {
      notification.style.opacity = '0';
      notification.style.transform = 'translate(-50%, -20px) translateZ(0)';
    });
  }
});
