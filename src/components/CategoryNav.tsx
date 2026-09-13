import React from 'react';
import { CategoryId } from '../types';

interface CategoryNavProps {
  activeCategory: CategoryId;
  onSelectCategory: (id: CategoryId) => void;
  counts: Record<CategoryId, number>;
}

interface CategoryItem {
  id: CategoryId;
  label: string;
  sublabel: string;
  emoji: string;
}

const CATEGORIES: CategoryItem[] = [
  { id: 'all', label: 'Semua Menu', sublabel: 'Daftar Lengkap', emoji: '🍽️' },
  { id: 'pibi', label: 'Kuliah PIBI', sublabel: 'Psikologi Bisnis Islam', emoji: '🎓' },
  { id: 'combo', label: 'Paket Hemat Combo', sublabel: 'Decoy Bundling', emoji: '🍔' },
  { id: 'decks', label: 'Slide & Deck Utama', sublabel: 'Presentasi', emoji: '🥪' },
  { id: 'visuals', label: 'Pustaka SVG Renyah', sublabel: '42 Diagram', emoji: '🍟' },
  { id: 'engines', label: 'Engine & Simulasi', sublabel: 'BeWay & AHP', emoji: '🍦' },
  { id: 'snacks', label: 'Camilan Heuristik', sublabel: 'MINDSPACE', emoji: '🍗' },
];

export const CategoryNav: React.FC<CategoryNavProps> = ({
  activeCategory,
  onSelectCategory,
  counts,
}) => {
  return (
    <div className="bg-amber-50/80 border-b border-amber-200/80 py-3 px-4 shadow-inner">
      <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          const count = counts[cat.id] || 0;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all shrink-0 border ${
                isActive
                  ? 'bg-[#DA291C] text-white border-red-700 shadow-md shadow-red-800/20 scale-[1.02]'
                  : 'bg-white text-slate-700 border-amber-300 hover:bg-amber-100/70 hover:border-amber-400'
              }`}
            >
              <span className="text-base">{cat.emoji}</span>
              <div className="flex flex-col text-left">
                <span className="leading-tight font-extrabold">{cat.label}</span>
                <span
                  className={`text-[10px] ${
                    isActive ? 'text-amber-200' : 'text-slate-500'
                  } font-normal`}
                >
                  {cat.sublabel}
                </span>
              </div>
              <span
                className={`ml-1 text-[11px] font-black px-1.5 py-0.5 rounded-full ${
                  isActive
                    ? 'bg-amber-400 text-red-950'
                    : 'bg-amber-100 text-amber-900'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
