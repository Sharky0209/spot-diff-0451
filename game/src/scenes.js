// Procedural scene art, drawn fresh every frame from code only: no images,
// no network, no copied art. drawScene(ctx, index, isRight, time) paints one
// 600x520 panel. isRight paints the altered copy: every difference in
// differences.js is a small, deliberate change to one visible object.
import { SCENES } from './differences.js';

function circle(ctx, x, y, r, color) { ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); }
function rect(ctx, x, y, w, h, color) { ctx.fillStyle = color; ctx.fillRect(x, y, w, h); }
function ellipse(ctx, x, y, rx, ry, color) { ctx.fillStyle = color; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fill(); }
function poly(ctx, points, color) { ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(points[0][0], points[0][1]); for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]); ctx.closePath(); ctx.fill(); }
function has(scene, right, id) { return right && SCENES[scene].diffs.some((d) => d.id === id); }
function flower(ctx, x, y, petal, centre) {
  for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; circle(ctx, x + Math.cos(a) * 9, y + Math.sin(a) * 9, 6, petal); }
  circle(ctx, x, y, 6, centre);
}
function bee(ctx, x, y) {
  ellipse(ctx, x, y, 10, 7, '#f7c948'); ctx.fillStyle = '#222'; ctx.fillRect(x - 3, y - 7, 3, 14); ctx.fillRect(x + 3, y - 7, 3, 14);
  ctx.fillStyle = 'rgba(255,255,255,0.85)'; ellipse(ctx, x - 4, y - 10, 6, 4, 'rgba(255,255,255,0.85)'); ellipse(ctx, x + 5, y - 10, 6, 4, 'rgba(255,255,255,0.85)');
}
function cat(ctx, x, y, tailUp) {
  ellipse(ctx, x, y, 26, 16, '#e8833a'); circle(ctx, x - 22, y - 12, 12, '#e8833a');
  poly(ctx, [[x - 30, y - 20], [x - 26, y - 32], [x - 20, y - 20]], '#e8833a'); poly(ctx, [[x - 18, y - 22], [x - 14, y - 33], [x - 10, y - 21]], '#e8833a');
  ctx.strokeStyle = '#e8833a'; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath();
  if (tailUp) { ctx.moveTo(x + 24, y); ctx.quadraticCurveTo(x + 38, y - 6, x + 34, y - 26); } else { ctx.moveTo(x + 24, y + 4); ctx.lineTo(x + 40, y + 12); }
  ctx.stroke(); circle(ctx, x - 26, y - 13, 2, '#222'); circle(ctx, x - 17, y - 13, 2, '#222');
}

