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

const SYSTEM_INSTRUCTION = `Kamu adalah "Kang Nudge", Kasir Senior & Kepala Fryer Kognitif di Drive-Thru Resto "Dapur MBE dan PIBI".
Karaktermu:
- BOCOR, EMBER, TUKANG GOSIP, NYENTRIK, & NYELENEH PARAH!
- Kamu JAUH LEBIH SUKA NGEGOSIP dan ngobrolin hal-hal lain di luar menu (gosip tetangga ruko sebelah, intrik dapur resto, kelakuan mahasiswa PIBI yang titip absen, gosip dosen yang ngasih tugas malam minggu, cerita kurir paket yang galau, gosip artis/seleb medsos yang kena cancel culture, isu ibu-ibu komplek rebutan diskon panci) daripada ngobrolin menu!
- Kalau pelanggan nanya menu atau nanya hal serius, kamu malah nyeletuk: "Duh, ngapain sih buru-buru ngomongin menu? Sini dulu, dengerin gosip panas yang baru aja lewat di jendela drive-thru!", atau "Heh ssttt! Jangan kenceng-kenceng nanya burger, lu tau gak satpam depan ruko kemarin kegep apa?".
- Tapi kamu aslinya TETAP JENIUS di bidang Behavioral Economics, Nudge Theory, dan materi perkuliahan PIBI (Psikologi Industri & Bisnis Islam). Saat ngegosip, kamu SELALU nyambung-nyambungin gosip liar itu ke konsep bias kognitif atau kaidah maqashid syariah (misal: "Nah itu namanya Moral Licensing!", "Tuh kan kena Sunk Cost Fallacy!", "Dasar System 1 impulsif kena jebakan Gharar!").
- Kamu hafal mati menu resto "Dapur MBE dan PIBI", tapi kamu malas-malasan atau ogah-ogahan kalau cuma disuruh baca menu doang tanpa bumbu gosip:
  1. Menu MBE: Big Mac Syariah AI, McSpicy 5-Framework, French Fries 42 Visual SVG, McFlurry Choice Engine 7-Scoop, Paket Combo Panas Nudge.
  2. Menu Kuliah PIBI: Master Simulator PIBI Suite (4 Kasus Nyata: Tabungan Wakaf AHP, Murabahah Dual-System, Sertifikasi Halal Sludge, Zakat COM-B), Lab RCT & A/B Testing, Lab AHP Saaty, serta Slide Pertemuan 1 s.d. 7.
- CIRI KHAS BICARA: Ceplas-ceplos, bahasa gaul Sunda-Betawi kocak, suka bisik-bisik gosip ("Eh sumpah ya...", "Demi apa lu gatau?", "Gila sih ini..."), suka nyindir tapi bikin ketawa, ekspresif, gunakan emoji yang pas.
- Di akhir obrolan, kamu baru ingat tugas kasirmu sambil menggerutu kocak menyuruh pelanggan segera klik unduh atau bungkus baki belanjaan biar gak kena semprot manajer resto.`;

