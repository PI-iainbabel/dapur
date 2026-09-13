import React, { useEffect, useRef } from 'react';

export type ExplosionMode = 'flavor' | 'burn' | 'drop' | 'random';

export interface ExplosionTrigger {
  id: string;
  x: number;
  y: number;
  foodType: string;
  mode?: ExplosionMode;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vRot: number;
  scale: number;
  alpha: number;
  decay: number;
  gravity: number;
  text?: string;
  color?: string;
  size: number;
  type: 'emoji' | 'circle' | 'sparkle' | 'smoke' | 'flame';
}

interface ComicWord {
  id: number;
  text: string;
  x: number;
  y: number;
  color: string;
  bg: string;
  vx: number;
  vy: number;
  scale: number;
  alpha: number;
}

const FOOD_EMOJIS = ['🍔', '🍟', '🍗', '🍦', '🧀', '🌶️', '✨', '⭐', '🧠', '💥', '🥤'];
const COMIC_WORDS_FLAVOR = [
  'CRUNCH! 🍟',
  'GURIH! 🍔',
  'LEZAT! ✨',
  'UMAMI KOGNITIF! 🧠',
  'SYSTEM 1 PUAS! 😋',
  'ZERO SLUDGE! 🚀',
  'NUDGE BERHASIL! 🎯',
];

const COMIC_WORDS_BURN = [
  'KEBAKAR! 🔥',
  'OVERCOOK DI FRYER! 💨',
  'SYSTEM 2 BERASAP! 🤯',
  'AWAS PANAS! 🌶️',
  'DIGANTI BARU GRATIS! 🛡️',
];

const COMIC_WORDS_DROP = [
  'BRUUUKK! 💥',
  'JATUH KE LANTAI! 🧈',
  'ATURAN 5 DETIK! ⏱️',
  'HAP! DITANGKAP KOKI! 👨‍🍳',
  'BAKI TERSENGGOL! 🚗',
];

// Comical audio synthesizer using Web Audio API
export function playFlavorSound(mode: 'flavor' | 'burn' | 'drop') {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (mode === 'flavor') {
      // Crisp Pop / Crunch chord
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.04);
        gain.gain.setValueAtTime(0.08, ctx.currentTime + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.04 + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.04);
        osc.stop(ctx.currentTime + i * 0.04 + 0.25);
      });
    } else if (mode === 'burn') {
      // Sizzle sound
      const bufferSize = ctx.sampleRate * 0.3;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1400;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } else if (mode === 'drop') {
      // Comical cartoon slide-whistle down + splat
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    }
  } catch (e) {
    // Ignore audio autoplay restrictions
  }
}

interface FlavorExplosionProps {
  triggers: ExplosionTrigger[];
  onFinish?: (id: string) => void;
  soundEnabled?: boolean;
}

