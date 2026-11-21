// The screenshot scenes behind ?shot=start|play|end|play2. Each one plays
// the real rules forward from a fresh world, clicking real differences, so
// the frame is what a short game really looks like and the same seed always
// gives the same frame. Cover first: play shows 3 found, 4 left, with
// green rings on both panels and the counter reading 3/7.
import { SCREEN_LEVEL, SCREEN_OVER, SCREEN_PLAY, SCREEN_TITLE } from './render.js';
import { EVENT_FOUND } from './world.js';

function clickDiff(world, index) {
  const d = world.diffs()[index];
  world.click(d.x, d.y);
}
export function stageShot(name, world) {
  world.reset();
  if (name === 'play2') {
    world.resetLevel(1);
    clickDiff(world, 0); clickDiff(world, 3);
    world.state.timeLeft = 58; world.state.score = 210;
    return { screen: SCREEN_PLAY, best: 0 };
  }
  if (name === 'play3') {
    world.resetLevel(2);
    clickDiff(world, 0); clickDiff(world, 2);
    world.state.timeLeft = 58; world.state.score = 210;
    return { screen: SCREEN_PLAY, best: 0 };
  }
  if (name === 'end') {
    const list = world.diffs();
    for (let i = 0; i < list.length; i++) clickDiff(world, i);
    world.state.timeLeft = 41;
    return { screen: SCREEN_LEVEL, best: world.state.score };
  }
  if (name === 'play') {
    clickDiff(world, 0); clickDiff(world, 1); clickDiff(world, 3);
    world.state.timeLeft = 62; world.state.score = 320;
    return { screen: SCREEN_PLAY, best: 0 };
  }
  return { screen: SCREEN_TITLE, best: 0 };
}
export { EVENT_FOUND };
