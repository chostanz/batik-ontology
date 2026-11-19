'use client';

import React, { useState } from 'react';
import ontologyBundle from '@/lib/ontologyData.json';
import { BatikItem } from '@/lib/semanticEngine';
import { BatikImage } from './BatikImage';
import { 
  BookOpen, Compass, ChevronRight, ChevronDown, Sparkles, 
  ShieldAlert, Heart, Baby, Sunset, Crown, ArrowRight,
  Palette, Info, Search, Filter, Eye, CheckCircle2, Layers
} from 'lucide-react';

interface KnowledgeBaseModuleProps {
  onSelectBatik: (batik: BatikItem) => void;
  onGoToSearchWithQuery: (q: string) => void;
}

export function KnowledgeBaseModule({ onSelectBatik, onGoToSearchWithQuery }: KnowledgeBaseModuleProps) {
  const [activeSubTab, setActiveSubTab] = useState<'taxonomy' | 'encyclopedia' | 'motifs' | 'craft' | 'properties'>('encyclopedia');
  const [selectedTaxonomyNode, setSelectedTaxonomyNode] = useState<string>('batik_tulis');
  const [propertyFilter, setPropertyFilter] = useState('');

  const allBatiks = ontologyBundle.batiks as unknown as BatikItem[];

  // Helper to find batik by ID
  const findBatik = (id: string): BatikItem | undefined => {
    return allBatiks.find(b => b.id === id);
  };

  // Batiks matching taxonomy node
  const getBatiksForNode = (nodeName: string): BatikItem[] => {
    switch (nodeName) {
      case 'batik_tulis':
        return allBatiks.filter(b => b.tipe === 'batik_tulis');
      case 'batik_cap':
        return allBatiks.filter(b => b.tipe === 'batik_cap');
      case 'batik_cetak':
        return allBatiks.filter(b => b.tipe === 'batik_cetak');
      case 'batik_kombinasi':
      case 'tulis_cap':
      case 'cap_cetak':
        return allBatiks.filter(b => b.tipe.includes('kombinasi') || b.tipe.includes('tulis_cap') || b.tipe.includes('cap_cetak'));
      case 'flora':
        return allBatiks.filter(b => b.motif.kategori === 'flora');
      case 'fauna':
        return allBatiks.filter(b => b.motif.kategori === 'fauna');
      case 'geometris':
        return allBatiks.filter(b => b.motif.kategori === 'geometris');
      case 'alam':
        return allBatiks.filter(b => b.motif.kategori === 'alam');
      case 'alami':
        return allBatiks.filter(b => b.pewarnaan && b.pewarnaan.some(p => p.tipe === 'alami'));
      case 'sintetis':
        return allBatiks.filter(b => b.pewarnaan && b.pewarnaan.some(p => p.tipe === 'sintetis'));
      case 'pernikahan':
        return allBatiks.filter(b => b.acara && b.acara.some(a => a.id.toLowerCase().includes('pernikahan') || a.tipe === 'pernikahan'));
      case 'kelahiran':
        return allBatiks.filter(b => b.acara && b.acara.some(a => a.id.toLowerCase().includes('kelahiran') || a.id.toLowerCase().includes('mitoni') || a.tipe === 'kelahiran'));
      case 'kematian':
        return allBatiks.filter(b => b.acara && b.acara.some(a => a.id.toLowerCase().includes('kematian') || a.tipe === 'kematian'));
      case 'kerajaan':
        return allBatiks.filter(b => (b.acara && b.acara.some(a => a.tipe === 'kerajaan')) || b.aturanPemakaian.toLowerCase().includes('keraton') || b.aturanPemakaian.toLowerCase().includes('raja'));
      case 'busana_formal':
        return allBatiks.filter(b => b.acara && b.acara.some(a => a.tipe === 'busana_formal'));
      case 'malam':
      case 'Malam_Klowong':
      case 'Malam_Tembokan':
      case 'Malam_Cap':
        return allBatiks.filter(b => b.malam && b.malam.length > 0).slice(0, 8);
      default:
        return allBatiks.slice(0, 6);
    }
  };

  const currentGalleryBatiks = getBatiksForNode(selectedTaxonomyNode);

  return (
    <div className="space-y-6">
      
      {/* Header Module Banner */}
      <div className="bg-gradient-to-r from-[#0B132B] via-[#1C2541] to-[#0B132B] rounded-2xl p-6 sm:p-8 text-white border border-[#C59B27]/30 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-[#C59B27]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C59B27]/20 border border-[#C59B27]/40 text-[#E8C56A] text-xs font-semibold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" /> Basis Pengetahuan Ontologi OWL 2 & Web Semantik
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-wide">
            Eksplorasi Taksonomi & Ensiklopedia Budaya Batik
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            Menghubungkan 29 kelas konsep OWL, 16 relasi objek, aturan sakral busana keraton, konteks ritual daur hidup adat, hingga visualisasi motif kain asli dengan gambar SVG terverifikasi.
          </p>
        </div>

        {/* Sub-Nav Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-6 mt-4 border-t border-white/10 text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab('encyclopedia')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
              activeSubTab === 'encyclopedia'
                ? 'bg-[#C59B27] text-[#0B132B] font-bold shadow-md'
                : 'bg-white/10 text-gray-200 hover:bg-white/20'
            }`}
          >
            <Sparkles className="w-4 h-4" /> Ensiklopedia Filosofis (Bergambar)
          </button>

          <button
            onClick={() => setActiveSubTab('taxonomy')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
              activeSubTab === 'taxonomy'
                ? 'bg-[#C59B27] text-[#0B132B] font-bold shadow-md'
                : 'bg-white/10 text-gray-200 hover:bg-white/20'
            }`}
          >
            <Layers className="w-4 h-4" /> Taksonomi Kelas Interaktif
          </button>

          <button
            onClick={() => setActiveSubTab('motifs')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
              activeSubTab === 'motifs'
                ? 'bg-[#C59B27] text-[#0B132B] font-bold shadow-md'
                : 'bg-white/10 text-gray-200 hover:bg-white/20'
            }`}
          >
            <Compass className="w-4 h-4" /> 4 Pilar Motif Nusantara
          </button>

          <button
            onClick={() => setActiveSubTab('craft')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
              activeSubTab === 'craft'
                ? 'bg-[#C59B27] text-[#0B132B] font-bold shadow-md'
                : 'bg-white/10 text-gray-200 hover:bg-white/20'
            }`}
          >
            <Palette className="w-4 h-4" /> Kriya, Canting & Pewarnaan
          </button>

          <button
            onClick={() => setActiveSubTab('properties')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
              activeSubTab === 'properties'
                ? 'bg-[#C59B27] text-[#0B132B] font-bold shadow-md'
                : 'bg-white/10 text-gray-200 hover:bg-white/20'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Kamus Properti Ontologi
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SUB-MODUL 1: ENSIKLOPEDIA FILOSOFIS & BUDAYA (SOLVES IMAGE BUG) */}
      {/* ============================================================== */}
      {activeSubTab === 'encyclopedia' && (
        <div className="space-y-8 animate-fade-in">
          
          {/* SECTION A: MOTIF LARANGAN KERATON (AWISAN DALEM) */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E8DFC9] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8DFC9] pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#99732B]">
                  <Crown className="w-4 h-4 text-[#C59B27]" /> Awisan Dalem / Norma Kebudayaan Mataram & Pasundan
                </div>
                <h3 className="text-xl font-bold font-display text-[#1C130D] mt-0.5">
                  Motif Sakral & Larangan Keraton (Royal Courtyard Sacred Motifs)
                </h3>
              </div>
              <span className="text-xs text-gray-500 bg-[#FAF7F2] px-3 py-1.5 rounded-lg border border-[#E8DFC9] self-start sm:self-auto">
                Ontologi: <code className="font-mono text-[#4A2E18] font-bold">aturanPemakaian</code> &amp; <code className="font-mono text-[#4A2E18] font-bold">:kerajaan</code>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed max-w-4xl">
              Dalam tatanan adat Keraton Kasunanan Surakarta, Kasultanan Yogyakarta, serta Kasepuhan Cirebon, motif batik tertentu dikhususkan bagi raja, sultan, dan keluarga bangsawan. Di bawah ini adalah motif sakral terdaftar dalam ontologi yang kini telah <strong>dilengkapi visualisasi motif terverifikasi</strong>:
            </p>

            {/* Grid Kartu Motif Keraton dengan Gambar Terverifikasi */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              
              {/* 1. Parang Rusak Barong */}
              {(() => {
                const b = findBatik('Batik_Parang_Rusak');
                return (
                  <div className="bg-[#FAF7F2] rounded-xl overflow-hidden border border-[#E8DFC9] shadow-sm hover:shadow-md hover:border-[#C59B27] transition flex flex-col justify-between group">
                    <div>
                      <div className="h-44 w-full relative overflow-hidden bg-black/10">
                        <BatikImage id="Batik_Parang_Rusak" alt="Batik Parang Rusak Barong" className="w-full h-full" />
                        <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 bg-[#0B132B]/85 text-[#E8C56A] text-[10px] font-bold rounded uppercase backdrop-blur-xs">
                          Awisan Sultan
                        </span>
                      </div>
                      <div className="p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm text-[#1C130D]">Parang Rusak Barong</h4>
                          <span className="text-[10px] font-mono text-gray-500">Yogyakarta</span>
                        </div>
                        <p className="text-xs text-gray-700 italic bg-white p-2.5 rounded-lg border border-[#E8DFC9] line-clamp-3">
                          &quot;Hanya dikenakan oleh Raja/Sultan pada upacara kenegaraan. Mengandung makna spiritual pengendalian hawa nafsu, keteguhan hati, dan kepemimpinan luhur.&quot;
                        </p>
                      </div>
                    </div>
                    <div className="p-4 pt-0">
                      {b && (
                        <button
                          onClick={() => onSelectBatik(b)}
                          className="w-full py-2 bg-[#F0E6D2] hover:bg-[#C59B27] hover:text-[#0B132B] text-[#4A2E18] font-bold text-xs rounded-lg transition border border-[#D9CEBC] flex items-center justify-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" /> Rincian Entitas Keraton
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* 2. Paksi Naga Liman */}
              {(() => {
                const b = findBatik('Batik_Paksi_Naga_Liman');
                return (
                  <div className="bg-[#FAF7F2] rounded-xl overflow-hidden border border-[#E8DFC9] shadow-sm hover:shadow-md hover:border-[#C59B27] transition flex flex-col justify-between group">
                    <div>
                      <div className="h-44 w-full relative overflow-hidden bg-black/10">
                        <BatikImage id="Batik_Paksi_Naga_Liman" alt="Batik Paksi Naga Liman" className="w-full h-full" />
                        <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 bg-[#0B132B]/85 text-[#E8C56A] text-[10px] font-bold rounded uppercase backdrop-blur-xs">
                          Keraton Kanoman
                        </span>
                      </div>
                      <div className="p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm text-[#1C130D]">Paksi Naga Liman</h4>
                          <span className="text-[10px] font-mono text-gray-500">Cirebon</span>
                        </div>
                        <p className="text-xs text-gray-700 italic bg-white p-2.5 rounded-lg border border-[#E8DFC9] line-clamp-3">
                          &quot;Kereta kebesaran Sultan gabungan Paksi (burung udara), Naga (air/kekuatan laut), dan Liman (gajah darat), menyimbolkan kedaulatan matra alam semesta.&quot;
                        </p>
                      </div>
                    </div>
                    <div className="p-4 pt-0">
                      {b && (
                        <button
                          onClick={() => onSelectBatik(b)}
                          className="w-full py-2 bg-[#F0E6D2] hover:bg-[#C59B27] hover:text-[#0B132B] text-[#4A2E18] font-bold text-xs rounded-lg transition border border-[#D9CEBC] flex items-center justify-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" /> Rincian Entitas Keraton
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* 3. Singa Barong Cirebon */}
              {(() => {
                const b = findBatik('Batik_Singa_Barong');
                return (
                  <div className="bg-[#FAF7F2] rounded-xl overflow-hidden border border-[#E8DFC9] shadow-sm hover:shadow-md hover:border-[#C59B27] transition flex flex-col justify-between group">
                    <div>
                      <div className="h-44 w-full relative overflow-hidden bg-black/10">
                        <BatikImage id="Batik_Singa_Barong" alt="Batik Singa Barong" className="w-full h-full" />
                        <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 bg-[#0B132B]/85 text-[#E8C56A] text-[10px] font-bold rounded uppercase backdrop-blur-xs">
                          Keraton Kasepuhan
                        </span>
                      </div>
                      <div className="p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm text-[#1C130D]">Singa Barong</h4>
                          <span className="text-[10px] font-mono text-gray-500">Cirebon</span>
                        </div>
                        <p className="text-xs text-gray-700 italic bg-white p-2.5 rounded-lg border border-[#E8DFC9] line-clamp-3">
                          &quot;Kereta kencana sakral lambang penjaga spiritual keraton dan akulturasi empat peradaban: Islam, Tiongkok, Hindu-Buddha, dan Eropa.&quot;
                        </p>
                      </div>
                    </div>
                    <div className="p-4 pt-0">
                      {b && (
                        <button
                          onClick={() => onSelectBatik(b)}
                          className="w-full py-2 bg-[#F0E6D2] hover:bg-[#C59B27] hover:text-[#0B132B] text-[#4A2E18] font-bold text-xs rounded-lg transition border border-[#D9CEBC] flex items-center justify-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" /> Rincian Entitas Keraton
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* 4. Semen Rama */}
              {(() => {
                const b = findBatik('Batik_Semen_Rama');
                return (
                  <div className="bg-[#FAF7F2] rounded-xl overflow-hidden border border-[#E8DFC9] shadow-sm hover:shadow-md hover:border-[#C59B27] transition flex flex-col justify-between group">
                    <div>
                      <div className="h-44 w-full relative overflow-hidden bg-black/10">
                        <BatikImage id="Batik_Semen_Rama" alt="Batik Semen Rama" className="w-full h-full" />
                        <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 bg-[#0B132B]/85 text-[#E8C56A] text-[10px] font-bold rounded uppercase backdrop-blur-xs">
                          Bangsawan Keraton
                        </span>
                      </div>
                      <div className="p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm text-[#1C130D]">Semen Rama</h4>
                          <span className="text-[10px] font-mono text-gray-500">Surakarta</span>
                        </div>
                        <p className="text-xs text-gray-700 italic bg-white p-2.5 rounded-lg border border-[#E8DFC9] line-clamp-3">
                          &quot;Memuat ajaran kepemimpinan agung Hastha Brata (delapan laku alam semesta: matahari, rembulan, bintang, bumi, angin, api, samudera, mendung).&quot;
                        </p>
                      </div>
                    </div>
                    <div className="p-4 pt-0">
                      {b && (
                        <button
                          onClick={() => onSelectBatik(b)}
                          className="w-full py-2 bg-[#F0E6D2] hover:bg-[#C59B27] hover:text-[#0B132B] text-[#4A2E18] font-bold text-xs rounded-lg transition border border-[#D9CEBC] flex items-center justify-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" /> Rincian Entitas Keraton
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* 5. Kawung Picis */}
              {(() => {
                const b = findBatik('Batik_Kawung');
                return (
                  <div className="bg-[#FAF7F2] rounded-xl overflow-hidden border border-[#E8DFC9] shadow-sm hover:shadow-md hover:border-[#C59B27] transition flex flex-col justify-between group">
                    <div>
                      <div className="h-44 w-full relative overflow-hidden bg-black/10">
                        <BatikImage id="Batik_Kawung" alt="Batik Kawung Picis" className="w-full h-full" />
                        <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 bg-[#0B132B]/85 text-[#E8C56A] text-[10px] font-bold rounded uppercase backdrop-blur-xs">
                          Adat Keraton
                        </span>
                      </div>
                      <div className="p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm text-[#1C130D]">Kawung Picis</h4>
                          <span className="text-[10px] font-mono text-gray-500">Yogyakarta & Solo</span>
                        </div>
                        <p className="text-xs text-gray-700 italic bg-white p-2.5 rounded-lg border border-[#E8DFC9] line-clamp-3">
                          &quot;Pola empat buah kolang-kaling melambangkan empat penjuru mata angin, kesucian niat, keadilan hati, dan pengendalian diri sejati manusia.&quot;
                        </p>
                      </div>
                    </div>
                    <div className="p-4 pt-0">
                      {b && (
                        <button
                          onClick={() => onSelectBatik(b)}
                          className="w-full py-2 bg-[#F0E6D2] hover:bg-[#C59B27] hover:text-[#0B132B] text-[#4A2E18] font-bold text-xs rounded-lg transition border border-[#D9CEBC] flex items-center justify-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" /> Rincian Entitas Keraton
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}

            </div>
          </div>

          {/* SECTION B: KONTEKS DAUR HIDUP & RITUAL ADAT (SOLVES MISSING PAMILUTO & SLOBOG TYPO) */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E8DFC9] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8DFC9] pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#99732B]">
                  <Sparkles className="w-4 h-4 text-[#C59B27]" /> Ritus Daur Hidup Adat (Human Lifecycle Rituals)
                </div>
                <h3 className="text-xl font-bold font-display text-[#1C130D] mt-0.5">
                  Motif Seremonial Transisi Kehidupan Manusia
                </h3>
              </div>
              <span className="text-xs text-gray-500 bg-[#FAF7F2] px-3 py-1.5 rounded-lg border border-[#E8DFC9] self-start sm:self-auto">
                Ontologi: <code className="font-mono text-[#4A2E18] font-bold">:adat ⊆ :kegunaan</code>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed max-w-4xl">
              Dalam daur hidup masyarakat Nusantara, kain batik menjadi pakaian sakral perantara doa bagi setiap fase transisi kehidupan: masa kehamilan (kelahiran), pernikahan sakral, hingga pengantaran jenazah menghadap Sang Pencipta:
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* 1. UPACARA PERNIKAHAN ADAT */}
              <div className="bg-[#FAF7F2] rounded-xl p-5 border border-[#E8DFC9] space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center font-bold">
                      <Heart className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#1C130D]">Pernikahan Adat (Manten)</h4>
                      <span className="text-[11px] text-gray-500">Ijab Kabul &amp; Panggih Pengantin</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed">
                    Menyiratkan doa kerukunan, cinta kasih abadi, dan limpahan rezeki bagi bahtera rumah tangga baru.
                  </p>

                  <div className="space-y-3 pt-1">
                    {/* Sido Asih */}
                    {(() => {
                      const b = findBatik('Batik_Sido_Asih');
                      return b ? (
                        <div 
                          onClick={() => onSelectBatik(b)}
                          className="bg-white p-3 rounded-lg border border-[#E8DFC9] hover:border-[#C59B27] cursor-pointer transition flex items-center gap-3 group"
                        >
                          <div className="w-14 h-14 rounded-md overflow-hidden bg-black/10 shrink-0">
                            <BatikImage id="Batik_Sido_Asih" alt="Batik Sido Asih" className="w-full h-full" />
                          </div>
                          <div className="overflow-hidden">
                            <div className="font-bold text-xs text-[#1C130D] group-hover:text-[#99732B] transition truncate">
                              Batik Sido Asih
                            </div>
                            <div className="text-[10px] text-gray-500 italic line-clamp-1">
                              Cinta kasih timbal balik berkelanjutan
                            </div>
                            <span className="text-[9px] text-[#C59B27] font-semibold mt-0.5 block flex items-center gap-1">
                              Lihat detail <ArrowRight className="w-2.5 h-2.5" />
                            </span>
                          </div>
                        </div>
                      ) : null;
                    })()}

                    {/* Truntum */}
                    {(() => {
                      const b = findBatik('Batik_Truntum');
                      return b ? (
                        <div 
                          onClick={() => onSelectBatik(b)}
                          className="bg-white p-3 rounded-lg border border-[#E8DFC9] hover:border-[#C59B27] cursor-pointer transition flex items-center gap-3 group"
                        >
                          <div className="w-14 h-14 rounded-md overflow-hidden bg-black/10 shrink-0">
                            <BatikImage id="Batik_Truntum" alt="Batik Truntum" className="w-full h-full" />
                          </div>
                          <div className="overflow-hidden">
                            <div className="font-bold text-xs text-[#1C130D] group-hover:text-[#99732B] transition truncate">
                              Batik Truntum
                            </div>
                            <div className="text-[10px] text-gray-500 italic line-clamp-1">
                              Dikenakan orang tua pengantin; cinta bersemi kembali
                            </div>
                            <span className="text-[9px] text-[#C59B27] font-semibold mt-0.5 block flex items-center gap-1">
                              Lihat detail <ArrowRight className="w-2.5 h-2.5" />
                            </span>
                          </div>
                        </div>
                      ) : null;
                    })()}

                    {/* Grompol */}
                    {(() => {
                      const b = findBatik('Batik_Grompol');
                      return b ? (
                        <div 
                          onClick={() => onSelectBatik(b)}
                          className="bg-white p-3 rounded-lg border border-[#E8DFC9] hover:border-[#C59B27] cursor-pointer transition flex items-center gap-3 group"
                        >
                          <div className="w-14 h-14 rounded-md overflow-hidden bg-black/10 shrink-0">
                            <BatikImage id="Batik_Grompol" alt="Batik Grompol" className="w-full h-full" />
                          </div>
                          <div className="overflow-hidden">
                            <div className="font-bold text-xs text-[#1C130D] group-hover:text-[#99732B] transition truncate">
                              Batik Grompol
                            </div>
                            <div className="text-[10px] text-gray-500 italic line-clamp-1">
                              Lamaran / peningsetan; berkumpulnya rezeki
                            </div>
                            <span className="text-[9px] text-[#C59B27] font-semibold mt-0.5 block flex items-center gap-1">
                              Lihat detail <ArrowRight className="w-2.5 h-2.5" />
                            </span>
                          </div>
                        </div>
                      ) : null;
                    })()}
                  </div>
                </div>

                <button
                  onClick={() => onGoToSearchWithQuery('manten')}
                  className="w-full py-2 bg-[#F0E6D2] hover:bg-[#C59B27] hover:text-[#0B132B] text-[#4A2E18] font-bold text-xs rounded-lg transition border border-[#D9CEBC] text-center"
                >
                  Lihat Semua Batik Pernikahan
                </button>
              </div>

              {/* 2. UPACARA KELAHIRAN / MITONI (FIXES MISSING PAMILUTO) */}
              <div className="bg-[#FAF7F2] rounded-xl p-5 border border-[#E8DFC9] space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                      <Baby className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#1C130D]">Kelahiran / Mitoni (Tingkeban)</h4>
                      <span className="text-[11px] text-gray-500">Upacara 7 Bulan Kehamilan</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed">
                    Dikenakan pada upacara siraman tujuh bulanan calon ibu agar persalinan selamat dan sang anak kelak berbudi pekerti luhur.
                  </p>

                  <div className="space-y-3 pt-1">
                    {/* Wahyu Tumurun */}
                    {(() => {
                      const b = findBatik('Batik_Wahyu_Tumurun');
                      return b ? (
                        <div 
                          onClick={() => onSelectBatik(b)}
                          className="bg-white p-3 rounded-lg border border-[#E8DFC9] hover:border-[#C59B27] cursor-pointer transition flex items-center gap-3 group"
                        >
                          <div className="w-14 h-14 rounded-md overflow-hidden bg-black/10 shrink-0">
                            <BatikImage id="Batik_Wahyu_Tumurun" alt="Batik Wahyu Tumurun" className="w-full h-full" />
                          </div>
                          <div className="overflow-hidden">
                            <div className="font-bold text-xs text-[#1C130D] group-hover:text-[#99732B] transition truncate">
                              Batik Wahyu Tumurun
                            </div>
                            <div className="text-[10px] text-gray-500 italic line-clamp-1">
                              Doa turunnya wahyu &amp; anugerah ilahi bagi sang anak
                            </div>
                            <span className="text-[9px] text-[#C59B27] font-semibold mt-0.5 block flex items-center gap-1">
                              Lihat detail <ArrowRight className="w-2.5 h-2.5" />
                            </span>
                          </div>
                        </div>
                      ) : null;
                    })()}

                    {/* Sido Luhur */}
                    {(() => {
                      const b = findBatik('Batik_Sido_Luhur');
                      return b ? (
                        <div 
                          onClick={() => onSelectBatik(b)}
                          className="bg-white p-3 rounded-lg border border-[#E8DFC9] hover:border-[#C59B27] cursor-pointer transition flex items-center gap-3 group"
                        >
                          <div className="w-14 h-14 rounded-md overflow-hidden bg-black/10 shrink-0">
                            <BatikImage id="Batik_Sido_Luhur" alt="Batik Sido Luhur" className="w-full h-full" />
                          </div>
                          <div className="overflow-hidden">
                            <div className="font-bold text-xs text-[#1C130D] group-hover:text-[#99732B] transition truncate">
                              Batik Sido Luhur
                            </div>
                            <div className="text-[10px] text-gray-500 italic line-clamp-1">
                              Harapan keluhuran budi, derajat tinggi, &amp; kemuliaan
                            </div>
                            <span className="text-[9px] text-[#C59B27] font-semibold mt-0.5 block flex items-center gap-1">
                              Lihat detail <ArrowRight className="w-2.5 h-2.5" />
                            </span>
                          </div>
                        </div>
                      ) : null;
                    })()}
                  </div>
                </div>

                <button
                  onClick={() => onGoToSearchWithQuery('kelahiran')}
                  className="w-full py-2 bg-[#F0E6D2] hover:bg-[#C59B27] hover:text-[#0B132B] text-[#4A2E18] font-bold text-xs rounded-lg transition border border-[#D9CEBC] text-center"
                >
                  Lihat Semua Batik Mitoni
                </button>
              </div>

              {/* 3. UPACARA KEMATIAN / LELAYU (FIXES SLOBOG TYPO) */}
              <div className="bg-[#FAF7F2] rounded-xl p-5 border border-[#E8DFC9] space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gray-200 text-gray-800 flex items-center justify-center font-bold">
                      <Sunset className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#1C130D]">Kematian / Lelayu</h4>
                      <span className="text-[11px] text-gray-500">Upacara Pemakaman &amp; Melayat</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed">
                    Dikenakan saat melayat kerabat wafat, sebagai perlambang kelapangan hati dan doa agar perjalanan arwah lancar tanpa halangan.
                  </p>

                  <div className="space-y-3 pt-1">
                    {/* Slobog */}
                    {(() => {
                      const b = findBatik('Batik_Slobog');
                      return b ? (
                        <div 
                          onClick={() => onSelectBatik(b)}
                          className="bg-white p-3 rounded-lg border border-[#E8DFC9] hover:border-[#C59B27] cursor-pointer transition flex items-center gap-3 group"
                        >
                          <div className="w-14 h-14 rounded-md overflow-hidden bg-black/10 shrink-0">
                            <BatikImage id="Batik_Slobog" alt="Batik Slobog" className="w-full h-full" />
                          </div>
                          <div className="overflow-hidden">
                            <div className="font-bold text-xs text-[#1C130D] group-hover:text-[#99732B] transition truncate">
                              Batik Slobog
                            </div>
                            <div className="text-[10px] text-gray-500 italic line-clamp-1">
                              Berasal dari kata &apos;longgar/slobok&apos;; kelancaran arwah
                            </div>
                            <span className="text-[9px] text-[#C59B27] font-semibold mt-0.5 block flex items-center gap-1">
                              Lihat detail <ArrowRight className="w-2.5 h-2.5" />
                            </span>
                          </div>
                        </div>
                      ) : null;
                    })()}

                    {/* Tambal */}
                    {(() => {
                      const b = findBatik('Batik_Tambal');
                      return b ? (
                        <div 
                          onClick={() => onSelectBatik(b)}
                          className="bg-white p-3 rounded-lg border border-[#E8DFC9] hover:border-[#C59B27] cursor-pointer transition flex items-center gap-3 group"
                        >
                          <div className="w-14 h-14 rounded-md overflow-hidden bg-black/10 shrink-0">
                            <BatikImage id="Batik_Tambal" alt="Batik Tambal" className="w-full h-full" />
                          </div>
                          <div className="overflow-hidden">
                            <div className="font-bold text-xs text-[#1C130D] group-hover:text-[#99732B] transition truncate">
                              Batik Tambal
                            </div>
                            <div className="text-[10px] text-gray-500 italic line-clamp-1">
                              Menambal hal yang kurang; kesembuhan dan ketabahan
                            </div>
                            <span className="text-[9px] text-[#C59B27] font-semibold mt-0.5 block flex items-center gap-1">
                              Lihat detail <ArrowRight className="w-2.5 h-2.5" />
                            </span>
                          </div>
                        </div>
                      ) : null;
                    })()}
                  </div>
                </div>

                <button
                  onClick={() => onGoToSearchWithQuery('lelayu')}
                  className="w-full py-2 bg-[#F0E6D2] hover:bg-[#C59B27] hover:text-[#0B132B] text-[#4A2E18] font-bold text-xs rounded-lg transition border border-[#D9CEBC] text-center"
                >
                  Lihat Semua Batik Duka Adat
                </button>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* SUB-MODUL 2: TAKSONOMI INTERAKTIF DENGAN GALERI KARTU BATIK    */}
      {/* ============================================================== */}
      {activeSubTab === 'taxonomy' && (
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E8DFC9] shadow-sm space-y-6 animate-fade-in">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#99732B]">
              Inferensi Hierarkis OWL 2 (SubClassOf)
            </span>
            <h3 className="text-xl font-bold font-display text-[#1C130D] mt-0.5">
              Pohon Taksonomi Kelas Interaktif
            </h3>
            <p className="text-xs text-gray-600 mt-1">
              Klik pada kelas ontologi di bawah untuk langsung menyaring dan memuat <strong>seluruh kain batik beserta citra visual SVG resminya</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Tree Selector (4 cols) */}
            <div className="lg:col-span-5 bg-[#FAF7F2] p-4 rounded-xl border border-[#E8DFC9] space-y-3 max-h-[600px] overflow-y-auto">
              <div className="font-bold text-xs uppercase tracking-wider text-[#4A2E18] border-b border-[#E8DFC9] pb-2">
                Pilih Kelas Konsep Ontologi
              </div>

              {/* Group: Teknik Pembuatan */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">Kelas Kain_Batik (Teknik)</span>
                {[
                  { id: 'batik_tulis', name: 'Batik Tulis Canting', count: 32 },
                  { id: 'batik_cap', name: 'Batik Cap Tembaga', count: 8 },
                  { id: 'batik_cetak', name: 'Batik Cetak / Printing', count: 5 },
                  { id: 'batik_kombinasi', name: 'Batik Kombinasi (Tulis-Cap)', count: 3 },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedTaxonomyNode(item.id)}
                    className={`w-full text-left p-2.5 rounded-lg text-xs font-semibold flex items-center justify-between transition ${
                      selectedTaxonomyNode === item.id
                        ? 'bg-[#0B132B] text-white shadow-sm'
                        : 'bg-white hover:bg-[#F0E6D2] text-[#2A180B] border border-[#E8DFC9]'
                    }`}
                  >
                    <span>{item.name}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      selectedTaxonomyNode === item.id ? 'bg-[#C59B27] text-[#0B132B] font-bold' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {item.count} entitas
                    </span>
                  </button>
                ))}
              </div>

              {/* Group: Motif */}
              <div className="space-y-1 pt-2">
                <span className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">Kelas Motif (Ragam Hias)</span>
                {[
                  { id: 'flora', name: 'Motif Flora (Tumbuhan & Bunga)', count: 18 },
                  { id: 'fauna', name: 'Motif Fauna (Satwa & Burung)', count: 9 },
                  { id: 'geometris', name: 'Motif Geometris (Parang/Kawung)', count: 14 },
                  { id: 'alam', name: 'Motif Alam (Awan / Ombak)', count: 7 },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedTaxonomyNode(item.id)}
                    className={`w-full text-left p-2.5 rounded-lg text-xs font-semibold flex items-center justify-between transition ${
                      selectedTaxonomyNode === item.id
                        ? 'bg-[#0B132B] text-white shadow-sm'
                        : 'bg-white hover:bg-[#F0E6D2] text-[#2A180B] border border-[#E8DFC9]'
                    }`}
                  >
                    <span>{item.name}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      selectedTaxonomyNode === item.id ? 'bg-[#C59B27] text-[#0B132B] font-bold' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {item.count} entitas
                    </span>
                  </button>
                ))}
              </div>

              {/* Group: Upacara Adat */}
              <div className="space-y-1 pt-2">
                <span className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">Kelas Adat ⊆ Kegunaan</span>
                {[
                  { id: 'pernikahan', name: 'Pernikahan Adat (Manten)', count: 8 },
                  { id: 'kelahiran', name: 'Kelahiran / Mitoni (Tingkeban)', count: 2 },
                  { id: 'kematian', name: 'Upacara Kematian / Lelayu', count: 1 },
                  { id: 'kerajaan', name: 'Lingkungan Keraton (Awisan Dalem)', count: 5 },
                  { id: 'busana_formal', name: 'Busana Formal & Acara Resmi', count: 32 },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedTaxonomyNode(item.id)}
                    className={`w-full text-left p-2.5 rounded-lg text-xs font-semibold flex items-center justify-between transition ${
                      selectedTaxonomyNode === item.id
                        ? 'bg-[#0B132B] text-white shadow-sm'
                        : 'bg-white hover:bg-[#F0E6D2] text-[#2A180B] border border-[#E8DFC9]'
                    }`}
                  >
                    <span>{item.name}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      selectedTaxonomyNode === item.id ? 'bg-[#C59B27] text-[#0B132B] font-bold' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {item.count} entitas
                    </span>
                  </button>
                ))}
              </div>

              {/* Group: Pewarnaan */}
              <div className="space-y-1 pt-2">
                <span className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">Kelas Pewarnaan</span>
                {[
                  { id: 'alami', name: 'Pewarna Alami Organik (Soga, Indigo)', count: 24 },
                  { id: 'sintetis', name: 'Pewarna Sintetis Modern (Remazol)', count: 11 },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedTaxonomyNode(item.id)}
                    className={`w-full text-left p-2.5 rounded-lg text-xs font-semibold flex items-center justify-between transition ${
                      selectedTaxonomyNode === item.id
                        ? 'bg-[#0B132B] text-white shadow-sm'
                        : 'bg-white hover:bg-[#F0E6D2] text-[#2A180B] border border-[#E8DFC9]'
                    }`}
                  >
                    <span>{item.name}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      selectedTaxonomyNode === item.id ? 'bg-[#C59B27] text-[#0B132B] font-bold' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {item.count} entitas
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Gallery of Matching Batiks (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="p-3 bg-[#F0E6D2] rounded-xl border border-[#D9CEBC] flex items-center justify-between text-xs">
                <div>
                  <span className="text-gray-500 text-[11px] block">Menampilkan entitas kelas:</span>
                  <strong className="text-[#1C130D] font-mono font-bold text-sm">
                    :{selectedTaxonomyNode}
                  </strong>
                </div>
                <span className="px-2.5 py-1 bg-white rounded-lg border border-[#D9CEBC] font-semibold text-[#4A2E18]">
                  {currentGalleryBatiks.length} Kain Ditemukan
                </span>
              </div>

              {/* Grid Images */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[530px] overflow-y-auto pr-1">
                {currentGalleryBatiks.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => onSelectBatik(b)}
                    className="bg-[#FAF7F2] rounded-xl overflow-hidden border border-[#E8DFC9] hover:border-[#C59B27] hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      <div className="h-36 w-full relative overflow-hidden bg-black/10">
                        <BatikImage id={b.id} alt={b.nama} className="w-full h-full" />
                        <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/75 text-[#E8C56A] rounded text-[10px] font-bold uppercase backdrop-blur-xs">
                          {b.jenisLabel}
                        </span>
                      </div>
                      <div className="p-3.5 space-y-1">
                        <h4 className="font-bold text-xs text-[#1C130D] group-hover:text-[#99732B] transition truncate">
                          {b.nama}
                        </h4>
                        <p className="text-[11px] text-gray-500">
                          {b.wilayah.nama}, {b.wilayah.provinsi}
                        </p>
                        <p className="text-[11px] text-gray-600 italic line-clamp-2 mt-1">
                          &quot;{b.maknaFilosofis || b.deskripsi}&quot;
                        </p>
                      </div>
                    </div>
                    <div className="p-3 pt-0 flex items-center justify-between text-[11px] text-[#C59B27] font-semibold">
                      <span>Buka Entitas</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUB-MODUL 3: EMPAT PILAR MOTIF NUSANTARA                       */}
      {/* ============================================================== */}
      {activeSubTab === 'motifs' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 border border-[#E8DFC9] shadow-sm space-y-2">
            <h3 className="text-xl font-bold font-display text-[#1C130D]">
              4 Kategori Ragam Hias Motif Tradisional
            </h3>
            <p className="text-xs text-gray-600">
              Dalam ontologi batik, kelas <code>:motif</code> dibagi menjadi 4 kelas utama dengan makna simbolis tersendiri:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                id: 'flora',
                title: 'Motif Flora (Tumbuhan, Bunga & Daun)',
                desc: 'Melambangkan keindahan alam, kesuburan, keanggunan budi pekerti, dan harmoni hidup bersama alam sekitar. Contoh: Buketan, Asem Arang, Sekar Jagad, Parijoto.',
                sampleIds: ['Batik_Buketan', 'Batik_Asem_Arang', 'Batik_Jahe_Srimpang', 'Batik_Parijoto']
              },
              {
                id: 'fauna',
                title: 'Motif Fauna (Satwa, Burung & Hewan Sakral)',
                desc: 'Melambangkan kekuatan pelindung, kesetiaan, ketangkasan, dan keagungan satwa nusantara. Contoh: Merak Ngibing, Cendrawasih Papua, Angso Duo, Singa Barong.',
                sampleIds: ['Batik_Merak_Ngibing', 'Batik_Cendrawasih', 'Batik_Angso_Duo', 'Batik_Singa_Barong']
              },
              {
                id: 'geometris',
                title: 'Motif Geometris (Pola Garis, Diagonal & Lingkaran)',
                desc: 'Bermuatan nilai filosofis matematis tertua warisan keraton, mencerminkan keteguhan batin, keteraturan kosmis, dan keadilan. Contoh: Parang Rusak, Kawung, Nitik, Ceplok.',
                sampleIds: ['Batik_Parang_Rusak', 'Batik_Kawung', 'Batik_Ceplok', 'Batik_Nitik']
              },
              {
                id: 'alam',
                title: 'Motif Alam (Awan, Langit, Ombak & Pemandangan)',
                desc: 'Menggambarkan elemen makrokosmos alam semesta, keterbukaan pikiran, serta permohonan keteduhan lahir batin. Contoh: Megamendung, Wadasan, Gentongan, Truntum.',
                sampleIds: ['Batik_Megamendung', 'Batik_Wadasan', 'Batik_Gentongan', 'Batik_Truntum']
              }
            ].map((cat) => (
              <div key={cat.id} className="bg-white rounded-2xl p-5 border border-[#E8DFC9] shadow-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-[#E8DFC9] pb-3">
                    <h4 className="font-bold text-sm text-[#1C130D]">{cat.title}</h4>
                    <span className="font-mono text-[10px] text-[#C59B27] bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#E8DFC9]">
                      :{cat.id}
                    </span>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    {cat.desc}
                  </p>

                  {/* 4 Mini Batik Previews */}
                  <div className="grid grid-cols-4 gap-2 pt-2">
                    {cat.sampleIds.map((bid) => {
                      const b = findBatik(bid);
                      if (!b) return null;
                      return (
                        <div
                          key={bid}
                          onClick={() => onSelectBatik(b)}
                          className="group cursor-pointer rounded-lg overflow-hidden border border-[#E8DFC9] hover:border-[#C59B27] bg-[#FAF7F2] transition"
                          title={b.nama}
                        >
                          <div className="h-16 w-full">
                            <BatikImage id={b.id} alt={b.nama} className="w-full h-full" />
                          </div>
                          <div className="p-1 text-[9px] font-bold text-[#1C130D] truncate text-center group-hover:text-[#99732B]">
                            {b.motif.nama}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={() => onGoToSearchWithQuery(cat.id)}
                  className="w-full py-2 bg-[#F0E6D2] hover:bg-[#C59B27] hover:text-[#0B132B] text-[#4A2E18] font-bold text-xs rounded-lg transition border border-[#D9CEBC] text-center flex items-center justify-center gap-1.5 mt-2"
                >
                  <Search className="w-3.5 h-3.5" /> Eksplor Seluruh Koleksi {cat.id}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUB-MODUL 4: KRIYA, CANTING & PEWARNAAN                        */}
      {/* ============================================================== */}
      {activeSubTab === 'craft' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 border border-[#E8DFC9] shadow-sm space-y-4">
            <h3 className="text-xl font-bold font-display text-[#1C130D]">
              Teknik Kriya Tradisional, Lilin Malam & Zat Pewarna Alami
            </h3>
            <p className="text-xs text-gray-700 leading-relaxed">
              Kekayaan batik nusantara bertumpu pada perpaduan instrumen kriya canting, komposisi lilin perintang malam nabati, serta ekstraksi tanaman pewarna alami asli kepulauan Indonesia.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E8DFC9] space-y-2">
                <span className="text-[10px] font-bold uppercase text-[#99732B]">Teknik 1: Canting Tulis</span>
                <h4 className="font-bold text-sm text-[#1C130D]">Batik Tulis Tradisional</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Dikerjakan secara manual helai demi helai menggunakan canting tembaga berpenampung cairan lilin malam mendidih. Menghasilkan garis klowongan yang lentur dan bernyawa.
                </p>
                <div className="text-[11px] text-[#4A2E18] font-semibold pt-1">
                  Instrumen: Canting cucuk 1, 2, atau cecek
                </div>
              </div>

              <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E8DFC9] space-y-2">
                <span className="text-[10px] font-bold uppercase text-[#99732B]">Teknik 2: Cap Tembaga</span>
                <h4 className="font-bold text-sm text-[#1C130D]">Batik Cap Presisi</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Menggunakan stempel plat canting cap tembaga yang dicelup ke wajan malam cair dan ditekan ke atas mori. Memberikan pola ornamen geometris simetris berulang yang rapi.
                </p>
                <div className="text-[11px] text-[#4A2E18] font-semibold pt-1">
                  Instrumen: Canting cap tembaga
                </div>
              </div>

              <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E8DFC9] space-y-2">
                <span className="text-[10px] font-bold uppercase text-[#99732B]">Pewarna: Alami Nabati</span>
                <h4 className="font-bold text-sm text-[#1C130D]">Ekstrak Kayu &amp; Daun</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Menggunakan kulit kayu soga jambal/tingi (warna cokelat keemasan), daun indigo/tarum (warna biru tua), akar mengkudu (warna merah), dan tanah liat liek Minang.
                </p>
                <div className="text-[11px] text-[#4A2E18] font-semibold pt-1">
                  Ramah lingkungan &amp; tahan ratusan tahun
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUB-MODUL 5: KAMUS PROPERTI ONTOLOGI                          */}
      {/* ============================================================== */}
      {activeSubTab === 'properties' && (
        <div className="bg-white rounded-2xl p-6 border border-[#E8DFC9] shadow-sm space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8DFC9] pb-4">
            <div>
              <h3 className="text-xl font-bold font-display text-[#1C130D]">
                Kamus Properti Ontologi (Properties Reference)
              </h3>
              <p className="text-xs text-gray-600 mt-0.5">
                Spesifikasi teknis relasi objek (Object Properties) dan atribut data (Datatype Properties) dalam model OWL 2.
              </p>
            </div>
            
            <input
              type="text"
              value={propertyFilter}
              onChange={(e) => setPropertyFilter(e.target.value)}
              placeholder="Cari identifier properti..."
              className="bg-[#FAF7F2] border border-[#D9CEBC] rounded-lg px-3 py-1.5 text-xs text-[#2A180B] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#C59B27] w-full sm:w-64"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAF7F2] text-[#4A2E18] border-b border-[#E8DFC9] font-bold">
                  <th className="p-3">Kategori OWL</th>
                  <th className="p-3">Identifier Properti</th>
                  <th className="p-3">Domain</th>
                  <th className="p-3">Range</th>
                  <th className="p-3">Definisi Semantik</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700 font-sans">
                {[
                  { type: 'owl:ObjectProperty', name: 'berasalDari', domain: 'Kain_Batik', range: 'asal_daerah_nusantara', desc: 'Relasi ke instansi kota atau kabupaten sentra produksi batik nusantara.' },
                  { type: 'owl:ObjectProperty', name: 'memilikiMotif', domain: 'Kain_Batik', range: 'motif', desc: 'Relasi ke ornamen ragam hias (flora, fauna, geometris, atau alam).' },
                  { type: 'owl:ObjectProperty', name: 'dipakaiPadaAcara', domain: 'Kain_Batik', range: 'kegunaan / adat', desc: 'Relasi ke upacara adat istiadat dan seremoni formal daur hidup.' },
                  { type: 'owl:ObjectProperty', name: 'menggunakanPewarnaan', domain: 'Kain_Batik', range: 'pewarnaan', desc: 'Relasi ke zat pewarna alami (soga, indigo) atau sintetis.' },
                  { type: 'owl:ObjectProperty', name: 'menggunakanBahanMalam', domain: 'Kain_Batik', range: 'malam', desc: 'Relasi ke formula lilin perintang (malam klowong, tembokan, biron).' },
                  { type: 'owl:ObjectProperty', name: 'dibuatDenganTeknik', domain: 'Kain_Batik', range: 'teknik_pembuatan', desc: 'Relasi ke metode manufaktur kriya (tulis canting, cap, cetak).' },
                  { type: 'owl:DatatypeProperty', name: 'maknaFilosofis', domain: 'Kain_Batik', range: 'xsd:string', desc: 'Nilai kearifan lokal, doa luhur, serta pesan moral simbolik pada motif.' },
                  { type: 'owl:DatatypeProperty', name: 'aturanPemakaian', domain: 'Kain_Batik', range: 'xsd:string', desc: 'Ketentuan norma adat mengenai siapa yang berhak mengenakan busana.' },
                  { type: 'owl:DatatypeProperty', name: 'sejarah', domain: 'Kain_Batik', range: 'xsd:string', desc: 'Latar belakang historis penciptaan motif dan tokoh pemrakarsa.' },
                  { type: 'owl:DatatypeProperty', name: 'golonganPemakai', domain: 'Kain_Batik', range: 'xsd:string', desc: 'Stratifikasi sosial pengguna (raja, bangsawan, atau rakyat umum).' },
                  { type: 'owl:DatatypeProperty', name: 'alatUtama', domain: 'teknik_pembuatan', range: 'xsd:string', desc: 'Instrumen kriya primer (canting tulis tembaga, canting cap, rakel cetak).' },
                  { type: 'owl:DatatypeProperty', name: 'warnaDominan', domain: 'Kain_Batik', range: 'xsd:string', desc: 'Spektrum visual rona warna utama pada helai kain batik.' },
                  { type: 'owl:DatatypeProperty', name: 'tingkatKerumitan', domain: 'Kain_Batik', range: 'xsd:string', desc: 'Estimasi tingkat kerumitan pengerjaan kriya (rendah, sedang, tinggi, sangat tinggi).' }
                ]
                  .filter(p => !propertyFilter || p.name.toLowerCase().includes(propertyFilter.toLowerCase()) || p.desc.toLowerCase().includes(propertyFilter.toLowerCase()))
                  .map((p, idx) => (
                    <tr key={idx} className="hover:bg-[#FAF7F2] transition">
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                          p.type === 'owl:ObjectProperty' ? 'bg-blue-100 text-blue-900' : 'bg-emerald-100 text-emerald-900'
                        }`}>
                          {p.type}
                        </span>
                      </td>
                      <td className="p-3 font-mono font-bold text-[#1C130D]">
                        :{p.name}
                      </td>
                      <td className="p-3 font-mono text-gray-600">
                        :{p.domain}
                      </td>
                      <td className="p-3 font-mono text-gray-600">
                        {p.range}
                      </td>
                      <td className="p-3 text-gray-700">
                        {p.desc}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
