// The differences for each scene: one entry per hidden change. x/y are in
// panel coordinates (0..600, 0..520), r is the click radius. Every change is
// fair: the object is visible in both panels, only one detail differs, and
// nothing is hidden by the panel edge or by another object. Difficulty rises
// across the three scenes: 7, then 8, then 9 differences, with smaller,
// busier changes later.
export const SCENES = [
  {
    name: 'Garden Cottage', hint: 'A sunny cottage garden',
    diffs: [
      { id: 'sun-rays', x: 92, y: 72, r: 42, label: 'Sun rays' },
      { id: 'smoke', x: 428, y: 66, r: 34, label: 'Chimney smoke' },
      { id: 'bee', x: 482, y: 172, r: 30, label: 'Extra bee' },
      { id: 'curtain', x: 298, y: 296, r: 34, label: 'Window curtain' },
      { id: 'cat-tail', x: 512, y: 428, r: 36, label: 'Cat tail' },
      { id: 'flower', x: 148, y: 468, r: 32, label: 'Flower colour' },
      { id: 'fence', x: 352, y: 478, r: 34, label: 'Fence post' },
    ],
  },
  {
    name: 'Lighthouse Bay', hint: 'A striped lighthouse at dusk',
    diffs: [
      { id: 'stripe', x: 300, y: 210, r: 38, label: 'Lighthouse stripe' },
      { id: 'lamp', x: 300, y: 96, r: 34, label: 'Lamp light' },
      { id: 'gull', x: 128, y: 92, r: 32, label: 'Seagull' },
      { id: 'sail', x: 462, y: 300, r: 36, label: 'Boat sail' },
      { id: 'starfish', x: 118, y: 462, r: 30, label: 'Starfish' },
      { id: 'buoy', x: 398, y: 392, r: 30, label: 'Buoy' },
      { id: 'cloud', x: 486, y: 78, r: 36, label: 'Cloud' },
      { id: 'bucket', x: 522, y: 462, r: 30, label: 'Beach bucket' },
    ],
  },
  {
    name: 'Winter Market', hint: 'A snowy night market',
    diffs: [
      { id: 'star', x: 300, y: 72, r: 32, label: 'Tree star' },
      { id: 'lantern', x: 152, y: 168, r: 30, label: 'Lantern' },
      { id: 'hat', x: 452, y: 392, r: 32, label: 'Snowman hat' },
      { id: 'awning', x: 218, y: 238, r: 36, label: 'Awning stripe' },
      { id: 'wreath', x: 392, y: 268, r: 30, label: 'Door wreath' },
      { id: 'present', x: 88, y: 442, r: 30, label: 'Present box' },
      { id: 'scarf', x: 452, y: 428, r: 30, label: 'Snowman scarf' },
      { id: 'sign', x: 300, y: 188, r: 30, label: 'Shop sign' },
      { id: 'bird', x: 528, y: 128, r: 28, label: 'Bird on wire' },
    ],
  },
];
export function sceneDiffCount(index) { return SCENES[index].diffs.length; }
export function totalDiffCount() { return SCENES.reduce((n, s) => n + s.diffs.length, 0); }
