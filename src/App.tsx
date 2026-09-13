import React, { useState, useMemo } from 'react';
import { MenuItem, CategoryId, CartItem, OrderItemCustomization } from './types';
import { MENU_ITEMS, DEFAULT_PORTIONS } from './data/menuItems';
import { Header } from './components/Header';
import { CategoryNav } from './components/CategoryNav';
import { MenuCard } from './components/MenuCard';
import { CustomizeModal } from './components/CustomizeModal';
import { CartDrawer } from './components/CartDrawer';
import { ReceiptModal } from './components/ReceiptModal';
import { BiasAnalogySection } from './components/BiasAnalogySection';
import { DocumentPreviewModal } from './components/DocumentPreviewModal';
import { UploadModal } from './components/UploadModal';
import { AdminChatModal } from './components/AdminChatModal';
import { FloatingChatTrigger } from './components/FloatingChatTrigger';
import { FlavorExplosion, ExplosionTrigger, ExplosionMode } from './components/FlavorExplosion';
import {
  Sparkles,
  ShoppingBag,
  Flame,
  CheckCircle2,
  Clock,
  Download,
  FileCheck2,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MENU_ITEMS);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals and animation state
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [previewingItem, setPreviewingItem] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [lastDownloadTime, setLastDownloadTime] = useState<Date | null>(null);

  // Particle explosion & drama mode state
  const [explosionTriggers, setExplosionTriggers] = useState<ExplosionTrigger[]>([]);
  const [selectedEffectMode, setSelectedEffectMode] = useState<ExplosionMode>('flavor');

  const triggerExplosion = (
    coords?: { x: number; y: number },
    foodType: string = 'burger',
    mode?: ExplosionMode
  ) => {
    const triggerX = coords?.x ?? window.innerWidth / 2;
    const triggerY = coords?.y ?? window.innerHeight / 2;
    const newTrigger: ExplosionTrigger = {
      id: `expl-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      x: triggerX,
      y: triggerY,
      foodType,
      mode: mode || selectedEffectMode,
    };
    setExplosionTriggers((prev) => [...prev.slice(-5), newTrigger]);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<CategoryId, number> = {
      all: menuItems.length,
      pibi: menuItems.filter((m) => m.categoryId === 'pibi').length,
      combo: menuItems.filter((m) => m.categoryId === 'combo').length,
      decks: menuItems.filter((m) => m.categoryId === 'decks').length,
      visuals: menuItems.filter((m) => m.categoryId === 'visuals').length,
      engines: menuItems.filter((m) => m.categoryId === 'engines').length,
      snacks: menuItems.filter((m) => m.categoryId === 'snacks').length,
    };
    return counts;
  }, [menuItems]);

  // Filtered menu items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchCat =
        selectedCategory === 'all' || item.categoryId === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.subtitle.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.includedBiases.some((b) => b.toLowerCase().includes(query));
      return matchCat && matchSearch;
    });
  }, [menuItems, selectedCategory, searchQuery]);

  // Total cart stats
  const totalCartCount = useMemo(
    () => cartItems.reduce((acc, curr) => acc + curr.quantity, 0),
    [cartItems]
  );
  const totalCalories = useMemo(
    () =>
      cartItems.reduce(
        (acc, curr) => acc + curr.item.cognitiveCalories * curr.quantity,
        0
      ),
    [cartItems]
  );

  // Cart operations
  const handleAddToCart = (
    item: MenuItem,
    customization?: OrderItemCustomization,
    coords?: { x: number; y: number },
    mode?: ExplosionMode
  ) => {
    const customConfig: OrderItemCustomization = customization || {
      portion: item.availablePortions[1] || DEFAULT_PORTIONS[1],
      selectedCondiments: [item.availableCondiments[0]?.name || 'Format Lengkap'],
      format: {
        id: 'html',
        name: 'Dokumen HTML Standalone',
        extension: '.html',
        description: 'Bisa dibuka offline di browser apa pun.',
      },
      spiceLevel: 'medium',
    };

    const newItem: CartItem = {
      cartItemId: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      item,
      customization: customConfig,
      quantity: 1,
      addedAt: new Date(),
    };

    setCartItems((prev) => [newItem, ...prev]);

    // Trigger Particle / Confetti / Drama Explosion!
    const effectiveMode = mode || selectedEffectMode;
    triggerExplosion(coords, item.foodType, effectiveMode);

    if (effectiveMode === 'burn') {
      showToast(`🔥 Sizzle! "${item.foodName}" sempat gosong di fryer tapi diganti baru gratis!`);
    } else if (effectiveMode === 'drop') {
      showToast(`🧈 Bruukk! "${item.foodName}" jatuh ke lantai! Aturan 5 detik berhasil diselamatkan!`);
    } else {
      showToast(`💥 Ledakan Rasa! "${item.foodName}" renyah masuk ke Baki!`);
    }
  };

  const handleRemoveFromCart = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
    showToast('Baki pesanan telah dikosongkan.');
  };

  // Real download handlers
  const downloadFile = (filePath: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = filePath;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleQuickDownload = (item: MenuItem) => {
    downloadFile(item.filePath, item.fileName);
    setLastDownloadTime(new Date());
    showToast(`📥 Mengunduh "${item.fileName}" langsung ke perangkat Anda...`);
  };

  const handleDownloadSingle = (cartItem: CartItem) => {
    downloadFile(cartItem.item.filePath, cartItem.item.fileName);
    setLastDownloadTime(new Date());
    showToast(`📥 Mengunduh "${cartItem.item.fileName}"...`);
  };

  const handleDownloadAll = () => {
    const itemsToDownload = cartItems.length > 0 ? cartItems.map((c) => c.item) : menuItems;
    itemsToDownload.forEach((item, idx) => {
      setTimeout(() => {
        downloadFile(item.filePath, item.fileName);
      }, idx * 300);
    });
    setLastDownloadTime(new Date());
    showToast(`🎉 Mengunduh ${itemsToDownload.length} berkas materi ke perangkat Anda!`);
  };

  const handleAddCustomMenuItem = (newItem: MenuItem) => {
    setMenuItems((prev) => [newItem, ...prev]);
    showToast(`✨ Menu baru "${newItem.foodName}" berhasil ditambahkan ke etalase!`);
  };

  return (
    <div className="min-h-screen flex flex-col font-['Plus_Jakarta_Sans',sans-serif] bg-[#FFFDF7] text-slate-900">
      {/* Toast Notification with fast food styling */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#DA291C] text-white px-5 py-3 rounded-2xl shadow-xl border-2 border-amber-300 text-xs sm:text-sm font-bold flex items-center gap-2 max-w-md w-[90%]"
          >
            <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
            <span className="flex-1">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <Header
        cartCount={totalCartCount}
        totalCalories={totalCalories}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenBiasGuide={() => {
          const el = document.getElementById('bias-guide-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Category Navigation Bar */}
      <CategoryNav
        activeCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        counts={categoryCounts}
      />

      {/* Hero Drive-Thru Welcome Banner */}
      <section className="bg-gradient-to-r from-[#DA291C] via-[#C8102E] to-[#990000] text-white py-8 px-4 sm:px-6 relative overflow-hidden border-b-4 border-amber-400">
        <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-amber-400/15 rounded-full blur-2xl pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-amber-400 text-red-950 px-3 py-1 rounded-full text-xs font-black uppercase font-mono tracking-wider mb-3 shadow-md">
              <span>🍟 LOKET PESAN CEPAT SAJI</span>
              <span>•</span>
              <span>100% BEBAS BIAYA</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black font-['Space_Grotesk'] tracking-tight leading-tight">
              Pesan Menu Wawasan Behavioral Economics Sekarang.
            </h1>
            <p className="text-amber-100 text-xs sm:text-sm mt-2.5 leading-relaxed font-sans">
              Setiap berkas dokumen disajikan layaknya menu makan siang siap unduh. Lengkap dengan takaran kalori kognitif, pilihan porsi, saus studi kasus, dan nol friksi birokrasi.
            </p>
          </div>

          {/* Quick Stat Pill Cards */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-3 rounded-2xl text-center">
              <span className="text-[10px] uppercase font-mono text-amber-300 font-bold block">
                Total Kalori Wawasan
              </span>
              <span className="text-xl font-black font-mono">1.250 kkal</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-3 rounded-2xl text-center">
              <span className="text-[10px] uppercase font-mono text-amber-300 font-bold block">
                Kadar Riba &amp; Sludge
              </span>
              <span className="text-xl font-black font-mono text-emerald-400">0.0%</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-3 rounded-2xl text-center">
              <span className="text-[10px] uppercase font-mono text-amber-300 font-bold block">
                Kecepatan Saji
              </span>
              <span className="text-xl font-black font-mono text-amber-300">&lt; 1 Detik</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-10">
        {/* Active Filter & Count Header with Animation Drama Mode Selector */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-amber-200 pb-3">
          <div>
            <h2 className="text-xl font-black text-slate-900 font-['Space_Grotesk'] flex items-center gap-2">
              <span>Daftar Menu Santap Siang</span>
              <span className="text-xs bg-amber-400 text-red-950 font-mono font-bold px-2 py-0.5 rounded-full">
                {filteredItems.length} Pilihan
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Klik &quot;Kustomisasi&quot; untuk memilih porsi dan saus, atau langsung tekan &quot;Pesan Sekarang&quot; untuk mengunduh.
            </p>
          </div>

          {/* Interactive Flavor & Drama Animation Selector */}
          <div className="flex items-center gap-1 bg-amber-50/90 border border-amber-300 p-1.5 rounded-2xl shadow-xs">
            <span className="text-[11px] font-black uppercase text-amber-900 font-mono px-2 hidden sm:inline flex items-center gap-1">
              <span>✨ Efek Tombol:</span>
            </span>
            <button
              onClick={() => setSelectedEffectMode('flavor')}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                selectedEffectMode === 'flavor'
                  ? 'bg-[#DA291C] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-amber-100'
              }`}
              title="Efek Ledakan Rasa Konfeti Cepat Saji"
            >
              <span>💥</span>
              <span>Ledakan Rasa</span>
            </button>
            <button
              onClick={() => setSelectedEffectMode('burn')}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                selectedEffectMode === 'burn'
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-amber-100'
              }`}
              title="Animasi Makanan Terbakar / Gosong di Fryer"
            >
              <span>🔥</span>
              <span>Terbakar</span>
            </button>
            <button
              onClick={() => setSelectedEffectMode('drop')}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                selectedEffectMode === 'drop'
                  ? 'bg-amber-500 text-red-950 shadow-xs'
                  : 'text-slate-700 hover:bg-amber-100'
              }`}
              title="Animasi Makanan Jatuh ke Lantai (Aturan 5 Detik)"
            >
              <span>🧈</span>
              <span>Jatuh Lantai</span>
            </button>
            <button
              onClick={() => setSelectedEffectMode('random')}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                selectedEffectMode === 'random'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-amber-100'
              }`}
              title="Efek Acak / Kejutan Dapur MBE"
            >
              <span>🎲</span>
              <span>Acak</span>
            </button>
          </div>

          {searchQuery && (
            <div className="text-xs text-slate-600 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
              Pencarian untuk: &quot;<strong>{searchQuery}</strong>&quot;
              <button
                onClick={() => setSearchQuery('')}
                className="ml-2 font-bold text-red-700 hover:underline"
              >
                Reset
              </button>
            </div>
          )}
        </div>

        {/* Menu Grid */}
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-3xl border-2 border-dashed border-amber-300 p-12 text-center my-8">
            <div className="w-16 h-16 rounded-full bg-amber-50 mx-auto flex items-center justify-center text-3xl mb-3">
              🔍
            </div>
            <h3 className="text-lg font-black text-slate-800 font-['Space_Grotesk']">
              Menu Tidak Ditemukan
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              Tidak ada menu materi yang cocok dengan pencarian &quot;{searchQuery}&quot;. Coba kata kunci lain atau unggah berkas Anda sendiri.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-red-950 text-xs font-bold rounded-xl shadow-xs"
            >
              Tampilkan Semua Menu
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredItems.map((item) => (
              <MenuCard
                key={item.id}
                item={item}
                onAddToCart={(it, coords, mode) => handleAddToCart(it, undefined, coords, mode)}
                onCustomize={(it) => setCustomizingItem(it)}
                onPreview={(it) => setPreviewingItem(it)}
                onQuickDownload={(it) => handleQuickDownload(it)}
                selectedEffectMode={selectedEffectMode}
              />
            ))}
          </motion.div>
        )}

        {/* Parody Fast Food Tray Floating Alert (If cart has items) */}
        {cartItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky bottom-4 z-30 bg-[#DA291C] text-white p-4 rounded-2xl shadow-2xl border-2 border-amber-400 flex flex-wrap items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-red-950 flex items-center justify-center font-black">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-black font-['Space_Grotesk'] leading-tight">
                  {cartItems.length} Menu Siap di Baki Anda ({totalCalories} kkal)
                </h4>
                <p className="text-[11px] text-amber-200">
                  Total Biaya: 0 Rupiah · Siap disantap secara offline
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsReceiptOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-red-800 hover:bg-red-900 text-amber-200 font-bold text-xs border border-red-700 transition-all"
              >
                Lihat Struk
              </button>
              <button
                onClick={handleDownloadAll}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-red-950 font-black text-xs shadow-md transition-all flex items-center gap-1.5 active:scale-95"
              >
                <Download className="w-4 h-4 text-red-950" />
                <span>Unduh Semua ({cartItems.length})</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* In-depth Educational Section: Bias vs Restaurant Menu */}
        <div id="bias-guide-section">
          <BiasAnalogySection />
        </div>
      </main>

      {/* Footer Fast-Food Retro */}
      <footer className="bg-slate-900 text-slate-300 py-12 px-4 sm:px-6 border-t-4 border-amber-400 mt-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">〽️</span>
              <span className="font-extrabold text-white text-lg font-['Space_Grotesk']">
                Menu Behavioral Economics
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              Sebuah inisiatif parodi edukasi untuk mendemokratisasi akses terhadap materi Behavioral Insights, Nudge, dan Ekonomi Syariah. Mengubah naskah akademis tebal menjadi sajian cepat saji yang lezat dan siap santap.
            </p>
            <p className="text-[11px] text-amber-400 font-mono">
              &quot;I&apos;m Nudgin&apos; It™ — Bridging Data to Behavior&quot;
            </p>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase text-amber-400 font-mono tracking-wider mb-3">
              Daftar Paket Populer
            </h4>
            <ul className="text-xs space-y-2 text-slate-400">
              <li>• Big Mac Syariah AI</li>
              <li>• McSpicy 5 Framework Deck</li>
              <li>• French Fries 42 Visual SVG</li>
              <li>• Sundae Choice Engine 7 Tahap</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase text-amber-400 font-mono tracking-wider mb-3">
              Standar Nutrisi Wawasan
            </h4>
            <ul className="text-xs space-y-2 text-slate-400">
              <li>✓ 100% Bebas Sludge Administratif</li>
              <li>✓ 0% Riba Finansial</li>
              <li>✓ Ramah Offline (Single File HTML)</li>
              <li>✓ Saji Cepat dalam 1-Klik Unduh</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
          <span>
            © 2026 Menu Behavioral Economics · Psychosophia Behavioral Lab.
          </span>
          <span className="font-mono text-slate-400">
            Dapur Riset: Oktarizal Drianus · Vibe Coding Production
          </span>
        </div>
      </footer>

      {/* Modals */}
      <CustomizeModal
        item={customizingItem}
        isOpen={Boolean(customizingItem)}
        onClose={() => setCustomizingItem(null)}
        onConfirmOrder={(item, custom, coords) => handleAddToCart(item, custom, coords)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onDownloadSingle={handleDownloadSingle}
        onDownloadAll={handleDownloadAll}
        onViewReceipt={() => {
          setIsCartOpen(false);
          setIsReceiptOpen(true);
        }}
      />

      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        cartItems={cartItems}
        onDownloadAll={handleDownloadAll}
      />

      <DocumentPreviewModal
        item={previewingItem}
        isOpen={Boolean(previewingItem)}
        onClose={() => setPreviewingItem(null)}
        onDownload={(item) => handleQuickDownload(item)}
      />

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onAddMenuItem={handleAddCustomMenuItem}
      />

      {/* Floating Chat Trigger with funny periodic speech bubble */}
      <FloatingChatTrigger onOpenChat={() => setIsChatOpen(true)} />

      {/* Admin Resto MBE Intercom Drive-Thru Chatbot Modal */}
      <AdminChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        menuItems={menuItems}
        onPreviewMenu={(item) => setPreviewingItem(item)}
        onAddToCart={(item) => handleAddToCart(item)}
        cartItemsCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onDownloadAll={handleDownloadAll}
        lastDownloadTime={lastDownloadTime}
      />

      {/* Interactive Flavor & Drama Confetti Explosion Canvas */}
      <FlavorExplosion triggers={explosionTriggers} />
    </div>
  );
}
