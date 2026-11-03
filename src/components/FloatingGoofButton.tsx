import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Laugh, X, Sparkles, Shuffle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SITUJ_PHOTOS, type SitujPhoto } from '../config/photos';
import { soundEffects } from '../utils/soundEffects';

export const FloatingGoofButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMeme, setCurrentMeme] = useState<SitujPhoto | null>(null);

  const goofyPhotos = SITUJ_PHOTOS.filter((p) => p.category === 'goofy' || p.isFeaturedGoofy);

  const getRandomGoof = () => {
    const random = goofyPhotos[Math.floor(Math.random() * goofyPhotos.length)];
    setCurrentMeme(random);
    soundEffects.playHeartCollect();

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { x: 0.1, y: 0.8 },
      colors: ['#FFD166', '#EF476F', '#06D6A0', '#F7B8D0'],
    });
  };

  const handleOpen = () => {
    getRandomGoof();
    setIsOpen(true);
  };

  return (
    <>
      {/* Floating Button in Bottom-Left */}
      <div className="fixed bottom-5 left-5 z-40">
        <motion.button
          type="button"
          onClick={handleOpen}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          className="group relative flex items-center gap-2 px-3.5 py-2.5 rounded-full glass-panel border border-yellow-300/40 bg-gradient-to-r from-yellow-500/20 via-pink-500/20 to-purple-600/20 shadow-[0_0_20px_rgba(250,204,21,0.3)] text-white text-xs font-semibold cursor-pointer hover:border-yellow-300"
          title="Click for a quick Situj laugh!"
        >
          {/* Pulsing Face Icon */}
          <span className="text-base group-hover:scale-125 transition-transform duration-300">
            🤪
          </span>
          <span className="hidden sm:inline text-yellow-200">Situj Goof Mode</span>
          <Sparkles size={13} className="text-yellow-300 animate-spin" style={{ animationDuration: '6s' }} />

          {/* Glowing Ping Ring */}
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
          </span>
        </motion.button>
      </div>

      {/* Quick Goof Meme Modal */}
      <AnimatePresence>
        {isOpen && currentMeme && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.85, rotate: -2, y: 20 }}
              animate={{ scale: 1, rotate: 0, y: 0 }}
              exit={{ scale: 0.85, y: 20 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="relative max-w-sm sm:max-w-md w-full glass-panel p-5 sm:p-6 rounded-3xl border-2 border-yellow-400 shadow-[0_0_40px_rgba(250,204,21,0.4)] text-center text-white"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute top-3 right-3 text-white/70 hover:text-white p-1.5 rounded-full bg-white/10"
              >
                <X size={18} />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-yellow-300 font-bold text-xs uppercase tracking-wider mb-3">
                <Laugh size={15} />
                <span>Certified Goofy Moment</span>
              </div>

              {/* Meme Card Container */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden border-2 border-white/20 mb-3 bg-black shadow-inner flex flex-col justify-between p-3 select-none">
                <img
                  src={currentMeme.url}
                  alt={currentMeme.caption}
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Top Meme Text */}
                <p className="relative z-10 font-black text-sm sm:text-lg text-white uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,1)] tracking-wide">
                  {currentMeme.memeTopText || 'SITUJ MOMENT'}
                </p>

                {/* Bottom Meme Text */}
                <p className="relative z-10 font-black text-sm sm:text-lg text-white uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,1)] tracking-wide">
                  {currentMeme.memeBottomText || '100% UNBOTHERED & ADORABLE'}
                </p>
              </div>

              <h4 className="text-sm sm:text-base font-bold text-white mb-1">
                {currentMeme.title}
              </h4>
              <p className="text-xs text-[#FFE1EC]/90 font-light mb-2">
                {currentMeme.caption}
              </p>

              {currentMeme.humorNote && (
                <p className="text-[11px] text-yellow-300 italic mb-4 bg-white/5 py-1.5 px-3 rounded-lg border border-yellow-300/20">
                  💡 {currentMeme.humorNote}
                </p>
              )}

              {/* Actions */}
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={getRandomGoof}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Shuffle size={14} />
                  <span>Next Random Goof! 🎲</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs cursor-pointer"
                >
                  Back
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
