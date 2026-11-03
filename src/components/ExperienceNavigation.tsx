import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Sparkles, Heart, Images, Cake, Mail, Gift } from 'lucide-react';

export type ExperienceStep = 
  | 'password'
  | 'reveal'
  | 'game'
  | 'memories'
  | 'cake'
  | 'letter'
  | 'gift';

interface StepMeta {
  id: ExperienceStep;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const STEPS: StepMeta[] = [
  { id: 'password', label: 'Secret Gate', icon: Lock },
  { id: 'reveal', label: 'Birthday Reveal', icon: Sparkles },
  { id: 'game', label: 'Heart Game', icon: Heart },
  { id: 'memories', label: 'Memories', icon: Images },
  { id: 'cake', label: '3D Cake', icon: Cake },
  { id: 'letter', label: 'Love Letter', icon: Mail },
  { id: 'gift', label: 'Special Gift', icon: Gift },
];

interface NavigationProps {
  currentStep: ExperienceStep;
  unlockedSteps: ExperienceStep[];
  onSelectStep: (step: ExperienceStep) => void;
}

export const ExperienceNavigation: React.FC<NavigationProps> = ({
  currentStep,
  unlockedSteps,
  onSelectStep,
}) => {
  // If still on password screen and nothing unlocked, hide navbar for suspense
  if (currentStep === 'password' && unlockedSteps.length <= 1) {
    return null;
  }

  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <nav
      aria-label="Birthday journey chapters"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-[95vw] sm:max-w-xl"
    >
      <div className="glass-panel px-3 py-2 rounded-full flex items-center justify-center gap-1.5 sm:gap-2 shadow-2xl border border-[#F7B8D0]/30 backdrop-blur-xl">
        {STEPS.map((step, idx) => {
          const isUnlocked = unlockedSteps.includes(step.id);
          const isActive = currentStep === step.id;
          const isPast = isUnlocked && !isActive && idx < currentIndex;
          const Icon = step.icon;

          return (
            <button
              key={step.id}
              type="button"
              disabled={!isUnlocked}
              onClick={() => onSelectStep(step.id)}
              className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-full transition-all duration-300 text-xs ${
                isActive
                  ? 'bg-gradient-to-r from-[#6541A5] to-[#B9A0F5] text-white font-medium shadow-[0_0_15px_rgba(247,184,208,0.5)]'
                  : isUnlocked
                  ? 'text-[#FFE1EC] hover:bg-white/10 hover:text-white cursor-pointer'
                  : 'text-white/20 cursor-not-allowed'
              }`}
              title={isUnlocked ? step.label : 'Complete earlier chapters to unlock'}
            >
              <Icon
                size={15}
                className={
                  isActive
                    ? 'text-white'
                    : isPast
                    ? 'text-[#F7B8D0]'
                    : isUnlocked
                    ? 'text-[#B9A0F5]'
                    : 'text-white/20'
                }
              />
              <span className="hidden md:inline">{step.label}</span>

              {/* Active glow indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeNavIndicator"
                  className="absolute inset-0 rounded-full border border-[#FFF8FC]/50 pointer-events-none"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
