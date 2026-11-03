import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, Wind, RotateCcw, ArrowRight, Heart } from 'lucide-react';
import { BIRTHDAY_CONFIG } from '../config/birthday';
import { soundEffects } from '../utils/soundEffects';

interface BirthdayCake3DProps {
  onProceed: () => void;
}

// Flickering Candle Flame 3D Component
const CandleFlame: React.FC<{ position: [number, number, number]; isBlownOut: boolean }> = ({
  position,
  isBlownOut,
}) => {
  const flameRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (isBlownOut || !flameRef.current) return;
    const t = clock.getElapsedTime();
    // Gentle natural flicker
    const flicker = Math.sin(t * 12) * 0.1 + Math.cos(t * 18) * 0.05;
    flameRef.current.scale.set(
      1 + flicker * 0.5,
      1 + flicker,
      1 + flicker * 0.5
    );
    if (lightRef.current) {
      lightRef.current.intensity = 1.2 + flicker * 0.4;
    }
  });

  if (isBlownOut) return null;

  return (
    <group position={position}>
      {/* Flame Mesh (tear shape) */}
      <mesh ref={flameRef} position={[0, 0.22, 0]}>
        <coneGeometry args={[0.07, 0.22, 16]} />
        <meshBasicMaterial color="#FFB03A" />
      </mesh>
      {/* Inner bright core */}
      <mesh position={[0, 0.18, 0]}>
        <coneGeometry args={[0.04, 0.14, 16]} />
        <meshBasicMaterial color="#FFFEE4" />
      </mesh>
      {/* Warm point light casting light on the frosting */}
      <pointLight ref={lightRef} distance={2.5} intensity={1.5} color="#FFA733" />
    </group>
  );
};

// 3D Model of the Pastel Pink & Lavender Cake
const CakeModel: React.FC<{ isBlownOut: boolean }> = ({ isBlownOut }) => {
  const cakeGroup = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (cakeGroup.current) {
      cakeGroup.current.rotation.y += delta * 0.2; // Gentle slow rotation
    }
  });

  // Candle positions on top tier
  const candlePositions: [number, number, number][] = [
    [-0.5, 1.2, -0.4],
    [0.5, 1.2, -0.4],
    [-0.7, 1.2, 0.1],
    [0.7, 1.2, 0.1],
    [-0.3, 1.2, 0.6],
    [0.3, 1.2, 0.6],
  ];

  return (
    <group ref={cakeGroup} position={[0, -0.6, 0]}>
      {/* Decorative Cake Stand */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[2.2, 2.2, 0.15, 32]} />
        <meshStandardMaterial color="#FFE1EC" metalness={0.2} roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.6, 0]}>
        <cylinderGeometry args={[0.8, 1.2, 0.7, 32]} />
        <meshStandardMaterial color="#B9A0F5" metalness={0.2} roughness={0.4} />
      </mesh>

      {/* Tier 1: Bottom Layer - Pastel Pink */}
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[1.8, 1.8, 0.7, 32]} />
        <meshStandardMaterial color="#F7B8D0" roughness={0.4} />
      </mesh>

      {/* Tier 1 Lavender Frosting Border */}
      <mesh position={[0, 0.6, 0]}>
        <torusGeometry args={[1.78, 0.08, 16, 32]} />
        <meshStandardMaterial color="#B9A0F5" roughness={0.3} />
      </mesh>

      {/* Tier 2: Top Layer - Pastel Soft Pink */}
      <mesh position={[0, 0.85, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 0.6, 32]} />
        <meshStandardMaterial color="#FFE1EC" roughness={0.4} />
      </mesh>

      {/* Top Lavender Icing Glaze */}
      <mesh position={[0, 1.15, 0]}>
        <cylinderGeometry args={[1.22, 1.22, 0.05, 32]} />
        <meshStandardMaterial color="#B9A0F5" roughness={0.2} />
      </mesh>

      {/* Sugar Pearls around Tier 2 */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i / 16) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 1.18, 0.58, Math.sin(angle) * 1.18]}
          >
            <sphereGeometry args={[0.05, 12, 12]} />
            <meshStandardMaterial color="#FFF8FC" metalness={0.4} roughness={0.2} />
          </mesh>
        );
      })}

      {/* Number 23 Cake Topper */}
      <group position={[0, 1.35, 0]}>
        {/* Number 2 */}
        <mesh position={[-0.22, 0.15, 0]}>
          <boxGeometry args={[0.16, 0.35, 0.06]} />
          <meshStandardMaterial color="#6541A5" metalness={0.6} roughness={0.2} />
        </mesh>
        {/* Number 3 */}
        <mesh position={[0.22, 0.15, 0]}>
          <boxGeometry args={[0.16, 0.35, 0.06]} />
          <meshStandardMaterial color="#6541A5" metalness={0.6} roughness={0.2} />
        </mesh>
      </group>

      {/* Candles and Animated Flames */}
      {candlePositions.map((pos, idx) => (
        <group key={idx}>
          {/* Candle stick */}
          <mesh position={[pos[0], pos[1] + 0.1, pos[2]]}>
            <cylinderGeometry args={[0.035, 0.035, 0.3, 16]} />
            <meshStandardMaterial
              color={idx % 2 === 0 ? '#B9A0F5' : '#F7B8D0'}
              roughness={0.3}
            />
          </mesh>
          {/* Candle wick */}
          <mesh position={[pos[0], pos[1] + 0.26, pos[2]]}>
            <cylinderGeometry args={[0.008, 0.008, 0.06, 8]} />
            <meshBasicMaterial color="#333333" />
          </mesh>
          {/* Animated Flame */}
          <CandleFlame position={[pos[0], pos[1] + 0.3, pos[2]]} isBlownOut={isBlownOut} />
        </group>
      ))}
    </group>
  );
};

