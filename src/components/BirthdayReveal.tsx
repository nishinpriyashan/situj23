import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Heart, ArrowRight, Stars, Eye, X } from 'lucide-react';
import { BIRTHDAY_CONFIG } from '../config/birthday';

interface BirthdayRevealProps {
  onProceed: () => void;
}

interface HighlightPill {
  id: string;
  label: string;
  photoUrl: string;
  caption: string;
  humorNote: string;
}

const HIGHLIGHT_DETAILS: HighlightPill[] = [
  {
    id: 'smile',
    label: 'That captivating smile',
    photoUrl: './Situj Photos/WhatsApp Image 2026-10-26 at 19.06.11.jpeg',
    caption: 'Her smile can literally illuminate the entire sky.',
    humorNote: 'Verified 100% genuine and 1000% infectious! 😄',
  },
  {
    id: 'anniversary',
    label: '1 year milestone since August',
    photoUrl: './Situj Photos/WhatsApp Image 2026-10-26 at 19.06.08.jpeg',
    caption: 'Co-pilots in flight and forever partners in life.',
    humorNote: 'Cleared for unlimited happiness on runway 23! ✈️❤️',
  },
  {
    id: 'chin',
    label: 'The cutest chin in the world',
    photoUrl: './Situj Photos/WhatsApp Image 2026-10-26 at 19.06.10 (2).jpeg',
    caption: 'Exhibit A: The internationally recognized chin framing pose.',
    humorNote: 'Voted #1 most boopable chin in the galaxy! 🤌✨',
  },
];

