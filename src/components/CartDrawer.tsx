import React from 'react';
import { CartItem } from '../types';
import { FoodVisual } from './FoodVisual';
import {
  X,
  Trash2,
  Download,
  Receipt,
  FileText,
  Clock,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  onDownloadSingle: (cartItem: CartItem) => void;
  onDownloadAll: () => void;
  onViewReceipt: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onRemoveItem,
  onClearCart,
  onDownloadSingle,
  onDownloadAll,
  onViewReceipt,
}) => {
  const totalCalories = cartItems.reduce(
    (acc, curr) => acc + curr.item.cognitiveCalories * curr.quantity,
    0
  );
  const totalMinutes = cartItems.reduce(
    (acc, curr) => acc + curr.item.estimatedMinutes * curr.quantity,
    0
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Container (Fast Food Takeaway Tray / Bag) */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="relative w-full max-w-md bg-[#FFFDF7] h-full shadow-2xl border-l-4 border-amber-400 z-10 flex flex-col"
          >
            {/* Drawer Header (Fast-Food Tray Header) */}
            <div className="bg-[#DA291C] text-white p-4 sm:p-5 flex items-center justify-between border-b-2 border-red-800 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-400 text-red-950 flex items-center justify-center font-black shadow-md">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-black tracking-tight font-['Space_Grotesk'] leading-tight">
                    Baki Pesanan Anda
                  </h2>
                  <p className="text-[11px] text-amber-200 font-sans">
                    Nampan Siap Saji Materi Behavioral
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="bg-red-800/80 hover:bg-red-900 text-amber-100 p-2 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nutrition & Reading Time Meter Bar */}
            <div className="bg-amber-100/90 border-b border-amber-300 p-3 flex items-center justify-between text-xs font-mono text-amber-950">
              <span className="flex items-center gap-1 font-bold">
                <Clock className="w-3.5 h-3.5 text-amber-800" />
                Total: {totalMinutes} Menit Santap
              </span>
              <span className="bg-amber-300/80 text-red-950 font-black px-2 py-0.5 rounded-full text-[11px]">
                {totalCalories} kkal Wawasan
              </span>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                  <div className="w-20 h-20 rounded-full bg-amber-50 border-2 border-dashed border-amber-300 flex items-center justify-center text-3xl mb-3">
                    🍟
                  </div>
                  <h3 className="text-base font-black text-slate-700">
                    Baki Pesanan Masih Kosong!
                  </h3>
                  <p className="text-xs text-slate-500 max-w-xs mt-1">
                    Silakan pilih menu materi di etalase dan klik &quot;Pesan Sekarang&quot; untuk menyantap wawasan bebas biaya.
                  </p>
                </div>
              ) : (
                cartItems.map((cartItem) => (
                  <motion.div
                    key={cartItem.cartItemId}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, x: 50 }}
                    className="bg-white rounded-2xl border-2 border-amber-200/90 p-3.5 shadow-xs relative flex gap-3 group"
                  >
                    {/* Visual Thumbnail */}
                    <div className="w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-amber-50 border border-amber-200 flex items-center justify-center p-1">
                      <FoodVisual type={cartItem.item.foodType} className="w-14 h-14" />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-xs font-black text-slate-900 truncate leading-snug">
                            {cartItem.item.title}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(cartItem.cartItemId)}
                            className="text-slate-400 hover:text-red-600 transition-colors p-1"
                            title="Hapus dari baki"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Customization Details */}
                        <div className="text-[11px] text-slate-500 mt-1 space-y-0.5">
                          <div className="flex items-center gap-1 text-amber-800 font-bold">
                            <span>📦 {cartItem.customization.portion.name}</span>
                          </div>
                          <div className="flex items-center gap-1 text-slate-500 text-[10px]">
                            <span>📄 Format: {cartItem.customization.format.extension}</span>
                            <span>•</span>
                            <span>Level: {cartItem.customization.spiceLevel}</span>
                          </div>
                          {cartItem.customization.selectedCondiments.length > 0 && (
                            <div className="text-[10px] text-red-600 truncate">
                              + {cartItem.customization.selectedCondiments.length} Saus Ekstra
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Item Bottom Action */}
                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] font-bold text-emerald-700 font-mono">
                          Gratis (0 Riba)
                        </span>
                        <button
                          onClick={() => onDownloadSingle(cartItem)}
                          className="flex items-center gap-1 text-[11px] font-bold text-[#DA291C] hover:text-red-800 bg-red-50 hover:bg-red-100 px-2 py-1 rounded-lg transition-colors border border-red-200"
                        >
                          <Download className="w-3 h-3" />
                          <span>Unduh Berkas</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Drawer Footer & Checkout Controls */}
            {cartItems.length > 0 && (
              <div className="bg-white p-4 border-t-2 border-amber-200 space-y-3 shadow-lg">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-bold text-slate-600">
                    Total Biaya Finansial:
                  </span>
                  <div className="text-right">
                    <span className="text-xs line-through text-slate-400 font-mono block">
                      Rp 750.000
                    </span>
                    <span className="text-base font-black text-[#DA291C] font-mono leading-none">
                      0 Rupiah / 100% Bebas Riba
                    </span>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={onViewReceipt}
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-amber-400 bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold text-xs transition-all shadow-xs"
                  >
                    <Receipt className="w-4 h-4 text-amber-700" />
                    <span>Lihat Struk Kasir</span>
                  </button>

                  <button
                    onClick={onDownloadAll}
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-gradient-to-r from-[#DA291C] to-[#B91C1C] hover:from-red-600 hover:to-red-800 text-white font-black text-xs shadow-md shadow-red-600/30 transition-all active:scale-95"
                  >
                    <Download className="w-4 h-4 text-amber-300" />
                    <span>Bungkus Semua</span>
                  </button>
                </div>

                {/* Clear Cart Button */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>✓ Siap dibawa pulang secara offline</span>
                  <button
                    onClick={onClearCart}
                    className="text-slate-400 hover:text-red-600 font-medium underline"
                  >
                    Kosongkan baki
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
