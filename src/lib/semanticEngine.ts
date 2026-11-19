import ontologyBundle from './ontologyData.json';

export interface BatikItem {
  id: string;
  nama: string;
  tipe: string;
  jenisLabel: string;
  deskripsi: string;
  maknaFilosofis: string;
  sejarah: string;
  aturanPemakaian: string;
  golonganPemakai: string;
  warnaDominan: string;
  bahanKain: string;
  jenisKain: string;
  tingkatKerumitan: string;
  statusWarisanBudaya: string;
  sumberReferensi?: string;
  gambarBatik?: string;
  wilayah: {
    id: string;
    nama: string;
    provinsi: string;
    pulau: string;
  };
  motif: {
    id: string;
    nama: string;
    kategori: string;
    makna: string;
  };
  teknik: {
    id: string;
    nama: string;
    alat: string;
  };
  acara: Array<{ id: string; tipe: string; nama: string }>;
  malam: Array<{ id: string; nama: string; fungsi: string; komposisi: string }>;
  pewarnaan: Array<{ id: string; tipe: string; nama: string; sumber: string; warna: string }>;
}

export interface ThesaurusItem {
  concept: string;
  canonicalLabel: string;
  ontologyClass: string;
  property: string;
  targetUri: string;
  synonyms: string[];
  reasoning: string;
  targetBatiks?: string[];
  isQuirky?: boolean;
}

export interface TypoCorrection {
  original: string;
  corrected: string;
  confidence: number;
}

export function levenshteinDistance(s1: string, s2: string): number {
  const m = s1.length;
  const n = s2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[m][n];
}

export function stringSimilarity(s1: string, s2: string): number {
  const maxLen = Math.max(s1.length, s2.length);
  if (maxLen === 0) return 1.0;
  return 1.0 - levenshteinDistance(s1, s2) / maxLen;
}

export const TYPO_DICTIONARY: Record<string, string> = {
  // Megamendung
  'megamendug': 'megamendung',
  'megamndung': 'megamendung',
  'mgamendung': 'megamendung',
  'megamendong': 'megamendung',
  'megamdung': 'megamendung',
  'mega mendong': 'megamendung',
  // Parang
  'parng': 'parang',
  'prang': 'parang',
  'prng': 'parang',
  'parangrusak': 'parang rusak',
  'prangrusak': 'parang rusak',
  'parng rusak': 'parang rusak',
  // Kawung
  'kawng': 'kawung',
  'kawoong': 'kawung',
  'kawong': 'kawung',
  'kwung': 'kawung',
  // Truntum
  'truntun': 'truntum',
  'truntoom': 'truntum',
  'trontom': 'truntum',
  'truntm': 'truntum',
  // Singa Barong
  'singabarong': 'singa barong',
  'singobarong': 'singa barong',
  'singa barng': 'singa barong',
  // Slobog / Tambal
  'slobok': 'slobog',
  'selobok': 'slobog',
  'sloboq': 'slobog',
  'tambel': 'tambal',
  // Sekar Jagad
  'sekarjagad': 'sekar jagad',
  'sekarjagat': 'sekar jagad',
  'sekar jagat': 'sekar jagad',
  // Paksi Naga Liman
  'paksinagaliman': 'paksi naga liman',
  'paksi naga': 'paksi naga liman',
  'naga liman': 'paksi naga liman',
  // Wahyu Tumurun
  'wahyutumurun': 'wahyu tumurun',
  'wahyu temurun': 'wahyu tumurun',
  // Daerah
  'peklongan': 'pekalongan',
  'pekalongn': 'pekalongan',
  'jogja': 'yogyakarta',
  'yogya': 'yogyakarta',
  'jogjakarta': 'yogyakarta',
  'yojakarta': 'yogyakarta',
  'jogya': 'yogyakarta',
  'solo': 'surakarta',
  'surokarto': 'surakarta',
  'cirebonn': 'cirebon',
  // Canting / Teknik
  'tjanting': 'canting',
  'cantng': 'canting',
  'cantink': 'canting',
  'cating': 'canting',
  'tjap': 'cap',
  // Acara
  'pernikahn': 'pernikahan',
  'nikahn': 'pernikahan',
  'mantenan': 'pernikahan',
  'kawinan': 'pernikahan',
  'nganten': 'pernikahan',
  'lelayuu': 'lelayu',
  'meninggl': 'kematian',
  'layat': 'kematian',
  'nglayat': 'kematian',
  'tingkeban': 'kelahiran',
  'tujuhbulanan': 'kelahiran',
  'mbrojol': 'kelahiran',
  'lahiran': 'kelahiran'
};