function garden(ctx, right, t) {
  const sky = ctx.createLinearGradient(0, 0, 0, 520); sky.addColorStop(0, '#8ec9ee'); sky.addColorStop(1, '#dff3ff'); ctx.fillStyle = sky; ctx.fillRect(0, 0, 600, 520);
  circle(ctx, 92, 72, 36, '#ffd93b'); ctx.strokeStyle = '#ffd93b'; ctx.lineWidth = 5; ctx.lineCap = 'round';
  const rays = has(0, right, 'sun-rays') ? 5 : 8;
  for (let i = 0; i < rays; i++) { const a = (i / rays) * Math.PI * 2 + 0.3; ctx.beginPath(); ctx.moveTo(92 + Math.cos(a) * 44, 72 + Math.sin(a) * 44); ctx.lineTo(92 + Math.cos(a) * 56, 72 + Math.sin(a) * 56); ctx.stroke(); }
  ellipse(ctx, 210, 62, 42, 16, '#fff'); ellipse(ctx, 240, 56, 34, 14, '#fff'); ellipse(ctx, 470, 48, 38, 14, '#fff');
  rect(ctx, 0, 380, 600, 140, '#7ec850'); ellipse(ctx, 90, 392, 120, 26, '#8fd45e'); ellipse(ctx, 480, 398, 130, 24, '#8fd45e');
  // cottage
  rect(ctx, 238, 250, 150, 150, '#fff3d6'); poly(ctx, [[222, 252], [313, 178], [404, 252]], '#d95f4b'); rect(ctx, 296, 300, 34, 100, '#8b5a2b');
  circle(ctx, 322, 352, 4, '#ffd93b'); rect(ctx, 356, 286, 52, 52, '#aee2ff'); rect(ctx, 258, 286, 44, 44, '#aee2ff');
  if (!has(0, right, 'curtain')) { rect(ctx, 258, 286, 8, 44, '#d95f4b'); rect(ctx, 294, 286, 8, 44, '#d95f4b'); rect(ctx, 356, 286, 8, 52, '#d95f4b'); rect(ctx, 400, 286, 8, 52, '#d95f4b'); }
  rect(ctx, 402, 196, 26, 62, '#b08968');
  if (!has(0, right, 'smoke')) { circle(ctx, 418, 172, 12, 'rgba(255,255,255,0.9)'); circle(ctx, 430, 150, 15, 'rgba(255,255,255,0.8)'); circle(ctx, 446, 126, 18, 'rgba(255,255,255,0.7)'); }
  // tree
  rect(ctx, 62, 300, 22, 96, '#7a4a21'); circle(ctx, 73, 268, 52, '#3f9e4d'); circle(ctx, 38, 292, 36, '#4caf50'); circle(ctx, 110, 292, 36, '#57b25e');
  circle(ctx, 52, 250, 7, '#e5534b'); circle(ctx, 96, 276, 7, '#e5534b'); circle(ctx, 72, 228, 7, '#ffd93b');
  // path + fence
  poly(ctx, [[290, 400], [336, 400], [360, 520], [266, 520]], '#e8d5a3');
  ctx.fillStyle = '#a9805a'; for (let i = 0; i < 6; i++) { const x = 30 + i * 52; if (has(0, right, 'fence') && i === 3) continue; ctx.fillRect(x, 452, 10, 44); } ctx.fillRect(20, 458, 280, 7); ctx.fillRect(20, 478, 280, 7);
  // flowers
  flower(ctx, 148, 468, has(0, right, 'flower') ? '#4a90e2' : '#e5534b', '#ffd93b'); flower(ctx, 190, 488, '#ff8fb3', '#ffd93b'); flower(ctx, 470, 488, '#ff8fb3', '#ffd93b'); flower(ctx, 540, 468, '#fff', '#ffd93b'); flower(ctx, 110, 496, '#b388ff', '#ffd93b');
  cat(ctx, 512, 428, !has(0, right, 'cat-tail'));
  if (has(0, right, 'bee')) bee(ctx, 482, 172);
  bee(ctx, 180, 150 + Math.sin(t * 2) * 4); bee(ctx, 520, 250 + Math.cos(t * 1.6) * 4);
  ctx.fillStyle = '#33415c'; ctx.font = 'bold 13px system-ui, sans-serif'; ctx.textAlign = 'left'; ctx.fillText('GARDEN COTTAGE', 18, 24);
}

