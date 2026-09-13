import React, { useState } from 'react';
import { BIAS_ANALOGIES } from '../data/biasAnalogies';
import { BiasAnalogy } from '../types';
import { Sparkles, ChevronDown, ChevronUp, Lightbulb, CheckCircle2, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const BiasAnalogySection: React.FC = () => {
  const [selectedAnalogy, setSelectedAnalogy] = useState<string>(BIAS_ANALOGIES[0].id);

  return (
    <section className="my-12 bg-gradient-to-b from-amber-50/70 via-white to-orange-50/60 rounded-3xl border-2 border-amber-300 p-6 sm:p-8 shadow-sm">
      {/* Section Title */}
      <div className="max-w-3xl mb-8">
        <div className="inline-flex items-center gap-2 bg-red-100 text-[#DA291C] px-3 py-1 rounded-full text-xs font-black uppercase font-mono tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-red-600" />
          Kajian Khusus: Restoran Cepat Saji × Bias Kognitif
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Space_Grotesk'] tracking-tight">
          Mengapa Menu Restoran Cepat Saji adalah{' '}
          <span className="text-[#DA291C] underline decoration-amber-400 decoration-wavy">
            Laboratorium Bias Kognitif
          </span>{' '}
          Terhebat di Dunia?
        </h2>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
          Pernahkah Anda bertanya mengapa Anda berniat membeli burger kecil, namun keluar kasir membawa paket jumbo lengkap dengan kentang dan soda besar? Itu bukan kebetulan — itu adalah <strong>Arsitektur Pilihan (Choice Architecture)</strong> yang bekerja sempurna pada System 1 manusia.
        </p>
      </div>

      {/* Grid of Analogies */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: List of 7 Key Tactics */}
        <div className="lg:col-span-1 space-y-2.5">
          <p className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-2">
            Pilih Taktik Restoran:
          </p>
          {BIAS_ANALOGIES.map((item) => {
            const isSelected = selectedAnalogy === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedAnalogy(item.id)}
                className={`w-full p-3.5 rounded-2xl text-left border-2 transition-all flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-[#DA291C] text-white border-red-800 shadow-md shadow-red-700/20 scale-[1.02]'
                    : 'bg-white border-amber-200 text-slate-800 hover:bg-amber-100/50 hover:border-amber-300'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-2xl shrink-0 p-1 bg-amber-100/80 rounded-xl text-slate-900">
                    {item.icon}
                  </span>
                  <div className="min-w-0">
                    <span
                      className={`text-xs font-extrabold block truncate leading-tight ${
                        isSelected ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {item.restaurantElement}
                    </span>
                    <span
                      className={`text-[11px] block truncate mt-0.5 ${
                        isSelected ? 'text-amber-200' : 'text-slate-500'
                      }`}
                    >
                      Bias: {item.biasConcept}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Deep-dive Explanation Panel */}
        <div className="lg:col-span-2">
          {(() => {
            const activeItem =
              BIAS_ANALOGIES.find((a) => a.id === selectedAnalogy) || BIAS_ANALOGIES[0];

            return (
              <motion.div
                key={activeItem.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="bg-white rounded-3xl border-2 border-amber-300 p-6 sm:p-7 shadow-md flex flex-col justify-between h-full space-y-5"
              >
                <div>
                  {/* Category Pill */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <span className="text-xs font-mono font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-full flex items-center gap-1.5">
                      <span>{activeItem.icon}</span>
                      <span>{activeItem.restaurantElement}</span>
                    </span>
                    <span className="text-xs font-mono text-red-600 font-bold">
                      Istilah Ilmiah: {activeItem.scientificTerm}
                    </span>
                  </div>

                  {/* Core Heading */}
                  <h3 className="text-xl font-black text-slate-900 font-['Space_Grotesk'] mt-3">
                    {activeItem.biasConcept}
                  </h3>

                  {/* Fast food tactic description */}
                  <div className="bg-red-50/80 rounded-2xl p-4 border border-red-200 my-4">
                    <div className="text-xs font-bold text-red-800 uppercase tracking-wider font-mono mb-1">
                      🍟 Taktik di Meja Kasir Resto:
                    </div>
                    <p className="text-sm font-semibold text-red-950 italic">
                      &quot;{activeItem.fastFoodTactic}&quot;
                    </p>
                  </div>

                  {/* Psychological Explanation */}
                  <div className="space-y-3 text-slate-700 text-sm leading-relaxed">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider font-mono text-amber-800">
                        🧠 Mekanisme Otak (System 1 vs System 2):
                      </h4>
                      <p className="mt-1 text-slate-600">
                        {activeItem.explanation}
                      </p>
                    </div>

                    {/* Analogy in Document & Dashboard Delivery */}
                    <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80">
                      <h4 className="font-extrabold text-amber-900 text-xs uppercase tracking-wider font-mono flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                        Penerapannya dalam Distribusi Materi Ini:
                      </h4>
                      <p className="mt-1 text-xs text-amber-950 leading-relaxed">
                        {activeItem.realWorldExample}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Practical Takeaway Banner */}
                <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-emerald-900 font-mono uppercase tracking-wider">
                      Takeaway untuk Pembuat Kebijakan &amp; Praktisi:
                    </h5>
                    <p className="text-xs text-emerald-800 mt-0.5 leading-snug">
                      {activeItem.practicalTakeaway}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })()}
        </div>
      </div>
    </section>
  );
};
