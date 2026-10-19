// Generative music-box lullaby, synthesised live with the Web Audio API (no audio files).
const CHORDS = [
  [261.63, 329.63, 392.0, 523.25], // C
  [220.0, 261.63, 329.63, 440.0], // Am
  [174.61, 261.63, 349.23, 440.0], // F
  [196.0, 246.94, 293.66, 392.0], // G
];
// [chord index, melody note on beat 1, melody note on beat 3]
const BARS = [
  [0, 659.25, 783.99], [1, 880.0, 783.99], [2, 698.46, 880.0], [3, 783.99, 587.33],
  [0, 659.25, 523.25], [1, 659.25, 880.0], [2, 880.0, 698.46], [3, 587.33, 783.99],
];
const PATTERN = [0, 1, 2, 3, 2, 1];
const EIGHTH = 0.32;
const BAR = EIGHTH * PATTERN.length;

let ctx = null;
let chain = null;
let timer = null;
let playing = false;
let barIndex = 0;
let nextTime = 0;

function note(freq, time, volume, length) {
  if (!ctx || !chain) return;
  const gain = ctx.createGain();
  const body = ctx.createOscillator();
  const shimmer = ctx.createOscillator();
  const shimmerGain = ctx.createGain();
  body.type = 'sine';
  body.frequency.value = freq;
  shimmer.type = 'sine';
  shimmer.frequency.value = freq * 2.01;
  shimmerGain.gain.value = 0.22;
  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.exponentialRampToValueAtTime(volume, time + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + length);
  body.connect(gain);
  shimmer.connect(shimmerGain);
  shimmerGain.connect(gain);
  gain.connect(chain.master);
  gain.connect(chain.delay);
  body.start(time);
  shimmer.start(time);
  body.stop(time + length + 0.05);
  shimmer.stop(time + length + 0.05);
  body.onended = () => {
    gain.disconnect();
    shimmerGain.disconnect();
  };
}

function pad(chord, time) {
  if (!ctx || !chain) return;
  chord.slice(0, 3).forEach((freq) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(0.014, time + 0.7);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + BAR + 0.6);
    osc.connect(gain);
    gain.connect(chain.master);
    osc.start(time);
    osc.stop(time + BAR + 0.7);
    osc.onended = () => gain.disconnect();
  });
}

function schedule() {
  if (!playing || !ctx || !chain) return;
  try {
    while (nextTime < ctx.currentTime + 1.2) {
      const [chordIndex, first, second] = BARS[barIndex % BARS.length];
      const chord = CHORDS[chordIndex];
      PATTERN.forEach((step, i) => note(chord[step] * 2, nextTime + i * EIGHTH, 0.05, 1.3));
      note(first, nextTime, 0.1, 1.9);
      note(second, nextTime + EIGHTH * 3, 0.09, 1.9);
      pad(chord, nextTime);
      barIndex += 1;
      nextTime += BAR;
    }
    timer = window.setTimeout(schedule, 250);
  } catch {
    stopMusic();
  }
}

export function startMusic() {
  if (playing) return true;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return false;
  try {
    if (!ctx || ctx.state === 'closed') ctx = new AudioContextClass();
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    const master = ctx.createGain();
    const delay = ctx.createDelay(1);
    const feedback = ctx.createGain();
    const tone = ctx.createBiquadFilter();
    master.gain.setValueAtTime(0.0001, ctx.currentTime);
    master.gain.exponentialRampToValueAtTime(1, ctx.currentTime + 1.5);
    delay.delayTime.value = 0.42;
    feedback.gain.value = 0.34;
    tone.type = 'lowpass';
    tone.frequency.value = 2400;
    delay.connect(tone);
    tone.connect(feedback);
    feedback.connect(delay);
    tone.connect(master);
    master.connect(ctx.destination);
    chain = { master, delay, feedback, tone };
    playing = true;
    barIndex = 0;
    nextTime = ctx.currentTime + 0.15;
    schedule();
    return true;
  } catch {
    playing = false;
    return false;
  }
}

export function stopMusic() {
  playing = false;
  if (timer) {
    window.clearTimeout(timer);
    timer = null;
  }
  if (!chain || !ctx) return;
  const old = chain;
  chain = null;
  try {
    old.master.gain.cancelScheduledValues(ctx.currentTime);
    old.master.gain.setValueAtTime(Math.max(old.master.gain.value, 0.0001), ctx.currentTime);
    old.master.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
  } catch {
    // Fading is cosmetic; disconnecting below still silences the music.
  }
  window.setTimeout(() => {
    try {
      old.master.disconnect();
      old.delay.disconnect();
      old.tone.disconnect();
      old.feedback.disconnect();
    } catch {
      // Already disconnected.
    }
  }, 600);
}

if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (!ctx || !playing) return;
    if (document.hidden) ctx.suspend().catch(() => {});
    else ctx.resume().catch(() => {});
  });
}
