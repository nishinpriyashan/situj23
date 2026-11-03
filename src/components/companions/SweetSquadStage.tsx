import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, X, Heart } from 'lucide-react';
import { BIRTHDAY_CONFIG, type CompanionId } from '../../config/birthday';
import { soundEffects } from '../../utils/soundEffects';
import {
  ChocoCharacter,
  MochiCharacter,
  SprinklesCharacter,
  TwinkleCharacter,
  type CartoonMood,
} from './CartoonCharacters';

const COMPANION_ORDER: CompanionId[] = ['choco', 'mochi', 'sprinkles', 'twinkle'];

export const SweetSquadStage: React.FC = () => {
  const [activeId, setActiveId] = useState<CompanionId | null>(null);
  const [lineIndices, setLineIndices] = useState<Record<CompanionId, number>>({
    choco: 0,
    mochi: 0,
    sprinkles: 0,
    twinkle: 0,
  });
  const [moods, setMoods] = useState<Record<CompanionId, CartoonMood>>({
    choco: 'idle',
    mochi: 'idle',
    sprinkles: 'idle',
    twinkle: 'idle',
  });
  const [metCompanions, setMetCompanions] = useState<CompanionId[]>([]);
  const [showSecretModal, setShowSecretModal] = useState(false);

  const playCharacterSound = (id: CompanionId) => {
    switch (id) {
      case 'choco':
        soundEffects.playPop();
        break;
      case 'mochi':
        soundEffects.playSqueak();
        break;
      case 'sprinkles':
        soundEffects.playBoing();
        break;
      case 'twinkle':
        soundEffects.playSparkle();
        break;
    }
  };

  const handleTapCompanion = (id: CompanionId) => {
    playCharacterSound(id);
    setActiveId(id);
    setMoods((prev) => ({ ...prev, [id]: 'happy' }));

    const lines = BIRTHDAY_CONFIG.companions.characters[id].lines;
    setLineIndices((prev) => ({
      ...prev,
      [id]: (prev[id] + 1) % lines.length,
    }));

    confetti({
      particleCount: 25,
      spread: 55,
      origin: { y: 0.85 },
      colors: ['#F7B8D0', '#B9A0F5', '#FFE1EC', '#FFD166'],
    });

    if (!metCompanions.includes(id)) {
      const nextMet = [...metCompanions, id];
      setMetCompanions(nextMet);
      if (nextMet.length === COMPANION_ORDER.length) {
        setTimeout(() => {
          soundEffects.playFanfare();
          setShowSecretModal(true);
        }, 700);
      }
    }

    setTimeout(() => {
      setMoods((prev) => ({ ...prev, [id]: 'idle' }));
    }, 1800);
  };

  const renderCharacterSvg = (id: CompanionId, mood: CartoonMood) => {
    switch (id) {
      case 'choco':
        return <ChocoCharacter mood={mood} className="w-12 h-12 sm:w-14 sm:h-14" blinkDelay="0.2s" />;
      case 'mochi':
        return <MochiCharacter mood={mood} className="w-12 h-12 sm:w-14 sm:h-14" blinkDelay="1.1s" />;
      case 'sprinkles':
        return <SprinklesCharacter mood={mood} className="w-12 h-12 sm:w-14 sm:h-14" blinkDelay="0.6s" />;
      case 'twinkle':
        return <TwinkleCharacter mood={mood} className="w-12 h-12 sm:w-14 sm:h-14" blinkDelay="1.7s" />;
    }
  };

  const activeConfig = activeId ? BIRTHDAY_CONFIG.companions.characters[activeId] : null;
  const activeLine =
    activeId && activeConfig
      ? activeConfig.lines[lineIndices[activeId] % activeConfig.lines.length]
      : '';

  return (
    <>
      {/* Interactive Cartoon Companions Dock (Bottom-Right) */}
      <div className="fixed bottom-16 sm:bottom-5 right-3 sm:right-5 z-40 flex flex-col items-end gap-2">
        <AnimatePresence mode="wait">
          {activeId && activeConfig && (
            <motion.div
              key={`${activeId}-${lineIndices[activeId]}`}
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.9 }}
              className="glass-panel px-4 py-3 rounded-2xl border border-pink-300/40 shadow-2xl max-w-[260px] text-left relative"
            >
              <button
                type="button"
                onClick={() => setActiveId(null)}
                className="absolute top-2 right-2 text-white/50 hover:text-white cursor-pointer"
                aria-label="Close message"
              >
                <X size={13} />
              </button>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#F7B8D0] mb-1">
                <span>{activeConfig.emoji}</span>
                <span>{activeConfig.name} says:</span>
              </div>
              <p className="text-xs text-[#FFF8FC] leading-relaxed pr-3">{activeLine}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="glass-pill px-2.5 py-1.5 rounded-full border border-pink-300/30 shadow-xl flex items-center gap-1 sm:gap-1.5">
          {COMPANION_ORDER.map((id) => {
            const info = BIRTHDAY_CONFIG.companions.characters[id];
            const isMet = metCompanions.includes(id);
            return (
              <motion.button
                key={id}
                type="button"
                onClick={() => handleTapCompanion(id)}
                whileHover={{ y: -6, scale: 1.12 }}
                whileTap={{ scale: 0.9 }}
                className="relative p-0.5 rounded-full cursor-pointer focus:outline-none group"
                title={`Tap ${info.name} ${info.emoji}`}
              >
                {renderCharacterSvg(id, moods[id])}
                {isMet && (
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-pink-400 ring-2 ring-[#170D2E]" />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Secret Squad Unlocked Modal */}
      <AnimatePresence>
        {showSecretModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSecretModal(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel max-w-md w-full p-6 sm:p-8 rounded-3xl border border-pink-300/50 text-center space-y-4 shadow-2xl"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 text-pink-200 text-xs font-semibold border border-pink-400/30">
                <Sparkles size={13} /> {BIRTHDAY_CONFIG.companions.squadName}
              </div>
              <h3 className="text-2xl font-serif font-bold text-white glow-pink">
                {BIRTHDAY_CONFIG.companions.secretNote.title}
              </h3>
              <p className="text-sm text-[#FFE1EC] leading-relaxed">
                {BIRTHDAY_CONFIG.companions.secretNote.message}
              </p>
              <button
                type="button"
                onClick={() => setShowSecretModal(false)}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#6541A5] to-[#F7B8D0] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Heart size={14} className="fill-white" /> Aww, Thank You!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

