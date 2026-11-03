import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Gift,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Heart,
  Film,
  Images,
  Smile,
  ChevronLeft,
  ChevronRight,
  Volume1,
} from 'lucide-react';
import { BIRTHDAY_CONFIG } from '../config/birthday';
import { soundEffects } from '../utils/soundEffects';
import { useDuckMusicWhilePlaying } from '../hooks/useMusicDucking';

const VIDEO_SOURCES = Array.from(
  new Set([BIRTHDAY_CONFIG.giftSurprise.videoUrl, './videos/birthday-montage.mp4'])
);

interface GiftRevealProps {
  onRestart: () => void;
}

export const GiftReveal: React.FC<GiftRevealProps> = ({ onRestart }) => {
  const [isOpened, setIsOpened] = useState(false);
  const [activeMediaTab, setActiveMediaTab] = useState<'video' | 'photos'>('video');
  const [videoHasError, setVideoHasError] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isSlideshowPlaying, setIsSlideshowPlaying] = useState(true);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const duckMusicHandlers = useDuckMusicWhilePlaying();
  const config = BIRTHDAY_CONFIG.giftSurprise;
  const photos = config.fallbackMontagePhotos;

  // Handle Box Opening
  const handleOpenGift = () => {
    soundEffects.playUnlock();
    setIsOpened(true);

    // Grand finale confetti burst
    confetti({
      particleCount: 120,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#F7B8D0', '#B9A0F5', '#FFE1EC', '#FFFFFF', '#6541A5'],
    });

    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 60,
        origin: { x: 0.1, y: 0.5 },
      });
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 60,
        origin: { x: 0.9, y: 0.5 },
      });
    }, 400);
  };

  // Auto-advance photo slideshow if playing
  useEffect(() => {
    if (!isOpened || !isSlideshowPlaying || activeMediaTab !== 'photos') return;

    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % photos.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isOpened, isSlideshowPlaying, activeMediaTab, photos.length]);

  return (
    <section className="relative min-h-[90vh] py-12 px-4 max-w-5xl mx-auto flex flex-col items-center justify-center z-10">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/15 text-[#FFE1EC] text-xs uppercase tracking-widest font-semibold border border-pink-400/30 mb-2"
        >
          <Sparkles size={12} className="text-[#F7B8D0]" /> Chapter Seven • Grand Finale
        </motion.div>

        <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#FFF8FC] glow-pink">
          {config.title}
        </h2>
        <p className="text-sm sm:text-base text-[#FFE1EC]/80 mt-1 max-w-md mx-auto">
          {config.subtitle}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!isOpened ? (
          /* Animated Gift Box */
          <motion.div
            key="gift-box"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center cursor-pointer select-none"
            onClick={handleOpenGift}
          >
            <div className="relative group p-10">
              {/* Outer Glow Halo */}
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/30 to-purple-600/30 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700 pointer-events-none" />

              {/* 3D-styled Gift Box Artwork */}
              <motion.div
                whileHover={{ scale: 1.06, rotate: [0, -2, 2, 0] }}
                whileTap={{ scale: 0.95 }}
                className="relative w-48 h-48 sm:w-56 sm:h-56 glass-panel rounded-3xl border-2 border-pink-300/40 flex items-center justify-center shadow-[0_20px_50px_rgba(23,13,46,0.9)] overflow-hidden"
              >
                {/* Vertical Satin Ribbon */}
                <div className="absolute inset-y-0 w-10 bg-gradient-to-r from-[#F7B8D0] via-[#FFE1EC] to-[#F7B8D0] shadow-md z-10" />
                {/* Horizontal Satin Ribbon */}
                <div className="absolute inset-x-0 h-10 bg-gradient-to-b from-[#F7B8D0] via-[#FFE1EC] to-[#F7B8D0] shadow-md z-10" />

                {/* Satin Bow on Top Center */}
                <div className="absolute z-20 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#6541A5] to-[#B9A0F5] border-2 border-white flex items-center justify-center shadow-lg">
                    <Gift size={28} className="text-white animate-bounce" />
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.p
              animate={{ y: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-sm font-medium text-[#FFE1EC] mt-2 flex items-center gap-1.5 glass-pill px-4 py-2 rounded-full border border-pink-300/30"
            >
              <span>Tap the ribbon to unwrap your surprise! 🎁</span>
            </motion.p>
          </motion.div>
        ) : (
          /* Revealed Montage Content */
          <motion.div
            key="revealed-montage"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="w-full max-w-3xl space-y-8"
          >
            {/* Media Presentation Card */}
            <div className="glass-panel p-4 sm:p-8 rounded-3xl border border-pink-300/30 shadow-[0_25px_60px_rgba(23,13,46,0.9)]">
              {/* Media Switcher Tab (Video vs Photos) */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveMediaTab('photos')}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      activeMediaTab === 'photos'
                        ? 'bg-[#F7B8D0] text-[#170D2E]'
                        : 'text-[#B9A0F5] hover:text-white'
                    }`}
                  >
                    <Images size={14} /> Photo Montage
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveMediaTab('video')}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      activeMediaTab === 'video'
                        ? 'bg-[#F7B8D0] text-[#170D2E]'
                        : 'text-[#B9A0F5] hover:text-white'
                    }`}
                  >
                    <Film size={14} /> Video Montage
                  </button>
                </div>

                <div className="text-[11px] text-[#B9A0F5] hidden sm:flex items-center gap-1">
                  <Sparkles size={12} className="text-[#F7B8D0]" />
                  <span>Personalized Keepsake</span>
                </div>
              </div>

              {/* Photo Montage Carousel */}
              {activeMediaTab === 'photos' && (
                <div className="space-y-4">
                  <div className="relative aspect-video sm:aspect-16/10 rounded-2xl overflow-hidden bg-black/40 border border-white/10 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={currentSlideIndex}
                        src={photos[currentSlideIndex].url}
                        alt={photos[currentSlideIndex].caption}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        className="w-full h-full object-cover"
                      />
                    </AnimatePresence>

                    {/* Left / Right Carousel Controls */}
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentSlideIndex(
                          (currentSlideIndex - 1 + photos.length) % photos.length
                        )
                      }
                      className="absolute left-3 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition-colors cursor-pointer"
                      aria-label="Previous slide"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentSlideIndex((currentSlideIndex + 1) % photos.length)
                      }
                      className="absolute right-3 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition-colors cursor-pointer"
                      aria-label="Next slide"
                    >
                      <ChevronRight size={20} />
                    </button>

                    {/* Bottom Caption Overlay */}
                    <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/85 via-black/40 to-transparent text-left">
                      <p className="text-sm sm:text-base font-semibold text-white drop-shadow">
                        {photos[currentSlideIndex].caption}
                      </p>
                      <span className="text-xs text-[#F7B8D0] font-mono">
                        {photos[currentSlideIndex].date}
                      </span>
                    </div>
                  </div>

                  {/* Slideshow playback toggle and dots */}
                  <div className="flex items-center justify-between text-xs text-[#B9A0F5] px-1">
                    <button
                      type="button"
                      onClick={() => setIsSlideshowPlaying(!isSlideshowPlaying)}
                      className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
                    >
                      {isSlideshowPlaying ? (
                        <>
                          <Pause size={13} /> Pause Slideshow
                        </>
                      ) : (
                        <>
                          <Play size={13} /> Resume Slideshow
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-1.5">
                      {photos.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setCurrentSlideIndex(idx)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            currentSlideIndex === idx
                              ? 'bg-[#F7B8D0] w-5'
                              : 'bg-white/20 hover:bg-white/40'
                          }`}
                          aria-label={`Go to slide ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Video Player */}
              {activeMediaTab === 'video' && (
                <div className="space-y-3">
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/60 border border-white/10 flex items-center justify-center">
                    {!videoHasError ? (
                      <video
                        ref={videoRef}
                        controls
                        playsInline
                        preload="metadata"
                        className="w-full h-full object-contain max-h-[500px]"
                        onError={() => setVideoHasError(true)}
                        {...duckMusicHandlers}
                      >
                        {VIDEO_SOURCES.map((src, idx) => (
                          <source
                            key={src}
                            src={encodeURI(src)}
                            type="video/mp4"
                            // The <video> never fires "error" when every <source> fails — the last one does
                            onError={idx === VIDEO_SOURCES.length - 1 ? () => setVideoHasError(true) : undefined}
                          />
                        ))}
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      /* Graceful Video Placeholder Notice */
                      <div className="p-8 text-center space-y-3 max-w-md">
                        <Film size={40} className="mx-auto text-[#B9A0F5]" />
                        <h4 className="text-base font-semibold text-white">
                          Video Montage Ready to Add
                        </h4>
                        <p className="text-xs text-[#FFE1EC]/80 leading-relaxed">
                          To feature your custom video montage here, simply add{' '}
                          <code className="text-[#F7B8D0] font-mono bg-white/10 px-1 py-0.5 rounded">
                            WhatsApp Video 2026-11-03 at 07.51.17.mp4
                          </code>{' '}
                          to the <code className="font-mono text-[#F7B8D0]">public/Video/</code> folder!
                        </p>
                        <div className="flex items-center justify-center gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setVideoHasError(false);
                              if (videoRef.current) {
                                videoRef.current.load();
                              }
                            }}
                            className="px-4 py-2 rounded-full bg-gradient-to-r from-[#6541A5] to-[#B9A0F5] text-white text-xs font-semibold cursor-pointer"
                          >
                            Retry Video
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveMediaTab('photos')}
                            className="px-4 py-2 rounded-full bg-[#F7B8D0] text-[#170D2E] text-xs font-semibold cursor-pointer"
                          >
                            View Photo Montage Instead
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  {!videoHasError && (
                    <p className="flex items-center justify-center gap-1.5 text-[11px] text-[#FFE1EC]/70">
                      <Volume1 size={12} className="text-amber-200" />
                      The background music softens automatically while this video plays.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Official Aviator of My Heart & Goofball Certificate */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border-2 border-yellow-300/40 bg-gradient-to-br from-yellow-500/10 via-pink-500/10 to-purple-950/40 shadow-2xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Official Portrait */}
                <div className="relative shrink-0">
                  <div className="w-28 h-36 sm:w-32 sm:h-40 rounded-2xl overflow-hidden border-2 border-yellow-300 shadow-xl bg-purple-950/50">
                    <img
                      src="./Situj Photos/WhatsApp Image 2026-10-26 at 19.06.10.jpeg"
                      alt="Captain Situj Official Portrait"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-yellow-400 border border-yellow-950 flex items-center justify-center text-xs font-black text-yellow-950 shadow-md">
                    23★
                  </div>
                </div>

                {/* Certificate Credentials */}
                <div className="flex-1 text-center sm:text-left space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-yellow-400/20 text-yellow-300 text-[10px] font-mono tracking-widest uppercase border border-yellow-300/30">
                    <span>★ Ministry of Love & Civil Aviation ★</span>
                  </div>

                  <h4 className="text-lg sm:text-xl font-serif font-bold text-white glow-pink">
                    Captain Ksheshira "Situj" Situge
                  </h4>
                  <p className="text-xs text-[#FFE1EC] font-mono">
                    Rank: Supreme Birthday Queen • Level 23 Aviator
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-[#FFE1EC]/90 pt-2 border-t border-white/10">
                    <div className="flex items-center gap-1.5">
                      <span className="text-emerald-400">✔</span>
                      <span>Lifetime License to Steal My Heart</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-emerald-400">✔</span>
                      <span>Certified Most Aerodynamic Cute Chin</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-emerald-400">✔</span>
                      <span>Cleared for Unlimited Chocolates & Desserts</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-amber-400">⚠</span>
                      <span>Cheeks Subject to Immediate Squishing 🤏</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Touches & Treat Tribute Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Sweet Treats for My Sweetest Girl */}
              <div className="glass-card p-5 rounded-2xl border border-pink-300/30 text-left space-y-2">
                <div className="flex items-center gap-2 text-[#F7B8D0] text-sm font-semibold">
                  <span className="text-lg">🍫</span>
                  <span>{BIRTHDAY_CONFIG.personalDetails.favoriteTreats.treatMessage}</span>
                </div>
                <p className="text-xs text-[#FFE1EC]/80 leading-relaxed">
                  {BIRTHDAY_CONFIG.personalDetails.favoriteTreats.chocolates} & delicious food
                  adventures forever with you.
                </p>
                <div className="text-[11px] text-[#B9A0F5] italic pt-1">
                  {config.romanticTreatNote}
                </div>
              </div>

              {/* The Things I Love Most (Smile, Chin, Kindness) */}
              <div className="glass-card p-5 rounded-2xl border border-pink-300/30 text-left space-y-2">
                <div className="flex items-center gap-2 text-[#F7B8D0] text-sm font-semibold">
                  <Smile size={16} />
                  <span>The Little Things That Stole My Heart</span>
                </div>
                <p className="text-xs text-[#FFE1EC]/80 leading-relaxed">
                  Your radiant smile that brightens any room, your gentle kindness, and that cute
                  little chin of yours that I adore endlessly. ❤️
                </p>
                <div className="flex items-center gap-2 pt-1 text-[11px] text-[#B9A0F5]">
                  <Heart size={11} className="text-[#F7B8D0] fill-[#F7B8D0]" />
                  <span>KShesthra Situge • One Year & A Lifetime to Go</span>
                </div>
              </div>
            </div>

            {/* Prompt Requirement Final Message */}
            <div className="py-6 text-center space-y-4">
              <motion.h3
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="text-2xl sm:text-3xl font-serif font-bold text-[#FFF8FC] glow-pink"
              >
                “{config.finalMessage}”
              </motion.h3>

              <div className="flex items-center justify-center gap-3 pt-2">
                <motion.button
                  type="button"
                  onClick={onRestart}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="glass-pill px-6 py-3 rounded-full text-xs sm:text-sm text-[#FFE1EC] hover:text-white flex items-center gap-2 cursor-pointer transition-colors shadow-lg"
                >
                  <RotateCcw size={16} className="text-[#F7B8D0]" />
                  <span>Replay Birthday Journey ✨</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
