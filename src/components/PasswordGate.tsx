import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Eye, EyeOff, Sparkles, KeyRound, AlertCircle, X, ShieldAlert } from 'lucide-react';
import { BIRTHDAY_CONFIG } from '../config/birthday';
import { soundEffects } from '../utils/soundEffects';

interface PasswordGateProps {
  onUnlock: () => void;
}

export const PasswordGate: React.FC<PasswordGateProps> = ({ onUnlock }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isError, setIsError] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [showMemeAlert, setShowMemeAlert] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password.trim() === BIRTHDAY_CONFIG.security.secretPassword) {
      setIsError(false);
      setShowMemeAlert(false);
      setIsUnlocking(true);
      soundEffects.playUnlock();

      setTimeout(() => {
        onUnlock();
      }, 700);
    } else {
      setIsError(true);
      setShowMemeAlert(true);
      soundEffects.playError();
    }
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 py-12 z-10">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.9 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <div className="glass-panel p-8 sm:p-10 rounded-3xl text-center relative overflow-hidden border border-pink-300/30 shadow-[0_20px_60px_rgba(23,13,46,0.8)]">
          {/* Decorative ambient light inside card */}
          <div className="absolute -top-20 -right-20 w-44 h-44 bg-pink-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-purple-600/20 rounded-full blur-2xl pointer-events-none" />

          {/* Captain Situj Avatar & Floating Lock Badge */}
          <div className="relative w-24 h-24 mx-auto mb-5">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 2 }}
              className="w-24 h-24 rounded-full p-[3px] bg-gradient-to-tr from-[#6541A5] via-[#F7B8D0] to-[#FFE1EC] shadow-xl overflow-hidden cursor-pointer"
              onClick={() => setShowHint(true)}
              title="Captain Situj - Chief Security Officer"
            >
              <img
                src="./Situj Photos/WhatsApp Image 2026-10-26 at 19.06.10.jpeg"
                alt="Captain Situj"
                className="w-full h-full object-cover object-top rounded-full"
              />
            </motion.div>

            {/* Lock / Unlock Mini Floating Badge */}
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#170D2E] border-2 border-[#F7B8D0] flex items-center justify-center shadow-lg"
            >
              {isUnlocking ? (
                <Unlock className="text-[#F7B8D0] animate-bounce" size={14} />
              ) : (
                <Lock className="text-[#B9A0F5]" size={14} />
              )}
            </motion.div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 text-[#FFE1EC] text-[11px] font-mono tracking-wider mb-3 border border-pink-300/20">
            <span>👩‍✈️ Captain Situj's Vault</span>
          </div>

          {/* Cinematic Greeting */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl sm:text-4xl font-serif font-bold text-[#FFF8FC] glow-pink mb-2"
          >
            Hey, {BIRTHDAY_CONFIG.recipient.nickname}… 💗
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="text-base sm:text-lg text-[#FFE1EC] font-light mb-1"
          >
            I made a little world just for you.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xs sm:text-sm text-[#B9A0F5] mb-6 font-light"
          >
            Ready to discover your 23rd birthday surprise?
          </motion.p>

          {/* Password Form with error shake */}
          <motion.form
            onSubmit={handleSubmit}
            animate={
              isError
                ? {
                    x: [-10, 10, -8, 8, -4, 4, 0],
                    transition: { duration: 0.5 },
                  }
                : {}
            }
            className="space-y-4"
          >
            <div className="relative">
              <label htmlFor="secret-pass" className="sr-only">
                Enter your secret password
              </label>

              <div className="relative flex items-center">
                <input
                  id="secret-pass"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (isError) setIsError(false);
                  }}
                  placeholder="Enter our secret code..."
                  autoFocus
                  maxLength={10}
                  className={`w-full px-5 py-3.5 pr-12 rounded-2xl bg-white/5 border text-center text-lg tracking-widest text-[#FFF8FC] placeholder:text-[#B9A0F5]/50 focus:outline-none transition-all duration-300 ${
                    isError
                      ? 'border-rose-400/80 shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                      : 'border-[#B9A0F5]/30 focus:border-[#F7B8D0] focus:shadow-[0_0_20px_rgba(247,184,208,0.3)]'
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-[#B9A0F5] hover:text-[#FFF8FC] transition-colors p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {isError && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-rose-300 font-medium flex items-center justify-center gap-1.5"
                >
                  <AlertCircle size={14} className="text-rose-400" />
                  Access Denied! Captain Situj is suspicious.
                </motion.p>
              )}
            </AnimatePresence>

            {/* Unlock Button */}
            <motion.button
              type="submit"
              disabled={isUnlocking}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#6541A5] via-[#8B5CF6] to-[#F7B8D0] text-[#FFF8FC] font-semibold text-base shadow-[0_4px_25px_rgba(101,65,165,0.5)] hover:shadow-[0_4px_30px_rgba(247,184,208,0.5)] transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
            >
              {isUnlocking ? (
                <>
                  <Sparkles size={18} className="animate-spin text-white" />
                  <span>Unlocking Situj's Galaxy...</span>
                </>
              ) : (
                <>
                  <KeyRound
                    size={18}
                    className="group-hover:rotate-45 transition-transform duration-300"
                  />
                  <span>Unlock My Birthday Surprise ✨</span>
                </>
              )}
            </motion.button>
          </motion.form>

          {/* Playful Hint Toggle */}
          <div className="mt-6 pt-4 border-t border-white/10 text-center">
            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className="text-xs text-[#B9A0F5]/80 hover:text-[#FFE1EC] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>{showHint ? 'Hide hint' : 'Need a little hint? 🗝️'}</span>
            </button>

            <AnimatePresence>
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden mt-2"
                >
                  <p className="text-xs text-[#FFE1EC] bg-white/5 py-2 px-3 rounded-xl border border-white/10 inline-block">
                    {BIRTHDAY_CONFIG.security.hint}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Hilarious Wrong Password Meme Modal */}
      <AnimatePresence>
        {showMemeAlert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setShowMemeAlert(false)}
          >
            <motion.div
              initial={{ scale: 0.8, rotate: -3, y: 30 }}
              animate={{ scale: 1, rotate: 0, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              transition={{ type: 'spring', damping: 22, stiffness: 300 }}
              className="relative max-w-sm w-full glass-panel p-6 rounded-3xl border-2 border-rose-400/80 shadow-[0_0_50px_rgba(244,63,94,0.5)] text-center text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setShowMemeAlert(false)}
                className="absolute top-3 right-3 text-white/70 hover:text-white p-1 rounded-full bg-white/10"
              >
                <X size={18} />
              </button>

              <div className="flex items-center justify-center gap-2 text-rose-300 font-bold text-sm tracking-wider uppercase mb-3">
                <ShieldAlert size={18} className="animate-bounce" />
                <span>🚨 INTRUDER ALERT! 🚨</span>
              </div>

              {/* The Staring Situj Meme Image */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden border-2 border-rose-400/60 mb-4 shadow-inner">
                <img
                  src="./Situj Photos/WhatsApp Image 2026-10-26 at 19.06.05.jpeg"
                  alt="Situj Staring Accusingly"
                  className="w-full h-full object-cover scale-110"
                />
                <div className="absolute top-2 inset-x-2 bg-black/70 py-1 px-2 rounded text-[11px] font-black uppercase text-yellow-300 tracking-wider">
                  SUSPICIOUS SITUJ IS WATCHING YOU
                </div>
                <div className="absolute bottom-2 inset-x-2 bg-black/70 py-1 px-2 rounded text-[11px] font-black uppercase text-white tracking-wider">
                  "EXCUSE ME?! WHO IS ENTERING WRONG CODES?!"
                </div>
              </div>

              <p className="text-sm text-pink-100 font-medium leading-relaxed mb-4">
                Did you really forget our secret code?! Look directly into Captain Situj's eyes and apologize immediately! 🤨😂
              </p>

              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPassword('1905');
                    setShowMemeAlert(false);
                    setIsError(false);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-xs tracking-wider shadow-lg hover:scale-105 transition-transform cursor-pointer"
                >
                  "Forgive me, Captain Situj! Use 1905" 🥺
                </button>
                <button
                  type="button"
                  onClick={() => setShowMemeAlert(false)}
                  className="w-full py-2 px-4 rounded-xl bg-white/10 text-white/80 hover:text-white text-xs cursor-pointer"
                >
                  Let me type it myself
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
