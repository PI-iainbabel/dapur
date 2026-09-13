import React, { useState } from 'react';
import { MenuItem } from '../types';
import { FoodVisual } from './FoodVisual';
import { Clock, Eye, Sliders, Check, Download, Sparkles, FileText, Flame, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ExplosionMode } from './FlavorExplosion';

interface MenuCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem, coords?: { x: number; y: number }, mode?: ExplosionMode) => void;
  onCustomize: (item: MenuItem) => void;
  onPreview: (item: MenuItem) => void;
  onQuickDownload: (item: MenuItem) => void;
  selectedEffectMode?: ExplosionMode;
}

export const MenuCard: React.FC<MenuCardProps> = ({
  item,
  onAddToCart,
  onCustomize,
  onPreview,
  onQuickDownload,
  selectedEffectMode = 'flavor',
}) => {
  const [justAdded, setJustAdded] = useState(false);
  const [cardDrama, setCardDrama] = useState<'none' | 'burn' | 'drop' | 'flavor'>('none');

  const handleAddWithFeedback = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const coords = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };

    // Determine current drama effect
    let currentDrama: 'burn' | 'drop' | 'flavor' = 'flavor';
    if (selectedEffectMode === 'burn') currentDrama = 'burn';
    else if (selectedEffectMode === 'drop') currentDrama = 'drop';
    else if (selectedEffectMode === 'random') {
      const rand = Math.random();
      if (rand < 0.25) currentDrama = 'burn';
      else if (rand < 0.5) currentDrama = 'drop';
      else currentDrama = 'flavor';
    }

    setCardDrama(currentDrama);
    onAddToCart(item, coords, currentDrama);

    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
      setCardDrama('none');
    }, 1500);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={
        cardDrama === 'burn'
          ? {
              x: [-4, 4, -4, 4, 0],
              filter: ['brightness(1)', 'brightness(0.6) saturate(2)', 'brightness(1)'],
              transition: { duration: 0.6 },
            }
          : cardDrama === 'drop'
          ? {
              rotate: [0, -12, 10, -4, 0],
              y: [0, 18, 5, 0],
              transition: { duration: 0.7, ease: 'bounce' },
            }
          : cardDrama === 'flavor'
          ? {
              scale: [1, 1.04, 0.98, 1],
              transition: { duration: 0.4 },
            }
          : { opacity: 1, y: 0 }
      }
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-3xl border-2 shadow-sm hover:shadow-xl transition-all flex flex-col overflow-hidden relative group ${
        cardDrama === 'burn'
          ? 'border-red-600 ring-4 ring-red-500/40 bg-gradient-to-b from-orange-50 to-red-100'
          : cardDrama === 'drop'
          ? 'border-amber-500 ring-4 ring-amber-400/40'
          : cardDrama === 'flavor'
          ? 'border-amber-400 ring-4 ring-amber-300/40'
          : 'border-amber-200/90 hover:border-amber-400'
      }`}
    >
      {/* Comical Drama Kitchen Overlays */}
      <AnimatePresence>
        {cardDrama === 'burn' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-x-0 top-0 z-20 bg-red-600/95 text-white py-1.5 px-3 text-center text-xs font-black flex items-center justify-center gap-1.5 shadow-lg"
          >
            <Flame className="w-4 h-4 text-amber-300 animate-bounce" />
            <span>GOSONG DI FRYER SYSTEM 2! 🔥 (Tapi diganti koki!)</span>
          </motion.div>
        )}
        {cardDrama === 'drop' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-x-0 top-0 z-20 bg-amber-500 text-red-950 py-1.5 px-3 text-center text-xs font-black flex items-center justify-center gap-1.5 shadow-lg"
          >
            <AlertTriangle className="w-4 h-4 text-red-900 animate-pulse" />
            <span>BRUUUKK! JATUH KE LANTAI! 🧈 (Aturan 5 detik!)</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Featured / Popular Badge */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5 pointer-events-none">
        {item.featured && (
          <span className="bg-[#DA291C] text-white text-[11px] font-black tracking-wider px-2.5 py-1 rounded-full uppercase shadow-md flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300" />
            Rekomendasi Koki
          </span>
        )}
        {item.popularRank !== undefined && item.popularRank > 0 && (
          <span className="bg-amber-400 text-red-950 text-[10px] font-black px-2 py-1 rounded-full uppercase shadow-xs">
            ★ #{item.popularRank} Terlaris
          </span>
        )}
      </div>

      {/* Quick Preview floating button */}
      <button
        onClick={() => onPreview(item)}
        title="Intip / Cicipi isi dokumen di sini"
        className="absolute top-3 right-3 z-10 bg-white/90 hover:bg-white text-slate-700 hover:text-red-600 p-2 rounded-full shadow-md border border-slate-200 transition-all hover:scale-110 active:scale-95"
      >
        <Eye className="w-4 h-4" />
      </button>

      {/* Food Visual Illustration */}
      <div className="pt-2 px-2 relative">
        <FoodVisual type={item.foodType} />

        {/* Drama visual particle smoke / sparks overlay */}
        {cardDrama === 'burn' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-4xl animate-ping">🔥</span>
          </div>
        )}
        {cardDrama === 'drop' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-4xl animate-bounce">🧈</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div>
          {/* Parody Category & Filename */}
          <div className="flex items-center justify-between gap-2 text-xs font-mono text-slate-500 mb-1">
            <span className="flex items-center gap-1 text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              <FileText className="w-3 h-3" />
              {item.fileName}
            </span>
            <span className="text-[11px] text-slate-400">{item.fileSize}</span>
          </div>

          {/* Food Menu Name */}
          <h3 className="text-lg font-black text-slate-900 leading-snug group-hover:text-[#DA291C] transition-colors font-['Space_Grotesk']">
            {item.title}
          </h3>

          <p className="text-xs font-semibold text-amber-600 mb-2">
            {item.subtitle}
          </p>

          {/* Description */}
          <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-3">
            {item.description}
          </p>

          {/* Bias & Taste notes */}
          <div className="bg-amber-50/80 rounded-xl p-2.5 border border-amber-200/80 mb-3">
            <div className="text-[11px] font-bold text-amber-900 mb-1 flex items-center gap-1">
              <span>👅 Catatan Rasa:</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-snug italic">
              &quot;{item.tasteNotes}&quot;
            </p>
          </div>

          {/* Cognitive Nutrition Pills */}
          <div className="grid grid-cols-2 gap-1.5 text-[11px] mb-3">
            <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200 flex items-center justify-between">
              <span className="text-slate-500">Kalori Fokus:</span>
              <span className="font-bold text-slate-800">{item.cognitiveCalories} kkal</span>
            </div>
            <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200 flex items-center justify-between">
              <span className="text-slate-500">Waktu Santap:</span>
              <span className="font-bold text-slate-800 flex items-center gap-0.5">
                <Clock className="w-3 h-3 text-amber-600" />
                {item.estimatedMinutes} mnt
              </span>
            </div>
          </div>

          {/* Bias tags */}
          <div className="flex flex-wrap gap-1 mb-2">
            {item.includedBiases.slice(0, 3).map((bias, i) => (
              <span
                key={i}
                className="text-[10px] font-medium bg-red-50 text-red-700 px-2 py-0.5 rounded-md border border-red-100"
              >
                #{bias}
              </span>
            ))}
          </div>
        </div>

        {/* Pricing and Order Buttons */}
        <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
          {/* Price Parody */}
          <div className="flex items-baseline justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] line-through text-slate-400 font-mono">
                {item.originalPrice}
              </span>
              <span className="text-base font-black text-[#DA291C] font-mono leading-none">
                {item.priceDisplay}
              </span>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              ✓ 100% Gratis Publik
            </span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            {/* Customization Option */}
            <button
              onClick={() => onCustomize(item)}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-amber-400 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs transition-all active:scale-95 shadow-xs"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-700" />
              <span>Kustomisasi</span>
            </button>

            {/* 'Pesan Sekarang' Download Button with Flavor Explosion / Drama Animation */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={handleAddWithFeedback}
              className={`relative flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl font-black text-xs transition-all shadow-md overflow-hidden ${
                justAdded
                  ? cardDrama === 'burn'
                    ? 'bg-red-700 text-white border border-red-900'
                    : cardDrama === 'drop'
                    ? 'bg-amber-600 text-white border border-amber-800'
                    : 'bg-emerald-600 text-white border border-emerald-700'
                  : 'bg-gradient-to-r from-[#DA291C] to-[#B91C1C] hover:from-red-600 hover:to-red-800 text-white border border-red-700'
              }`}
            >
              <AnimatePresence mode="wait">
                {justAdded ? (
                  <motion.span
                    key="added"
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -15, opacity: 0 }}
                    className="flex items-center gap-1"
                  >
                    {cardDrama === 'burn' ? (
                      <>
                        <Flame className="w-4 h-4 text-amber-300" />
                        <span>Sizzle Panas!</span>
                      </>
                    ) : cardDrama === 'drop' ? (
                      <>
                        <AlertTriangle className="w-4 h-4 text-amber-300" />
                        <span>Hap! Selamat!</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 text-amber-300 stroke-[3]" />
                        <span>Masuk Baki!</span>
                      </>
                    )}
                  </motion.span>
                ) : (
                  <motion.span
                    key="normal"
                    initial={{ y: -15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 15, opacity: 0 }}
                    className="flex items-center gap-1.5"
                  >
                    <Download className="w-4 h-4 text-amber-300" />
                    <span>Pesan Sekarang</span>
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Direct Instant Download Trigger */}
          <button
            onClick={() => onQuickDownload(item)}
            className="text-[11px] font-semibold text-slate-500 hover:text-red-700 text-center py-1 transition-colors underline decoration-dotted"
          >
            Unduh langsung berkas .html tanpa lewat baki
          </button>
        </div>
      </div>
    </motion.div>
  );
};

