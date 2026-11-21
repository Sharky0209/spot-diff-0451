// Boot and the one loop: input is read every frame, the world advances in
// fixed 1/60 s steps, and the renderer paints what is there. The game moves
// between title, play, paused, level-clear, game-over and win screens.
// ?seed=N fixes the scene order. ?shot=start|play|end|play2 (with &seed=N)
// stages that scene instead of running the loop, paints it twice and sets
// window.__shotReady for a screenshot.
import { BEST_KEY, PANEL, STEP } from './config.js';
import { createWorld, EVENT_FOUND, EVENT_HINT, EVENT_LEVEL, EVENT_OVER, EVENT_WIN, EVENT_WRONG } from './world.js';
import { ACTION_CONFIRM, ACTION_HINT, ACTION_MUTE, ACTION_PAUSE, createInput } from './input.js';
import { createAudio } from './audio.js';
import { createRenderer, SCREEN_LEVEL, SCREEN_OVER, SCREEN_PAUSED, SCREEN_PLAY, SCREEN_TITLE, SCREEN_WIN } from './render.js';
import { stageShot } from './shots.js';

const MAX_FRAME = 0.25;
const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');
const canvas = document.getElementById('game');
const status = document.getElementById('status');
const world = createWorld();
const audio = createAudio();
const renderer = createRenderer(canvas);
const input = createInput(canvas, (cx, cy) => renderer.toLogical(cx, cy));

function renderState() {
  return { ...world.state, diffs: world.diffs(), sceneName: world.sceneName(), totalDiffCount: world.totalDiffCount() };
}
function readBest() { try { return Number.parseInt(window.localStorage.getItem(BEST_KEY) ?? '0', 10) || 0; } catch { return 0; } }
function saveBest(value) { try { window.localStorage.setItem(BEST_KEY, String(value)); } catch { /* storage off */ } }

function runShot(name) {
  const scene = stageShot(name, world);
  let painted = 0;
  function paint() {
    renderer.draw(renderState(), scene.screen, scene.best, 1.2);
    painted += 1;
    if (painted < 2) requestAnimationFrame(paint);
    else window.__shotReady = true;
  }
  requestAnimationFrame(paint);
}

function runGame() {
  let screen = SCREEN_TITLE; let best = readBest(); let accumulator = 0; let last = performance.now(); let lastTickSecond = -1;
  function announce(message) { status.textContent = message; }
  function startGame() { world.reset(); accumulator = 0; screen = SCREEN_PLAY; announce('Playing. Find 7 differences in the garden.'); }
  function endGame(win) {
    screen = win ? SCREEN_WIN : SCREEN_OVER;
    if (world.state.score > best) { best = world.state.score; saveBest(best); }
    announce(win ? `You found them all. Score ${world.state.score}.` : `Time up. Score ${world.state.score}.`);
  }
  function handleClick() {
    const click = input.takeClick(); if (!click) return;
    if (screen === SCREEN_TITLE || screen === SCREEN_OVER || screen === SCREEN_WIN) { startGame(); return; }
    if (screen === SCREEN_LEVEL) { world.nextLevel(); screen = SCREEN_PLAY; announce(`Level ${world.state.sceneIndex + 1}. Find ${world.diffs().length} differences.`); return; }
    if (screen !== SCREEN_PLAY) return;
    // map the logical click to a panel, if it landed inside one
    let panel = null;
    if (click.y >= PANEL.y && click.y <= PANEL.y + PANEL.height) {
      if (click.x >= PANEL.leftX && click.x <= PANEL.leftX + PANEL.width) panel = { x: click.x - PANEL.leftX, y: click.y - PANEL.y };
      else if (click.x >= PANEL.rightX && click.x <= PANEL.rightX + PANEL.width) panel = { x: click.x - PANEL.rightX, y: click.y - PANEL.y };
    }
    if (!panel) return;
    const events = world.click(panel.x, panel.y);
    if (events & EVENT_FOUND) { audio.found(); announce(`Found one. ${world.remaining()} left.`); if (events & EVENT_LEVEL) { audio.level(); screen = SCREEN_LEVEL; } else if (events & EVENT_WIN) { audio.level(); endGame(true); } }
    else if (events & EVENT_WRONG) { audio.wrong(); announce('Not a difference. Minus 10, minus 3 seconds.'); }
  }
  function handleActions() {
    const actions = input.takeActions();
    if (actions & ACTION_MUTE) { const muted = audio.toggleMute(); announce(muted ? 'Muted.' : 'Sound on.'); }
    if (actions & ACTION_HINT && screen === SCREEN_PLAY) { if (world.hint()) { audio.hint(); announce('Hint: look at the gold ring.'); } }
    if (actions & ACTION_CONFIRM && (screen === SCREEN_TITLE || screen === SCREEN_OVER || screen === SCREEN_WIN)) startGame();
    else if (actions & ACTION_CONFIRM && screen === SCREEN_LEVEL) { world.nextLevel(); screen = SCREEN_PLAY; }
    else if (actions & ACTION_PAUSE && screen === SCREEN_PLAY) { screen = SCREEN_PAUSED; announce('Paused.'); }
    else if (actions & (ACTION_PAUSE | ACTION_CONFIRM) && screen === SCREEN_PAUSED) { screen = SCREEN_PLAY; announce('Playing.'); }
  }
  function frame(now) {
    requestAnimationFrame(frame);
    accumulator += Math.min((now - last) / 1000, MAX_FRAME); last = now;
    handleActions(); handleClick();
    if (screen === SCREEN_PLAY) {
      while (accumulator >= STEP) {
        const events = world.step(STEP); accumulator -= STEP;
        if (events & EVENT_OVER) { endGame(false); break; }
        const sec = Math.ceil(world.state.timeLeft);
        if (sec !== lastTickSecond) { lastTickSecond = sec; if (sec <= 10 && sec > 0) audio.tick(); }
      }
    } else accumulator = 0;
    renderer.draw(renderState(), screen, best, now / 1000);
  }
  document.addEventListener('visibilitychange', () => { if (document.hidden && screen === SCREEN_PLAY) { screen = SCREEN_PAUSED; announce('Paused.'); } });
  announce('Spot the Difference. Press Space or click to start.');
  requestAnimationFrame(frame);
}
if (shot) runShot(shot); else runGame();
