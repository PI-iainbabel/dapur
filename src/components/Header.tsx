import React from 'react';
import { ParodyLogo } from './ParodyLogo';
import { BookOpen, ShoppingBag, PlusCircle, Search, Sparkles, ChefHat } from 'lucide-react';
import { motion } from 'motion/react';

interface HeaderProps {
  cartCount: number;
  totalCalories: number;
  onOpenCart: () => void;
  onOpenBiasGuide: () => void;
  onOpenUpload: () => void;
  onOpenChat: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  totalCalories,
  onOpenCart,
  onOpenBiasGuide,
  onOpenUpload,
  onOpenChat,
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-amber-300 shadow-xs">
      {/* Top Fast-Food Marquee / Promo Bar */}
      <div className="bg-[#DA291C] text-white py-1.5 px-4 text-xs font-semibold overflow-hidden border-b border-red-700">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
            <span className="bg-amber-400 text-red-950 font-black px-1.5 py-0.2 rounded text-[10px] uppercase font-mono">
              PROMO BEBAS RIBA
            </span>
            <span className="text-amber-100 flex items-center gap-1 text-[11px] sm:text-xs">
              🍟 100% Bebas Sludge & Birokrasi • Saji Cepat 1-Klik &quot;Pesan Sekarang&quot; • Diskon Biaya Kognitif 100%!
            </span>
          </div>
          <div className="hidden md:flex items-center gap-3 text-[11px] text-amber-200">
            <span>Drive-Thru 24/7 Terbuka untuk Publik</span>
            <span className="text-amber-400 font-mono">★ 4.9 (12.4K Reviewers)</span>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <ParodyLogo size="md" />
        </div>

        {/* Search Bar Styled like Drive-thru Order Mic */}
        <div className="flex-1 max-w-md min-w-[220px] relative order-3 sm:order-2">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-600" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari menu materi (misal: Maqashid, BWC, SVG, AHP)..."
              className="w-full pl-10 pr-4 py-2 bg-amber-50/70 border border-amber-300/80 rounded-full text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#DA291C] focus:bg-white transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5 order-2 sm:order-3">
          {/* Intercom Drive-Thru Chatbot Button */}
          <button
            onClick={onOpenChat}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-black text-red-950 bg-amber-400 hover:bg-amber-500 border border-amber-500 transition-all hover:shadow-xs active:scale-95 animate-pulse"
            style={{ animationDuration: '3s' }}
            title="Chat Intercom Drive-Thru bersama Kang Nudge (Kasir Nyentrik & Ngeyel)"
          >
            <ChefHat className="w-4 h-4 text-red-900" />
            <span className="hidden sm:inline">Tanya Kasir Nyentrik</span>
            <span className="sm:hidden">Kasir</span>
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
          </button>

          {/* Philosophy / Bias Analogy Modal Button */}
          <button
            onClick={onOpenBiasGuide}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 transition-all hover:shadow-xs active:scale-95"
            title="Pelajari mengapa menu restoran cepat saji adalah laboratorium bias kognitif"
          >
            <Sparkles className="w-4 h-4 text-amber-600 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="hidden lg:inline">Filosofi Menu Resto</span>
            <span className="lg:hidden hidden sm:inline">Filosofi</span>
          </button>

          {/* Upload New Document Button */}
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-all active:scale-95"
            title="Tambah berkas dokumen baru ke daftar menu"
          >
            <PlusCircle className="w-4 h-4 text-slate-600" />
            <span className="hidden xl:inline">Tambah Menu</span>
          </button>

          {/* Unique McDelivery Tray / Cart Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenCart}
            id="cart-trigger-button"
            className="relative flex items-center gap-2.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#DA291C] to-[#C8102E] text-white font-bold text-sm shadow-md shadow-red-600/30 border border-red-500 hover:from-red-600 hover:to-red-700 transition-all"
          >
            {/* Fast-Food Bag / Tray Graphic Icon */}
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-amber-300" />
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute -top-2.5 -right-2.5 bg-amber-400 text-red-950 text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#DA291C] shadow-xs"
                >
                  {cartCount}
                </motion.span>
              )}
            </div>

            <div className="flex flex-col text-left leading-tight">
              <span className="text-[10px] text-amber-200 uppercase font-mono tracking-wider font-semibold">
                Baki Pesanan
              </span>
              <span className="text-xs font-black tracking-tight">
                {cartCount > 0 ? `${cartCount} Menu (${totalCalories} kkal)` : 'Kosong'}
              </span>
            </div>
          </motion.button>
        </div>
      </div>
    </header>
  );
};
