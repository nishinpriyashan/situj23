/**
 * Delicate romantic sound effects using Web Audio API
 * No external sound files required!
 */

class SoundEffects {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /** Heart collection pop & chime */
  public playHeartCollect() {
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const now = ctx.currentTime;
    
    // Happy ascending chime (E5 -> G5)
    osc.frequency.setValueAtTime(659.25, now);
    osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.15);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  /** Magical unlock chime */
  public playUnlock() {
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime + idx * 0.1;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.5);
    });
  }

  /** Gentle candle blow-out whoosh + chime */
  public playCandleBlow() {
    const ctx = this.getContext();
    if (!ctx) return;

    // White noise puff
    const bufferSize = ctx.sampleRate * 0.4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.4);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(ctx.currentTime);
  }

  /** Soft error shake sound */
  public playError() {
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.setValueAtTime(196, now + 0.1);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  /* ---------------- Cartoon character voices ---------------- */

  /** Shared helper: one shaped tone with optional pitch glide */
  private tone(
    from: number,
    to: number,
    duration: number,
    type: OscillatorType = 'sine',
    volume = 0.12,
    delay = 0
  ) {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(from, now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, to), now + duration);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  /** Bubbly "pop!" — Choco */
  public playPop() {
    this.tone(900, 220, 0.12, 'sine', 0.16);
    this.tone(1400, 1800, 0.08, 'triangle', 0.06, 0.06);
  }

  /** Squeaky toy — Mochi the bear */
  public playSqueak() {
    this.tone(1200, 1700, 0.09, 'sine', 0.1);
    this.tone(1700, 1100, 0.12, 'sine', 0.1, 0.1);
  }

  /** Springy cartoon boing — Sprinkles */
  public playBoing() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const wobble = ctx.createOscillator();
    const wobbleGain = ctx.createGain();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(520, now + 0.18);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.45);

    wobble.frequency.setValueAtTime(18, now);
    wobbleGain.gain.setValueAtTime(40, now);
    wobbleGain.gain.exponentialRampToValueAtTime(1, now + 0.45);
    wobble.connect(wobbleGain);
    wobbleGain.connect(osc.frequency);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.14, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    wobble.start(now);
    osc.stop(now + 0.5);
    wobble.stop(now + 0.5);
  }

  /** Twinkly sparkle arpeggio — Twinkle the star */
  public playSparkle() {
    [1318.5, 1568, 1975.5, 2637].forEach((f, i) =>
      this.tone(f, f * 1.02, 0.22, 'triangle', 0.07, i * 0.055)
    );
  }

  /** Little "wheee!" when a character is dragged */
  public playWhee() {
    this.tone(500, 1300, 0.28, 'sine', 0.08);
  }

  /** Celebratory fanfare — squad complete */
  public playFanfare() {
    const notes = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5];
    const times = [0, 0.12, 0.24, 0.36, 0.56, 0.68];
    notes.forEach((f, i) => this.tone(f, f, i === notes.length - 1 ? 0.7 : 0.18, 'triangle', 0.12, times[i]));
  }
}

export const soundEffects = new SoundEffects();
