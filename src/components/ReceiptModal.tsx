import React from 'react';
import { CartItem } from '../types';
import { X, Printer, Download, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onDownloadAll: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onDownloadAll,
}) => {
  if (!isOpen) return null;

  const orderNumber = Math.floor(1000 + Math.random() * 9000);
  const totalCalories = cartItems.reduce(
    (acc, curr) => acc + curr.item.cognitiveCalories * curr.quantity,
    0
  );
  const totalMinutes = cartItems.reduce(
    (acc, curr) => acc + curr.item.estimatedMinutes * curr.quantity,
    0
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden z-10 my-8 border border-slate-300"
        >
          {/* Header Bar */}
          <div className="bg-[#DA291C] text-white px-4 py-2.5 flex items-center justify-between">
            <span className="text-xs font-black font-mono tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              STRUK KASIR DRIVE-THRU MCBEHAVIOR
            </span>
            <button onClick={onClose} className="text-white hover:text-amber-200">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Thermal Receipt Paper Effect */}
          <div className="p-6 font-mono text-xs text-slate-800 bg-[#FFFDF9] space-y-4">
            {/* Receipt Header */}
            <div className="text-center pb-4 border-b-2 border-dashed border-slate-300">
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                〽️ McBehavior Economics
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Restoran Cepat Saji Wawasan &amp; Keputusan Publik
              </p>
              <p className="text-[10px] text-slate-400">
                Jl. Nudge Bebas Sludge No. 2026, Cloud Run
              </p>
              <div className="mt-2 text-[11px] font-bold text-slate-700">
                <span>PESANAN #{orderNumber}</span> • <span>LOKET 01 DRIVE-THRU</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {new Date().toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            {/* Receipt Order Items */}
            <div className="space-y-3 py-2 border-b-2 border-dashed border-slate-300">
              <div className="flex justify-between font-bold text-[11px] text-slate-500 uppercase pb-1 border-b border-slate-200">
                <span>Item Materi</span>
                <span>Biaya</span>
              </div>

              {cartItems.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span className="truncate pr-2">
                      {item.quantity}x {item.item.foodName}
                    </span>
                    <span>Rp 0</span>
                  </div>
                  <div className="text-[10px] text-slate-500 pl-3">
                    • Porsi: {item.customization.portion.name}
                  </div>
                  <div className="text-[10px] text-slate-500 pl-3">
                    • Format: {item.customization.format.name} ({item.item.fileName})
                  </div>
                  {item.customization.selectedCondiments.length > 0 && (
                    <div className="text-[10px] text-amber-700 pl-3">
                      • Saus: {item.customization.selectedCondiments.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Total Summary */}
            <div className="space-y-1.5 py-2 border-b-2 border-dashed border-slate-300">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal Diskon (100% Sunk Cost):</span>
                <span className="line-through">Rp 750.000</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Pajak Kognitif (PPN Sludge):</span>
                <span>Rp 0 (Bebas Riba)</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Waktu Santap Baca:</span>
                <span className="font-bold">{totalMinutes} Menit</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>TOTAL DIBAYAR:</span>
                <span className="text-[#DA291C]">0 RUPIAH</span>
              </div>
              <div className="text-[10px] text-emerald-700 text-right font-bold">
                ✓ Dibayar lunas dengan komitmen niat baik
              </div>
            </div>

            {/* Cognitive Nutrition Summary */}
            <div className="bg-amber-50 p-2.5 rounded border border-amber-200 text-[11px] text-amber-900 space-y-1">
              <div className="font-bold">📊 Nilai Gizi Intelektual:</div>
              <div className="flex justify-between text-[10px]">
                <span>Total Kalori Fokus:</span>
                <span className="font-bold">{totalCalories} kkal</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span>Kadar Lemak Sludge:</span>
                <span className="font-bold text-emerald-700">0% (Bersih &amp; Terbuka)</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span>Serat Kebijakan Publik:</span>
                <span className="font-bold">100% Kaya Manfaat</span>
              </div>
            </div>

            {/* Quote of the day & Barcode */}
            <div className="text-center pt-2 space-y-2">
              <p className="text-[10px] text-slate-500 italic">
                &quot;Diagnosis dulu, baru intervensi. Mengubah lingkungan lebih murah daripada memaksakan kehendak.&quot;
              </p>
              
              {/* Fake thermal barcode */}
              <div className="flex justify-center items-center py-1">
                <div className="font-mono text-lg tracking-[6px] text-slate-700 select-all font-bold">
                  ||| | |||| | ||| || ||| |
                </div>
              </div>
              <p className="text-[9px] text-slate-400">
                Simpan struk ini sebagai bukti bahwa Anda telah melangkah dari intensi ke aksi.
              </p>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="bg-slate-100 p-4 border-t border-slate-200 flex items-center justify-between gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Struk</span>
            </button>

            <button
              onClick={onDownloadAll}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#DA291C] to-[#B91C1C] hover:from-red-600 hover:to-red-800 text-white font-black text-xs shadow-md shadow-red-600/30 active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-amber-300" />
              <span>Unduh Semua Berkas Sekarang</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
