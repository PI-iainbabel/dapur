import React, { useState, useRef } from 'react';
import { MenuItem } from '../types';
import { DEFAULT_PORTIONS, CONDIMENT_OPTIONS } from '../data/menuItems';
import { X, Upload, FileUp, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMenuItem: (item: MenuItem) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onAddMenuItem,
}) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [foodName, setFoodName] = useState('');
  const [foodType, setFoodType] = useState<MenuItem['foodType']>('burger');
  const [description, setDescription] = useState('');
  const [estimatedMinutes, setEstimatedMinutes] = useState(15);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [uploadedFileUrl, setUploadedFileUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFileSize(`${Math.round(file.size / 1024)} KB`);
      if (!title) {
        setTitle(`Menu Baru: ${file.name.replace(/\.[^/.]+$/, '')}`);
      }
      if (!foodName) {
        setFoodName('Burger Spesial Tambahan');
      }
      // Create local object URL for preview
      const url = URL.createObjectURL(file);
      setUploadedFileUrl(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !fileName) return;

    const newItem: MenuItem = {
      id: `custom-menu-${Date.now()}`,
      title,
      subtitle: subtitle || 'Dokumen Terunggah Pengguna',
      foodName: foodName || 'Menu Kustom Pengguna',
      foodType,
      categoryId: 'decks',
      priceDisplay: '0 Rupiah / Gratis',
      originalPrice: 'Rp 100.000',
      cognitiveCalories: estimatedMinutes * 10,
      estimatedMinutes,
      description: description || 'Materi dokumen publik tambahan yang disajikan dalam etalase Drive-Thru McBehavior.',
      tasteNotes: 'Kombinasi bahan segar terunggah yang siap disantap para pemikir kritis.',
      includedBiases: ['Self-Determination', 'Customization', 'IKEA Effect'],
      cognitiveNutrition: {
        protein: 'Kustomisasi Pengguna',
        carbs: 'Format Langsung',
        fat: '0% Sludge',
        fiber: 'Kaya Praktik',
      },
      filePath: uploadedFileUrl || '/materials/dari-intensi-ke-aksi-syariah-ai.html',
      fileName,
      fileSize: fileSize || '35 KB',
      availablePortions: DEFAULT_PORTIONS,
      availableCondiments: CONDIMENT_OPTIONS,
    };

    onAddMenuItem(newItem);
    onClose();
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
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden z-10"
        >
          {/* Header */}
          <div className="bg-[#DA291C] text-white p-4 sm:p-5 flex items-center justify-between border-b-2 border-red-800">
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-red-950 px-2 py-0.5 rounded text-xs font-black uppercase font-mono">
                Loket Dapur Terbuka
              </span>
              <h3 className="text-base font-black font-['Space_Grotesk']">
                Tambah Dokumen ke Daftar Menu
              </h3>
            </div>
            <button onClick={onClose} className="text-white hover:text-amber-200">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
            {/* File Drag / Drop Box */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-amber-400 hover:border-[#DA291C] bg-amber-50/60 hover:bg-amber-50 p-6 rounded-2xl text-center cursor-pointer transition-all"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".html,.htm,.pdf,.txt,.md"
                onChange={handleFileChange}
                className="hidden"
              />
              <FileUp className="w-8 h-8 text-[#DA291C] mx-auto mb-2" />
              {fileName ? (
                <div className="flex flex-col items-center">
                  <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {fileName} ({fileSize})
                  </span>
                  <span className="text-[11px] text-slate-500 mt-1">
                    Klik untuk mengganti berkas
                  </span>
                </div>
              ) : (
                <div>
                  <p className="text-xs font-extrabold text-slate-800">
                    Klik atau seret berkas materi ke sini (HTML, PDF, Markdown, dsb.)
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Berkas akan otomatis diolah menjadi menu makan siang cepat saji
                  </p>
                </div>
              )}
            </div>

            {/* Title & Food Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Menu Parodi Makanan
                </label>
                <input
                  type="text"
                  required
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  placeholder="Misal: Burger Heuristik Pedas"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DA291C]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pilih Jenis Sajian
                </label>
                <select
                  value={foodType}
                  onChange={(e) => setFoodType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DA291C] bg-white"
                >
                  <option value="burger">🍔 Burger (Materi Utama)</option>
                  <option value="fries">🍟 Kentang (Visual &amp; Diagram)</option>
                  <option value="dessert">🍦 Dessert (Engine &amp; Simulasi)</option>
                  <option value="nuggets">🍗 Nuggets (Snack Ringkas)</option>
                </select>
              </div>
            </div>

            {/* Document Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Judul Lengkap Materi Dokumen
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Misal: Studi Kasus Nudge di Perbankan Syariah"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DA291C]"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Deskripsi Singkat / Analogi Rasa
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Jelaskan ringkasan materi dan pesan utama yang bisa dipelajari pembaca..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DA291C]"
              />
            </div>

            {/* Reading Minutes */}
            <div className="flex items-center gap-3 bg-amber-50 p-3 rounded-xl border border-amber-200">
              <label className="text-xs font-bold text-slate-700 shrink-0">
                Waktu Santap Baca:
              </label>
              <input
                type="range"
                min="5"
                max="60"
                step="5"
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                className="flex-1 accent-[#DA291C]"
              />
              <span className="text-xs font-black text-[#DA291C] font-mono min-w-[60px] text-right">
                {estimatedMinutes} Menit ({estimatedMinutes * 10} kkal)
              </span>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={!fileName || !title}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#DA291C] to-[#B91C1C] hover:from-red-600 hover:to-red-800 disabled:opacity-50 text-white font-black text-xs shadow-md shadow-red-600/30 flex items-center gap-2"
              >
                <Upload className="w-4 h-4 text-amber-300" />
                <span>Sajikan ke Menu Dashboard</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