function lighthouse(ctx, right, t) {
  const sky = ctx.createLinearGradient(0, 0, 0, 520); sky.addColorStop(0, '#2b2a55'); sky.addColorStop(0.55, '#c96f4a'); sky.addColorStop(1, '#f2a65a'); ctx.fillStyle = sky; ctx.fillRect(0, 0, 600, 520);
  circle(ctx, 520, 420, 34, '#fff3c4'); ellipse(ctx, 120, 70, 46, 14, '#ffffff22'); ellipse(ctx, 200, 52, 34, 11, '#ffffff22');
  if (!has(1, right, 'cloud')) { ellipse(ctx, 486, 78, 40, 13, '#ffe9c9'); ellipse(ctx, 512, 70, 28, 10, '#ffe9c9'); }
  // gulls
  ctx.strokeStyle = '#222'; ctx.lineWidth = 2; const gulls = has(1, right, 'gull') ? [[200, 90], [260, 70]] : [[128, 92], [200, 90], [260, 70]];
  for (const [x, y] of gulls) { ctx.beginPath(); ctx.moveTo(x - 10, y); ctx.quadraticCurveTo(x - 4, y - 8, x, y); ctx.quadraticCurveTo(x + 4, y - 8, x + 10, y); ctx.stroke(); }
  rect(ctx, 0, 330, 600, 190, '#2e6f8e'); ctx.fillStyle = '#3f8fb0'; for (let i = 0; i < 5; i++) ellipse(ctx, 60 + i * 120, 352 + (i % 2) * 18, 52, 8, '#3f8fb0');
  // lighthouse
  poly(ctx, [[278, 120], [322, 120], [330, 330], [270, 330]], '#f4f1e8');
  rect(ctx, 284, 196, 32, 34, has(1, right, 'stripe') ? '#2a9d8f' : '#d95f4b'); rect(ctx, 276, 268, 48, 30, has(1, right, 'stripe') ? '#2a9d8f' : '#d95f4b');
  rect(ctx, 282, 76, 36, 44, '#33415c'); circle(ctx, 300, 96, 13, has(1, right, 'lamp') ? '#5a6478' : '#ffe066');
  if (!has(1, right, 'lamp')) { ctx.fillStyle = 'rgba(255,224,102,0.35)'; poly(ctx, [[300, 96], [600, 40], [600, 150]], 'rgba(255,224,102,0.35)'); poly(ctx, [[300, 96], [0, 60], [0, 130]], 'rgba(255,224,102,0.25)'); }
  rect(ctx, 262, 330, 76, 18, '#33415c');
  // boat
  poly(ctx, [[430, 330], [500, 330], [486, 306], [446, 306]], '#7a4a21'); rect(ctx, 462, 258, 5, 50, '#7a4a21');
  poly(ctx, [[468, 262], [468, 304], [500, 304]], has(1, right, 'sail') ? '#e5534b' : '#fff'); poly(ctx, [[458, 270], [458, 304], [436, 304]], '#ffe9c9');
  if (!has(1, right, 'buoy')) { circle(ctx, 398, 392, 10, '#ff6b35'); rect(ctx, 392, 376, 12, 8, '#ffd93b'); }
  // beach + rocks
  rect(ctx, 0, 452, 600, 68, '#e8d5a3'); ellipse(ctx, 80, 470, 60, 18, '#9c8b70'); ellipse(ctx, 540, 478, 70, 20, '#9c8b70');
  if (!has(1, right, 'starfish')) { ctx.fillStyle = '#ff8f5e'; ctx.beginPath(); for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + (i / 5) * Math.PI * 2; const x = 118 + Math.cos(a) * 13, y = 462 + Math.sin(a) * 13; if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); } ctx.closePath(); ctx.fill(); }
  rect(ctx, 514, 446, 18, 16, has(1, right, 'bucket') ? '#4a90e2' : '#e5534b'); rect(ctx, 510, 442, 26, 6, has(1, right, 'bucket') ? '#4a90e2' : '#e5534b');
  ctx.fillStyle = '#33415c'; ctx.font = 'bold 13px system-ui, sans-serif'; ctx.textAlign = 'left'; ctx.fillText('LIGHTHOUSE BAY', 18, 24);
}

