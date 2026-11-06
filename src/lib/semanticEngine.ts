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
}

export function searchSemanticBatik(query: string, filters: {
  jenis?: string;
  motif?: string;
  acara?: string;
  warna?: string;
  pulau?: string;
}) {
  const q = query.trim().toLowerCase();
  const thesaurus = ontologyBundle.thesaurus as ThesaurusItem[];
  const batiks = ontologyBundle.batiks as BatikItem[];

  // Find synonym match
  let semanticMatch: (ThesaurusItem & { matchedKeyword: string }) | null = null;
  if (q.length > 0) {
    for (const item of thesaurus) {
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
    }

    return false;
  });

  return {
    results,
    semanticMatch
  };
}
