/**
 * Interactive Multi-Theme Audio Synthesizer
 * 
 * Uses Web Audio API to deliver:
 * 1. 'funniest' - Playful cartoon / comedy circus ragtime with funny bouncy slides & spring boings!
 * 2. 'birthday' - Upbeat, celebratory retro Happy Birthday party tune!
 * 3. 'romantic' - Gentle, sweet music-box chimes ("Until I Found You" vibe).
 */

export type MusicTheme = 'funniest' | 'birthday' | 'romantic';

export interface Note {
  freq: number;
  duration: number; // in seconds
  type?: OscillatorType;
  slideFreq?: number; // pitch bend / slide target
  isBoing?: boolean;
}

// Frequency constants
const NOTE = {
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, Bb4: 466.16, B4: 493.88,
  C5: 523.25, D5: 587.33, Eb5: 622.25, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77,
  C6: 1046.50,
};

class InteractiveMusicSynthesizer {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private timer: number | null = null;
  private noteIndex = 0;
  private activeTheme: MusicTheme = 'funniest';
  private currentVolume = 0.2;

  // 1. FUNNIEST CARTOON THEME: Bouncy comedy ragtime with funny pitch bends and boings
  private funniestMelody: Note[] = [
    // Bouncy cartoon intro
    { freq: NOTE.C4, duration: 0.18, type: 'triangle' },
    { freq: NOTE.E4, duration: 0.18, type: 'triangle' },
    { freq: NOTE.G4, duration: 0.18, type: 'triangle' },
    { freq: NOTE.C5, duration: 0.35, type: 'triangle', slideFreq: NOTE.D5 },
    { freq: NOTE.B4, duration: 0.18, type: 'square' },
    { freq: NOTE.G4, duration: 0.18, type: 'square' },
    { freq: NOTE.E4, duration: 0.35, type: 'triangle', isBoing: true },

    // Silly syncopated comedy bounce
    { freq: NOTE.A4, duration: 0.18, type: 'triangle' },
    { freq: NOTE.F4, duration: 0.18, type: 'triangle' },
    { freq: NOTE.D4, duration: 0.22, type: 'triangle' },
    { freq: NOTE.G4, duration: 0.22, type: 'square', slideFreq: NOTE.A4 },
    { freq: NOTE.E4, duration: 0.22, type: 'triangle' },
    { freq: NOTE.C4, duration: 0.35, type: 'triangle' },

    // Funny slide down (kazoo / slide whistle feel)
    { freq: NOTE.G5, duration: 0.28, type: 'sawtooth', slideFreq: NOTE.C4 },
    { freq: NOTE.E4, duration: 0.18, type: 'triangle' },
    { freq: NOTE.F4, duration: 0.18, type: 'triangle' },
    { freq: NOTE.G4, duration: 0.25, type: 'square' },
    { freq: NOTE.C5, duration: 0.4, type: 'triangle', isBoing: true },

    // Bouncy circus cadence
    { freq: NOTE.C4, duration: 0.15, type: 'square' },
    { freq: NOTE.D4, duration: 0.15, type: 'square' },
    { freq: NOTE.Eb5, duration: 0.18, type: 'sawtooth', slideFreq: NOTE.E5 },
    { freq: NOTE.C5, duration: 0.25, type: 'triangle' },
    { freq: NOTE.A4, duration: 0.22, type: 'triangle' },
    { freq: NOTE.G4, duration: 0.45, type: 'triangle' },

    // Cute finish
    { freq: NOTE.G3, duration: 0.16, type: 'triangle' },
    { freq: NOTE.C4, duration: 0.16, type: 'triangle' },
    { freq: NOTE.E4, duration: 0.16, type: 'triangle' },
    { freq: NOTE.C5, duration: 0.6, type: 'triangle', isBoing: true },
  ];

  // 2. HAPPY BIRTHDAY THEME: Cheerful upbeat party chiptune
  private birthdayMelody: Note[] = [
    // "Happy Birthday to you"
    { freq: NOTE.C4, duration: 0.28, type: 'triangle' },
    { freq: NOTE.C4, duration: 0.22, type: 'triangle' },
    { freq: NOTE.D4, duration: 0.45, type: 'triangle' },
    { freq: NOTE.C4, duration: 0.45, type: 'triangle' },
    { freq: NOTE.F4, duration: 0.45, type: 'triangle' },
    { freq: NOTE.E4, duration: 0.85, type: 'triangle' },

    // "Happy Birthday to you"
    { freq: NOTE.C4, duration: 0.28, type: 'triangle' },
    { freq: NOTE.C4, duration: 0.22, type: 'triangle' },
    { freq: NOTE.D4, duration: 0.45, type: 'triangle' },
    { freq: NOTE.C4, duration: 0.45, type: 'triangle' },
    { freq: NOTE.G4, duration: 0.45, type: 'triangle' },
    { freq: NOTE.F4, duration: 0.85, type: 'triangle' },

    // "Happy Birthday dear Situj"
    { freq: NOTE.C4, duration: 0.28, type: 'triangle' },
    { freq: NOTE.C4, duration: 0.22, type: 'triangle' },
    { freq: NOTE.C5, duration: 0.48, type: 'triangle' },
    { freq: NOTE.A4, duration: 0.45, type: 'triangle' },
    { freq: NOTE.F4, duration: 0.38, type: 'triangle' },
    { freq: NOTE.E4, duration: 0.38, type: 'triangle' },
    { freq: NOTE.D4, duration: 0.75, type: 'triangle' },

    // "Happy Birthday to you!"
    { freq: NOTE.Bb4, duration: 0.28, type: 'triangle' },
    { freq: NOTE.Bb4, duration: 0.22, type: 'triangle' },
    { freq: NOTE.A4, duration: 0.45, type: 'triangle' },
    { freq: NOTE.F4, duration: 0.45, type: 'triangle' },
    { freq: NOTE.G4, duration: 0.5, type: 'triangle' },
    { freq: NOTE.F4, duration: 1.1, type: 'triangle', slideFreq: NOTE.F4 },
  ];

