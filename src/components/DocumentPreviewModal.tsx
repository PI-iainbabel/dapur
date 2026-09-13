import React from 'react';
import { MenuItem } from '../types';
import { X, ExternalLink, Download, FileText, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DocumentPreviewModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (item: MenuItem) => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  item,
  isOpen,
  onClose,
  onDownload,
}) => {
  if (!item) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
          />

          {/* Modal Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white w-full max-w-5xl h-[90vh] rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden z-10 flex flex-col"
          >
            {/* Modal Header */}
            <div className="bg-[#DA291C] text-white p-3 sm:p-4 flex items-center justify-between border-b-2 border-red-800 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="bg-amber-400 text-red-950 px-2 py-0.5 rounded text-xs font-black uppercase font-mono">
                  Cicipi Menu (Live Preview)
                </span>
                <h3 className="text-sm sm:text-base font-black truncate font-['Space_Grotesk'] text-white">
                  {item.title}
                </h3>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={item.filePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-red-800 hover:bg-red-900 text-amber-200 rounded-xl text-xs font-bold transition-colors border border-red-700"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buka di Tab Baru</span>
                </a>
                <button
                  onClick={() => onDownload(item)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-red-950 rounded-xl text-xs font-black transition-colors shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Pesan &amp; Unduh</span>
                </button>
                <button
                  onClick={onClose}
                  className="bg-red-900/80 hover:bg-red-950 text-white p-1.5 rounded-full transition-colors ml-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Sub-bar with document info */}
            <div className="bg-amber-50 px-4 py-2 border-b border-amber-200 flex flex-wrap items-center justify-between text-xs text-amber-950 shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-700" />
                <span className="font-mono font-bold">{item.fileName}</span>
                <span className="text-slate-400">({item.fileSize})</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-slate-600">
                <span>⏱️ {item.estimatedMinutes} Menit Santap</span>
                <span>•</span>
                <span>🔥 {item.cognitiveCalories} kkal Fokus</span>
                <span>•</span>
                <span className="text-emerald-700 font-bold">100% Bebas Sludge</span>
              </div>
            </div>

            {/* Live Interactive Iframe Preview */}
            <div className="flex-1 bg-slate-900 overflow-hidden relative">
              <iframe
                src={item.filePath}
                title={item.title}
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
