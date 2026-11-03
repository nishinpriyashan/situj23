import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BackgroundEffects } from './components/BackgroundEffects';
import { MusicPlayer } from './components/MusicPlayer';
import { ExperienceNavigation, type ExperienceStep } from './components/ExperienceNavigation';
import { PasswordGate } from './components/PasswordGate';
import { BirthdayReveal } from './components/BirthdayReveal';
import { HeartGame } from './components/HeartGame';
import { MemoryGallery } from './components/MemoryGallery';
import { BirthdayCake3D } from './components/BirthdayCake3D';
import { LoveLetter } from './components/LoveLetter';
import { GiftReveal } from './components/GiftReveal';
import { FloatingGoofButton } from './components/FloatingGoofButton';
import { SweetSquadStage } from './components/companions/SweetSquadStage';

const STORAGE_KEY_STEP = 'situj_birthday_current_step';
const STORAGE_KEY_UNLOCKED = 'situj_birthday_unlocked_steps';

export function App() {
  const [currentStep, setCurrentStep] = useState<ExperienceStep>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_STEP);
    return (saved as ExperienceStep) || 'password';
  });

  const [unlockedSteps, setUnlockedSteps] = useState<ExperienceStep[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_UNLOCKED);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return ['password'];
  });

  // Keep track of whether she has passed the password gate to start music gracefully
  const hasStartedExperience = currentStep !== 'password';

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_STEP, currentStep);
  }, [currentStep]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_UNLOCKED, JSON.stringify(unlockedSteps));
  }, [unlockedSteps]);

  const unlockAndGoTo = (nextStep: ExperienceStep) => {
    setUnlockedSteps((prev) => (prev.includes(nextStep) ? prev : [...prev, nextStep]));
    setCurrentStep(nextStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRestart = () => {
    setUnlockedSteps(['password']);
    setCurrentStep('password');
    localStorage.removeItem(STORAGE_KEY_STEP);
    localStorage.removeItem(STORAGE_KEY_UNLOCKED);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen text-[#FFF8FC] selection:bg-[#F7B8D0] selection:text-[#170D2E] pb-24">
      {/* Background Starry Sky, Ambient Glowing Orbs, and Floating Petals */}
      <BackgroundEffects />

      {/* Persistent Romantic Music Player */}
      <MusicPlayer hasStartedExperience={hasStartedExperience} />

      {/* Chapter Progress & Navigation Dock */}
      <ExperienceNavigation
        currentStep={currentStep}
        unlockedSteps={unlockedSteps}
        onSelectStep={(step) => {
          setCurrentStep(step);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Experience Screen Transitions */}
      <main className="relative z-10 flex flex-col justify-center min-h-[90vh]">
        <AnimatePresence mode="wait">
          {currentStep === 'password' && (
            <motion.div
              key="step-password"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.6 }}
            >
              <PasswordGate onUnlock={() => unlockAndGoTo('reveal')} />
            </motion.div>
          )}

          {currentStep === 'reveal' && (
            <motion.div
              key="step-reveal"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.6 }}
            >
              <BirthdayReveal onProceed={() => unlockAndGoTo('game')} />
            </motion.div>
          )}

          {currentStep === 'game' && (
            <motion.div
              key="step-game"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.6 }}
            >
              <HeartGame onComplete={() => unlockAndGoTo('memories')} />
            </motion.div>
          )}

          {currentStep === 'memories' && (
            <motion.div
              key="step-memories"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.6 }}
            >
              <MemoryGallery onProceed={() => unlockAndGoTo('cake')} />
            </motion.div>
          )}

          {currentStep === 'cake' && (
            <motion.div
              key="step-cake"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.6 }}
            >
              <BirthdayCake3D onProceed={() => unlockAndGoTo('letter')} />
            </motion.div>
          )}

          {currentStep === 'letter' && (
            <motion.div
              key="step-letter"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.6 }}
            >
              <LoveLetter onProceed={() => unlockAndGoTo('gift')} />
            </motion.div>
          )}

          {currentStep === 'gift' && (
            <motion.div
              key="step-gift"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.6 }}
            >
              <GiftReveal onRestart={handleRestart} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Quick Goof / Meme of the Moment Floating Button */}
      <FloatingGoofButton />

      {/* Interactive Cartoon Characters ("The Sweet Squad") */}
      <SweetSquadStage />
    </div>
  );
}

export default App;