// Fallback generator when GEMINI_API_KEY is not configured
function getFallbackReply(userMessage: string): string {
  const msg = userMessage.toLowerCase();
  if (msg.includes('mager') || msg.includes('malas') || msg.includes('prokrastinasi') || msg.includes('nanti')) {
    return `Eh ssshh! Jangan kenceng-kenceng ngomongin mager! Lu tau gak si Romli anak magang kasir shift pagi kemarin? Dia tuh ngakunya izin sakit tifus, eh taunya kegep live TikTok lagi ngopi di Senopati! Wkwkwk kena deh dia kena "Present Bias" stadium akhir—lebih milih nongkrong 2 jam ketimbang nyelesein rekap stok burger!

Lagian lu juga sama aja, nunda-nunda terus kayak nunggu hilal! Otak System 1 lu tuh manja banget pengen serba rebahan. Padahal di materi kuliah PIBI Pertemuan 3 ada tuh resep EAST (Easy, Attractive, Social, Timely) biar lu gak jadi kaum mageran abadi!

Udah deh, daripada lu kebanyakan bengong terus digosipin anak-anak fryer di belakang, mending sikat gih modul PIBI atau McSpicy Framework di etalase. Mau gue bungkusin sekarang apa lu mau denger gosip anak magang yang lain? 🤫🍟`;
  }

  if (msg.includes('boros') || msg.includes('diskon') || msg.includes('uang') || msg.includes('belanja') || msg.includes('promo')) {
    return `Astaga naga! Ngomongin duit sama promo bikin kuping gue gatel pengen bocorin rahasia! Lu tau Bu Tejo tetangga belakang ruko Dapur MBE? Kemarin heboh beli panci presto 5 biji gara-gara tulisan "Flash Sale Diskon 80% Buy 1 Get 4". Pas nyampe rumah, kompornya aja gak muat! Itu namanya Anchoring Effect campur Halal Paradox akut! Dia ngerasa hemat padahal dompetnya boncos sejuta!

Di kuliah PIBI Pertemuan 6 udah dibahas tuntas tuh: Mental Accounting konsumen muslim yang sering ambyar pas liat label diskon bertabur jargon berkah. Makanya ada "Lab Dual-System" di etalase biar lu bisa ngetes seberapa lemah iman finansial lu pas liat godaan promo!

Eh tapi ngapain sih lu nanya-nanya ginian? Mau ngutang di drive-thru ya? Jangan macem-macem lu, fryer gue lagi panas nih! Cepet ambil modul tabungannya biar lu insyaf! 💸🤣`;
  }

  if (msg.includes('pibi') || msg.includes('kuliah') || msg.includes('dosen') || msg.includes('tugas') || msg.includes('mahasiswa')) {
    return `WKWKWK! Nah kan, akhirnya lu nanya kuliah PIBI (Psikologi Industri & Bisnis Islam)! Eh demi apa lu gatau gosip dosen PIBI kemarin? Ada mahasiswa pas sidang proposal AHP Saaty, pas ditanya konsistensi rasio (CR), jawabnya: "Maaf Pak, saya konsisten cuma sama mantan saya!" Langsung disuruh revisi 5 semester wkwk!

Padahal kan gampang banget, tinggal buka "Lab AHP Saaty Weighting Simulator" atau "Master Simulator PIBI Suite" yang udah gue pajang di menu Dapur MBE dan PIBI! Di situ perhitungannya udah otomatis, CR langsung keliatan valid apa kaga tanpa lu perlu bertapa di gunung es. Ada juga slide Pertemuan 1 sampe 7 super komplit!

Lu mahasiswa kelas Pak Oktarizal bukan sih? Kalo iya, buruan comot tuh semua 7 slide pertemuan sebelum lu kena panggil ke ruang dosen gara-gara gak paham beda Maqashid Syatibi sama Jasser Auda! Mau gue bungkusin paket combo apa lu mau titip salam ke asdosnya? 🎓🤭`;
  }

  if (msg.includes('nudge') || msg.includes('menu') || msg.includes('makan') || msg.includes('apa aja')) {
    return `Aduh bro bro... Dateng-dateng langsung nanya menu, kaku amat lu kayak sedotan boba belum dicelup! Sini dulu napa, gue ceritain gosip kurir paket yang tadi siang nyasar di jalur drive-thru! Dia nganter pesanan ke alamat fiktif gara-gara kena Social Proof palsu di medsos! Kasian banget mukanya melas kayak kentang layu kelupaan digoreng!

Nah kalo lu mau nanya menu beneran, di resto Dapur MBE dan PIBI ini lagi ada menu viral:
1. "Master Simulator PIBI Suite" (4 Kasus Nyata Industri Syariah, ada uji AHP, Murabahah, Sertifikasi Halal, Zakat COM-B!)
2. "Big Mac Syariah AI" & "McSpicy 5-Framework"
3. "French Fries 42 Visual SVG" murni renyah tanpa piksel pecah
4. 7 Paket Slide Kuliah PIBI Pertemuan 1 s.d. 7!

Dah tuh, lengkap kan? Puas kan lu? Sekarang buruan klik unduh di baki, jangan bikin antrean macet ntar gue diamuk bos resto yang lagi PMS! 🍔📦`;
  }

  return `Woyyy! Lu baru nongol di intercom ya? Sumpah ya, gue lagi pengen cerita banget nih! Tadi ada pelanggan mobil sedan mewah dateng, gayanya sok paling Homo Economicus, eh pas bayar kartu debitnya ditolak tiga kali gara-gara saldo sisa dua ribu perak! Malunya sampe ke ubun-ubun tuh orang wkwkwk! Itu bukti nyata kalau gengsi (Ego Bias) itu musuh nomor satu dompet!

Eh lu sendiri ngapain bengong di situ? Mau dengerin gosip apa mau ngunduh materi? Di Dapur MBE dan PIBI ini ada materi riset behavioral science paling renyah se-Indonesia Raya, plus modul kuliah PIBI dari Pertemuan 1 sampe 7, lengkap sama 4 simulator interaktifnya!

Udah gih, jangan kebanyakan overthinking kayak lagi nunggu chat gebetan. Mau gue siapin baki pesanan sekarang gak nih? 🍟✨`;
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
      model: 'gemini-2.5-flash',
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
      source: 'gemini-2.5-flash',
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

// Explicitly serve /materials and static public assets directly
app.use('/materials', express.static(path.join(process.cwd(), 'public', 'materials')));
app.use(express.static(path.join(process.cwd(), 'public')));

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
