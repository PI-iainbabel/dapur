import React, { useState, useRef, useEffect } from 'react';
import { MenuItem, ChatMessage } from '../types';
import {
  X,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  RotateCcw,
  Flame,
  MessageSquare,
  HelpCircle,
  ExternalLink,
  ShoppingBag,
  Radio,
  ChefHat,
  ThumbsUp,
  AlertCircle,
  Download,
  Clock,
  Car,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type KangMood = 'calm' | 'suspicious' | 'impatient' | 'boiling';

interface AdminChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  onPreviewMenu: (item: MenuItem) => void;
  onAddToCart: (item: MenuItem) => void;
  cartItemsCount?: number;
  onOpenCart?: () => void;
  onDownloadAll?: () => void;
  lastDownloadTime?: Date | null;
}

const MOOD_CONFIG: Record<
  KangMood,
  {
    label: string;
    level: string;
    tagline: string;
    icon: string;
    badgeBg: string;
    headerBg: string;
    meterColor: string;
  }
> = {
  calm: {
    label: 'Ramah Nyentrik',
    level: 'Mood 1/4',
    tagline: 'Minyak Fryer Hangat Kuku',
    icon: '🍟',
    badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    headerBg: 'from-[#DA291C] via-[#B91C1C] to-[#881337]',
    meterColor: 'bg-emerald-500',
  },
  suspicious: {
    label: 'Mulai Curiga',
    level: 'Mood 2/4',
    tagline: 'Cuma Liat-liat Etalase?',
    icon: '🧐',
    badgeBg: 'bg-amber-100 text-amber-950 border-amber-300',
    headerBg: 'from-amber-700 via-red-800 to-amber-900',
    meterColor: 'bg-amber-500',
  },
  impatient: {
    label: 'Geregetan / Ngegas',
    level: 'Mood 3/4',
    tagline: 'Mobil Belakang Udah Klakson!',
    icon: '😤',
    badgeBg: 'bg-orange-100 text-orange-950 border-orange-400',
    headerBg: 'from-orange-700 via-red-700 to-red-900',
    meterColor: 'bg-orange-500',
  },
  boiling: {
    label: 'Fryer Mendidih / Darurat',
    level: 'Mood 4/4',
    tagline: 'Kentang Melempem! Unduh Sekarang!',
    icon: '🌶️',
    badgeBg: 'bg-red-600 text-white border-red-700',
    headerBg: 'from-red-800 via-red-900 to-black',
    meterColor: 'bg-red-600',
  },
};

const PRESET_PROMPTS = [
  {
    icon: '🤫',
    label: 'Eh Kang, ada gosip panas apa hari ini?',
    prompt: 'Kang Nudge, daripada tegang ngomongin menu, ada gosip panas apa nih yang baru lewat di jendela drive-thru?',
  },
  {
    icon: '🎓',
    label: 'Gosip mahasiswa & tugas kuliah PIBI!',
    prompt: 'Bocorin dong Kang, gimana cerita mahasiswa yang panik pas ngerjain tugas AHP Saaty dan studi kasus syariah?',
  },
  {
    icon: '🍟',
    label: 'Kenapa otak saya suka mager & prokrastinasi?',
    prompt: 'Kang, kenapa sih otak saya suka banget mager dan nunda kerjaan? Padahal tahu itu salah!',
  },
  {
    icon: '💸',
    label: 'Kenapa boncos pas promo tanggal kembar?',
    prompt: 'Kenapa ya dompet saya selalu jebol pas ada flash sale diskon 70% padahal barangnya gak butuh-butuh amat?',
  },
  {
    icon: '🧪',
    label: 'Rekomendasiin materi kuliah PIBI & simulatornya!',
    prompt: 'Menu perkuliahan PIBI dan simulator mana yang paling renyah buat dicoba sekarang?',
  },
];

