// Keyboard and pointer input for a spot-the-difference game. Clicks carry
// their logical-field position; one-shot keys (start, pause, hint, mute)
// are queued as bit flags and taken once by the loop, so a press between
// two frames is never lost and never counted twice.
export const ACTION_CONFIRM = 1;
export const ACTION_PAUSE = 2;
export const ACTION_HINT = 4;
export const ACTION_MUTE = 8;

const CONFIRM = new Set(['Space', 'Enter']);
const PAUSE = new Set(['KeyP', 'Escape']);
const HINT = new Set(['KeyH']);
const MUTE = new Set(['KeyM']);

export function createInput(canvas, toLogical) {
  let actions = 0; let click = null;
  window.addEventListener('keydown', (event) => {
    if (CONFIRM.has(event.code)) { if (!event.repeat) actions |= ACTION_CONFIRM; }
    else if (PAUSE.has(event.code)) { if (!event.repeat) actions |= ACTION_PAUSE; }
    else if (HINT.has(event.code)) { if (!event.repeat) actions |= ACTION_HINT; }
    else if (MUTE.has(event.code)) { if (!event.repeat) actions |= ACTION_MUTE; }
    else return;
    event.preventDefault();
  });
  canvas.addEventListener('pointerdown', (event) => {
    const rect = canvas.getBoundingClientRect();
    click = toLogical(event.clientX - rect.left, event.clientY - rect.top);
  });
  return {
    takeActions() { const taken = actions; actions = 0; return taken; },
    takeClick() { const taken = click; click = null; return taken; },
  };
}