  // 3. ROMANTIC THEME: Soft music-box chimes ("Until I Found You" progression)
  private romanticMelody: Note[] = [
    { freq: NOTE.C4, duration: 0.6, type: 'sine' },
    { freq: NOTE.E4, duration: 0.6, type: 'sine' },
    { freq: NOTE.G4, duration: 0.8, type: 'sine' },
    { freq: NOTE.A4, duration: 0.8, type: 'sine' },
    { freq: NOTE.G4, duration: 0.6, type: 'sine' },
    { freq: NOTE.E4, duration: 0.8, type: 'sine' },
    { freq: NOTE.D4, duration: 0.6, type: 'sine' },
    { freq: NOTE.C4, duration: 1.2, type: 'sine' },
    { freq: NOTE.A3, duration: 0.6, type: 'sine' },
    { freq: NOTE.C4, duration: 0.6, type: 'sine' },
    { freq: NOTE.E4, duration: 0.8, type: 'sine' },
    { freq: NOTE.F4, duration: 0.6, type: 'sine' },
    { freq: NOTE.E4, duration: 0.6, type: 'sine' },
    { freq: NOTE.D4, duration: 0.8, type: 'sine' },
    { freq: NOTE.C4, duration: 1.4, type: 'sine' },
  ];

  private initContext() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public playNote(note: Note, baseVolume: number) {
    if (!this.ctx || baseVolume <= 0.0005) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = note.type || 'triangle';
    osc.frequency.setValueAtTime(note.freq, now);

    // Funny pitch slide / wobble
    if (note.slideFreq) {
      osc.frequency.exponentialRampToValueAtTime(
        Math.max(20, note.slideFreq),
        now + note.duration * 0.8
      );
    }

    // Playful cartoon "boing" vibrato
    if (note.isBoing) {
      const vibrato = this.ctx.createOscillator();
      const vibratoGain = this.ctx.createGain();
      vibrato.frequency.setValueAtTime(14, now);
      vibratoGain.gain.setValueAtTime(25, now);
      vibrato.connect(vibratoGain);
      vibratoGain.connect(osc.frequency);
      vibrato.start(now);
      vibrato.stop(now + note.duration);
    }

    // Volume envelope
    const peakVol = this.activeTheme === 'funniest' ? baseVolume * 1.3 : baseVolume;
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(peakVol, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + note.duration);

    // Subtle low-pass filter to keep timbre warm and pleasant
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(
      this.activeTheme === 'funniest' ? 3200 : this.activeTheme === 'birthday' ? 2600 : 1800,
      now
    );

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + note.duration);
  }

  private getActiveMelody(): Note[] {
    switch (this.activeTheme) {
      case 'funniest':
        return this.funniestMelody;
      case 'birthday':
        return this.birthdayMelody;
      case 'romantic':
      default:
        return this.romanticMelody;
    }
  }

  public setTheme(theme: MusicTheme) {
    this.activeTheme = theme;
    this.noteIndex = 0;
    if (this.isPlaying) {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.playNext();
    }
  }

  public getTheme(): MusicTheme {
    return this.activeTheme;
  }

  public start(theme?: MusicTheme, volume = 0.15) {
    this.initContext();
    // Never stack two melody loops on top of each other
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (theme) {
      this.activeTheme = theme;
    }
    this.currentVolume = volume;
    this.isPlaying = true;
    this.noteIndex = 0;

    this.playNext();
  }

  /** Change loudness on the fly (used for ducking under video voices). */
  public setVolume(volume: number) {
    this.currentVolume = Math.max(0, volume);
  }

  private playNext = () => {
    if (!this.isPlaying || !this.ctx) return;
    const melody = this.getActiveMelody();
    const note = melody[this.noteIndex];

    this.playNote(note, this.currentVolume);

    this.noteIndex = (this.noteIndex + 1) % melody.length;
    this.timer = window.setTimeout(this.playNext, note.duration * 1000);
  };

  public stop() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  public get active(): boolean {
    return this.isPlaying;
  }
}

export const interactiveMusicSynthesizer = new InteractiveMusicSynthesizer();
export const romanticSynthesizer = interactiveMusicSynthesizer; // Backward compatibility