export const EXTRA_QUIRKY_THESAURUS: ThesaurusItem[] = [
  {
    concept: "wisuda_akademik",
    canonicalLabel: "Wisuda & Gelar Kelulusan Akademik",
    ontologyClass: "busana_formal",
    property: "dipakaiPadaAcara",
    targetUri: "Busana_Formal",
    targetBatiks: ["Batik_Sido_Luhur", "Batik_Wahyu_Tumurun", "Batik_Semen_Rama"],
    isQuirky: true,
    synonyms: [
      "wisuda", "wisudahan", "sidang", "skripsi", "toga", "sarjana", "lulusan", "kelulusan", 
      "cumlaude", "pelantikan", "yudisium", "wisudawan", "wisudawati", "pendidikan", "lulus", "kuliah"
    ],
    reasoning: "Mendeteksi keinginan busana wisuda / kelulusan. Tradisi budaya Jawa menganjurkan Batik Sido Luhur (filosofi keluhuran derajat budi pekerti) dan Wahyu Tumurun (anugerah wahyu kecerdasan) agar wisudawan sukses dalam masa depan."
  },
  {
    concept: "lamaran_camer",
    canonicalLabel: "Lamaran & Restu Calon Mertua",
    ontologyClass: "pernikahan",
    property: "dipakaiPadaAcara",
    targetUri: "Acara_Pernikahan_Adat",
    targetBatiks: ["Batik_Sido_Asih", "Batik_Truntum", "Batik_Sido_Luhur"],
    isQuirky: true,
    synonyms: [
      "lamaran", "ngelamar", "calon mertua", "camer", "restu camer", "ketemu camer", 
      "ketemu mertua", "tunangan", "nembak cewek", "seserahan", "hantaran", "pinangan", "melamar", "nglamar"
    ],
    reasoning: "Mendeteksi prosesi lamaran / silaturahmi calon mertua. Motif Sido Asih dan Truntum melambangkan ketulusan cinta sejati yang memikat restu keluarga besar dan doa kasih sayang abadi."
  },
  {
    concept: "bucin_romantis",
    canonicalLabel: "Cinta Sejati, Bucin, & Kesetiaan",
    ontologyClass: "pernikahan",
    property: "memilikiMakna",
    targetUri: "pernikahan",
    targetBatiks: ["Batik_Truntum", "Batik_Sido_Asih", "Batik_Angso_Duo"],
    isQuirky: true,
    synonyms: [
      "bucin", "romantis", "cinta", "love", "kasih sayang", "setia", "kesetiaan", "jodoh", 
      "ldr", "kangen", "rindu", "patah hati", "galau", "gagal move on", "balikan", "pacar", "kekasih", "asmara"
    ],
    reasoning: "Mendeteksi ungkapan perasaan asmara, cinta, dan kerinduan. Batik Truntum melambangkan cinta tulus yang bersemi kembali laksana bintang malam; Batik Angso Duo melambangkan kesetiaan abadi sepasang kekasih."
  },
  {
    concept: "kekuasaan_wibawa",
    canonicalLabel: "Kewibawaan, Kepemimpinan, & Sultan",
    ontologyClass: "kerajaan",
    property: "aturanPemakaian",
    targetUri: "Acara_Keraton",
    targetBatiks: ["Batik_Parang_Rusak", "Batik_Singa_Barong", "Batik_Semen_Rama"],
    isQuirky: true,
    synonyms: [
      "bos", "sultan", "pejabat", "orang kaya", "flexing", "tajir", "wibawa", "gagah", 
      "macho", "karisma", "kharisma", "presiden", "menteri", "direktur", "pemimpin", "raja", "penguasa", "alpha", "berwibawa", "hormat"
    ],
    reasoning: "Mendeteksi keinginan tampil gagah, berwibawa, dan karismatik. Motif Parang Rusak Barong adalah Awisan Dalem Keraton yang mencerminkan keteguhan moral, kepemimpinan ksatria, dan kewibawaan agung."
  },
  {
    concept: "mitologi_monster",
    canonicalLabel: "Satwa Mitologi & Makhluk Legenda",
    ontologyClass: "fauna",
    property: "memilikiMotif",
    targetUri: "fauna",
    targetBatiks: ["Batik_Singa_Barong", "Batik_Paksi_Naga_Liman"],
    isQuirky: true,
    synonyms: [
      "naga", "monster", "hewan mitos", "makhluk mitologi", "naga terbang", "gajah naga", 
      "pokemon", "avatar", "singa naga", "fantasi", "beast", "dragon", "siluman", "hewan purba", "paksi naga"
    ],
    reasoning: "Mendeteksi pencarian satwa legenda / mitologi. Batik Singa Barong dan Paksi Naga Liman menampilkan satwa mitologis hibrida akulturasi dunia: kepala naga bertaring, belalai gajah, badan singa, dan sayap garuda."
  },
  {
    concept: "anime_langit",
    canonicalLabel: "Awan Kosmik & Dinamika Langit (Megamendung)",
    ontologyClass: "alam",
    property: "memilikiMotif",
    targetUri: "alam",
    targetBatiks: ["Batik_Megamendung"],
    isQuirky: true,
    synonyms: [
      "akatsuki", "anime", "awan", "langit", "mendung", "hujan", "badai", "petir", 
      "cuaca", "angin", "naruto", "cloud", "storm", "megamendug", "megamndung", "mega mendung", "awan mega", "awan akatsuki"
    ],
    reasoning: "Mendeteksi elemen cuaca / awan kosmis. Motif Megamendung khas Cirebon menampilkan gradasi 7 lapis awan pembawa berkah hujan kesuburan, memiliki kesamaan estetika dengan ornamen awan dalam kultur visual dunia."
  },
  {
    concept: "penolak_bala_kesembuhan",
    canonicalLabel: "Tolak Bala & Doa Kesembuhan (Tambal & Slobog)",
    ontologyClass: "adat",
    property: "memilikiMakna",
    targetUri: "Acara_Kematian",
    targetBatiks: ["Batik_Tambal", "Batik_Slobog"],
    isQuirky: true,
    synonyms: [
      "tolak bala", "sembuh", "sakit", "obat", "pemulihan", "broken", "hancur", "luka", 
      "operasi", "sial", "buang sial", "keselamatan", "rawat", "rumah sakit", "sembuhkan", "tambalan", "sembuh penyakit"
    ],
    reasoning: "Mendeteksi doa pemulihan / tolak bala. Batik Tambal secara turun-temurun dipercaya menyelimuti orang sakit agar hal-hal yang rusak/lemah lekas 'ditambal' dan pulih menuju keselamatan."
  },
  {
    concept: "vintage_jadul",
    canonicalLabel: "Batik Klasik Vintage & Pewarna Alami Soga",
    ontologyClass: "alami",
    property: "menggunakanPewarnaan",
    targetUri: "alami",
    isQuirky: true,
    synonyms: [
      "vintage", "jadul", "kuno", "tempo doeloe", "jaman dulu", "antik", "klasik", 
      "tradisional asli", "organik", "ramah lingkungan", "eco friendly", "tanpa kimia", "daun", "kayu soga", "pewarna alami", "earth tone"
    ],
    reasoning: "Mendeteksi preferensi gaya vintage / ramah lingkungan. Menampilkan koleksi batik yang diproses menggunakan ekstrak kayu pohon soga dan indigofera alami tanpa zat kimia buatan."
  },
  {
    concept: "pemberontak_laut",
    canonicalLabel: "Gelombang Laut & Deburan Samudra Karang",
    ontologyClass: "alam",
    property: "memilikiMotif",
    targetUri: "alam",
    targetBatiks: ["Batik_Parang_Rusak", "Batik_Megamendung"],
    isQuirky: true,
    synonyms: [
      "pantai", "laut", "ombak", "samudra", "laut selatan", "nyi roro kidul", "karang", 
      "parangtritis", "selat", "maritim", "bahari", "peselancar", "ombak karang", "ombak laut"
    ],
    reasoning: "Mendeteksi elemen maritim / samudra. Motif Parang Rusak diciptakan Panembahan Senopati saat berkontemplasi di Pantai Parangtritis mengamati ombak yang tak kenal lelah mengikis karang karang terjal."
  },
  {
    concept: "ceria_akulturasi",
    canonicalLabel: "Batik Pesisiran Ceria & Akulturasi Peranakan",
    ontologyClass: "kabupaten",
    property: "berasalDari",
    targetUri: "Kota_Pekalongan",
    targetBatiks: ["Batik_Pekalongan", "Batik_Lasem", "Batik_Bakaran", "Batik_Priangan"],
    isQuirky: true,
    synonyms: [
      "cerah", "warna warni", "gonjreng", "rame", "meriah", "ngejreng", "cina", "tionghoa", 
      "peranakan", "belanda", "kompeni", "buketan", "eropa", "pop", "modern", "bunga buketan", "warna cerah"
    ],
    reasoning: "Mendeteksi gaya pesisir yang meriah dan cerah. Corak pesisiran Pantura menyerap akulturasi Tionghoa (merah getih pitik) dan bunga buketan Eropa yang kaya warna kontemporer."
  },
  {
    concept: "etnik_pedalaman",
    canonicalLabel: "Motif Etnik Pedalaman Nusantara (Asmat & Dayak)",
    ontologyClass: "geometris",
    property: "berasalDari",
    targetUri: "Kab_Asmat",
    targetBatiks: ["Batik_Asmat", "Batik_Dayak"],
    isQuirky: true,
    synonyms: [
      "etnik", "tribal", "pedalaman", "rimba", "hutan", "kayu", "asli", "eksotis", 
      "dayak", "papua", "asmat", "borneo", "ukiran asmat", "mandau", "primitif"
    ],
    reasoning: "Mendeteksi motif etnik pedalaman. Mengangkat seni ukir patung leluhur suku Asmat Papua Selatan dan perisai tameng suku Dayak pedalaman Kalimantan."
  },
  {
    concept: "matematika_geometri",
    canonicalLabel: "Pola Geometris & Simetri Matematika (Kawung/Ceplok)",
    ontologyClass: "geometris",
    property: "memilikiMotif",
    targetUri: "geometris",
    targetBatiks: ["Batik_Kawung", "Batik_Ceplok", "Batik_Slobog"],
    isQuirky: true,
    synonyms: [
      "bulet bulet", "bulet", "lingkaran", "koin", "uang kepeng", "catur", "kotak kotak", 
      "matematika", "geometri", "simetri", "teratur", "rapi", "kawng", "kawoong", "kawong"
    ],
    reasoning: "Mendeteksi bentuk geometris / matematika. Motif Kawung bersumber dari formasi buah aren bersilang empat melambangkan kesucian hati serta keseimbangan empat penjuru mata angin."
  },
  {
    concept: "unggas_petarung",
    canonicalLabel: "Sawung Galing (Ayam Jantan Petarung Kesatria)",
    ontologyClass: "fauna",
    property: "memilikiMotif",
    targetUri: "fauna",
    targetBatiks: ["Batik_Sawung_Galing"],
    isQuirky: true,
    synonyms: [
      "ayam", "jago", "ayam jantan", "petarung", "aduan", "perkasa", "pendekar", "berani", 
      "sawung", "ayam jago", "laga", "sawung galing", "sawunggaling"
    ],
    reasoning: "Mendeteksi simbol satwa unggas petarung. Motif Sawung Galing melambangkan ayam jantan aduan yang tak pernah mundur dalam menegakkan keadilan dan membela kebenaran."
  },
  {
    concept: "pesona_keindahan",
    canonicalLabel: "Pesona Estetika & Burung Merak Menari",
    ontologyClass: "fauna",
    property: "memilikiMotif",
    targetUri: "fauna",
    targetBatiks: ["Batik_Merak_Ngibing", "Batik_Sekar_Jagad"],
    isQuirky: true,
    synonyms: [
      "cantik", "anggun", "menawan", "pesona", "merak", "menari", "ngibing", "bunga sejagat", 
      "taman surga", "merak ngibing", "pesolek", "sekar jagad", "sekar jagat"
    ],
    reasoning: "Mendeteksi estetika keindahan dan keanggunan. Motif Merak Ngibing menggambarkan burung merak yang sedang menari (ngibing) mengumbar pesona kemegahan bulunya."
  }
];

