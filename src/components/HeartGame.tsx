import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, RotateCcw, ArrowRight } from 'lucide-react';
import { soundEffects } from '../utils/soundEffects';

interface HeartItem {
  id: number;
  x: number; // percentage 5% - 90%
  y: number; // starting or current Y
  size: number;
  duration: number;
  color: string;
  isCollected: boolean;
}

interface FloatingPlusOne {
  id: number;
  x: number;
  y: number;
}

interface HeartGameProps {
  onComplete: () => void;
}

const TARGET_SCORE = 10;
const HEART_COLORS = ['#F7B8D0', '#B9A0F5', '#FFE1EC', '#FF6B95', '#E0AAFF'];

export const HeartGame: React.FC<HeartGameProps> = ({ onComplete }) => {
  const shouldReduceMotion = useReducedMotion();
  const [score, setScore] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [hearts, setHearts] = useState<HeartItem[]>([]);
  const [plusOnes, setPlusOnes] = useState<FloatingPlusOne[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const nextHeartId = useRef(0);
  const collectedIds = useRef<Set<number>>(new Set());

  // Generate a random floating heart
  const createHeart = useCallback((): HeartItem => {
    const id = nextHeartId.current++;
    return {
      id,
      x: Math.random() * 80 + 10,
      y: 100, // spawn near bottom
      size: Math.random() * 20 + 36, // 36px to 56px - easy for touch targets
      duration: Math.random() * 3 + 4.5,
      color: HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)],
      isCollected: false,
    };
  }, []);

  // Initialize hearts and spawn loop
  const initGame = useCallback(() => {
    setScore(0);
    setIsWon(false);
    setPlusOnes([]);
    collectedIds.current.clear();

    // Start with 6 hearts
    const initial = Array.from({ length: 6 }).map(() => ({
      ...createHeart(),
      y: Math.random() * 70 + 15,
    }));
    setHearts(initial);
  }, [createHeart]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  // Periodic respawn of hearts if won is false
  useEffect(() => {
    if (isWon) return;

    const interval = setInterval(() => {
      setHearts((prev) => {
        const active = prev.filter((h) => !h.isCollected);
        if (active.length < 8) {
          return [...active, createHeart()];
        }
        return active;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [isWon, createHeart]);

  // Handle heart tap / click
  const handleCollectHeart = (heart: HeartItem, event: React.MouseEvent | React.TouchEvent) => {
    event.stopPropagation();
    if (isWon || collectedIds.current.has(heart.id) || heart.isCollected) {
      return;
    }

    // Mark as collected immediately to prevent duplicate triggers
    collectedIds.current.add(heart.id);
    soundEffects.playHeartCollect();

    // Calculate click coordinates for +1 animation
    let clientX = heart.x;
    let clientY = 50;
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      if ('touches' in event && event.touches.length > 0) {
        clientX = ((event.touches[0].clientX - rect.left) / rect.width) * 100;
        clientY = ((event.touches[0].clientY - rect.top) / rect.height) * 100;
      } else if ('clientX' in event) {
        clientX = (((event as React.MouseEvent).clientX - rect.left) / rect.width) * 100;
        clientY = (((event as React.MouseEvent).clientY - rect.top) / rect.height) * 100;
      }
    }

    const newPlusOne: FloatingPlusOne = {
      id: Date.now() + Math.random(),
      x: clientX,
      y: clientY,
    };
    setPlusOnes((prev) => [...prev, newPlusOne]);

    // Remove +1 after animation
    setTimeout(() => {
      setPlusOnes((prev) => prev.filter((p) => p.id !== newPlusOne.id));
    }, 1000);

    // Update hearts list
    setHearts((prev) =>
      prev.map((h) => (h.id === heart.id ? { ...h, isCollected: true } : h))
    );

    // Update score
    setScore((prevScore) => {
      const newScore = prevScore + 1;
      if (newScore >= TARGET_SCORE) {
        setIsWon(true);
        // Confetti celebration
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#F7B8D0', '#B9A0F5', '#FFE1EC', '#ffffff'],
        });
      }
      return newScore;
    });
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 py-8 z-10">
      <div className="max-w-2xl w-full">
        {/* Header Section */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 text-[#FFE1EC] text-xs uppercase tracking-widest font-semibold border border-pink-400/30 mb-2"
          >
            <Sparkles size={12} className="text-[#F7B8D0]" /> Mini-Game Chapter
          </motion.div>

          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#FFF8FC] glow-pink">
            Collect My Love 💗
          </h2>
          <p className="text-sm text-[#FFE1EC]/80 mt-1">
            Tap the floating hearts to catch all 10 pieces of my love!
          </p>

          {/* Progress Bar & Score Display */}
          <div className="mt-4 max-w-sm mx-auto flex items-center gap-3 glass-pill px-4 py-2 rounded-2xl">
            <Heart size={18} className="text-[#F7B8D0] fill-[#F7B8D0] animate-pulse" />
            <div className="flex-1 bg-white/10 rounded-full h-3 overflow-hidden border border-white/15">
              <motion.div
                className="h-full bg-gradient-to-r from-[#6541A5] via-[#B9A0F5] to-[#F7B8D0] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(Math.min(score, TARGET_SCORE) / TARGET_SCORE) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <span className="text-xs font-semibold text-[#FFF8FC] min-w-[40px] text-right">
              {score} / {TARGET_SCORE}
            </span>
          </div>
        </div>

        {/* Game Arena Card */}
        <div
          ref={containerRef}
          className="relative h-[420px] sm:h-[480px] glass-panel rounded-3xl overflow-hidden border border-pink-300/30 shadow-2xl select-none"
        >
          {/* Subtle grid and decorative background */}
          <div className="absolute inset-0 bg-gradient-to-b from-purple-950/20 via-transparent to-pink-950/30 pointer-events-none" />

          {/* Active Hearts Floating in Arena */}
          {!isWon &&
            hearts.map((heart) => {
              if (heart.isCollected) return null;

              return (
                <motion.button
                  key={heart.id}
                  type="button"
                  onClick={(e) => handleCollectHeart(heart, e)}
                  onTouchStart={(e) => handleCollectHeart(heart, e)}
                  initial={{
                    y: `${heart.y}%`,
                    x: `${heart.x}%`,
                    scale: 0.5,
                    opacity: 0,
                  }}
                  animate={
                    shouldReduceMotion
                      ? {
                          scale: [1, 1.15, 1],
                          opacity: 1,
                        }
                      : {
                          y: ['105%', '-15%'],
                          x: [
                            `${heart.x}%`,
                            `${Math.max(5, Math.min(85, heart.x + (heart.id % 2 === 0 ? 8 : -8)))}%`,
                          ],
                          scale: 1,
                          opacity: [0.8, 1, 0.9],
                        }
                  }
                  transition={
                    shouldReduceMotion
                      ? { duration: 2, repeat: Infinity }
                      : {
                          y: {
                            duration: heart.duration,
                            repeat: Infinity,
                            ease: 'linear',
                          },
                          x: {
                            duration: heart.duration * 0.8,
                            repeat: Infinity,
                            repeatType: 'reverse',
                            ease: 'easeInOut',
                          },
                          opacity: { duration: 0.4 },
                        }
                  }
                  whileHover={{ scale: 1.25 }}
                  whileTap={{ scale: 0.8 }}
                  className="absolute cursor-pointer p-2 focus:outline-none drop-shadow-[0_0_12px_rgba(247,184,208,0.7)]"
                  style={{
                    touchAction: 'manipulation',
                  }}
                  aria-label="Collect heart"
                >
                  <svg
                    width={heart.size}
                    height={heart.size}
                    viewBox="0 0 24 24"
                    fill={heart.color}
                    stroke="#FFF8FC"
                    strokeWidth="1.2"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </motion.button>
              );
            })}

          {/* Floating +1 Popups */}
          {plusOnes.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 1, y: `${p.y}%`, x: `${p.x}%`, scale: 0.8 }}
              animate={{ opacity: 0, y: `${p.y - 12}%`, scale: 1.4 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="absolute pointer-events-none font-bold text-sm sm:text-base text-[#FFE1EC] glow-pink drop-shadow-md z-30 flex items-center gap-1"
            >
              <span>+1 Love</span>
              <Sparkles size={14} className="text-[#F7B8D0]" />
            </motion.div>
          ))}

          {/* Completion Celebration Overlay */}
          <AnimatePresence>
            {isWon && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[#170D2E]/92 backdrop-blur-md p-4 sm:p-8 flex flex-col items-center justify-center text-center z-40 overflow-y-auto"
              >
                {/* 3D Glasses Victory Polaroid */}
                <motion.div
                  initial={{ rotate: -10, scale: 0.5, y: -20 }}
                  animate={{ rotate: -2, scale: 1, y: 0 }}
                  transition={{ type: 'spring', damping: 15 }}
                  className="w-36 sm:w-44 bg-white p-2 rounded-xl shadow-2xl border-2 border-pink-300 mb-3"
                >
                  <div className="aspect-square w-full rounded-lg overflow-hidden bg-purple-950/20">
                    <img
                      src="/Situj Photos/WhatsApp Image 2026-10-26 at 19.06.06 (1).jpeg"
                      alt="3D Glasses Squad Victory"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-[10px] font-bold text-purple-950 mt-1 truncate">
                    Squad Certified Winner! 🕶️✨
                  </p>
                </motion.div>

                <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#FFF8FC] glow-pink mb-2">
                  All 10 Hearts Collected! 🎉
                </h3>

                {/* Prompt requirement message */}
                <p className="text-xs sm:text-sm text-[#FFE1EC] max-w-sm mx-auto mb-4 leading-relaxed font-light">
                  “You collected 10 hearts, but there's one thing you'll never run out of —{' '}
                  <span className="font-semibold text-white underline decoration-[#F7B8D0]/60 underline-offset-4">
                    my love for you
                  </span>
                  . ❤️”
                </p>

                {/* Action Controls */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="button"
                    onClick={initGame}
                    className="glass-pill px-4 py-2 rounded-full text-xs text-[#B9A0F5] hover:text-white flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <RotateCcw size={14} /> Catch More Hearts
                  </button>

                  <motion.button
                    type="button"
                    onClick={onComplete}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#6541A5] via-[#A855F7] to-[#F7B8D0] text-white font-semibold text-xs sm:text-sm shadow-[0_0_25px_rgba(247,184,208,0.5)] flex items-center gap-2 cursor-pointer"
                  >
                    <span>Walk Down Memory Lane 📸</span>
                    <ArrowRight size={16} />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
