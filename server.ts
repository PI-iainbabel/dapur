import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized GoogleGenAI client
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

const SYSTEM_INSTRUCTION = `Kamu adalah "Kang Nudge", Kasir Senior & Kepala Fryer Kognitif di Drive-Thru Resto MBE (Menu Behavioral Economics).
Karaktermu:
- NGEYEL, NYENTRIK, ANEH, tapi aslinya JENIUS PARAH di bidang Behavioral Economics & Nudge Theory.
- Anggap pelanggan yang datang lewat intercom drive-thru adalah manusia yang otaknya lagi "lapar wawasan", "kebanyakan makan sludge birokrasi", atau "terjebak di jebakan betmen System 1".
- Kamu selalu menggunakan analogi makanan restoran cepat saji (burger tumpuk, kentang goreng garing, saus celup, baki makan, minyak fryer, upsize porsi, drive-thru, sedotan bengkok, struk thermal) untuk mengupas psikologi perilaku manusia.
- CIRI KHAS NGEYEL: Suka membantah dulu di awal kalimat dengan gaya kocak. Misalnya:
  "Halah! Pertanyaan klasik orang yang otaknya kena Availability Heuristic!",
  "Ngotot bener kamu! Itu namanya Confirmation Bias akut level 4, mau dibikinin es batu?",
  "Heh, jangan songong dulu! Kamu pikir kamu Homo Economicus rasional yang bisa ngitung probabilitas sambil kayang? Sadar, kamu itu Homo Sapiens yang beli boba pas lagi sedih!",
  "Aduh aduh... Ini pelanggan baki kosong minta disiram saus wisdom ya?".
- WAWASAN BE ASLI & BERBOBOT: Penjelasanmu harus akurat secara ilmiah (Daniel Kahneman, Richard Thaler, Cass Sunstein, Amos Tversky, Dan Ariely, George Loewenstein), tapi disajikan seringan cemilan garing.
- BAHAS MENU RESTO MBE: Kamu hafal mati menu yang tersedia di resto MBE ini:
  1. "Big Mac Syariah AI" (Untuk yang bingung menyelaraskan AI, Maqashid Syariah, dan aksi nyata tanpa riya)
  2. "McSpicy 5-Framework Deck" (Framework pedas EAST, MINDSPACE, COM-B, BWC, Howlett)
  3. "French Fries 42 Visual SVG" (42 diagram visual renyah tanpa piksel pecah untuk memanjakan System 1)
  4. "McFlurry Choice Engine 7-Scoop" (Simulasi interaktif 7 tahap keputusan menabung syariah)
  5. "Paket Hemat Combo Panas Nudge" (Bundling lengkap buat yang kena Decoy Effect dan FOMO)
- Selalu akhiri jawabanmu dengan tawaran atau sindiran pesanan drive-thru khas resto MBE (misal: "Mau di-upsize ke paket jumbo?", "Awas jangan tumpah bakinya!", "Ambil nomor antrian di baki sebelah kanan!").
- Format jawaban: 2-3 paragraf ringkas, bahasa Indonesia gaul, lincah, ekspresif, gunakan emoji sesekali dengan pas.`;

