import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

interface Petal {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  rotate: number;
}

export const BackgroundEffects: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [stars, setStars] = useState<Particle[]>([]);
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    // Generate subtle twinkling stars
    const newStars: Particle[] = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 1,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
      opacity: Math.random() * 0.7 + 0.3,
    }));
    setStars(newStars);

    // Generate falling rose / sakura petals
    if (!shouldReduceMotion) {
      const newPetals: Petal[] = Array.from({ length: 18 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: Math.random() * 12 + 10,
        duration: Math.random() * 10 + 12,
        delay: Math.random() * 8,
        rotate: Math.random() * 360,
      }));
      setPetals(newPetals);
    }
  }, [shouldReduceMotion]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* Dreamy deep purple & pink gradient mesh background */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-[#170D2E] via-[#241344] to-[#170D2E] opacity-95" 
      />

      {/* Ambient Breathing Glowing Orbs */}
      <div 
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#6541A5] opacity-25 blur-3xl animate-pulse-glow" 
      />
      <div 
        className="absolute top-1/3 -right-32 w-[30rem] h-[30rem] rounded-full bg-[#F7B8D0] opacity-20 blur-3xl animate-pulse-glow"
        style={{ animationDelay: '1.5s' }}
      />
      <div 
        className="absolute -bottom-32 left-1/4 w-[28rem] h-[28rem] rounded-full bg-[#B9A0F5] opacity-20 blur-3xl animate-pulse-glow"
        style={{ animationDelay: '3s' }}
      />

      {/* Twinkling Stars */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            boxShadow: `0 0 ${star.size * 2}px rgba(247, 184, 208, 0.8)`,
          }}
          animate={
            shouldReduceMotion
              ? { opacity: star.opacity }
              : {
                  opacity: [star.opacity * 0.3, star.opacity, star.opacity * 0.3],
                  scale: [0.8, 1.2, 0.8],
                }
          }
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Falling Floating Petals */}
      {!shouldReduceMotion &&
        petals.map((petal) => (
          <motion.div
            key={petal.id}
            className="absolute -top-10"
            style={{
              left: `${petal.x}%`,
            }}
            animate={{
              y: ['0vh', '105vh'],
              x: [`${petal.x}%`, `${petal.x + (petal.id % 2 === 0 ? 4 : -4)}%`],
              rotate: [petal.rotate, petal.rotate + 360],
            }}
            transition={{
              duration: petal.duration,
              repeat: Infinity,
              delay: petal.delay,
              ease: 'linear',
            }}
          >
            <svg
              width={petal.size}
              height={petal.size * 1.3}
              viewBox="0 0 24 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="opacity-40 drop-shadow-sm"
            >
              <path
                d="M12 0C18 8 24 18 20 28C16 38 8 32 4 28C0 24 6 8 12 0Z"
                fill="url(#petalGradient)"
              />
              <defs>
                <linearGradient id="petalGradient" x1="0" y1="0" x2="24" y2="32" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#F7B8D0" stopOpacity="0.8" />
                  <stop offset="1" stopColor="#B9A0F5" stopOpacity="0.5" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        ))}
    </div>
  );
};