export const BirthdayCake3D: React.FC<BirthdayCake3DProps> = ({ onProceed }) => {
  const [isBlownOut, setIsBlownOut] = useState(false);
  const [hasWished, setHasWished] = useState(false);

  const handleBlowOut = () => {
    soundEffects.playCandleBlow();
    setIsBlownOut(true);
    setHasWished(true);

    // Blast celebratory confetti!
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#F7B8D0', '#B9A0F5', '#FFE1EC', '#FFFFFF', '#6541A5'],
    });

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 70,
        origin: { x: 0.1, y: 0.6 },
        colors: ['#F7B8D0', '#FFE1EC'],
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 70,
        origin: { x: 0.9, y: 0.6 },
        colors: ['#B9A0F5', '#FFFFFF'],
      });
    }, 300);
  };

  const handleRelight = () => {
    setIsBlownOut(false);
    setHasWished(false);
  };

  return (
    <section className="relative min-h-[90vh] py-12 px-4 max-w-5xl mx-auto flex flex-col items-center justify-center z-10">
      {/* Header */}
      <div className="text-center mb-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/15 text-[#FFE1EC] text-xs uppercase tracking-widest font-semibold border border-pink-400/30 mb-2"
        >
          <Sparkles size={12} className="text-[#F7B8D0]" /> Chapter Five
        </motion.div>

        <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#FFF8FC] glow-pink">
          Make a 23rd Birthday Wish 🎂
        </h2>
        <p className="text-sm sm:text-base text-[#FFE1EC]/80 mt-1 max-w-md mx-auto">
          Drag to spin the cake. Close your eyes, think of your deepest wish, and blow out your candles!
        </p>
      </div>

      {/* 3D Cake Canvas Container */}
      <div className="relative w-full max-w-xl h-[380px] sm:h-[460px] glass-panel rounded-3xl overflow-hidden border border-pink-300/30 shadow-2xl flex items-center justify-center">
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center gap-3 text-pink-300">
              <Sparkles className="animate-spin text-pink-400" size={32} />
              <span className="text-xs">Decorating Situj's 3D Birthday Cake...</span>
            </div>
          }
        >
          <Canvas
            camera={{ position: [0, 2.2, 4.5], fov: 42 }}
            className="w-full h-full cursor-grab active:cursor-grabbing"
          >
            <ambientLight intensity={0.9} />
            <directionalLight position={[5, 8, 5]} intensity={1.2} color="#FFF8FC" />
            <pointLight position={[-5, 3, -5]} intensity={0.6} color="#B9A0F5" />
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
              <CakeModel isBlownOut={isBlownOut} />
            </Float>
            <OrbitControls
              enableZoom={false}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 2.2}
            />
          </Canvas>
        </Suspense>

        {/* Wish Granted Celebration Banner */}
        <AnimatePresence>
          {hasWished && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 glass-panel p-4 rounded-2xl border border-pink-300/50 shadow-2xl z-20 flex items-center gap-3 sm:gap-4 text-left"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-pink-300 shrink-0 bg-purple-950/40 shadow-md">
                <img
                  src="/Situj Photos/WhatsApp Image 2026-10-26 at 19.06.09 (2).jpeg"
                  alt="Situj Joyful Laugh"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-serif font-bold text-white glow-pink flex items-center gap-1.5">
                  <span>Wish Sealed, {BIRTHDAY_CONFIG.recipient.nickname}!</span>
                  <Heart size={16} className="text-[#F7B8D0] fill-[#F7B8D0] animate-bounce shrink-0" />
                </h3>
                <p className="text-[11px] sm:text-xs text-[#FFE1EC] mt-0.5 font-light leading-relaxed">
                  Candles extinguished, 23rd year officially inaugurated! May you always giggle this hard and enjoy unlimited chocolates. ✨
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Interactive Controls */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        {!isBlownOut ? (
          <motion.button
            type="button"
            onClick={handleBlowOut}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#6541A5] via-[#A855F7] to-[#F7B8D0] text-white font-semibold text-base shadow-[0_0_25px_rgba(247,184,208,0.5)] flex items-center gap-2.5 cursor-pointer"
          >
            <Wind size={20} className="animate-pulse" />
            <span>Make a Wish & Blow Out Candles ✨</span>
          </motion.button>
        ) : (
          <>
            <button
              type="button"
              onClick={handleRelight}
              className="glass-pill px-5 py-3 rounded-full text-xs sm:text-sm text-[#B9A0F5] hover:text-white flex items-center gap-2 cursor-pointer transition-colors"
            >
              <RotateCcw size={16} /> Relight Candles 🕯️
            </button>

            <motion.button
              type="button"
              onClick={onProceed}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#6541A5] via-[#A855F7] to-[#F7B8D0] text-white font-semibold text-base shadow-[0_0_25px_rgba(247,184,208,0.5)] flex items-center gap-2 cursor-pointer"
            >
              <span>Read Your Birthday Letter 💌</span>
              <ArrowRight size={18} />
            </motion.button>
          </>
        )}
      </div>
    </section>
  );
};
