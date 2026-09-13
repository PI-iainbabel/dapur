import React, { useState } from 'react';
import { MenuItem, PortionOption, FileFormatOption, OrderItemCustomization } from '../types';
import { FoodVisual } from './FoodVisual';
import { X, Check, Flame, Package, Clock, ShieldCheck, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CustomizeModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmOrder: (
    item: MenuItem,
    customization: OrderItemCustomization,
    coords?: { x: number; y: number }
  ) => void;
}

const FILE_FORMATS: FileFormatOption[] = [
  {
    id: 'html',
    name: 'Dokumen HTML Standalone (Offline)',
    extension: '.html',
    description: 'Bisa dibuka langsung di Chrome/Safari/Edge tanpa koneksi internet, lengkap dengan visual SVG interaktif.',
  },
  {
    id: 'md',
    name: 'Teks Ringkas Markdown',
    extension: '.md',
    description: 'Format teks murni terstruktur cocok untuk Notion, Obsidian, GitHub, atau konteks prompt AI.',
  },
  {
    id: 'bundle',
    name: 'Paket Komplit (HTML + Catatan + Diagram)',
    extension: '.html (full)',
    description: 'Seluruh isi berkas lengkap dengan struk kasir dan panduan implementasi kebijakan.',
  },
];

export const CustomizeModal: React.FC<CustomizeModalProps> = ({
  item,
  isOpen,
  onClose,
  onConfirmOrder,
}) => {
  if (!item) return null;

  const [selectedPortion, setSelectedPortion] = useState<PortionOption>(
    item.availablePortions[1] || item.availablePortions[0]
  );
  const [selectedCondiments, setSelectedCondiments] = useState<string[]>([
    item.availableCondiments[0]?.id || '',
    item.availableCondiments[1]?.id || '',
  ].filter(Boolean));
  const [selectedFormat, setSelectedFormat] = useState<FileFormatOption>(FILE_FORMATS[0]);
  const [spiceLevel, setSpiceLevel] = useState<'mild' | 'medium' | 'spicy'>('medium');
  const [customNotes, setCustomNotes] = useState('');

  const toggleCondiment = (id: string) => {
    if (selectedCondiments.includes(id)) {
      setSelectedCondiments(selectedCondiments.filter((c) => c !== id));
    } else {
      setSelectedCondiments([...selectedCondiments, id]);
    }
  };

  const handleOrder = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const coords = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
    onConfirmOrder(
      item,
      {
        portion: selectedPortion,
        selectedCondiments,
        format: selectedFormat,
        spiceLevel,
        customNotes,
      },
      coords
    );
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden z-10 flex flex-col max-h-[90vh]"
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#DA291C] to-[#B91C1C] text-white p-4 sm:p-5 flex items-center justify-between border-b-2 border-red-800">
              <div className="flex items-center gap-2">
                <div className="bg-amber-400 text-red-950 px-2 py-0.5 rounded text-xs font-black uppercase font-mono">
                  Dapur Koki McBehavior
                </div>
                <h2 className="text-base sm:text-lg font-black font-['Space_Grotesk'] tracking-tight">
                  Kustomisasi Pesanan Menu
                </h2>
              </div>
              <button
                onClick={onClose}
                className="bg-red-800/80 hover:bg-red-900 text-amber-200 p-1.5 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
              {/* Product mini summary */}
              <div className="flex items-center gap-4 bg-amber-50/70 p-4 rounded-2xl border border-amber-200">
                <div className="w-20 h-20 shrink-0">
                  <FoodVisual type={item.foodType} className="w-20 h-20" />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-mono font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded uppercase">
                    {item.fileName}
                  </span>
                  <h3 className="text-base font-black text-slate-900 leading-snug mt-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* 1. Portion Size */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 font-mono mb-2">
                  1. Pilih Ukuran Porsi (Portion Size)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {item.availablePortions.map((portion) => {
                    const isSelected = selectedPortion.id === portion.id;
                    return (
                      <button
                        key={portion.id}
                        type="button"
                        onClick={() => setSelectedPortion(portion)}
                        className={`p-3 rounded-2xl text-left border-2 transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-red-50 border-[#DA291C] shadow-md shadow-red-100'
                            : 'bg-white border-slate-200 hover:border-amber-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="font-extrabold text-xs text-slate-900">
                              {portion.name}
                            </span>
                            {isSelected && (
                              <Check className="w-4 h-4 text-[#DA291C] stroke-[3]" />
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 leading-snug">
                            {portion.description}
                          </p>
                        </div>
                        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                          <span className="text-amber-700 font-bold flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {portion.readingTimeModifier}
                          </span>
                          <span className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-bold">
                            {portion.badge}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Condiments / Add-ons */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 font-mono mb-2">
                  2. Tambah Saus &amp; Topping Wawasan (Condiments)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {item.availableCondiments.map((condiment) => {
                    const isChecked = selectedCondiments.includes(condiment.id);
                    return (
                      <button
                        key={condiment.id}
                        type="button"
                        onClick={() => toggleCondiment(condiment.id)}
                        className={`p-3 rounded-xl text-left border transition-all flex items-start gap-3 ${
                          isChecked
                            ? 'bg-amber-50/80 border-amber-400 text-amber-950 font-medium'
                            : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                            isChecked
                              ? 'bg-[#DA291C] text-white'
                              : 'border-2 border-slate-300 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div className="flex-1">
                          <span className="text-xs font-bold block text-slate-900">
                            {condiment.name}
                          </span>
                          <span className="text-[11px] text-slate-500 leading-snug block">
                            {condiment.description}
                          </span>
                          <span className="text-[10px] text-red-600 font-semibold block mt-1">
                            Target: #{condiment.biasTarget}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Delivery / File Format */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 font-mono mb-2">
                  3. Format Kemasan Berkas (Packaging)
                </label>
                <div className="space-y-2">
                  {FILE_FORMATS.map((fmt) => {
                    const isSelected = selectedFormat.id === fmt.id;
                    return (
                      <button
                        key={fmt.id}
                        type="button"
                        onClick={() => setSelectedFormat(fmt)}
                        className={`w-full p-3 rounded-xl text-left border flex items-center justify-between gap-3 transition-all ${
                          isSelected
                            ? 'bg-red-50/80 border-[#DA291C] text-slate-900'
                            : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Package className={`w-4 h-4 ${isSelected ? 'text-[#DA291C]' : 'text-slate-400'}`} />
                          <div>
                            <span className="text-xs font-bold block text-slate-900">
                              {fmt.name}
                            </span>
                            <span className="text-[11px] text-slate-500 block">
                              {fmt.description}
                            </span>
                          </div>
                        </div>
                        <span className="text-[11px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-1 rounded">
                          {fmt.extension}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Analysis Spice Level */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 font-mono mb-2 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-red-600" />
                  4. Tingkat Kepedasan Analisis (Depth Level)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'mild', label: 'Ringan (Pemula)', desc: 'Fokus heuristik dasar & visual' },
                    { id: 'medium', label: 'Sedang (Praktisi)', desc: 'Framework COM-B & studi kasus' },
                    { id: 'spicy', label: 'Ekstra Pedas (Akademisi)', desc: 'Matriks AHP, BOCR & Fikih' },
                  ].map((level) => {
                    const isSelected = spiceLevel === level.id;
                    return (
                      <button
                        key={level.id}
                        type="button"
                        onClick={() => setSpiceLevel(level.id as any)}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          isSelected
                            ? 'bg-amber-100/80 border-amber-500 text-amber-950 font-bold shadow-xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <span className="text-xs font-black block">{level.label}</span>
                        <span className="text-[10px] text-slate-500 leading-tight block mt-0.5">
                          {level.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 5. Custom Notes */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 font-mono mb-1.5">
                  5. Catatan Khusus untuk Koki (Optional)
                </label>
                <input
                  type="text"
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="Misal: Mohon tambahkan studi kasus perbankan daerah atau tanpa rumus matematis rumit..."
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#DA291C]"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 p-4 sm:p-5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-col">
                <span className="text-[11px] text-slate-500">Estimasi Pengeluaran Kognitif:</span>
                <span className="text-sm font-black text-[#DA291C] font-mono">
                  {selectedPortion.readingTimeModifier} (0 Rupiah / 0 Riba)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleOrder}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#DA291C] to-[#B91C1C] hover:from-red-600 hover:to-red-800 text-white font-black text-xs shadow-md shadow-red-600/30 flex items-center gap-2 transition-all active:scale-95"
                >
                  <Check className="w-4 h-4 text-amber-300 stroke-[3]" />
                  <span>Simpan &amp; Pesan Sekarang</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
