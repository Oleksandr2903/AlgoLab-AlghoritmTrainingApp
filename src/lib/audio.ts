type AudioContextCtor = typeof AudioContext;

let audioCtx: AudioContext | null = null;
let soundEnabled = false;

export function setSoundEnabled(enabled: boolean): void {
  soundEnabled = enabled;
}

export function playTone(val: number, maxVal: number, isSwap = false): void {
  if (!soundEnabled) return;
  const Ctor: AudioContextCtor | undefined =
    window.AudioContext || (window as unknown as { webkitAudioContext?: AudioContextCtor }).webkitAudioContext;
  if (!Ctor) return;

  if (!audioCtx) audioCtx = new Ctor();
  if (audioCtx.state === 'suspended') void audioCtx.resume();

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const norm = Math.min(Math.max(val || 1, 1), maxVal || 100);
  const freq = 160 + ((norm - 1) / Math.max(1, maxVal - 1)) * 980;

  osc.type = isSwap ? 'triangle' : 'sine';
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.055);

  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.055);
}