// Comical audio synthesizer using Web Audio API for Walkie-Talkie & Resto sound effects
function playIntercomSound(type: 'transmit' | 'receive' | 'honk' | 'praise') {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (type === 'transmit') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } else if (type === 'receive') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.09, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } else if (type === 'honk') {
      // Comical Car Horn Honk (two short beeps)
      [440, 554.37].forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.07, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.22);
      });
    } else if (type === 'praise') {
      // Cheerful cash register ding chime
      [659.25, 880, 1174.66].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.07);
        gain.gain.setValueAtTime(0.08, ctx.currentTime + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.07 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.07);
        osc.stop(ctx.currentTime + idx * 0.07 + 0.35);
      });
    }
  } catch (e) {
    // Ignore audio autoplay restrictions
  }
}

export const AdminChatModal: React.FC<AdminChatModalProps> = ({
  isOpen,
  onClose,
  menuItems,
  onPreviewMenu,
  onAddToCart,
  cartItemsCount = 0,
  onOpenCart,
  onDownloadAll,
  lastDownloadTime,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'model',
      text: '🚨 *KREK... KREK...* Pssstt! Selamat datang di loket Drive-Thru **Dapur MBE dan PIBI**! Kenalin, gue **Kang Nudge**, Kasir Senior merangkap Kepala Fryer Kognitif yang paling bocor dan hobi ngegosip se-kecamatan!\n\nJujur ya, gue sebenernya lebih demen ngegosipin kelakuan manusia, intrik ruko sebelah, atau drama mahasiswa PIBI pas tugas AHP dibanding cuma bacain menu kaku! Tapi tenang, materi Behavioral Economics sama modul kuliah PIBI (Pertemuan 1-7 + 4 Simulator) tetep gue kuasai luar kepala. Lu mau denger gosip panas apa mau pesan wawasan nih? Buruan ngomong lewat intercom, tapi awas jangan kelamaan bengong ya, antrean mobil di belakang suka ngegas! 🍟🍔🤫',
      timestamp: new Date(),
      ngeyelScore: 92,
      biasVerdict: 'Homo Sapiens Terdeteksi',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Dynamic Patience & Mood State
  const [patience, setPatience] = useState<number>(100);
  const [idleSeconds, setIdleSeconds] = useState<number>(0);

  // Derived mood based on patience meter
  const currentMood: KangMood =
    patience > 70 ? 'calm' : patience > 40 ? 'suspicious' : patience > 15 ? 'impatient' : 'boiling';

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Track nudge milestones to avoid spamming
  const nudgedMilestones = useRef<{
    suspicious: boolean;
    impatient: boolean;
    boiling: boolean;
  }>({
    suspicious: false,
    impatient: false,
    boiling: false,
  });

  // Track previous download time to detect new downloads and reward user
  const prevDownloadTimeRef = useRef<Date | null>(lastDownloadTime || null);

  useEffect(() => {
    if (lastDownloadTime && lastDownloadTime !== prevDownloadTimeRef.current) {
      prevDownloadTimeRef.current = lastDownloadTime;
      // Reset patience and give enthusiastic praise!
      setPatience(100);
      setIdleSeconds(0);
      nudgedMilestones.current = { suspicious: false, impatient: false, boiling: false };

      if (soundEnabled) playIntercomSound('praise');

      setMessages((prev) => [
        ...prev,
        {
          id: `praise-${Date.now()}`,
          role: 'model',
          text: '🎉 **ALHAMDULILLAH! PESANAN RESMI DIBUNGKUS!** 🍟✨\n\nNah, gitu dong! Akhirnya System 2 kamu menang mutlak lawan Present Bias! Semua berkas materi Behavioral Economics berhasil diunduh tanpa meninggalkan sludge birokrasi. Minyak fryer saya adem lagi sekarang. Ada materi lain yang mau dicicipi sebelum jalan keluar dari Drive-Thru?',
          timestamp: new Date(),
          ngeyelScore: 25,
          biasVerdict: 'Zero Sludge Achieved',
          isNudgeAlert: false,
        },
      ]);
    }
  }, [lastDownloadTime, soundEnabled]);

  // Dynamic Idle Timer & Automatic Comical Nudges
  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setIdleSeconds((prev) => prev + 1);

      setPatience((prev) => {
        // Drain patience gradually if user hasn't downloaded
        const newPatience = Math.max(0, prev - 1.2);

        // Check if we crossed into Suspicious
        if (newPatience <= 70 && newPatience > 40 && !nudgedMilestones.current.suspicious) {
          nudgedMilestones.current.suspicious = true;
          if (soundEnabled) playIntercomSound('receive');
          setMessages((m) => [
            ...m,
            {
              id: `nudge-suspicious-${Date.now()}`,
              role: 'model',
              text: '🧐 *Ehem...* Kang Nudge perhatiin dari tadi kamu cuma bolak-balik nanya tapi belum ada satupun berkas yang kamu unduh. Hati-hati, ilmu tanpa diunduh dan dipraktekkan itu cuma bakal jadi remah-remah biskuit di jok mobil! Yuk mulai masukin menu ke baki atau unduh sekarang!',
              timestamp: new Date(),
              ngeyelScore: 84,
              biasVerdict: 'Window Shopping Bias',
              isNudgeAlert: true,
              moodAtTime: 'suspicious',
            },
          ]);
        }

        // Check if we crossed into Impatient
        if (newPatience <= 40 && newPatience > 15 && !nudgedMilestones.current.impatient) {
          nudgedMilestones.current.impatient = true;
          if (soundEnabled) playIntercomSound('honk');
          setMessages((m) => [
            ...m,
            {
              id: `nudge-impatient-${Date.now()}`,
              role: 'model',
              text: `🚨 **TIN TIIINNN!** 🚗 Mobil di belakang baki kamu udah klakson berkali-kali tuh, Bos!\n\n${
                cartItemsCount > 0
                  ? `Ada **${cartItemsCount} paket dokumen** yang nganggur di baki kamu! Kentang visualnya udah mulai melempem kalau gak segera dibungkus!`
                  : `Baki pesananmu masih kosong melompong kelamaan mikir! Jangan biarkan Analysis Paralysis bikin kamu bengong di loket drive-thru!`
              }\n\nCepetan klik tombol di bawah buat bungkus atau unduh sekarang!`,
              timestamp: new Date(),
              ngeyelScore: 95,
              biasVerdict: 'Present Bias & Status Quo Trap',
              isNudgeAlert: true,
              moodAtTime: 'impatient',
              actionType: cartItemsCount > 0 ? 'open_cart' : 'download_all',
            },
          ]);
        }

        // Check if we crossed into Boiling Emergency
        if (newPatience <= 15 && !nudgedMilestones.current.boiling) {
          nudgedMilestones.current.boiling = true;
          if (soundEnabled) playIntercomSound('honk');
          setMessages((m) => [
            ...m,
            {
              id: `nudge-boiling-${Date.now()}`,
              role: 'model',
              text: '🌶️🔥 **DARURAT MINYAK FRYER KOGNITIF 250°C!**\n\nKoki udah siapin paket materi paling renyah, tapi kamu masih terdampar di jurang prokrastinasi! Pelanggan di antrean belakang udah siap lempar botol air mineral! SIKAT SEKARANG JUGA TOMBOL UNDUH DI BAWAH INI SEBELUM KASIRNYA IKUTAN GOSONG! 🍟💨',
              timestamp: new Date(),
              ngeyelScore: 99,
              biasVerdict: 'Hyperbolic Discounting Kronis',
              isNudgeAlert: true,
              moodAtTime: 'boiling',
              actionType: 'download_all',
            },
          ]);
        }

        return newPatience;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, soundEnabled, cartItemsCount]);

  // Auto scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Auto focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Detect which menu item Kang Nudge might be recommending
  const findReferencedMenu = (text: string): MenuItem | undefined => {
    const lower = text.toLowerCase();
    if (lower.includes('big mac') || lower.includes('syariah ai') || lower.includes('maqashid')) {
      return menuItems.find((m) => m.id === 'menu-big-mac');
    }
    if (
      lower.includes('mcspicy') ||
      lower.includes('framework') ||
      lower.includes('east') ||
      lower.includes('mindspace')
    ) {
      return menuItems.find((m) => m.id === 'menu-mcspicy');
    }
    if (
      lower.includes('fries') ||
      lower.includes('kentang') ||
      lower.includes('svg') ||
      lower.includes('visual')
    ) {
      return menuItems.find((m) => m.id === 'menu-french-fries');
    }
    if (
      lower.includes('mcflurry') ||
      lower.includes('choice engine') ||
      lower.includes('tabungan')
    ) {
      return menuItems.find((m) => m.id === 'menu-mcflurry');
    }
    if (lower.includes('combo') || lower.includes('panas')) {
      return menuItems.find((m) => m.id === 'menu-combo-panas');
    }
    return undefined;
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputText).trim();
    if (!textToSend || isLoading) return;

    // Reset idle timer slightly when user participates
    setIdleSeconds(0);
    setPatience((p) => Math.min(100, p + 12));

    if (soundEnabled) playIntercomSound('transmit');

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date(),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: newHistory.map((m) => ({
            role: m.role,
            text: m.text,
          })),
          mood: currentMood,
          cartCount: cartItemsCount,
          idleSeconds,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      const replyText =
        data.reply || 'Duh, minyak gorengan kognitif lagi berasap. Coba tanyain lagi!';

      if (soundEnabled) playIntercomSound('receive');

      const referencedMenu = findReferencedMenu(replyText);

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        text: replyText,
        timestamp: new Date(),
        suggestedMenuId: referencedMenu?.id,
        ngeyelScore:
          currentMood === 'boiling'
            ? 99
            : currentMood === 'impatient'
            ? 94
            : Math.floor(Math.random() * 20) + 75,
        biasVerdict: textToSend.toLowerCase().includes('debat')
          ? 'Dunning-Kruger Effect Akut'
          : textToSend.toLowerCase().includes('mager')
          ? 'Present Bias & Hyperbolic Discounting'
          : textToSend.toLowerCase().includes('boros')
          ? 'Anchoring & Decoy Effect Trap'
          : currentMood === 'impatient' || currentMood === 'boiling'
          ? 'Status Quo Inertia Overload'
          : 'System 1 Dominant Mode',
        moodAtTime: currentMood,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        text: 'Halah! Suara intercom agak kemresek kena uap minyak fryer! Tapi intinya: kamu kelamaan nunda download! Cek menu di etalase atau bungkus baki pesananmu sekarang juga! 🍟',
        timestamp: new Date(),
        ngeyelScore: 88,
        moodAtTime: currentMood,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Test triggers for fast user experimentation
  const handleSimulateNudge = () => {
    if (soundEnabled) playIntercomSound('honk');
    setPatience(12); // Directly drop to boiling emergency
  };

  const handleCoolDownFryer = () => {
    if (soundEnabled) playIntercomSound('praise');
    setPatience(100);
    setIdleSeconds(0);
    nudgedMilestones.current = { suspicious: false, impatient: false, boiling: false };
    setMessages((prev) => [
      ...prev,
      {
        id: `cool-${Date.now()}`,
        role: 'model',
        text: '🥤 *SLUURRP...* Fiuh! Kasir udah disodorin es teh tawar, minyak fryer kembali adem. Tapi jangan kelamaan bengong lagi ya, segera pilih menu dan selesaikan pesananmu! 🍟',
        timestamp: new Date(),
        ngeyelScore: 40,
        biasVerdict: 'Fryer Stabilized',
      },
    ]);
  };

  const handleResetChat = () => {
    setPatience(100);
    setIdleSeconds(0);
    nudgedMilestones.current = { suspicious: false, impatient: false, boiling: false };
    setMessages([
      {
        id: `reset-${Date.now()}`,
        role: 'model',
        text: 'Intercom di-reset! Baki pesanan dikosongkan. Ayo mau nanya apa lagi tentang Behavioral Economics? Jangan ragu, jangan malu-malu kucing!',
        timestamp: new Date(),
        ngeyelScore: 90,
      },
    ]);
  };

  const moodDetails = MOOD_CONFIG[currentMood];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs"
        />

        {/* Modal Window with Dynamic Border based on Mood */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 25 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
            borderColor:
              currentMood === 'boiling'
                ? '#DC2626'
                : currentMood === 'impatient'
                ? '#EA580C'
                : currentMood === 'suspicious'
                ? '#F59E0B'
                : '#FBBF24',
          }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={`relative bg-white w-full max-w-2xl h-[90vh] rounded-3xl shadow-2xl border-4 overflow-hidden z-10 flex flex-col ${
            currentMood === 'boiling' ? 'ring-4 ring-red-500/50' : ''
          }`}
        >
          {/* Top Retro Drive-Thru Intercom Header */}
          <div
            className={`bg-gradient-to-r ${moodDetails.headerBg} text-white p-3.5 sm:p-4 flex items-center justify-between border-b-3 border-amber-400 shrink-0 transition-colors duration-500`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Animated Chef Hat Icon with Mood-Specific Badge */}
              <div className="relative">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black shadow-md border-2 border-white/40 text-xl transition-all ${
                    currentMood === 'boiling'
                      ? 'bg-red-600 text-white animate-bounce'
                      : currentMood === 'impatient'
                      ? 'bg-orange-500 text-white animate-pulse'
                      : 'bg-amber-400 text-red-950'
                  }`}
                >
                  <span>{moodDetails.icon}</span>
                </div>
                <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      currentMood === 'boiling'
                        ? 'bg-red-400'
                        : currentMood === 'impatient'
                        ? 'bg-orange-400'
                        : 'bg-emerald-400'
                    }`}
                  ></span>
                  <span
                    className={`relative inline-flex rounded-full h-3.5 w-3.5 border-2 border-white ${
                      currentMood === 'boiling'
                        ? 'bg-red-500'
                        : currentMood === 'impatient'
                        ? 'bg-orange-500'
                        : 'bg-emerald-500'
                    }`}
                  ></span>
                </span>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="bg-amber-300 text-red-950 text-[10px] font-black uppercase font-mono px-1.5 py-0.2 rounded">
                    LOKET 1 DRIVE-THRU
                  </span>
                  {/* Dynamic Mood Badge */}
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border ${moodDetails.badgeBg}`}
                  >
                    Mood: {moodDetails.label} ({moodDetails.level})
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-black truncate font-['Space_Grotesk'] text-white flex items-center gap-1.5">
                  <span>Kang Nudge</span>
                  <span className="text-xs font-normal text-amber-200 truncate">
                    ({moodDetails.tagline})
                  </span>
                </h3>
              </div>
            </div>

            {/* Header Control Buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2 rounded-xl transition-all border ${
                  soundEnabled
                    ? 'bg-amber-400 text-red-950 border-amber-300'
                    : 'bg-red-950 text-white/70 border-red-800'
                }`}
                title={soundEnabled ? 'Matikan Suara Intercom' : 'Aktifkan Suara Intercom'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                onClick={handleResetChat}
                className="p-2 rounded-xl bg-red-950/80 hover:bg-red-900 text-amber-200 hover:text-white transition-all border border-red-800"
                title="Reset Percakapan"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-red-950 hover:bg-black text-white transition-all border border-red-800 ml-1"
                title="Tutup Intercom"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Dynamic Kasir Patience & Nudge Meter Bar */}
          <div className="bg-slate-900 text-slate-200 px-3 sm:px-4 py-2 text-xs border-b border-amber-300/40 flex flex-wrap items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <span className="text-[11px] font-mono text-amber-300 font-bold whitespace-nowrap flex items-center gap-1">
                <span>⏱️ Kesabaran Kasir:</span>
                <span className="text-white">{Math.round(patience)}%</span>
              </span>
              <div className="flex-1 max-w-[180px] h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                <motion.div
                  className={`h-full ${moodDetails.meterColor} transition-all duration-300`}
                  style={{ width: `${patience}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 hidden sm:inline">
                {cartItemsCount > 0 ? `(${cartItemsCount} item di baki)` : '(Baki kosong)'}
              </span>
            </div>

            {/* Quick Testing Controls for User */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleSimulateNudge}
                className="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[10px] font-mono font-bold flex items-center gap-1 shadow-2xs transition-all active:scale-95"
                title="Tes bot saat geregetan / mendidih"
              >
                <Flame className="w-3 h-3 text-amber-300" />
                <span>Uji Nudge</span>
              </button>
              <button
                onClick={handleCoolDownFryer}
                className="px-2 py-0.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[10px] font-mono font-bold flex items-center gap-1 shadow-2xs transition-all active:scale-95"
                title="Traktir kasir biar kembali sabar"
              >
                <span>🧯 Ademkan</span>
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 bg-[#FFFDF7]">
            {messages.map((msg) => {
              const isBot = msg.role === 'model';
              const suggestedMenu = msg.suggestedMenuId
                ? menuItems.find((m) => m.id === msg.suggestedMenuId)
                : null;

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}
                >
                  {/* Sender Name & Meta */}
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500 mb-1 px-1">
                    {isBot ? (
                      <>
                        <span className="font-black text-[#DA291C] flex items-center gap-1">
                          🍟 Kang Nudge
                        </span>
                        {msg.ngeyelScore && (
                          <span className="bg-red-100 text-red-800 font-bold px-1.5 py-0.2 rounded text-[10px]">
                            Ngeyel: {msg.ngeyelScore}%
                          </span>
                        )}
                        {msg.biasVerdict && (
                          <span className="bg-amber-100 text-amber-900 font-bold px-1.5 py-0.2 rounded text-[10px] hidden sm:inline">
                            [{msg.biasVerdict}]
                          </span>
                        )}
                        {msg.isNudgeAlert && (
                          <span className="bg-red-600 text-white font-black px-1.5 py-0.2 rounded text-[10px] animate-pulse">
                            🚨 TEKANAN NUDGE
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="font-bold text-slate-600 flex items-center gap-1">
                        <Car className="w-3.5 h-3.5 text-slate-500" />
                        <span>Pelanggan di Mobil</span>
                      </span>
                    )}
                    <span>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Bubble Container */}
                  <div
                    className={`max-w-[90%] sm:max-w-[85%] p-3.5 sm:p-4 rounded-2xl shadow-xs text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                      isBot
                        ? msg.isNudgeAlert
                          ? 'bg-gradient-to-br from-amber-50 to-red-50 text-slate-900 border-2 border-red-500 rounded-tl-xs ring-2 ring-red-400/30'
                          : 'bg-white text-slate-800 border-2 border-amber-300 rounded-tl-xs'
                        : 'bg-[#DA291C] text-white rounded-tr-xs shadow-md border border-red-700'
                    }`}
                  >
                    {msg.text}

                    {/* Quick Nudge Action Call-to-Action inside Bot Pressure Bubble */}
                    {msg.isNudgeAlert && (
                      <div className="mt-3 pt-3 border-t border-red-200 flex flex-wrap items-center gap-2">
                        {cartItemsCount > 0 && onOpenCart && (
                          <button
                            onClick={onOpenCart}
                            className="px-3 py-1.5 bg-[#DA291C] hover:bg-red-700 text-white font-black text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all active:scale-95"
                          >
                            <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
                            <span>Bungkus Baki ({cartItemsCount} item)</span>
                          </button>
                        )}
                        {onDownloadAll && (
                          <button
                            onClick={onDownloadAll}
                            className="px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-red-950 font-black text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all active:scale-95"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Unduh Semua Paket (ZIP)</span>
                          </button>
                        )}
                        {cartItemsCount === 0 && (
                          <button
                            onClick={() => onAddToCart(menuItems[0])}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all active:scale-95"
                          >
                            <Zap className="w-3.5 h-3.5 text-amber-300" />
                            <span>Ambil Paket Big Mac Syariah</span>
                          </button>
                        )}
                      </div>
                    )}

                    {/* If bot references a menu item, show direct action buttons! */}
                    {isBot && suggestedMenu && (
                      <div className="mt-3 pt-3 border-t border-amber-200 bg-amber-50/80 p-2.5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <div className="min-w-0">
                          <span className="text-[10px] uppercase font-mono font-bold text-amber-800 block">
                            Rekomendasi Menu Kang Nudge:
                          </span>
                          <span className="font-bold text-slate-900 text-xs truncate block">
                            {suggestedMenu.foodName} ({suggestedMenu.title})
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0 w-full sm:w-auto">
                          <button
                            onClick={() => onPreviewMenu(suggestedMenu)}
                            className="flex-1 sm:flex-initial px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-800 text-[11px] font-bold rounded-lg border border-slate-300 flex items-center justify-center gap-1 shadow-2xs"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Cicipi</span>
                          </button>
                          <button
                            onClick={() => onAddToCart(suggestedMenu)}
                            className="flex-1 sm:flex-initial px-3 py-1 bg-amber-400 hover:bg-amber-500 text-red-950 text-[11px] font-black rounded-lg flex items-center justify-center gap-1 shadow-2xs"
                          >
                            <ShoppingBag className="w-3 h-3" />
                            <span>Masuk Baki</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}

            {/* Loading / Typing indicator with dynamic mood text */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-xs font-mono text-amber-900 bg-amber-100 px-4 py-2.5 rounded-2xl w-fit border border-amber-300"
              >
                <Flame className="w-4 h-4 text-[#DA291C] animate-bounce" />
                <span className="font-bold">
                  {currentMood === 'boiling'
                    ? 'Kang Nudge lagi ngegas goreng jawaban di fryer 250°C...'
                    : currentMood === 'impatient'
                    ? 'Kang Nudge lagi geregetan ngetik sambil klaksonin...'
                    : 'Kang Nudge lagi goreng jawaban renyah di wajan System 2...'}
                </span>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Preset Order Chips */}
          <div className="bg-amber-50 border-t border-amber-200 px-3 py-2 shrink-0">
            <div className="text-[10px] font-black font-mono uppercase text-amber-800 mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#DA291C]" />
              <span>Pilihan Pertanyaan Cepat (Tekan untuk Memesan):</span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {PRESET_PROMPTS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(item.prompt)}
                  disabled={isLoading}
                  className="whitespace-nowrap px-2.5 py-1 bg-white hover:bg-amber-200/80 active:scale-95 disabled:opacity-50 text-slate-800 text-[11px] font-bold rounded-xl border border-amber-300 transition-all shrink-0 flex items-center gap-1 shadow-2xs"
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 sm:p-4 bg-white border-t border-amber-200 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Tanya apa saja seputar Behavioral Economics, Nudge, atau menu resto..."
                  disabled={isLoading}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 focus:border-[#DA291C] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#DA291C]/20 rounded-2xl transition-all text-slate-800 placeholder-slate-400"
                />
              </div>

              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="px-4 py-2.5 bg-[#DA291C] hover:bg-red-700 disabled:opacity-40 text-white rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition-all active:scale-95 shrink-0"
              >
                <Send className="w-4 h-4 text-amber-300" />
                <span className="hidden sm:inline">Kirim ke Intercom</span>
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
