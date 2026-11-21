// The game's rules and state, with no drawing and no browser in it: the
// current scene, the differences found, score, timer, hints and combo.
// step() advances one fixed step; click() resolves one pointer press and
// returns what happened as bit flags, so the caller can react (and play a
// sound) without the world knowing about screens or audio.
import { COMBO_BONUS, FIND_POINTS, HINTS_PER_LEVEL, HINT_COST, LEVEL_BONUS_PER_SECOND, LEVEL_TIME, SCENE_NAMES, WRONG_PENALTY, WRONG_TIME } from './config.js';
import { SCENES, totalDiffCount } from './differences.js';

export const EVENT_FOUND = 1;
export const EVENT_WRONG = 2;
export const EVENT_LEVEL = 4;
export const EVENT_OVER = 8;
export const EVENT_WIN = 16;
export const EVENT_HINT = 32;

export function createWorld() {
  const state = {
    sceneIndex: 0, found: [], hintDiff: null, hintTimer: 0,
    score: 0, timeLeft: LEVEL_TIME, hintsLeft: HINTS_PER_LEVEL,
    combo: 0, totalFound: 0, wrong: 0, elapsed: 0, levelDone: false,
    pops: [], shake: 0,
  };
  function diffs() { return SCENES[state.sceneIndex].diffs; }
  function resetLevel(index) {
    state.sceneIndex = index; state.found = []; state.hintDiff = null; state.hintTimer = 0;
    state.timeLeft = LEVEL_TIME; state.hintsLeft = HINTS_PER_LEVEL; state.combo = 0; state.levelDone = false; state.pops = [];
  }
  function reset() { state.score = 0; state.totalFound = 0; state.wrong = 0; state.elapsed = 0; resetLevel(0); }
  function remaining() { return diffs().length - state.found.length; }
  function click(panelX, panelY) {
    if (state.levelDone) return 0;
    const list = diffs();
    for (let i = 0; i < list.length; i++) {
      if (state.found.includes(list[i].id)) continue;
      const dx = panelX - list[i].x, dy = panelY - list[i].y;
      if (dx * dx + dy * dy <= list[i].r * list[i].r) {
        state.found.push(list[i].id); state.totalFound += 1; state.combo += 1;
        const gained = FIND_POINTS + (state.combo - 1) * COMBO_BONUS;
        state.score += gained; state.hintDiff = null;
        state.pops.push({ x: list[i].x, y: list[i].y, r: list[i].r, age: 0, text: `+${gained}` });
        if (state.found.length === list.length) {
          const bonus = Math.ceil(state.timeLeft) * LEVEL_BONUS_PER_SECOND;
          state.score += bonus; state.levelDone = true;
          return state.sceneIndex === SCENES.length - 1 ? EVENT_FOUND | EVENT_WIN : EVENT_FOUND | EVENT_LEVEL;
        }
        return EVENT_FOUND;
      }
    }
    state.combo = 0; state.wrong += 1; state.score = Math.max(0, state.score - WRONG_PENALTY);
    state.timeLeft = Math.max(0, state.timeLeft - WRONG_TIME); state.shake = 0.35;
    state.pops.push({ x: panelX, y: panelY, age: 0, text: '✕', wrong: true });
    return EVENT_WRONG;
  }
  function hint() {
    if (state.hintsLeft <= 0 || state.levelDone) return 0;
    const left = diffs().filter((d) => !state.found.includes(d.id));
    if (left.length === 0) return 0;
    state.hintDiff = left[Math.floor(Math.random() * left.length)].id; state.hintTimer = 2.2;
    state.hintsLeft -= 1; state.score = Math.max(0, state.score - HINT_COST);
    return EVENT_HINT;
  }
  function nextLevel() { resetLevel(state.sceneIndex + 1); }
  function step(dt) {
    state.elapsed += dt;
    if (!state.levelDone) {
      state.timeLeft = Math.max(0, state.timeLeft - dt);
      if (state.timeLeft <= 0) return EVENT_OVER;
    }
    if (state.hintTimer > 0) { state.hintTimer -= dt; if (state.hintTimer <= 0) state.hintDiff = null; }
    if (state.shake > 0) state.shake = Math.max(0, state.shake - dt);
    for (const p of state.pops) p.age += dt;
    state.pops = state.pops.filter((p) => p.age < 0.9);
    return 0;
  }
  return { state, reset, resetLevel, click, hint, nextLevel, remaining, diffs, totalDiffCount, sceneName: () => SCENE_NAMES[state.sceneIndex], step };
}