function winter(ctx, right, t) {
  const sky = ctx.createLinearGradient(0, 0, 0, 520); sky.addColorStop(0, '#1b2340'); sky.addColorStop(1, '#3a4a7a'); ctx.fillStyle = sky; ctx.fillRect(0, 0, 600, 520);
  ctx.fillStyle = '#fff'; for (let i = 0; i < 40; i++) { const x = (i * 137) % 600, y = (i * 89 + Math.floor(t * 12) % 40) % 300; circle(ctx, x, y, 2, '#ffffffcc'); }
  if (!has(2, right, 'bird')) { ctx.strokeStyle = '#0f1424'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(480, 120); ctx.lineTo(580, 120); ctx.stroke(); circle(ctx, 528, 116, 6, '#222'); poly(ctx, [[522, 114], [518, 106], [526, 112]], '#222'); }
  rect(ctx, 0, 420, 600, 100, '#eef3ff');
  // big tree centre
  poly(ctx, [[300, 60], [250, 170], [350, 170]], '#2e7d4f'); poly(ctx, [[300, 120], [240, 230], [360, 230]], '#2e7d4f'); poly(ctx, [[300, 180], [228, 300], [372, 300]], '#2a6b45'); rect(ctx, 288, 300, 24, 36, '#7a4a21');
  if (!has(2, right, 'star')) { ctx.fillStyle = '#ffd93b'; ctx.beginPath(); for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + (i / 5) * Math.PI * 2; const r = i % 2 === 0 ? 14 : 6; const x = 300 + Math.cos(a) * r, y = 60 + Math.sin(a) * r; if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); } ctx.closePath(); ctx.fill(); }
  circle(ctx, 268, 160, 5, '#e5534b'); circle(ctx, 332, 190, 5, '#ffd93b'); circle(ctx, 292, 240, 5, '#4a90e2'); circle(ctx, 318, 268, 5, '#ff8fb3');
  // stalls
  rect(ctx, 60, 300, 150, 90, '#8b5a2b'); poly(ctx, [[48, 300], [222, 300], [210, 258], [60, 258]], has(2, right, 'awning') ? '#4a90e2' : '#d95f4b');
  ctx.fillStyle = '#fff'; for (let i = 0; i < 4; i++) ctx.fillRect(66 + i * 40, 258, 16, 42);
  rect(ctx, 390, 300, 150, 90, '#5b4a8a'); poly(ctx, [[378, 300], [552, 300], [540, 258], [390, 258]], '#2a9d8f');
  ctx.fillStyle = '#fff'; for (let i = 0; i < 4; i++) ctx.fillRect(396 + i * 40, 258, 16, 42);
  // shop sign + wreath
  rect(ctx, 272, 176, 56, 26, '#ffd93b'); ctx.fillStyle = '#222'; ctx.font = 'bold 12px system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.fillText(has(2, right, 'sign') ? 'TOYS' : 'BOOKS', 300, 193);
  if (!has(2, right, 'wreath')) { circle(ctx, 392, 268, 14, '#2e7d4f'); circle(ctx, 392, 268, 7, '#5b4a8a'); }
  // lanterns
  const lanternOn = !has(2, right, 'lantern'); circle(ctx, 152, 168, 12, lanternOn ? '#ffb703' : '#8b93a3'); rect(ctx, 148, 152, 8, 6, '#333');
  circle(ctx, 452, 168, 12, '#ffb703');
  // snowman: white on white snow, so every ball gets a blue-grey outline
  // and a shadow, or the body vanishes into the ground
  ellipse(ctx, 452, 486, 36, 8, '#d7e2f5');
  ctx.strokeStyle = '#b8c6e2'; ctx.lineWidth = 2;
  for (const [y, r] of [[452, 30], [402, 22], [368, 15]]) { ctx.beginPath(); ctx.arc(452, y, r, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill(); ctx.stroke(); }
  rect(ctx, 438, 344, 28, 8, has(2, right, 'hat') ? '#2a9d8f' : '#d95f4b'); rect(ctx, 442, 322, 20, 24, has(2, right, 'hat') ? '#2a9d8f' : '#d95f4b');
  rect(ctx, 432, 388, 40, 9, has(2, right, 'scarf') ? '#4a90e2' : '#e5534b');
  circle(ctx, 447, 364, 2, '#222'); circle(ctx, 457, 364, 2, '#222'); poly(ctx, [[452, 368], [448, 374], [456, 374]], '#ff8f3c');
  // present
  if (!has(2, right, 'present')) { rect(ctx, 72, 424, 32, 26, '#e5534b'); rect(ctx, 86, 424, 5, 26, '#ffd93b'); rect(ctx, 72, 434, 32, 5, '#ffd93b'); }
  ctx.fillStyle = '#33415c'; ctx.font = 'bold 13px system-ui, sans-serif'; ctx.textAlign = 'left'; ctx.fillText('WINTER MARKET', 18, 24);
}

export function drawScene(ctx, sceneIndex, isRight, time) {
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, 600, 520); ctx.clip();
  if (sceneIndex === 0) garden(ctx, isRight, time);
  else if (sceneIndex === 1) lighthouse(ctx, isRight, time);
  else winter(ctx, isRight, time);
  ctx.restore();
}
