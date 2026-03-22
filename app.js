// ── State ──
const State = {
  IDLE: 'idle',
  WAITING: 'waiting',
  READY: 'ready',
  RESULT: 'result',
  FALSE_START: 'false-start',
};

let state = State.IDLE;
let timeoutId = null;
let readyTimestamp = 0;

// ── DOM ──
const panel = document.getElementById('panel');
const panelText = document.getElementById('panelText');
const panelResult = document.getElementById('panelResult');
const startBtn = document.getElementById('startBtn');
const bestScoreEl = document.getElementById('bestScore');
const leaderboardList = document.getElementById('leaderboardList');

// ── Local Storage ──
const STORAGE_KEY = 'reactionlab-times';

function getTopTimes() {
  const val = localStorage.getItem(STORAGE_KEY);
  if (!val) return [];
  try {
    return JSON.parse(val);
  } catch {
    return [];
  }
}

function addTime(ms) {
  const times = getTopTimes();
  times.push(ms);
  times.sort((a, b) => a - b);
  const top5 = times.slice(0, 5);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(top5));
  return top5[0] === ms && (times.length === 1 || top5[0] < times[1]);
}

function getBestScore() {
  const times = getTopTimes();
  return times.length > 0 ? times[0] : null;
}

// ── State Transitions ──
function setState(newState) {
  state = newState;
  panel.className = 'panel panel--' + newState;
  panelResult.textContent = '';

  switch (newState) {
    case State.IDLE:
      panelText.textContent = 'Click button below to start';
      startBtn.textContent = 'Start';
      break;
    case State.WAITING:
      panelText.textContent = 'Wait for it\u2026';
      startBtn.textContent = 'Waiting\u2026';
      break;
    case State.READY:
      panelText.textContent = 'Click now!';
      startBtn.textContent = 'Go!';
      readyTimestamp = performance.now();
      break;
    case State.FALSE_START:
      panelText.textContent = 'Too soon!';
      startBtn.textContent = 'Retry';
      break;
    case State.RESULT:
      startBtn.textContent = 'Retry';
      break;
  }
}

function showResult(ms) {
  setState(State.RESULT);
  panelText.textContent = 'Your time';
  panelResult.textContent = ms + ' ms';

  const prevBest = getBestScore();
  addTime(ms);
  updateBestScore();
  renderLeaderboard();

  if (prevBest === null || ms < prevBest) {
    panelText.textContent = 'New best!';
  }
}

function startGame() {
  setState(State.WAITING);
  const delay = 1500 + Math.random() * 3500; // 1.5s – 5s
  timeoutId = setTimeout(() => {
    setState(State.READY);
  }, delay);
}

function reset() {
  clearTimeout(timeoutId);
  timeoutId = null;
  setState(State.IDLE);
}

// ── Event Handlers ──
panel.addEventListener('click', () => {
  if (state === State.READY) {
    const reactionTime = Math.round(performance.now() - readyTimestamp);
    showResult(reactionTime);
  } else if (state === State.WAITING) {
    clearTimeout(timeoutId);
    setState(State.FALSE_START);
  }
});

startBtn.addEventListener('click', () => {
  if (state === State.IDLE || state === State.RESULT || state === State.FALSE_START) {
    startGame();
  }
});

// ── Best Score Display ──
function updateBestScore() {
  const best = getBestScore();
  bestScoreEl.textContent = best !== null ? 'Best: ' + best + ' ms' : '';
}

// ── Leaderboard ──
function renderLeaderboard() {
  const times = getTopTimes();

  if (times.length === 0) {
    leaderboardList.innerHTML =
      '<li class="leaderboard-empty">Play to set your first time!</li>';
    return;
  }

  leaderboardList.innerHTML = times
    .map((time, i) => {
      const rank = i + 1;
      const label = rank === 1 ? 'Fastest' : '#' + rank;
      return (
        '<li class="leaderboard-item leaderboard-item--' + rank + '">' +
        '<span class="leaderboard-name">' + label + '</span>' +
        '<span class="leaderboard-time">' + time + ' ms</span>' +
        '</li>'
      );
    })
    .join('');
}

// ── Init ──
updateBestScore();
renderLeaderboard();
