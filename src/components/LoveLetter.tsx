import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Heart, Sparkles, ArrowRight, RotateCcw } from 'lucide-react';
import { BIRTHDAY_CONFIG } from '../config/birthday';
import { soundEffects } from '../utils/soundEffects';

interface LoveLetterProps {
  onProceed: () => void;
}

export const LoveLetter: React.FC<LoveLetterProps> = ({ onProceed }) => {
  const [isOpen, setIsOpen] = useState(false);
  const letter = BIRTHDAY_CONFIG.loveLetter;

  const handleOpenEnvelope = () => {
    soundEffects.playUnlock();
    setIsOpen(true);
  };

  const handleCloseEnvelope = () => {
    setIsOpen(false);
  };

  return (
    <section className="relative min-h-[90vh] py-12 px-4 max-w-4xl mx-auto flex flex-col items-center justify-center z-10">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/15 text-[#FFE1EC] text-xs uppercase tracking-widest font-semibold border border-pink-400/30 mb-2"
        >
          <Sparkles size={12} className="text-[#F7B8D0]" /> Chapter Six
        </motion.div>

        <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#FFF8FC] glow-pink">
          {letter.title}
        </h2>
        <p className="text-sm sm:text-base text-[#FFE1EC]/80 mt-1 max-w-md mx-auto">
          Words from the heart, penned especially for your 23rd birthday.
        </p>
      </div>

      {/* Main Container */}
      <div className="w-full flex flex-col items-center">
        <AnimatePresence mode="wait">
          {!isOpen ? (
            /* Closed Envelope View */
            <motion.div
              key="closed-envelope"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: -20 }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-md cursor-pointer select-none"
              onClick={handleOpenEnvelope}
            >
              <div className="relative glass-panel rounded-3xl p-8 sm:p-12 text-center border border-pink-300/40 shadow-[0_20px_60px_rgba(23,13,46,0.9)] overflow-hidden group hover:border-[#F7B8D0] transition-all duration-500">
                {/* Envelope Flap Vector Shape */}
                <div className="relative mx-auto w-48 h-36 mb-6 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#6541A5] via-[#48287A] to-[#2E1850] rounded-2xl border border-pink-300/30 shadow-lg group-hover:scale-105 transition-transform duration-500" />
                  
                  {/* Flap lines */}
                  <div className="absolute inset-0 border-t-transparent border-l-transparent border-r-transparent border-b-2 border-pink-200/20 rounded-2xl" />

                  {/* Wax Seal Button */}
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    className="relative z-10 w-16 h-16 rounded-full bg-gradient-to-br from-[#FF6B95] via-[#E11D48] to-[#9F1239] border-2 border-[#FFE1EC] shadow-[0_0_20px_rgba(247,184,208,0.7)] flex flex-col items-center justify-center text-white"
                  >
                    <Heart size={24} className="fill-white" />
                  </motion.div>
                </div>

                <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#FFF8FC] mb-2">
                  For My Situj 💌
                </h3>
                <p className="text-xs text-[#B9A0F5] mb-6 font-mono">
                  Tap the heart wax seal to break the seal and read
                </p>

                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-[#FFE1EC] text-xs font-semibold border border-pink-300/30 transition-colors">
                  <Mail size={14} className="text-[#F7B8D0]" />
                  <span>Open Birthday Letter</span>
                </div>
              </div>
            </motion.div>
          ) : (
            /* Open Letter View */
            <motion.div
              key="open-letter"
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="w-full max-w-2xl"
            >
              {/* Parchment Styled Romantic Paper */}
              <div className="relative bg-[#FFF8FC] text-[#170D2E] rounded-3xl p-6 sm:p-12 shadow-[0_25px_70px_rgba(0,0,0,0.6)] border-4 border-[#F7B8D0]/50 overflow-hidden">
                {/* Vintage Rose Corner Ornaments */}
                <div className="absolute top-3 left-3 text-[#B9A0F5]/40 text-xs select-none">
                  ❦
                </div>
                <div className="absolute top-3 right-3 text-[#B9A0F5]/40 text-xs select-none">
                  ❦
                </div>
                <div className="absolute bottom-3 left-3 text-[#B9A0F5]/40 text-xs select-none">
                  ❦
                </div>
                <div className="absolute bottom-3 right-3 text-[#B9A0F5]/40 text-xs select-none">
                  ❦
                </div>

                {/* Gentle background watermark */}
                <div className="absolute right-6 bottom-16 opacity-5 pointer-events-none">
                  <Heart size={200} className="fill-[#6541A5]" />
                </div>

                {/* Letter Content */}
                <div className="space-y-4 text-left leading-relaxed sm:leading-loose text-sm sm:text-base text-gray-800 font-sans">
                  {letter.paragraphs.map((p, idx) => {
                    const isFirst = idx === 0;
                    const isLast = idx === letter.paragraphs.length - 1;
                    const isChinParagraph = idx === 1; // paragraph mentioning chin and smile
                    const isDessertParagraph = idx === 2; // paragraph mentioning food and chocolates

                    return (
                      <React.Fragment key={idx}>
                        <p
                          className={`${
                            isFirst
                              ? 'text-lg sm:text-xl font-serif font-bold text-[#6541A5] pb-1'
                              : isLast
                              ? 'font-serif font-semibold text-[#6541A5] pt-2'
                              : ''
                          }`}
                        >
                          {p}
                        </p>

                        {/* Pinned Polaroid after Chin paragraph */}
                        {isChinParagraph && (
                          <div className="my-4 flex items-center justify-center sm:justify-end">
                            <motion.div
                              whileHover={{ scale: 1.05, rotate: 0 }}
                              className="w-36 sm:w-44 bg-white p-2 rounded-xl shadow-lg rotate-2 border border-pink-200"
                            >
                              <div className="aspect-[4/3] w-full rounded-lg overflow-hidden bg-purple-100">
                                <img
                                  src="./Situj Photos/WhatsApp Image 2026-10-26 at 19.06.10 (2).jpeg"
                                  alt="The Famous Chin"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <p className="text-[10px] text-purple-900 font-bold mt-1 text-center font-mono">
                                Exhibit A: That cute chin 🤌✨
                              </p>
                            </motion.div>
                          </div>
                        )}

                        {/* Pinned Polaroid after Food/Chocolate paragraph */}
                        {isDessertParagraph && (
                          <div className="my-4 flex items-center justify-center sm:justify-start">
                            <motion.div
                              whileHover={{ scale: 1.05, rotate: 0 }}
                              className="w-36 sm:w-44 bg-white p-2 rounded-xl shadow-lg -rotate-2 border border-pink-200"
                            >
                              <div className="aspect-[4/3] w-full rounded-lg overflow-hidden bg-purple-100">
                                <img
                                  src="./Situj Photos/WhatsApp Image 2026-10-26 at 19.06.16 (1).jpeg"
                                  alt="Dessert Anticipation"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <p className="text-[10px] text-purple-900 font-bold mt-1 text-center font-mono">
                                Ready for chocolates & treats 🍫
                              </p>
                            </motion.div>
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}

                  {/* Closing Signature with Cheek Squish Stamp */}
                  <div className="pt-6 mt-6 border-t border-purple-200/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="w-28 sm:w-32 bg-white p-1.5 rounded-lg shadow-md -rotate-3 border border-pink-200">
                      <img
                        src="./Situj Photos/WhatsApp Image 2026-10-26 at 19.06.08 (1).jpeg"
                        alt="Cheek Squish Forever"
                        className="w-full h-20 object-cover rounded"
                      />
                      <p className="text-[9px] text-purple-950 font-bold text-center mt-0.5 font-mono">
                        Forever Cheek Squish 🤏
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-purple-900/70 italic">
                        {letter.closingTitle}
                      </p>
                      <p className="text-xl sm:text-2xl font-serif text-[#6541A5] mt-1 font-bold tracking-wide">
                        {letter.signature}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons Below Letter */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={handleCloseEnvelope}
                  className="glass-pill px-5 py-3 rounded-full text-xs sm:text-sm text-[#B9A0F5] hover:text-white flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <RotateCcw size={15} /> Fold Letter Back
                </button>

                <motion.button
                  type="button"
                  onClick={onProceed}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#6541A5] via-[#A855F7] to-[#F7B8D0] text-white font-semibold text-base shadow-[0_0_30px_rgba(247,184,208,0.5)] flex items-center gap-2 cursor-pointer"
                >
                  <span>Open Your Final Surprise 🎁</span>
                  <ArrowRight size={18} />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
