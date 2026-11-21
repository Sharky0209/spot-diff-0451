// Tiny WebAudio chimes, synthesised in code: no sound files, no network.
// M toggles mute. Every call is guarded so a browser without audio, or a
// call before any user gesture, simply does nothing.
export function createAudio() {
  let context = null; let muted = false;
  function ensure() {
    if (muted) return null;
    try {
      if (!context) context = new (window.AudioContext || window.webkitAudioContext)();
      if (context.state === 'suspended') void context.resume();
      return context;
    } catch { return null; }
  }
  function tone(freq, when, dur, type, vol) {
    const ac = ensure(); if (!ac) return;
    const osc = ac.createOscillator(); const gain = ac.createGain();
    osc.type = type; osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, ac.currentTime + when);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + when + dur);
    osc.connect(gain); gain.connect(ac.destination);
    osc.start(ac.currentTime + when); osc.stop(ac.currentTime + when + dur);
  }
  return {
    toggleMute() { muted = !muted; return muted; },
    found() { tone(660, 0, 0.12, 'sine', 0.16); tone(880, 0.08, 0.16, 'sine', 0.16); tone(1320, 0.16, 0.2, 'sine', 0.1); },
    wrong() { tone(180, 0, 0.18, 'sawtooth', 0.08); },
    hint() { tone(520, 0, 0.12, 'triangle', 0.12); tone(780, 0.1, 0.14, 'triangle', 0.1); },
    level() { [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.09, 0.18, 'sine', 0.14)); },
    tick() { tone(980, 0, 0.05, 'square', 0.05); },
  };
}
