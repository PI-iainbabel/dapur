import React from 'react';

interface FoodVisualProps {
  type: 'burger' | 'fries' | 'combo' | 'drink' | 'dessert' | 'nuggets';
  className?: string;
}

export const FoodVisual: React.FC<FoodVisualProps> = ({ type, className = 'w-full h-44' }) => {
  if (type === 'burger') {
    return (
      <div className={`relative flex items-center justify-center p-4 bg-gradient-to-b from-amber-50 to-orange-100/70 rounded-2xl overflow-hidden ${className}`}>
        {/* Subtle background rays */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.25)_0,transparent_70%)]" />
        
        <svg viewBox="0 0 160 140" className="w-full h-full max-h-40 drop-shadow-[0_12px_14px_rgba(180,83,9,0.25)]">
          {/* Top Sesame Bun */}
          <path
            d="M20 62C20 30 50 18 80 18C110 18 140 30 140 62C140 66 136 68 130 68H30C24 68 20 66 20 62Z"
            fill="#F59E0B"
            stroke="#D97706"
            strokeWidth="3"
          />
          {/* Sesame Seeds */}
          <ellipse cx="50" cy="36" rx="2.5" ry="1.5" fill="#FEF3C7" transform="rotate(-15 50 36)" />
          <ellipse cx="75" cy="28" rx="2.5" ry="1.5" fill="#FEF3C7" />
          <ellipse cx="102" cy="34" rx="2.5" ry="1.5" fill="#FEF3C7" transform="rotate(20 102 34)" />
          <ellipse cx="64" cy="46" rx="2.5" ry="1.5" fill="#FEF3C7" transform="rotate(10 64 46)" />
          <ellipse cx="90" cy="48" rx="2.5" ry="1.5" fill="#FEF3C7" transform="rotate(-10 90 48)" />
          <ellipse cx="118" cy="48" rx="2.5" ry="1.5" fill="#FEF3C7" transform="rotate(15 118 48)" />

          {/* Crispy Lettuce layer (Wavy) */}
          <path
            d="M16 68C22 64 26 72 34 68C42 64 46 72 54 68C62 64 66 72 74 68C82 64 86 72 94 68C102 64 106 72 114 68C122 64 126 72 134 68C140 65 144 72 146 71L142 77H18L16 68Z"
            fill="#10B981"
          />

          {/* Melted Cheese layer 1 */}
          <polygon points="22,76 138,76 130,86 100,94 85,82 65,96 45,82 28,90" fill="#FBBF24" stroke="#F59E0B" strokeWidth="1.5" />

          {/* Beef Patty 1 (Behavioral) */}
          <rect x="22" y="78" width="116" height="14" rx="6" fill="#78350F" stroke="#522307" strokeWidth="2" />

          {/* Middle Bun */}
          <rect x="26" y="92" width="108" height="10" rx="4" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />

          {/* Melted Cheese layer 2 */}
          <polygon points="26,102 134,102 122,112 105,106 82,116 60,105 35,114" fill="#FBBF24" />

          {/* Beef Patty 2 (Maqashid) */}
          <rect x="22" y="104" width="116" height="14" rx="6" fill="#78350F" stroke="#522307" strokeWidth="2" />

          {/* Bottom Bun */}
          <path
            d="M26 118H134C136 118 138 120 137 123C134 132 110 138 80 138C50 138 26 132 23 123C22 120 24 118 26 118Z"
            fill="#F59E0B"
            stroke="#D97706"
            strokeWidth="3"
          />
        </svg>

        <span className="absolute bottom-2 right-3 text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wide">
          Double-Deck
        </span>
      </div>
    );
  }

  if (type === 'fries') {
    return (
      <div className={`relative flex items-center justify-center p-4 bg-gradient-to-b from-amber-50 to-red-50 rounded-2xl overflow-hidden ${className}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.15)_0,transparent_70%)]" />
        
        <svg viewBox="0 0 160 140" className="w-full h-full max-h-40 drop-shadow-[0_12px_14px_rgba(220,38,38,0.2)]">
          {/* Golden Fries sticking out */}
          <g fill="#FBBF24" stroke="#D97706" strokeWidth="1.5">
            <rect x="42" y="15" width="10" height="70" rx="3" transform="rotate(-18 47 50)" />
            <rect x="58" y="10" width="11" height="75" rx="3" transform="rotate(-8 63 47)" />
            <rect x="74" y="8" width="11" height="78" rx="3" transform="rotate(2 79 47)" />
            <rect x="90" y="12" width="10" height="72" rx="3" transform="rotate(12 95 48)" />
            <rect x="105" y="18" width="10" height="65" rx="3" transform="rotate(24 110 50)" />
            
            {/* Front layer fries */}
            <rect x="50" y="24" width="10" height="62" rx="3" fill="#FCD34D" transform="rotate(-12 55 55)" />
            <rect x="68" y="20" width="10" height="66" rx="3" fill="#FDE68A" transform="rotate(-2 73 53)" />
            <rect x="84" y="22" width="10" height="64" rx="3" fill="#FCD34D" transform="rotate(8 89 54)" />
            <rect x="98" y="28" width="10" height="58" rx="3" fill="#FCD34D" transform="rotate(18 103 57)" />
          </g>

          {/* Red Fries Box with curved scoop opening */}
          <path
            d="M32 70L44 132C45 136 49 138 54 138H106C111 138 115 136 116 132L128 70C116 78 100 82 80 82C60 82 44 78 32 70Z"
            fill="#DC2626"
            stroke="#991B1B"
            strokeWidth="3"
          />

          {/* Golden Arch Parody on Box */}
          <path
            d="M62 118C62 102 70 96 80 106C90 96 98 102 98 118"
            stroke="#FFC72C"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
        </svg>

        <span className="absolute bottom-2 right-3 text-[10px] font-bold bg-amber-500 text-red-950 px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wide">
          42 Pcs SVG
        </span>
      </div>
    );
  }

  if (type === 'dessert') {
    return (
      <div className={`relative flex items-center justify-center p-4 bg-gradient-to-b from-sky-50 to-blue-100/70 rounded-2xl overflow-hidden ${className}`}>
        <svg viewBox="0 0 160 140" className="w-full h-full max-h-40 drop-shadow-[0_12px_14px_rgba(2,132,199,0.2)]">
          {/* Swirled Soft Serve */}
          <ellipse cx="80" cy="55" rx="34" ry="24" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
          <ellipse cx="80" cy="40" rx="26" ry="18" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />
          <path d="M72 26C72 16 88 12 88 24C88 28 84 32 72 32" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />

          {/* 7 Swirl Crumb Toppings (representing 7 steps) */}
          <circle cx="68" cy="46" r="3" fill="#D97706" />
          <circle cx="84" cy="38" r="2.5" fill="#2563EB" />
          <circle cx="95" cy="50" r="3.5" fill="#D97706" />
          <circle cx="75" cy="58" r="2.5" fill="#10B981" />
          <circle cx="60" cy="54" r="3" fill="#2563EB" />
          <circle cx="90" cy="62" r="3" fill="#10B981" />
          <circle cx="80" cy="22" r="3.5" fill="#DC2626" />

          {/* Clear Cup with Blue McD Swirl */}
          <path
            d="M48 64L58 132C59 135 62 138 66 138H94C98 138 101 135 102 132L112 64H48Z"
            fill="#E0F2FE"
            stroke="#0284C7"
            strokeWidth="2.5"
            opacity="0.9"
          />
          {/* Cup Brand label */}
          <rect x="58" y="85" width="44" height="26" rx="4" fill="#0284C7" />
          <text x="80" y="102" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="900" fontFamily="sans-serif">
            CHOICE
          </text>

          {/* McFlurry Mixing Spoon Stick */}
          <rect x="94" y="12" width="8" height="60" rx="3" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" transform="rotate(22 98 42)" />
        </svg>

        <span className="absolute bottom-2 right-3 text-[10px] font-bold bg-sky-600 text-white px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wide">
          7-Step Swirl
        </span>
      </div>
    );
  }

  if (type === 'nuggets') {
    return (
      <div className={`relative flex items-center justify-center p-4 bg-gradient-to-b from-amber-50 to-yellow-100/70 rounded-2xl overflow-hidden ${className}`}>
        <svg viewBox="0 0 160 140" className="w-full h-full max-h-40 drop-shadow-[0_12px_14px_rgba(217,119,6,0.2)]">
          {/* Open box */}
          <polygon points="20,70 140,70 128,132 32,132" fill="#F59E0B" stroke="#B45309" strokeWidth="2.5" />
          <path d="M20 70L28 32H132L140 70" fill="#FBBF24" stroke="#B45309" strokeWidth="2" opacity="0.6" />

          {/* Crispy Golden Nuggets (9 pieces) */}
          <path d="M38 72C32 60 48 48 60 56C68 62 62 76 48 76C42 76 39 74 38 72Z" fill="#D97706" stroke="#92400E" strokeWidth="1.5" />
          <path d="M64 52C58 40 78 36 86 44C94 52 86 64 74 64C68 64 65 58 64 52Z" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
          <path d="M92 56C86 45 106 40 116 48C124 55 118 68 104 68C98 68 94 62 92 56Z" fill="#D97706" stroke="#92400E" strokeWidth="1.5" />
          
          <ellipse cx="50" cy="88" rx="16" ry="12" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
          <ellipse cx="80" cy="85" rx="18" ry="13" fill="#D97706" stroke="#92400E" strokeWidth="1.5" />
          <ellipse cx="110" cy="88" rx="16" ry="12" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
          <ellipse cx="65" cy="108" rx="17" ry="11" fill="#D97706" stroke="#92400E" strokeWidth="1.5" />
          <ellipse cx="95" cy="108" rx="17" ry="11" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />

          {/* Barbeque dip cup */}
          <rect x="68" y="112" width="24" height="16" rx="3" fill="#7F1D1D" stroke="#450A0A" strokeWidth="1" />
        </svg>

        <span className="absolute bottom-2 right-3 text-[10px] font-bold bg-amber-600 text-white px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wide">
          9 Pcs Box
        </span>
      </div>
    );
  }

  // Fallback combo tray
  return (
    <div className={`relative flex items-center justify-center p-4 bg-gradient-to-b from-red-50 to-amber-100 rounded-2xl overflow-hidden ${className}`}>
      <svg viewBox="0 0 160 140" className="w-full h-full max-h-40 drop-shadow-[0_12px_14px_rgba(185,28,28,0.25)]">
        {/* Fast-Food Plastic Red Serving Tray */}
        <rect x="10" y="70" width="140" height="62" rx="8" fill="#B91C1C" stroke="#7F1D1D" strokeWidth="3" />
        <rect x="16" y="76" width="128" height="50" rx="4" fill="#DC2626" />

        {/* Paper Liner on Tray */}
        <rect x="22" y="80" width="116" height="42" fill="#FEF3C7" stroke="#FDE68A" strokeWidth="1" />

        {/* Soda Drink Cup with Straw */}
        <path d="M102 38L106 90H124L128 38H102Z" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
        <rect x="100" y="34" width="30" height="6" rx="2" fill="#DC2626" />
        <path d="M115 14L115 34" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" />
        <path d="M115 14L124 8" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" />

        {/* Mini Burger on Tray */}
        <path d="M30 64C30 46 48 38 65 38C82 38 100 46 100 64H30Z" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" />
        <rect x="28" y="64" width="74" height="6" fill="#10B981" />
        <rect x="28" y="70" width="74" height="8" rx="3" fill="#78350F" />
        <rect x="30" y="78" width="70" height="8" rx="3" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" />

        {/* Mini Fries Bag */}
        <path d="M82 48L88 84H102L108 48Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
        <rect x="88" y="34" width="4" height="24" fill="#FBBF24" />
        <rect x="94" y="30" width="4" height="26" fill="#FBBF24" />
        <rect x="100" y="36" width="4" height="20" fill="#FBBF24" />
      </svg>

      <span className="absolute bottom-2 right-3 text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wide">
        Combo Feast
      </span>
    </div>
  );
};
