import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Quote,
  Sparkles,
  Calendar,
  MapPin,
  ChevronLeft,
  ChevronRight,
  X,
  Cake,
  Utensils,
  Music,
  ArrowRight,
  Maximize2,
  Laugh,
  Plane,
  Layers,
  Sparkle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BIRTHDAY_CONFIG, type MemoryPhoto, type TimelineMilestone } from '../config/birthday';
import { soundEffects } from '../utils/soundEffects';

interface MemoryGalleryProps {
  onProceed: () => void;
}

type CategoryFilter = 'all' | 'goofy' | 'pilot' | 'romantic' | 'glam';

export const MemoryGallery: React.FC<MemoryGalleryProps> = ({ onProceed }) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [randomMemePhoto, setRandomMemePhoto] = useState<MemoryPhoto | null>(null);
  const [showMemeMode, setShowMemeMode] = useState(false);

  const allPhotos = BIRTHDAY_CONFIG.memories;
  const milestones = BIRTHDAY_CONFIG.timeline;

  // Filter photos according to category
  const filteredPhotos = allPhotos.filter((p) => {
    if (activeCategory === 'all') return true;
    return p.category === activeCategory;
  });

  // Keyboard navigation for Lightbox
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (selectedPhotoIndex === null) return;
      if (e.key === 'ArrowRight') {
        setSelectedPhotoIndex((prev) => (prev !== null ? (prev + 1) % filteredPhotos.length : 0));
      } else if (e.key === 'ArrowLeft') {
        setSelectedPhotoIndex((prev) =>
          prev !== null ? (prev - 1 + filteredPhotos.length) % filteredPhotos.length : 0
        );
      } else if (e.key === 'Escape') {
        setSelectedPhotoIndex(null);
        setRandomMemePhoto(null);
      }
    },
    [selectedPhotoIndex, filteredPhotos.length]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Emergency Laugh Button - Trigger random goofy meme
  const triggerRandomMeme = () => {
    const goofyList = allPhotos.filter((p) => p.category === 'goofy' || p.isFeaturedGoofy);
    const randomIndex = Math.floor(Math.random() * goofyList.length);
    const chosen = goofyList[randomIndex];
    setRandomMemePhoto(chosen);
    setShowMemeMode(true);
    soundEffects.playHeartCollect();

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#FFD166', '#EF476F', '#06D6A0', '#118AB2', '#F7B8D0'],
    });
  };

  const renderTimelineIcon = (type: TimelineMilestone['iconType']) => {
    switch (type) {
      case 'sparkles':
        return <Sparkles size={16} className="text-[#F7B8D0]" />;
      case 'heart':
        return <Heart size={16} className="text-[#F7B8D0] fill-[#F7B8D0]" />;
      case 'utensils':
        return <Utensils size={16} className="text-[#F7B8D0]" />;
      case 'music':
        return <Music size={16} className="text-[#F7B8D0]" />;
      case 'cake':
        return <Cake size={16} className="text-[#F7B8D0]" />;
      default:
        return <Calendar size={16} className="text-[#F7B8D0]" />;
    }
  };

  const categories = [
    { id: 'all', label: 'All Memories', count: allPhotos.length, icon: Layers },
    { id: 'goofy', label: 'Goofy Hall of Fame 🤪', count: allPhotos.filter((p) => p.category === 'goofy').length, icon: Laugh },
    { id: 'pilot', label: 'Captain Situj ✈️', count: allPhotos.filter((p) => p.category === 'pilot').length, icon: Plane },
    { id: 'romantic', label: 'Sweet & Romantic 💕', count: allPhotos.filter((p) => p.category === 'romantic').length, icon: Heart },
    { id: 'glam', label: 'Dressed to Slay ✨', count: allPhotos.filter((p) => p.category === 'glam').length, icon: Sparkle },
  ];

  const currentPhoto = selectedPhotoIndex !== null ? filteredPhotos[selectedPhotoIndex] : null;

  return (
    <section className="relative min-h-[90vh] py-12 px-4 sm:px-6 max-w-6xl mx-auto z-10">
      {/* Header */}
      <div className="text-center mb-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/15 text-[#FFE1EC] text-xs uppercase tracking-widest font-semibold border border-pink-400/30 mb-3"
        >
          <Sparkles size={12} className="text-[#F7B8D0]" /> Chapter Four • Memory Lane
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-5xl font-serif font-bold text-[#FFF8FC] glow-pink mb-3"
        >
          Our Little World of Memories
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-base sm:text-lg text-[#FFE1EC]/80 max-w-xl mx-auto font-light"
        >
          From aviation uniform milestones to hilariously unhinged candid faces.
        </motion.p>
      </div>

      {/* Featured Special Memory Message Card with Couple Photo */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="glass-panel p-6 sm:p-10 rounded-3xl relative mb-14 border border-pink-300/30 shadow-[0_15px_50px_rgba(23,13,46,0.8)] overflow-hidden"
      >
        <Quote
          size={64}
          className="absolute top-4 right-6 text-pink-300/10 pointer-events-none"
        />

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Couple Photo Spotlight */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-48 sm:w-56 bg-white p-2.5 rounded-2xl shadow-2xl -rotate-2 border-2 border-pink-300 hover:rotate-0 transition-transform duration-300">
              <div className="aspect-[4/5] w-full rounded-xl overflow-hidden bg-purple-950/20 shadow-inner">
                <img
                  src="/Situj Photos/WhatsApp Image 2026-10-26 at 19.06.08.jpeg"
                  alt="Co-Pilots in Love"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-center text-[11px] font-mono text-purple-900 font-bold mt-2">
                Co-Pilots Since August 💕✈️
              </p>
            </div>
          </div>

          {/* Special Memory Text */}
          <div className="md:col-span-2 space-y-3 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm text-[#F7B8D0] font-semibold tracking-wider uppercase mb-1">
              <Heart size={14} className="fill-[#F7B8D0]" />
              <span>{BIRTHDAY_CONFIG.specialMemory.title}</span>
            </div>

            <p className="text-sm sm:text-base text-[#FFF8FC]/90 leading-relaxed font-light whitespace-pre-line">
              {BIRTHDAY_CONFIG.specialMemory.fullMessage}
            </p>

            {/* Highlighted Closing Quote */}
            <div className="pt-3 mt-3 border-t border-white/10 text-center sm:text-left">
              <p className="text-base sm:text-lg font-serif italic font-semibold text-[#FFE1EC] glow-pink">
                “{BIRTHDAY_CONFIG.specialMemory.highlightQuote}”
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Emergency Laugh Button Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="glass-panel p-4 sm:p-5 rounded-2xl mb-10 border border-yellow-300/30 bg-gradient-to-r from-yellow-500/10 via-pink-500/15 to-purple-600/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-yellow-400/20 border border-yellow-300/40 flex items-center justify-center text-yellow-300 shrink-0 shadow-[0_0_15px_rgba(250,204,21,0.4)]">
            <Laugh size={24} className="animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <div>
            <h4 className="text-base font-bold text-white flex items-center gap-2 justify-center sm:justify-start">
              <span>Situj Meme Machine</span>
              <span className="px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-300 text-[10px] font-mono">
                100% UNHINGED
              </span>
            </h4>
            <p className="text-xs text-[#FFE1EC]/80 mt-0.5">
              Need an instant burst of joy? Click the emergency button to reveal a random funny photo!
            </p>
          </div>
        </div>

        <motion.button
          type="button"
          onClick={triggerRandomMeme}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white font-bold text-xs sm:text-sm tracking-wider uppercase shadow-[0_0_20px_rgba(244,114,182,0.5)] flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Laugh size={16} />
          <span>Emergency Laugh Button! 😂</span>
        </motion.button>
      </motion.div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id as CategoryFilter)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#6541A5] to-[#F7B8D0] text-white shadow-[0_0_15px_rgba(247,184,208,0.4)] border border-white/30'
                  : 'glass-pill text-[#B9A0F5] hover:text-white hover:border-pink-300/40'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-white' : 'text-[#F7B8D0]'} />
              <span>{cat.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-white/10 text-[#B9A0F5]'}`}>
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Photo Gallery Grid */}
      <div className="mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredPhotos.map((photo: MemoryPhoto, index: number) => {
            const tilts = [-2, 1.8, -1.2, 2.2, -1.6, 1.4];
            const tilt = tilts[index % tilts.length];
            const isGoofy = photo.category === 'goofy';

            return (
              <motion.div
                key={photo.id}
                layout
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: (index % 6) * 0.05 }}
                whileHover={{ scale: 1.03, rotate: 0 }}
                style={{ rotate: `${tilt}deg` }}
                onClick={() => setSelectedPhotoIndex(index)}
                className={`polaroid rounded-xl cursor-pointer group flex flex-col justify-between relative ${
                  isGoofy ? 'hover:ring-2 hover:ring-yellow-400' : 'hover:ring-2 hover:ring-pink-300'
                }`}
              >
                {/* Goofy Tag Badge */}
                {isGoofy && (
                  <div className="absolute top-3 left-3 z-10 bg-yellow-400 text-yellow-950 font-black text-[10px] px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
                    <Laugh size={11} />
                    <span>Meme Pick</span>
                  </div>
                )}

                {/* Photo container */}
                <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-purple-950/20 mb-3 shadow-inner">
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-white rounded-full p-2.5 shadow-lg">
                      <Maximize2 size={18} />
                    </div>
                  </div>
                </div>

                {/* Polaroid Caption & Details */}
                <div className="text-left px-1">
                  <h4 className="text-xs sm:text-sm font-bold text-purple-950 line-clamp-1 mb-0.5">
                    {photo.title || photo.caption}
                  </h4>
                  <p className="text-[11px] sm:text-xs font-normal text-purple-900/85 line-clamp-2 leading-snug">
                    {photo.caption}
                  </p>

                  {/* Humor Toast Note */}
                  {photo.humorNote && (
                    <p className="text-[10px] text-pink-700 italic font-medium mt-1 truncate">
                      💡 {photo.humorNote}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-[10px] text-purple-700/80 mt-2 font-mono pt-1.5 border-t border-purple-200/60">
                    <span>{photo.date}</span>
                    {photo.location && (
                      <span className="flex items-center gap-0.5 truncate max-w-[140px]">
                        <MapPin size={10} /> {photo.location}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Relationship Milestone Timeline */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#FFF8FC]">
            Our Journey Together
          </h3>
          <p className="text-xs text-[#B9A0F5] mt-1">
            Every chapter leading to your 23rd birthday
          </p>
        </div>

        <div className="relative max-w-3xl mx-auto">
          {/* Vertical connecting line */}
          <div className="absolute left-4 sm:left-1/2 top-4 bottom-4 -translate-x-1/2 w-[2px] bg-gradient-to-b from-[#6541A5] via-[#F7B8D0] to-[#6541A5]" />

          <div className="space-y-8">
            {milestones.map((item, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className={`relative flex items-center ${
                    isEven ? 'sm:flex-row-reverse' : 'sm:flex-row'
                  }`}
                >
                  {/* Timeline Node Icon */}
                  <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#170D2E] border-2 border-[#F7B8D0] flex items-center justify-center z-10 shadow-[0_0_12px_rgba(247,184,208,0.5)]">
                    {renderTimelineIcon(item.iconType)}
                  </div>

                  {/* Card Content */}
                  <div className="ml-12 sm:ml-0 sm:w-1/2 sm:px-6">
                    <div
                      className={`glass-card p-4 rounded-2xl border border-white/10 hover:border-pink-300/40 transition-colors ${
                        isEven ? 'sm:text-right' : 'sm:text-left'
                      }`}
                    >
                      <span className="text-[11px] font-semibold text-[#F7B8D0] tracking-wider uppercase">
                        {item.date}
                      </span>
                      <h4 className="text-base font-semibold text-[#FFF8FC] mt-0.5">
                        {item.title}
                      </h4>
                      <p className="text-xs text-[#FFE1EC]/80 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Button to proceed to Chapter Five */}
      <div className="text-center">
        <motion.button
          type="button"
          onClick={onProceed}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="py-4 px-8 rounded-full bg-gradient-to-r from-[#6541A5] via-[#A855F7] to-[#F7B8D0] text-[#FFF8FC] font-semibold text-base sm:text-lg shadow-[0_0_30px_rgba(247,184,208,0.5)] hover:shadow-[0_0_40px_rgba(247,184,208,0.7)] transition-all duration-300 inline-flex items-center gap-3 cursor-pointer"
        >
          <span>Time for Your 3D Birthday Cake 🎂</span>
          <ArrowRight size={20} className="animate-pulse" />
        </motion.button>
      </div>

      {/* Full-Screen Lightbox Modal */}
      <AnimatePresence>
        {currentPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={() => setSelectedPhotoIndex(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-4xl w-full glass-panel p-4 sm:p-6 rounded-3xl border border-pink-300/40 shadow-2xl flex flex-col md:flex-row gap-6 max-h-[92vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedPhotoIndex(null)}
                className="absolute top-3 right-3 text-white/70 hover:text-white p-2 rounded-full bg-white/10 z-20 transition-colors"
              >
                <X size={20} />
              </button>

              {/* Photo Display with optional Meme Overlay */}
              <div className="relative md:w-3/5 flex flex-col items-center justify-center bg-black/50 rounded-2xl overflow-hidden min-h-[300px]">
                <img
                  src={currentPhoto.url}
                  alt={currentPhoto.caption}
                  className="max-h-[65vh] w-auto object-contain rounded-xl"
                />

                {/* Meme Text Overlay if toggled */}
                {showMemeMode && currentPhoto.memeTopText && (
                  <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none">
                    <p className="text-center font-black text-lg sm:text-2xl text-white uppercase drop-shadow-[0_3px_3px_rgba(0,0,0,1)] tracking-wide">
                      {currentPhoto.memeTopText}
                    </p>
                    <p className="text-center font-black text-lg sm:text-2xl text-white uppercase drop-shadow-[0_3px_3px_rgba(0,0,0,1)] tracking-wide">
                      {currentPhoto.memeBottomText}
                    </p>
                  </div>
                )}

                {/* Previous / Next buttons */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPhotoIndex((prev) =>
                      prev !== null ? (prev - 1 + filteredPhotos.length) % filteredPhotos.length : 0
                    );
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                >
                  <ChevronLeft size={22} />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPhotoIndex((prev) =>
                      prev !== null ? (prev + 1) % filteredPhotos.length : 0
                    );
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                >
                  <ChevronRight size={22} />
                </button>
              </div>

              {/* Photo Metadata & Commentary */}
              <div className="md:w-2/5 flex flex-col justify-between text-left space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs uppercase tracking-widest font-semibold px-2.5 py-1 rounded-full bg-pink-500/20 text-[#F7B8D0] border border-pink-400/30">
                      {currentPhoto.category?.toUpperCase() || 'MEMORIES'}
                    </span>
                    <span className="text-xs text-[#B9A0F5] font-mono">
                      {selectedPhotoIndex! + 1} of {filteredPhotos.length}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-white glow-pink">
                    {currentPhoto.title || currentPhoto.caption}
                  </h3>

                  <p className="text-sm text-[#FFE1EC] mt-2 leading-relaxed">
                    {currentPhoto.caption}
                  </p>

                  {/* Humor & Love Note */}
                  {currentPhoto.humorNote && (
                    <div className="mt-4 p-3 rounded-xl bg-purple-950/40 border border-pink-400/20 text-xs text-[#F7B8D0] leading-relaxed">
                      <span className="font-bold text-yellow-300 block mb-0.5">💡 Situj Fact:</span>
                      {currentPhoto.humorNote}
                    </div>
                  )}

                  {/* Date & Location */}
                  <div className="mt-4 space-y-1 text-xs text-[#B9A0F5] font-mono">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-[#F7B8D0]" />
                      <span>{currentPhoto.date}</span>
                    </div>
                    {currentPhoto.location && (
                      <div className="flex items-center gap-1.5">
                        <MapPin size={13} className="text-[#F7B8D0]" />
                        <span>{currentPhoto.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {currentPhoto.tags && currentPhoto.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {currentPhoto.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-white/10 text-pink-200"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Meme Toggle Button */}
                {currentPhoto.memeTopText && (
                  <button
                    type="button"
                    onClick={() => setShowMemeMode(!showMemeMode)}
                    className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white border border-pink-300/30 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <Laugh size={14} className="text-yellow-300" />
                    <span>{showMemeMode ? 'Hide Meme Caption' : 'Show Meme Mode Text 😂'}</span>
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Random Meme Machine Modal */}
      <AnimatePresence>
        {randomMemePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={() => setRandomMemePhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.8, rotate: -3 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-lg w-full glass-panel p-6 rounded-3xl border-2 border-yellow-400 shadow-[0_0_50px_rgba(250,204,21,0.4)] text-center text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setRandomMemePhoto(null)}
                className="absolute top-3 right-3 text-white/70 hover:text-white p-1 rounded-full bg-white/10"
              >
                <X size={18} />
              </button>

              <div className="flex items-center justify-center gap-2 text-yellow-300 font-bold text-xs uppercase tracking-widest mb-3">
                <Laugh size={16} />
                <span>Situj Meme of the Moment</span>
              </div>

              {/* Meme Card with Image and Impact Text */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden border-2 border-white/20 mb-4 bg-black shadow-inner flex flex-col justify-between p-3">
                <img
                  src={randomMemePhoto.url}
                  alt={randomMemePhoto.caption}
                  className="absolute inset-0 w-full h-full object-cover"
                />

                <p className="relative z-10 font-black text-lg sm:text-xl text-white uppercase drop-shadow-[0_3px_4px_rgba(0,0,0,1)] tracking-wide">
                  {randomMemePhoto.memeTopText || 'WHEN SITUJ REALIZES'}
                </p>

                <p className="relative z-10 font-black text-lg sm:text-xl text-white uppercase drop-shadow-[0_3px_4px_rgba(0,0,0,1)] tracking-wide">
                  {randomMemePhoto.memeBottomText || 'SHE IS THE CUTEST PERSON ALIVE'}
                </p>
              </div>

              <h4 className="text-base font-bold text-white mb-1">
                {randomMemePhoto.title}
              </h4>
              <p className="text-xs text-[#FFE1EC]/90 mb-4 font-light">
                {randomMemePhoto.caption}
              </p>

              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={triggerRandomMeme}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-pink-500 text-white font-bold text-xs tracking-wider uppercase shadow-lg hover:scale-105 transition-transform cursor-pointer flex items-center gap-1.5"
                >
                  <Laugh size={14} /> Another Random Meme! 🤣
                </button>
                <button
                  type="button"
                  onClick={() => setRandomMemePhoto(null)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 text-white text-xs hover:bg-white/20 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