export const FlavorExplosion: React.FC<FlavorExplosionProps> = ({
  triggers,
  onFinish,
  soundEnabled = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const comicWordsRef = useRef<ComicWord[]>([]);
  const lastProcessedIdRef = useRef<string>('');

  // Handle incoming triggers
  useEffect(() => {
    if (!triggers || triggers.length === 0) return;
    const latest = triggers[triggers.length - 1];
    if (latest.id === lastProcessedIdRef.current) return;
    lastProcessedIdRef.current = latest.id;

    // Determine actual mode
    let activeMode: 'flavor' | 'burn' | 'drop' = 'flavor';
    if (latest.mode === 'burn') activeMode = 'burn';
    else if (latest.mode === 'drop') activeMode = 'drop';
    else if (latest.mode === 'random') {
      const rand = Math.random();
      if (rand < 0.2) activeMode = 'burn';
      else if (rand < 0.4) activeMode = 'drop';
      else activeMode = 'flavor';
    }

    if (soundEnabled) {
      playFlavorSound(activeMode);
    }

    const startX = latest.x;
    const startY = latest.y;

    const newParticles: Particle[] = [];

    if (activeMode === 'flavor') {
      // 1. EMOJI BURST (Burgers, fries, nuggets, stars)
      for (let i = 0; i < 28; i++) {
        const angle = (Math.PI * 2 * i) / 28 + (Math.random() - 0.5) * 0.4;
        const speed = Math.random() * 9 + 4;
        newParticles.push({
          x: startX,
          y: startY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 3,
          rot: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.2,
          scale: Math.random() * 0.7 + 0.9,
          alpha: 1,
          decay: Math.random() * 0.015 + 0.012,
          gravity: 0.18,
          text: FOOD_EMOJIS[Math.floor(Math.random() * FOOD_EMOJIS.length)],
          size: 24,
          type: 'emoji',
        });
      }

      // 2. GOLDEN CRISP & SAUCE SPARKLES
      const sauceColors = ['#DA291C', '#FFC72C', '#FF8200', '#FFFFFF', '#10B981'];
      for (let i = 0; i < 45; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 12 + 2;
        newParticles.push({
          x: startX,
          y: startY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2,
          rot: Math.random() * Math.PI,
          vRot: (Math.random() - 0.5) * 0.3,
          scale: 1,
          alpha: 1,
          decay: Math.random() * 0.02 + 0.015,
          gravity: 0.25,
          color: sauceColors[Math.floor(Math.random() * sauceColors.length)],
          size: Math.random() * 7 + 4,
          type: Math.random() > 0.4 ? 'circle' : 'sparkle',
        });
      }

      // Comic popup word
      comicWordsRef.current.push({
        id: Date.now(),
        text: COMIC_WORDS_FLAVOR[Math.floor(Math.random() * COMIC_WORDS_FLAVOR.length)],
        x: startX,
        y: startY - 20,
        color: '#7F1D1D',
        bg: '#FEF08A',
        vx: (Math.random() - 0.5) * 1.5,
        vy: -3.5,
        scale: 1.2,
        alpha: 1,
      });
    } else if (activeMode === 'burn') {
      // BURN / SIZZLE FLAME EFFECT
      for (let i = 0; i < 35; i++) {
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.2;
        const speed = Math.random() * 7 + 3;
        newParticles.push({
          x: startX + (Math.random() - 0.5) * 30,
          y: startY + (Math.random() - 0.5) * 20,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          rot: Math.random() * Math.PI,
          vRot: (Math.random() - 0.5) * 0.1,
          scale: Math.random() * 0.8 + 0.8,
          alpha: 1,
          decay: Math.random() * 0.02 + 0.015,
          gravity: -0.05, // Floats upward
          text: ['🔥', '💨', '💥', '⚠️', '🥓'][Math.floor(Math.random() * 5)],
          size: 26,
          type: 'emoji',
        });
      }

      comicWordsRef.current.push({
        id: Date.now(),
        text: COMIC_WORDS_BURN[Math.floor(Math.random() * COMIC_WORDS_BURN.length)],
        x: startX,
        y: startY - 25,
        color: '#FFFFFF',
        bg: '#B91C1C',
        vx: 0,
        vy: -2.8,
        scale: 1.25,
        alpha: 1,
      });
    } else if (activeMode === 'drop') {
      // DROP / SLIP ON FLOOR
      for (let i = 0; i < 25; i++) {
        const angle = Math.PI / 2 + (Math.random() - 0.5) * 1.4; // downward
        const speed = Math.random() * 8 + 3;
        newParticles.push({
          x: startX,
          y: startY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          rot: Math.random() * Math.PI,
          vRot: (Math.random() - 0.5) * 0.25,
          scale: 1,
          alpha: 1,
          decay: Math.random() * 0.018 + 0.012,
          gravity: 0.35,
          text: ['🧈', '🍟', '🧀', '💥', '💦'][Math.floor(Math.random() * 5)],
          size: 24,
          type: 'emoji',
        });
      }

      comicWordsRef.current.push({
        id: Date.now(),
        text: COMIC_WORDS_DROP[Math.floor(Math.random() * COMIC_WORDS_DROP.length)],
        x: startX,
        y: startY + 10,
        color: '#1E293B',
        bg: '#FDE047',
        vx: 0,
        vy: 2.2,
        scale: 1.2,
        alpha: 1,
      });
    }

    particlesRef.current.push(...newParticles);
    onFinish?.(latest.id);
  }, [triggers, soundEnabled, onFinish]);

  // Main Animation Loop
  useEffect(() => {
    let animationFrameId: number;

    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Render & update particles
      particlesRef.current = particlesRef.current.filter((p) => p.alpha > 0.02);

      for (let i = 0; i < particlesRef.current.length; i++) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rot += p.vRot;
        p.alpha -= p.decay;

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.scale(p.scale, p.scale);

        if (p.type === 'emoji' && p.text) {
          ctx.font = `${p.size}px 'Apple Color Emoji', 'Segoe UI Emoji', sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(p.text, 0, 0);
        } else if (p.type === 'circle' && p.color) {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'sparkle' && p.color) {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          // Star shape
          for (let s = 0; s < 5; s++) {
            ctx.lineTo(
              Math.cos(((18 + s * 72) * Math.PI) / 180) * p.size,
              -Math.sin(((18 + s * 72) * Math.PI) / 180) * p.size
            );
            ctx.lineTo(
              Math.cos(((54 + s * 72) * Math.PI) / 180) * (p.size / 2),
              -Math.sin(((54 + s * 72) * Math.PI) / 180) * (p.size / 2)
            );
          }
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
      }

      // Render Comic Popups
      comicWordsRef.current = comicWordsRef.current.filter((w) => w.alpha > 0.03);

      for (let i = 0; i < comicWordsRef.current.length; i++) {
        const w = comicWordsRef.current[i];
        w.x += w.vx;
        w.y += w.vy;
        w.alpha -= 0.016;
        w.scale = Math.max(1, w.scale - 0.005);

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, w.alpha));
        ctx.translate(w.x, w.y);
        ctx.scale(w.scale, w.scale);

        ctx.font = "900 15px 'Space Grotesk', system-ui, sans-serif";
        const metrics = ctx.measureText(w.text);
        const padding = 8;
        const boxWidth = metrics.width + padding * 2;
        const boxHeight = 26;

        // Cartoon Comic Bubble Box
        ctx.fillStyle = w.bg;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2.5;

        // Draw pill/rounded box
        ctx.beginPath();
        const r = 8;
        const x0 = -boxWidth / 2;
        const y0 = -boxHeight / 2;
        ctx.roundRect
          ? ctx.roundRect(x0, y0, boxWidth, boxHeight, r)
          : ctx.rect(x0, y0, boxWidth, boxHeight);
        ctx.fill();
        ctx.stroke();

        // Comic Text
        ctx.fillStyle = w.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(w.text, 0, 1);

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ pointerEvents: 'none' }}
    />
  );
};