export function searchSemanticBatik(query: string, filters: {
  jenis?: string;
  motif?: string;
  acara?: string;
  warna?: string;
  pulau?: string;
}) {
  let q = query.trim().toLowerCase();
  const rawThesaurus = ontologyBundle.thesaurus as ThesaurusItem[];
  const allThesaurus = [...rawThesaurus, ...EXTRA_QUIRKY_THESAURUS];
  const batiks = ontologyBundle.batiks as BatikItem[];

  let typoCorrection: TypoCorrection | null = null;

  // 1. Cek kamus typo instan
  if (TYPO_DICTIONARY[q]) {
    typoCorrection = {
      original: q,
      corrected: TYPO_DICTIONARY[q],
      confidence: 0.95
    };
    q = TYPO_DICTIONARY[q];
  } else if (q.length >= 3) {
    // 2. Fuzzy Matching menggunakan Levenshtein Distance
    let bestCandidate = '';
    let highestSim = 0;

    // Evaluasi terhadap nama motif batik
    for (const b of batiks) {
      const bName = b.nama.toLowerCase();
      const sim = stringSimilarity(q, bName);
      if (sim > highestSim && sim >= 0.72) {
        highestSim = sim;
        bestCandidate = b.nama;
      }
      // Evaluasi per kata
      const words = bName.split(/\s+/);
      for (const w of words) {
        const wSim = stringSimilarity(q, w);
        if (wSim > highestSim && wSim >= 0.72) {
          highestSim = wSim;
          bestCandidate = w;
        }
      }
    }

    // Evaluasi terhadap sinonim thesaurus
    for (const item of allThesaurus) {
      for (const syn of item.synonyms) {
        const sim = stringSimilarity(q, syn.toLowerCase());
        if (sim > highestSim && sim >= 0.72) {
          highestSim = sim;
          bestCandidate = syn;
        }
      }
    }

    if (bestCandidate && highestSim >= 0.72 && highestSim < 1.0) {
      typoCorrection = {
        original: query.trim(),
        corrected: bestCandidate,
        confidence: Math.round(highestSim * 100) / 100
      };
      q = bestCandidate.toLowerCase();
    }
  }

  // 3. Match terhadap thesaurus semantik
  let semanticMatch: (ThesaurusItem & { matchedKeyword: string }) | null = null;
  if (q.length > 0) {
    for (const item of allThesaurus) {
      const match = item.synonyms.find(syn => q.includes(syn) || syn.includes(q));
      if (match) {
        semanticMatch = { ...item, matchedKeyword: match };
        break;
      }
    }
  }

  const results = batiks.filter(b => {
    // Dropdown filters
    if (filters.jenis && filters.jenis !== 'all' && b.tipe !== filters.jenis && !b.tipe.includes(filters.jenis)) return false;
    if (filters.motif && filters.motif !== 'all' && b.motif.kategori !== filters.motif) return false;
    if (filters.acara && filters.acara !== 'all' && !b.acara.some(a => a.tipe === filters.acara || a.id.toLowerCase().includes(filters.acara))) return false;
    if (filters.warna && filters.warna !== 'all' && !b.pewarnaan.some(p => p.tipe === filters.warna)) return false;
    if (filters.pulau && filters.pulau !== 'all' && b.wilayah.pulau !== filters.pulau) return false;

    if (!q) return true;

    // Direct match
    if (
      b.nama.toLowerCase().includes(q) ||
      b.wilayah.nama.toLowerCase().includes(q) ||
      b.wilayah.provinsi.toLowerCase().includes(q) ||
      b.motif.nama.toLowerCase().includes(q) ||
      b.deskripsi.toLowerCase().includes(q) ||
      b.maknaFilosofis.toLowerCase().includes(q)
    ) return true;

    // Semantic match
    if (semanticMatch) {
      // Jika concept memiliki targetBatiks eksplisit
      if (semanticMatch.targetBatiks && semanticMatch.targetBatiks.length > 0) {
        if (semanticMatch.targetBatiks.includes(b.id)) return true;
      }

      if (semanticMatch.concept === 'pernikahan' && b.acara.some(a => a.tipe === 'pernikahan' || a.id.includes('Pernikahan'))) return true;
      if (semanticMatch.concept === 'kematian' && b.acara.some(a => a.tipe === 'kematian' || a.id.includes('Kematian'))) return true;
      if (semanticMatch.concept === 'kelahiran' && b.acara.some(a => a.tipe === 'kelahiran' || a.id.includes('Mitoni'))) return true;
      if (semanticMatch.concept === 'kerajaan' && (b.acara.some(a => a.tipe === 'kerajaan') || b.aturanPemakaian.toLowerCase().includes('keraton') || b.aturanPemakaian.toLowerCase().includes('raja'))) return true;
      if (semanticMatch.concept === 'formal' && b.acara.some(a => a.tipe === 'busana_formal')) return true;
      if (semanticMatch.concept === 'fauna' && b.motif.kategori === 'fauna') return true;
      if (semanticMatch.concept === 'flora' && b.motif.kategori === 'flora') return true;
      if (semanticMatch.concept === 'geometris' && b.motif.kategori === 'geometris') return true;
      if (semanticMatch.concept === 'alam' && b.motif.kategori === 'alam') return true;
      if (semanticMatch.concept === 'alami' && b.pewarnaan.some(p => p.tipe === 'alami')) return true;
      if (semanticMatch.concept === 'sintetis' && b.pewarnaan.some(p => p.tipe === 'sintetis')) return true;
      if (semanticMatch.concept === 'tulis' && b.tipe === 'batik_tulis') return true;
      if (semanticMatch.concept === 'cap' && (b.tipe === 'batik_cap' || b.tipe === 'tulis_cap')) return true;
      if (semanticMatch.concept === 'cetak' && b.tipe === 'batik_cetak') return true;
      if (semanticMatch.concept === 'jogja' && b.wilayah.provinsi.includes('Yogyakarta')) return true;
      if (semanticMatch.concept === 'solo' && b.wilayah.nama.includes('Surakarta')) return true;
      if (semanticMatch.concept === 'vintage_jadul' && b.pewarnaan.some(p => p.tipe === 'alami')) return true;
    }

    return false;
  });

  return {
    results,
    semanticMatch,
    typoCorrection
  };
}
