// Every tuning number and colour in one place. The playfield is a fixed
// 1280x720 logical area; the renderer scales it to the window, so no rule
// below depends on the screen size. Two panels sit side by side inside it.
export const FIELD = { width: 1280, height: 720 };
export const PANEL = { width: 600, height: 520, y: 112, leftX: 20, rightX: 660, gap: 40 };
export const STEP = 1 / 60;
export const LEVEL_TIME = 90;
export const HINTS_PER_LEVEL = 3;
export const FIND_POINTS = 100;
export const COMBO_BONUS = 10;
export const WRONG_PENALTY = 10;
export const WRONG_TIME = 3;
export const HINT_COST = 20;
export const LEVEL_BONUS_PER_SECOND = 5;
export const FONT = 'system-ui, -apple-system, "Segoe UI", sans-serif';
export const BEST_KEY = 'spot-the-difference.best';
export const PALETTE = {
  backdrop: '#141a26', panelBorder: '#3a4358', panelBg: '#f7ead0',
  text: '#f4f1e8', muted: '#9aa3b5', accent: '#ffd166', good: '#3ddc84',
  bad: '#ff5d5d', gold: '#ffb703', timer: '#4cc9f0', timerLow: '#ff5d5d',
  hud: '#1d2436', button: '#2a3350',
};
export const SCENE_NAMES = ['Garden Cottage', 'Lighthouse Bay', 'Winter Market'];