export const BirthdayReveal: React.FC<BirthdayRevealProps> = ({ onProceed }) => {
  const [activePill, setActivePill] = useState<HighlightPill | null>(null);

  // Launch celebration confetti on mount
  useEffect(() => {
    const end = Date.now() + 2.5 * 1000;
    const colors = ['#f7b8d0', '#b9a0f5', '#ffe1ec', '#ffffff', '#6541a5'];

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  const triggerCelebrate = () => {
    confetti({
      particleCount: 90,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#f7b8d0', '#b9a0f5', '#ffe1ec', '#ffffff'],
    });
    setTimeout(() => {
      onProceed();
    }, 400);
  };

  // Birthday date calculation
  const getBirthdayStatusText = () => {
    const bday = new Date(BIRTHDAY_CONFIG.recipient.birthdayDate);
    const today = new Date();
    const isToday =
      today.getMonth() === bday.getMonth() && today.getDate() === bday.getDate();

    if (isToday) {
      return "Today is your special day! Celebrating Situj's 23rd Birthday ✨";
    }
    const diffTime = bday.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) {
      return `Counting down to November 5, 2026 — ${diffDays} day${diffDays === 1 ? '' : 's'} until your big celebration! 🌸`;
    }
    return `Celebrating your unforgettable 23rd year, Situj! 💖`;
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 py-12 z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="max-w-3xl w-full text-center"
      >
        <div className="glass-panel p-6 sm:p-12 rounded-3xl border border-pink-300/40 relative shadow-[0_25px_70px_rgba(23,13,46,0.9)] overflow-hidden">
          {/* Glowing background ring */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-tr from-[#6541A5]/30 to-[#F7B8D0]/30 rounded-full blur-3xl pointer-events-none" />

          {/* Floating celebratory crown badge */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-pink-300/30 text-xs sm:text-sm text-[#FFE1EC] mb-4 shadow-sm"
          >
            <Stars size={14} className="text-[#F7B8D0] animate-pulse" />
            <span>{getBirthdayStatusText()}</span>
          </motion.div>

          {/* Trio of Hero Mini-Polaroids */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="flex items-center justify-center -space-x-3 sm:-space-x-4 my-4"
          >
            {/* Left: The Chin Pose */}
            <motion.div
              whileHover={{ scale: 1.12, rotate: -8, zIndex: 30 }}
              className="w-24 sm:w-32 bg-white/95 p-1.5 sm:p-2 rounded-xl shadow-xl -rotate-6 border border-pink-200 cursor-pointer transform transition-all duration-300"
              onClick={() => setActivePill(HIGHLIGHT_DETAILS[2])}
            >
              <div className="aspect-square w-full rounded-lg overflow-hidden bg-purple-950/20">
                <img
                  src="./Situj Photos/WhatsApp Image 2026-10-26 at 19.06.10 (2).jpeg"
                  alt="Situj Chin Pose"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-[9px] sm:text-[10px] font-sans font-bold text-purple-950 mt-1 truncate">
                The Chin Pose 🤌
              </p>
            </motion.div>

            {/* Center: Birthday Smile */}
            <motion.div
              whileHover={{ scale: 1.15, rotate: 0, zIndex: 30 }}
              className="w-28 sm:w-36 bg-white p-2 rounded-xl shadow-2xl z-20 border-2 border-pink-300 cursor-pointer transform transition-all duration-300"
              onClick={() => setActivePill(HIGHLIGHT_DETAILS[0])}
            >
              <div className="aspect-square w-full rounded-lg overflow-hidden bg-purple-950/20">
                <img
                  src="./Situj Photos/WhatsApp Image 2026-10-26 at 19.06.11.jpeg"
                  alt="Birthday Queen Situj"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <p className="text-[10px] sm:text-[11px] font-sans font-bold text-pink-700 mt-1 truncate">
                Birthday Queen 👑
              </p>
            </motion.div>

            {/* Right: Cheek Squish */}
            <motion.div
              whileHover={{ scale: 1.12, rotate: 8, zIndex: 30 }}
              className="w-24 sm:w-32 bg-white/95 p-1.5 sm:p-2 rounded-xl shadow-xl rotate-6 border border-pink-200 cursor-pointer transform transition-all duration-300"
              onClick={() => setActivePill(HIGHLIGHT_DETAILS[1])}
            >
              <div className="aspect-square w-full rounded-lg overflow-hidden bg-purple-950/20">
                <img
                  src="./Situj Photos/WhatsApp Image 2026-10-26 at 19.06.08 (1).jpeg"
                  alt="Cheek Squish Couple"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-[9px] sm:text-[10px] font-sans font-bold text-purple-950 mt-1 truncate">
                Cheek Squish 🤏
              </p>
            </motion.div>
          </motion.div>

          {/* Big Headline */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.8 }}
            className="space-y-2 mb-5"
          >
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-[#FFF8FC] glow-pink tracking-tight leading-tight">
              Happy {BIRTHDAY_CONFIG.recipient.age}rd Birthday,{' '}
              <span className="bg-gradient-to-r from-[#F7B8D0] via-[#FFE1EC] to-[#B9A0F5] bg-clip-text text-transparent">
                {BIRTHDAY_CONFIG.recipient.nickname}
              </span>
              ! ❤️
            </h1>

            <p className="text-base sm:text-xl font-light text-[#FFE1EC]">
              Today is all about you, my favorite person, pilot & goofball.
            </p>
          </motion.div>

          {/* Interactive Romantic / Funny Highlight Pills */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 my-6"
          >
            {HIGHLIGHT_DETAILS.map((pill) => (
              <button
                key={pill.id}
                type="button"
                onClick={() => setActivePill(pill)}
                className={`glass-pill px-4 py-2 rounded-full text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                  activePill?.id === pill.id
                    ? 'border-[#F7B8D0] bg-pink-500/30 text-white shadow-[0_0_15px_rgba(247,184,208,0.5)]'
                    : 'text-[#B9A0F5] hover:text-white hover:border-pink-300/40'
                }`}
              >
                <Heart size={13} className="text-[#F7B8D0] fill-[#F7B8D0]" />
                <span>{pill.label}</span>
                <Eye size={12} className="opacity-70" />
              </button>
            ))}
          </motion.div>

          {/* Inline Highlight Popover Modal if clicked */}
          <AnimatePresence>
            {activePill && (
              <motion.div
                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                animate={{ opacity: 1, height: 'auto', scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                className="overflow-hidden mb-6"
              >
                <div className="max-w-md mx-auto glass-panel p-4 rounded-2xl border border-pink-300/50 flex items-center gap-4 text-left relative bg-black/40">
                  <img
                    src={activePill.photoUrl}
                    alt={activePill.label}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-white/20 shrink-0"
                  />
                  <div className="flex-1 pr-6">
                    <p className="text-xs sm:text-sm font-semibold text-[#FFE1EC]">
                      {activePill.caption}
                    </p>
                    <p className="text-[11px] text-[#F7B8D0] mt-1 italic">
                      {activePill.humorNote}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActivePill(null)}
                    className="absolute top-2 right-2 text-white/60 hover:text-white p-1 rounded-full"
                  >
                    <X size={14} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Button to enter birthday world */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.75, duration: 0.6 }}
          >
            <motion.button
              type="button"
              onClick={triggerCelebrate}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="py-4 px-8 rounded-full bg-gradient-to-r from-[#6541A5] via-[#A855F7] to-[#F7B8D0] text-[#FFF8FC] font-semibold text-base sm:text-lg shadow-[0_0_30px_rgba(247,184,208,0.5)] hover:shadow-[0_0_40px_rgba(247,184,208,0.7)] transition-all duration-300 inline-flex items-center gap-3 cursor-pointer"
            >
              <span>Explore Your Birthday Galaxy</span>
              <ArrowRight size={20} className="animate-pulse" />
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