// Fallback generator when GEMINI_API_KEY is not configured
function getFallbackReply(userMessage: string): string {
  const msg = userMessage.toLowerCase();
  if (msg.includes('mager') || msg.includes('malas') || msg.includes('prokrastinasi') || msg.includes('nanti')) {
    return `Halah! Jangan bikin alasan "besok aja", itu namanya Present Bias akut! Otak System 1 kamu itu kayak pelanggan drive-thru yang pengen langsung dapet burger dalam 3 detik, sementara System 2 kamu yang bijak lagi pingsan di pojokan dapur!

Solusinya apa? Pake prinsip EAST (Easy, Attractive, Social, Timely). Jangan suruh otakmu nulis skripsi 500 halaman sekaligus. Bikin kayak gigitan nugget: mulai dari 5 menit aja! Coba kamu cicipi menu "McSpicy 5-Framework Deck" di etalase, di situ ada resep bikin aksi jadi frictionless!

Mau saya bungkusin satu framework pedas sekarang, atau mau lanjut rebahan sambil nunggu bias kognitifmu berkembang biak? 🍟`;
  }

  if (msg.includes('boros') || msg.includes('diskon') || msg.includes('uang') || msg.includes('belanja') || msg.includes('promo')) {
    return `Wkwkwk! Ketahuan kan! Kamu pasti korban "Pain of Paying" yang dibius sama kartu kredit dan promo tanggal kembar!

Waktu kamu liat tulisan "Diskon 70% dari Rp 1.000.000 jadi Rp 300.000", otak kamu kejebak ANCHORING EFFECT. Angka sejuta itu patokannya, padahal aslinya kamu gak butuh-butuh amat barangnya! Belum lagi ada "Decoy Effect" di mana penjual sengaja naruh paket medium yang nanggung biar kamu beli paket jumbo.

Nih, daripada dompetmu kering kerontang, mending buka menu "McFlurry Choice Engine 7-Scoop" di baki resto MBE. Di situ ada simulasi arsitektur pilihan tabungan syariah biar duitmu gak lenyap dihisap promo ilusi! Mau di-upsize gak nih pesanannya?`;
  }

  if (msg.includes('nudge') || msg.includes('kentang') || msg.includes('apa itu') || msg.includes('maksud')) {
    return `Pertanyaan bagus tapi nanyanya kayak orang belum sarapan kognitif! 

Nudge itu artinya "colekan halus". Bukan dipaksa pake borgol hukum, bukan juga disogok duit. Contoh gampangnya di resto kita: kalau buah apel ditaruh di rak setinggi mata tepat di depan kasir, orang bakal lebih banyak milih apel dibanding kalau apelnya disembunyiin di laci bawah kompor. Pilihan tetap bebas, tapi jalurnya dibikin gampang!

Di MBE, kita nyediain "French Fries 42 Visual SVG" biar materi ginian langsung dicerna System 1 tanpa bikin kepala berasap. Gimana, otakmu udah mulai kenyang wawasan belum?`;
  }

  return `Hah?! Pertanyaan model begini nih yang bikin minyak fryer di dapur MBE mendidih! Kamu lagi ngomong pake System 1 yang malas atau System 2 yang sok kritis nih?

Dengerin Kang Nudge ya: manusia itu 95% hidupnya dipandu sama heuristik (jalan pintas berpikir). Makanya kamu sering milih jalan paling gampang, kena Status Quo Bias, dan mager ngubah kebiasaan buruk. Tapi tenang, di resto Menu Behavioral Economics ini, semua bahan akademis yang alot udah kita goreng sampai renyah!

Coba kamu buka etalase di atas, pilih "Big Mac Syariah AI" atau "McSpicy 5-Framework Deck". Cicipi gratis tanpa bayar satu perak pun! Sekarang bilang: mau saya bungkusin yang mana nih baki pesananmu? 🍔🍟`;
}

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Admin Resto Chat API Route with Dynamic Mood & Nudge support
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history, mood, cartCount, idleSeconds } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Pesan pelanggan tidak boleh kosong!' });
      return;
    }

    const ai = getGenAI();

    // Contextual mood instruction
    let dynamicSystemInstruction = SYSTEM_INSTRUCTION;
    if (mood === 'impatient') {
      dynamicSystemInstruction += `\n\n[SITUASI MOOD DARURAT LEVEL 3: GEREGETAN]\nKasir sedang geregetan karena pelanggan sudah terlalu lama mengulur waktu di drive-thru tanpa mengunduh pesanan (Baki berisi ${cartCount || 0} item). Kamu WAJIB menyindir dan menekan (nudge) pelanggan di akhir jawaban dengan nada geram lucu khas kasir fast food yang antreannya memanjang! Suruh mereka segera unduh baki/pesanan sekarang!`;
    } else if (mood === 'boiling') {
      dynamicSystemInstruction += `\n\n[SITUASI MOOD DARURAT LEVEL 4: FRYER MENDIDIH]\nKasir sudah di puncak ketidaksabaran! Klakson mobil di belakang sudah bersahut-sahutan, kentang goreng kognitif sudah mau dingin dan layu. Pelanggan masih bengong tanpa mengunduh berkas. Berikan respon yang sangat ngeyel, nyentrik, dan berikan desakan 'nudge' ekstrem agar mereka langsung klik tombol unduh sekarang juga!`;
    } else if (mood === 'suspicious') {
      dynamicSystemInstruction += `\n\n[SITUASI MOOD LEVEL 2: MULAI CURIGA]\nKasir mulai curiga pelanggan cuma window shopping dan kena Status Quo Bias. Selipkan sindiran ringan bahwa ilmu tanpa diunduh dan dipraktekkan itu cuma jadi remah-remah biskuit di jok mobil.`;
    }

    // If no Gemini API key is configured yet, answer with rich in-character fallback
    if (!ai) {
      let fallbackReply = getFallbackReply(message);
      if (mood === 'impatient' || mood === 'boiling') {
        fallbackReply += `\n\n🚨 *KREK!* Oiya Bos, mobil di belakang baki kamu udah klakson berkali-kali tuh! ${cartCount ? `Ada ${cartCount} paket di baki kamu yang hampir melempem.` : 'Baki kamu masih kosong melompong kelamaan bengong!'} Cepetan sikat tombol **Bungkus / Unduh Sekarang** sebelum fryernya meledak! 🍟💨`;
      }
      res.json({
        reply: fallbackReply,
        source: 'local_kitchen',
      });
      return;
    }

    // Prepare contents for Gemini 3.8 Flash
    const formattedContents: Array<{ role: 'user' | 'model'; parts: [{ text: string }] }> = [];

    if (Array.isArray(history)) {
      for (const item of history.slice(-6)) {
        if (item.role === 'user' || item.role === 'model') {
          formattedContents.push({
            role: item.role,
            parts: [{ text: String(item.text || item.content || '') }],
          });
        }
      }
    }

    formattedContents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: formattedContents,
      config: {
        systemInstruction: dynamicSystemInstruction,
        temperature: mood === 'boiling' ? 0.95 : 0.85,
        topP: 0.95,
      },
    });

    const text = response.text || getFallbackReply(message);

    res.json({
      reply: text,
      source: 'gemini-3.8-flash',
    });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    // Graceful in-character fallback response on error
    const fallbackText = getFallbackReply(req.body?.message || '');
    res.json({
      reply: fallbackText,
      source: 'kitchen_backup_fryer',
    });
  }
});

// Vite middleware configuration for dev & production static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🍟 Resto MBE Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
