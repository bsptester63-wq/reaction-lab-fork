// ── State ──
const State = {
  IDLE: 'idle',
  WAITING: 'waiting',
  COUNTDOWN: 'countdown',
  READY: 'ready',
  RESULT: 'result',
  RED_LIGHT: 'red-light',
};

const LIGHT_SEQUENCE = ['amber-1', 'amber-2', 'amber-3'];
const TREE_INTERVAL_MS = 400;
const RANDOM_DELAY_MIN_MS = 1200;
const RANDOM_DELAY_RANGE_MS = 1800;
const STORAGE_KEY = 'reactionlab-times';

let state = State.IDLE;
let timeoutIds = [];
let greenTimestamp = 0;

// ── DOM ──
const panel = document.getElementById('panel');
const panelText = document.getElementById('panelText');
const panelResult = document.getElementById('panelResult');
const startBtn = document.getElementById('startBtn');
const bestScoreEl = document.getElementById('bestScore');
const leaderboardList = document.getElementById('leaderboardList');
const bulbs = Array.from(document.querySelectorAll('[data-light]'));

function getBulb(name) {
  return document.querySelector('[data-light="' + name + '"]');
}

function resetTreeLights() {
  bulbs.forEach((bulb) => bulb.classList.remove('is-on'));
}

function lightBulb(name) {
  const bulb = getBulb(name);
  if (bulb) {
    bulb.classList.add('is-on');
  }
}

function clearScheduledTimeouts() {
  timeoutIds.forEach((id) => clearTimeout(id));
  timeoutIds = [];
}

function schedule(fn, delay) {
  const id = setTimeout(() => {
    timeoutIds = timeoutIds.filter((timeoutId) => timeoutId !== id);
    fn();
  }, delay);

  timeoutIds.push(id);
}

// ── Local Storage ──
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

  resetTreeLights();
  lightBulb('prestaged');
  lightBulb('staged');

  switch (newState) {
    case State.IDLE:
      panelText.textContent = 'Click start, then launch on green.';
      startBtn.textContent = 'Stage';
      break;
    case State.WAITING:
      panelText.textContent = 'Get ready... tree is about to drop.';
      startBtn.textContent = 'Staged';
      break;
    case State.COUNTDOWN:
      panelText.textContent = 'Amber countdown is live. Leave on green!';
      startBtn.textContent = 'Launch';
      break;
    case State.READY:
      panelText.textContent = 'Green! Click to launch!';
      startBtn.textContent = 'Launch';
      lightBulb('green');
      greenTimestamp = performance.now();
      break;
    case State.RED_LIGHT:
      panelText.textContent = 'Red light! You left before green.';
      startBtn.textContent = 'Restage';
      lightBulb('red');
      break;
    case State.RESULT:
      startBtn.textContent = 'Run Again';
      lightBulb('green');
      break;
  }
}

function showResult(ms) {
  setState(State.RESULT);
  panelText.textContent = 'Reaction time';
  panelResult.textContent = ms + ' ms';

  const prevBest = getBestScore();
  addTime(ms);
  updateBestScore();
  renderLeaderboard();

  if (prevBest === null || ms < prevBest) {
    panelText.textContent = 'New best light!';
  }
}

function triggerRedLight() {
  clearScheduledTimeouts();
  setState(State.RED_LIGHT);
}

function beginTreeSequence() {
  setState(State.COUNTDOWN);

  LIGHT_SEQUENCE.forEach((lightName, index) => {
    schedule(() => {
      lightBulb(lightName);
    }, index * TREE_INTERVAL_MS);
  });

  schedule(() => {
    setState(State.READY);
  }, LIGHT_SEQUENCE.length * TREE_INTERVAL_MS);
}

function startGame() {
  clearScheduledTimeouts();
  greenTimestamp = 0;
  setState(State.WAITING);

  const delay = RANDOM_DELAY_MIN_MS + Math.random() * RANDOM_DELAY_RANGE_MS;
  schedule(() => {
    beginTreeSequence();
  }, delay);
}

function reset() {
  clearScheduledTimeouts();
  greenTimestamp = 0;
  setState(State.IDLE);
}

// ── Event Handlers ──
panel.addEventListener('click', () => {
  if (state === State.READY) {
    const reactionTime = Math.round(performance.now() - greenTimestamp);
    showResult(reactionTime);
  } else if (state === State.WAITING || state === State.COUNTDOWN) {
    triggerRedLight();
  }
});

startBtn.addEventListener('click', () => {
  if (state === State.IDLE || state === State.RESULT || state === State.RED_LIGHT) {
    startGame();
  }
});

// ── Best Score Display ──
function updateBestScore() {
  const best = getBestScore();
  bestScoreEl.textContent = best !== null ? 'Best light: ' + best + ' ms' : '';
}

// ── Leaderboard ──
function renderLeaderboard() {
  const times = getTopTimes();

  if (times.length === 0) {
    leaderboardList.innerHTML =
      '<li class="leaderboard-empty">Stage up and log your first launch!</li>';
    return;
  }

  leaderboardList.innerHTML = times
    .map((time, i) => {
      const rank = i + 1;
      const label = rank === 1 ? 'Holeshot' : '#' + rank;
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
reset();
updateBestScore();
renderLeaderboard();
