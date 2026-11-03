import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Volume2,
  VolumeX,
  Disc3,
  Sparkles,
  Laugh,
  Cake,
  Heart,
  Music2,
  ChevronDown,
  Mic,
} from 'lucide-react';
import { BIRTHDAY_CONFIG } from '../config/birthday';
import { interactiveMusicSynthesizer } from '../utils/audioSynthesizer';
import { useIsMusicDucked } from '../hooks/useMusicDucking';

export type SelectedTrack = 'original' | 'funniest' | 'birthday' | 'romantic';

interface MusicPlayerProps {
  hasStartedExperience?: boolean;
}

interface TrackInfo {
  id: SelectedTrack;
  title: string;
  subtitle: string;
  emoji: string;
  badge: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const TRACKS: TrackInfo[] = [
  {
    id: 'original',
    title: BIRTHDAY_CONFIG.music.songTitle,
    subtitle: BIRTHDAY_CONFIG.music.artist,
    emoji: '🎵',
    badge: 'Her Song',
    icon: Music2,
  },
  {
    id: 'funniest',
    title: 'The Situj Goofball Rag',
    subtitle: 'Funniest Cartoon Comedy Rag',
    emoji: '🤪',
    badge: 'Funniest',
    icon: Laugh,
  },
  {
    id: 'birthday',
    title: 'Happy 23rd, Situj!',
    subtitle: 'Upbeat Birthday Party Tune',
    emoji: '🎂',
    badge: 'Birthday',
    icon: Cake,
  },
  {
    id: 'romantic',
    title: 'Dreamy Chimes',
    subtitle: 'Romantic Music-Box Melody',
    emoji: '💗',
    badge: 'Chimes',
    icon: Heart,
  },
];

/** How loud the music stays (relative) while a video with speech is playing. */
const DUCK_RATIO = 0.15;
/** Synthesized tracks are naturally louder than the recording. */
const SYNTH_GAIN = 0.18;
const FADE_MS = 450;

const AUDIO_SOURCES = [
  BIRTHDAY_CONFIG.music.audioFile,
  ...(BIRTHDAY_CONFIG.music.fallbackAudioFiles ?? []),
].filter(Boolean);

/** iOS Safari ignores element.volume — detect it so we can pause instead of fade. */
const detectVolumeControl = () => {
  try {
    const probe = new Audio();
    probe.volume = 0.5;
    return probe.volume === 0.5;
  } catch {
    return false;
  }
};

const hasUserGesture = () =>
  typeof navigator === 'undefined' || !navigator.userActivation
    ? true
    : navigator.userActivation.hasBeenActive;

const isTypingTarget = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ hasStartedExperience }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [volumeControllable] = useState(detectVolumeControl);
  const [selectedTrack, setSelectedTrack] = useState<SelectedTrack>(() => {
    const saved = localStorage.getItem('situj_music_track') as SelectedTrack | null;
    if (saved && TRACKS.some((t) => t.id === saved)) return saved;
    return (BIRTHDAY_CONFIG.music.defaultTrack as SelectedTrack) || 'original';
  });
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem('situj_music_volume');
    return saved !== null ? parseFloat(saved) : 0.75;
  });

  const isDucked = useIsMusicDucked();
  const effectiveVolume = isMuted ? 0 : volume * (isDucked ? DUCK_RATIO : 1);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const effectiveVolumeRef = useRef(effectiveVolume);
  const isPlayingRef = useRef(isPlaying);
  const selectedTrackRef = useRef(selectedTrack);
  const pausedForDuckRef = useRef(false);
  const autoStartedRef = useRef(false);

  useEffect(() => {
    effectiveVolumeRef.current = effectiveVolume;
    isPlayingRef.current = isPlaying;
    selectedTrackRef.current = selectedTrack;
  });

  // Persist preferences
  useEffect(() => {
    localStorage.setItem('situj_music_volume', volume.toString());
  }, [volume]);

  useEffect(() => {
    localStorage.setItem('situj_music_track', selectedTrack);
  }, [selectedTrack]);

  // Smoothly glide the music to its target loudness (handles ducking, mute & slider)
  useEffect(() => {
    interactiveMusicSynthesizer.setVolume(effectiveVolume * SYNTH_GAIN);

    const audio = audioRef.current;
    if (!audio || !volumeControllable) return;

    const from = audio.volume;
    const to = Math.min(1, Math.max(0, effectiveVolume));
    const startedAt = performance.now();
    let frame = 0;

    const step = (now: number) => {
      const t = Math.min(1, (now - startedAt) / FADE_MS);
      const eased = 1 - Math.pow(1 - t, 3);
      audio.volume = Math.min(1, Math.max(0, from + (to - from) * eased));
      if (t < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [effectiveVolume, volumeControllable]);

  // iOS fallback: the volume can't be lowered, so pause during the video and resume after
  useEffect(() => {
    if (volumeControllable) return;
    const audio = audioRef.current;
    if (!audio) return;

    if (isDucked && !audio.paused) {
      audio.pause();
      pausedForDuckRef.current = true;
    } else if (!isDucked && pausedForDuckRef.current) {
      pausedForDuckRef.current = false;
      if (isPlayingRef.current && selectedTrackRef.current === 'original') {
        audio.play().catch(() => undefined);
      }
    }
  }, [isDucked, volumeControllable]);

  const startPlayback = useCallback((track: SelectedTrack) => {
    const audio = audioRef.current;

    if (track !== 'original') {
      audio?.pause();
      interactiveMusicSynthesizer.start(track, effectiveVolumeRef.current * SYNTH_GAIN);
      setIsPlaying(true);
      return;
    }

    interactiveMusicSynthesizer.stop();
    if (!audio) return;

    audio.volume = Math.min(1, Math.max(0, effectiveVolumeRef.current));
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch((error: DOMException) => {
        if (error.name === 'NotAllowedError') {
          // Browser wants a tap first — start on the very next interaction
          setIsPlaying(false);
          const resume = () => {
            window.removeEventListener('pointerdown', resume);
            window.removeEventListener('keydown', resume);
            if (selectedTrackRef.current === 'original') {
              audio.play().then(() => setIsPlaying(true)).catch(() => undefined);
            }
          };
          window.addEventListener('pointerdown', resume, { once: true });
          window.addEventListener('keydown', resume, { once: true });
          return;
        }
        // Song file missing or unsupported — keep the mood with the synthesized chimes
        console.info('Song file unavailable, using synthesized chimes instead.');
        interactiveMusicSynthesizer.start('romantic', effectiveVolumeRef.current * SYNTH_GAIN);
        setIsPlaying(true);
      });
  }, []);

  const stopPlayback = useCallback(() => {
    audioRef.current?.pause();
    interactiveMusicSynthesizer.stop();
    pausedForDuckRef.current = false;
    setIsPlaying(false);
  }, []);

  // Begin music once she passes the gate (or on first tap if the browser requires it)
  useEffect(() => {
    if (!hasStartedExperience || autoStartedRef.current) return;
    autoStartedRef.current = true;

    if (hasUserGesture()) {
      startPlayback(selectedTrackRef.current);
      return;
    }

    const begin = () => {
      window.removeEventListener('pointerdown', begin);
      window.removeEventListener('keydown', begin);
      startPlayback(selectedTrackRef.current);
    };
    window.addEventListener('pointerdown', begin, { once: true });
    window.addEventListener('keydown', begin, { once: true });
    return () => {
      window.removeEventListener('pointerdown', begin);
      window.removeEventListener('keydown', begin);
    };
  }, [hasStartedExperience, startPlayback]);

  // Stop everything if the player ever unmounts
  useEffect(() => () => interactiveMusicSynthesizer.stop(), []);

  const togglePlay = () => (isPlaying ? stopPlayback() : startPlayback(selectedTrack));

  const toggleMute = useCallback(() => setIsMuted((m) => !m), []);

  // Keyboard shortcut: "M" toggles mute
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== 'm' || e.metaKey || e.ctrlKey || e.altKey) return;
      if (isTypingTarget(e.target)) return;
      toggleMute();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggleMute]);

  const handleSelectTrack = (trackId: SelectedTrack) => {
    setSelectedTrack(trackId);
    startPlayback(trackId);
  };

  const currentTrackInfo = TRACKS.find((t) => t.id === selectedTrack) ?? TRACKS[0];
  const showDuckBadge = isPlaying && isDucked && !isMuted;

  return (
    <div className="fixed top-3 right-3 sm:top-4 sm:right-4 z-50 flex flex-col items-end gap-2">
      {/* Hidden audio-only element — the song plays without ever showing the video */}
      <audio ref={audioRef} loop preload="auto" aria-hidden="true">
        {AUDIO_SOURCES.map((src) => (
          <source key={src} src={encodeURI(src)} type="audio/mp4" />
        ))}
      </audio>

      {/* Main pill */}
      <motion.div
        className="glass-pill flex items-center gap-1 pl-1.5 pr-1 py-1 rounded-full shadow-lg border border-[#F7B8D0]/40 hover:border-[#F7B8D0]/80 transition-colors duration-300"
        whileHover={{ scale: 1.03 }}
      >
        <button
          type="button"
          onClick={togglePlay}
          className="flex items-center gap-2.5 pl-2 pr-2.5 py-1 rounded-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F7B8D0]"
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
        >
          <span className="relative flex items-center justify-center">
            <Disc3
              size={18}
              className={`text-[#F7B8D0] ${isPlaying ? 'animate-spin' : ''}`}
              style={{ animationDuration: selectedTrack === 'funniest' ? '2.5s' : '3.5s' }}
            />
            {isPlaying && (
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    showDuckBadge ? 'bg-amber-300' : 'bg-pink-400'
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    showDuckBadge ? 'bg-amber-400' : 'bg-pink-500'
                  }`}
                />
              </span>
            )}
          </span>

          {/* Equalizer bars — shrink while the music is lowered */}
          <span className="flex items-end gap-[3px] h-3.5 px-0.5" aria-hidden="true">
            {[0.6, 1, 0.4, 0.8].map((heightRatio, i) => (
              <motion.span
                key={i}
                className="w-[2.5px] bg-gradient-to-t from-[#B9A0F5] to-[#F7B8D0] rounded-full"
                animate={
                  isPlaying && !isMuted
                    ? {
                        height: [
                          '20%',
                          `${heightRatio * (showDuckBadge ? 40 : 100)}%`,
                          '30%',
                        ],
                      }
                    : { height: '25%' }
                }
                transition={{
                  duration: selectedTrack === 'funniest' ? 0.45 + i * 0.1 : 0.8 + i * 0.15,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'easeInOut',
                }}
              />
            ))}
          </span>

          <span className="text-xs font-medium text-[#FFE1EC] hidden sm:inline-flex items-center gap-1.5 min-w-[96px]">
            <AnimatePresence mode="wait" initial={false}>
              {showDuckBadge ? (
                <motion.span
                  key="ducked"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="inline-flex items-center gap-1 text-amber-200"
                >
                  <Mic size={12} /> Lowered for video
                </motion.span>
              ) : (
                <motion.span
                  key="normal"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                >
                  {currentTrackInfo.emoji} {isPlaying ? (isMuted ? 'Muted' : 'Playing') : 'Play Song'}
                </motion.span>
              )}
            </AnimatePresence>
          </span>
        </button>

        <button
          type="button"
          onClick={() => setIsExpanded((v) => !v)}
          className="text-[#B9A0F5] hover:text-white hover:bg-white/10 p-1.5 rounded-full flex items-center cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F7B8D0]"
          aria-label="Soundtrack options"
          aria-expanded={isExpanded}
        >
          <ChevronDown
            size={14}
            className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
          />
        </button>
      </motion.div>

      {/* Screen-reader announcement for ducking */}
      <span className="sr-only" aria-live="polite">
        {showDuckBadge ? 'Music lowered so the video can be heard.' : ''}
      </span>

      {/* Expanded panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="glass-panel p-3.5 rounded-3xl flex flex-col gap-3 shadow-2xl border border-pink-300/30 text-white text-xs w-[min(92vw,340px)]"
          >
            {/* Now playing */}
            <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-2xl shrink-0">{currentTrackInfo.emoji}</span>
                <div className="flex flex-col text-left min-w-0">
                  <span className="font-semibold text-[#FFE1EC] truncate">
                    {currentTrackInfo.title}
                  </span>
                  <span className="text-[10px] text-[#B9A0F5] truncate flex items-center gap-1">
                    <Sparkles size={10} className="text-pink-300 shrink-0" />
                    {currentTrackInfo.subtitle}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 pl-2 border-l border-white/10 shrink-0">
                <button
                  type="button"
                  onClick={toggleMute}
                  className="text-pink-200 hover:text-white transition-colors p-1 cursor-pointer"
                  aria-label={isMuted ? 'Unmute (M)' : 'Mute (M)'}
                  title="Mute / unmute (M)"
                >
                  {isMuted || volume === 0 ? <VolumeX size={15} /> : <Volume2 size={15} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(parseFloat(e.target.value));
                    if (isMuted) setIsMuted(false);
                  }}
                  className="w-16 h-1 bg-purple-900/60 rounded-lg appearance-none cursor-pointer accent-[#F7B8D0]"
                  aria-label="Music volume"
                />
              </div>
            </div>

            {/* Track picker */}
            <div className="flex flex-col gap-1.5 text-left">
              <span className="text-[10px] text-[#B9A0F5] font-semibold uppercase tracking-[0.18em]">
                Soundtrack
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {TRACKS.map((track) => {
                  const isSelected = track.id === selectedTrack;
                  return (
                    <button
                      key={track.id}
                      type="button"
                      onClick={() => handleSelectTrack(track.id)}
                      aria-pressed={isSelected}
                      className={`flex items-center gap-2 p-2 rounded-xl text-[11px] font-medium transition-all duration-200 cursor-pointer text-left ${
                        isSelected
                          ? 'bg-gradient-to-r from-[#6541A5] to-[#B9A0F5] text-white shadow-md ring-1 ring-pink-200/50'
                          : 'bg-white/5 hover:bg-white/12 text-[#FFE1EC] ring-1 ring-white/5'
                      }`}
                    >
                      <span className="text-base shrink-0">{track.emoji}</span>
                      <span className="flex flex-col min-w-0">
                        <span className="truncate">{track.title}</span>
                        <span className="text-[9px] opacity-75 font-normal truncate">
                          {track.badge}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="flex items-center gap-1.5 text-[10px] text-[#FFE1EC]/70 pt-0.5">
              <Mic size={11} className="text-amber-200 shrink-0" />
              Music softens automatically while a video plays.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
