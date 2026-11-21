// Drawing only: the world's state and the current screen in, pixels out.
// The 1280x720 playfield is scaled to fit the window and centred. Each
// frame paints the HUD, then the two panels side by side (left original,
// right altered), then the found markers, the hint ring, the pop scores
// and the screen overlay. Text that holds a number is rebuilt only when
// the number changes, so a frame allocates nothing.
import { FIELD, FONT, PALETTE, PANEL } from './config.js';
import { drawScene } from './scenes.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_PAUSED = 'paused';
export const SCREEN_LEVEL = 'level';
export const SCREEN_OVER = 'over';
export const SCREEN_WIN = 'win';

function cachedLabel(prefix) {
  let value = -1; let text = '';
  return function label(next) { if (next !== value) { value = next; text = prefix + next; } return text; };
}

export function createRenderer(canvas) {
  const context = canvas.getContext('2d');
  const view = { scale: 1, x: 0, y: 0 };
  const scoreLabel = cachedLabel('Score ');
  const foundLabel = cachedLabel('');
  const fonts = new Map();
  function text(value, x, y, size, color, align) {
    if (!fonts.has(size)) fonts.set(size, `${size}px ${FONT}`);
    context.font = fonts.get(size); context.fillStyle = color; context.textAlign = align || 'left'; context.fillText(value, x, y);
  }
  function resize() {
    const ratio = window.devicePixelRatio || 1;
    const width = Math.round(window.innerWidth * ratio); const height = Math.round(window.innerHeight * ratio);
    canvas.width = width; canvas.height = height;
    view.scale = Math.min(width / FIELD.width, height / FIELD.height);
    view.x = (width - FIELD.width * view.scale) / 2; view.y = (height - FIELD.height * view.scale) / 2;
  }
  function panelOrigin(isRight) { return { x: isRight ? PANEL.rightX : PANEL.leftX, y: PANEL.y }; }
  function drawPanel(state, isRight, time) {
    const o = panelOrigin(isRight);
    context.save(); context.translate(o.x, o.y);
    const shake = state.shake > 0 ? (Math.random() - 0.5) * 6 : 0; context.translate(shake, 0);
    context.fillStyle = '#fff'; context.fillRect(-4, -4, PANEL.width + 8, PANEL.height + 8);
    drawScene(context, state.sceneIndex, isRight, time);
    // found markers: a green ring + check on BOTH panels, at the same spot
    for (const id of state.found) {
      const d = state.diffs.find((x) => x.id === id); if (!d) continue;
      const pop = state.pops.find((p) => p.x === d.x && p.y === d.y);
      const r = d.r * (pop ? 1 + (0.9 - pop.age) * 0.25 : 1);
      context.strokeStyle = '#2f9e44'; context.lineWidth = 5; context.beginPath(); context.arc(d.x, d.y, r, 0, Math.PI * 2); context.stroke();
      context.fillStyle = '#2f9e44'; context.beginPath(); context.arc(d.x, d.y, 11, 0, Math.PI * 2); context.fill();
      context.strokeStyle = '#fff'; context.lineWidth = 3; context.beginPath(); context.moveTo(d.x - 5, d.y); context.lineTo(d.x - 1, d.y + 4); context.lineTo(d.x + 6, d.y - 5); context.stroke();
    }
    if (state.hintDiff) {
      const d = state.diffs.find((x) => x.id === state.hintDiff); if (d) {
        const pulse = 1 + Math.sin(time * 8) * 0.12;
        context.strokeStyle = '#ffb703'; context.lineWidth = 4; context.setLineDash([10, 6]);
        context.beginPath(); context.arc(d.x, d.y, d.r * pulse, 0, Math.PI * 2); context.stroke(); context.setLineDash([]);
      }
    }
    for (const p of state.pops) {
      if (p.wrong) { context.fillStyle = '#ff5d5d'; text('✕', p.x, p.y - p.age * 20, 26, '#ff5d5d', 'center'); }
      else { context.fillStyle = '#2f9e44'; text(p.text, p.x, p.y - (p.r || 34) - 14 - p.age * 18, 22, '#1b7a2e', 'center'); }
    }
    context.restore();
    context.strokeStyle = PALETTE.panelBorder; context.lineWidth = 3; context.strokeRect(o.x - 4, o.y - 4, PANEL.width + 8, PANEL.height + 8);
    text(isRight ? 'RIGHT — spot the changes' : 'LEFT — original', o.x, o.y - 12, 15, PALETTE.muted, 'left');
  }
  function drawHud(state, best) {
    context.fillStyle = PALETTE.hud; context.fillRect(0, 0, FIELD.width, 96);
    text('SPOT THE DIFFERENCE', 20, 34, 28, PALETTE.text, 'left');
    text(state.sceneName ? '' : '', 0, 0, 1, '#000', 'left');
    const total = state.diffs.length; const found = state.found.length;
    text(`Found ${found} / ${total}  •  ${total - found} left`, 20, 66, 20, PALETTE.accent, 'left');
    text(scoreLabel(state.score), 560, 34, 24, PALETTE.text, 'left');
    text(`Best ${best}`, 560, 66, 16, PALETTE.muted, 'left');
    const label = `Level ${state.sceneIndex + 1}/3 — ${['Garden Cottage', 'Lighthouse Bay', 'Winter Market'][state.sceneIndex]}`;
    text(label, 860, 34, 18, PALETTE.text, 'left');
    const secs = Math.ceil(state.timeLeft);
    text(secs <= 20 ? `⏱ ${secs}s — hurry!` : `⏱ ${secs}s`, 860, 66, 20, secs <= 20 ? PALETTE.timerLow : PALETTE.timer, 'left');
    const w = 340; const frac = Math.max(0, state.timeLeft / 90);
    context.fillStyle = '#333d55'; context.fillRect(860, 76, w, 8);
    context.fillStyle = secs <= 20 ? PALETTE.timerLow : PALETTE.timer; context.fillRect(860, 76, w * frac, 8);
    // progress dots
    for (let i = 0; i < total; i++) { context.fillStyle = i < found ? PALETTE.good : '#3a4358'; context.beginPath(); context.arc(360 + i * 22, 60, 7, 0, Math.PI * 2); context.fill(); }
    context.fillStyle = PALETTE.backdrop; context.fillRect(0, 648, FIELD.width, 72);
    text('Click a difference on either picture  •  H hint (3 per level, −20)  •  P pause  •  M mute  •  Wrong click −10 and −3s', 20, 682, 16, PALETTE.muted, 'left');
    text(`Hints left: ${state.hintsLeft}   •   Total found: ${state.totalFound} / 24`, 20, 706, 14, PALETTE.muted, 'left');
  }
  function overlay(title, lines) {
    context.fillStyle = 'rgba(10,14,24,0.72)'; context.fillRect(0, 0, FIELD.width, FIELD.height);
    context.fillStyle = '#fff'; context.fillRect(340, 150, 600, 420); context.strokeStyle = PALETTE.accent; context.lineWidth = 4; context.strokeRect(340, 150, 600, 420);
    text(title, 640, 210, 34, '#1d2436', 'center');
    lines.forEach((line, i) => text(line, 640, 258 + i * 34, 19, '#33415c', 'center'));
    text('Press Space or click to continue', 640, 530, 16, '#8b93a3', 'center');
  }
  function draw(state, screen, best, time) {
    resize();
    context.setTransform(view.scale, 0, 0, view.scale, view.x, view.y);
    context.fillStyle = PALETTE.backdrop; context.fillRect(0, 0, FIELD.width, FIELD.height);
    if (screen === SCREEN_TITLE) {
      // garden preview behind the title, both panels side by side so the
      // whole frame is a real game picture, not a half-dark screen
      context.save(); context.translate(PANEL.leftX, PANEL.y); drawScene(context, 0, false, time); context.restore();
      context.save(); context.translate(PANEL.rightX, PANEL.y); drawScene(context, 0, true, time); context.restore();
      context.fillStyle = 'rgba(10,14,24,0.78)'; context.fillRect(0, 0, FIELD.width, FIELD.height);
      text('SPOT THE', 640, 170, 54, PALETTE.text, 'center'); text('DIFFERENCE', 640, 232, 54, PALETTE.accent, 'center');
      text('Two pictures. One is lying. Find every change.', 640, 282, 22, PALETTE.muted, 'center');
      text('3 scenes  •  24 differences  •  90 seconds a level  •  Hints, combos, time bonus', 640, 322, 18, PALETTE.text, 'center');
      text('Garden Cottage  →  Lighthouse Bay  →  Winter Market', 640, 362, 18, PALETTE.accent, 'center');
      text(`Best ${best}   •   Click a difference on either picture`, 640, 410, 16, PALETTE.muted, 'center');
      text('Press Space or click to start', 640, 470, 20, PALETTE.text, 'center');
      return;
    }
    drawHud(state, best);
    drawPanel(state, false, time); drawPanel(state, true, time);
    if (screen === SCREEN_PAUSED) overlay('PAUSED', ['Take a breath. The timer is waiting.', 'P or Space to resume']);
    else if (screen === SCREEN_LEVEL) overlay('LEVEL CLEAR!', [`All differences found — time bonus added.`, `Score ${state.score}  •  Next: ${state.sceneIndex + 1 < 3 ? ['Garden Cottage', 'Lighthouse Bay', 'Winter Market'][state.sceneIndex + 1] : '—'}`]);
    else if (screen === SCREEN_OVER) overlay('TIME UP', [`You found ${state.totalFound} of 24 differences.`, `Score ${state.score}  •  Best ${best}`, 'The last scene still has secrets. Try again.']);
    else if (screen === SCREEN_WIN) overlay('YOU FOUND THEM ALL!', [`24 / 24 differences. Every scene solved.`, `Score ${state.score}  •  Best ${best}`, 'Detective rank: Eagle Eye.']);
  }
  return { draw, view, toLogical(clientX, clientY) { const r = window.devicePixelRatio || 1; return { x: (clientX * r - view.x) / view.scale, y: (clientY * r - view.y) / view.scale }; } };
}
