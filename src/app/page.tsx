'use client';

import React, { useState, useMemo, useEffect } from 'react';
import ontologyBundle from '@/lib/ontologyData.json';
import { searchSemanticBatik, BatikItem } from '@/lib/semanticEngine';
import { BatikImage } from '@/components/BatikImage';
import { BatikDetailModal } from '@/components/BatikDetailModal';
import { KnowledgeBaseModule } from '@/components/KnowledgeBaseModule';
import { SparqlModule } from '@/components/SparqlModule';
import { 
  Search, Compass, BookOpen, Terminal, Database, 
  MapPin, ChevronRight, ChevronLeft, Award, ArrowRight, Filter, 
  RotateCcw, LayoutGrid, List, Sparkles, Layers,
  Check, ExternalLink, HelpCircle, Code, ShieldCheck,
  Maximize2, Grid as GridIcon, Flower, Shield, Cloud,
  HeartHandshake, Network
} from 'lucide-react';

const HERO_FEATURED = [
  {
    id: 'Batik_Parang_Rusak',
    nama: 'Batik Parang Rusak',
    wilayah: 'Surakarta, Jawa Tengah',
    badge: 'Awisan Dalem Keraton',
    teknik: 'Batik Tulis Canting',
    filosofi: 'Keteguhan moral, keberanian spiritual, dan pantang menyerah laksana deburan ombak karang samudra selatan.'
  },
  {
    id: 'Batik_Megamendung',
    nama: 'Batik Megamendung',
    wilayah: 'Kota Cirebon, Jawa Barat',
    badge: 'Akulturasi Tiongkok & Pesisir',
    teknik: 'Batik Tulis Canting',
    filosofi: 'Ketenangan batin, kesabaran jiwa, dan gradasi tujuh lapis langit pembawa rahmat air hujan kesuburan.'
  },
  {
    id: 'Batik_Singa_Barong',
    nama: 'Batik Singa Barong',
    wilayah: 'Kota Cirebon, Jawa Barat',
    badge: 'Keraton Kasepuhan Cirebon',
    teknik: 'Batik Tulis Canting',
    filosofi: 'Sinergi sakral empat peradaban dunia: singa (Islam), gajah (Hindu), naga (Tiongkok), dan garuda (Nusantara).'
  },
  {
    id: 'Batik_Kawung',
    nama: 'Batik Kawung',
    wilayah: 'Yogyakarta, DI Yogyakarta',
    badge: 'Filosofi Kesucian Keraton',
    teknik: 'Batik Tulis / Cap',
    filosofi: 'Simbol buah aren (kolang-kaling) bersilang empat: kesucian hati, keadilan raja, dan pengendalian empat nafsu batin.'
  },
  {
    id: 'Batik_Truntum',
    nama: 'Batik Truntum',
    wilayah: 'Surakarta, Jawa Tengah',
    badge: 'Simbol Cinta Bersemi Abadi',
    teknik: 'Batik Tulis Canting',
    filosofi: 'Kuntum bunga bertaburan di langit malam; simbol cinta tulus sejati yang senantiasa bersemi kembali.'
  }
];

const MARQUEE_IDS = [
  'Batik_Sekar_Jagad', 'Batik_Paksi_Naga_Liman', 'Batik_Slobog', 'Batik_Tambal',
  'Batik_Bakaran', 'Batik_Lasem', 'Batik_Priangan', 'Batik_Dayak',
  'Batik_Asmat', 'Batik_Bali', 'Batik_Sido_Luhur', 'Batik_Grompol'
];

const SHOWCASE_IDS = [
  'Batik_Parang_Rusak', 'Batik_Megamendung', 'Batik_Singa_Barong', 'Batik_Kawung',
  'Batik_Truntum', 'Batik_Sekar_Jagad', 'Batik_Paksi_Naga_Liman', 'Batik_Wahyu_Tumurun'
];

export default function BatikApp() {
  const [activeTab, setActiveTab] = useState<'landing' | 'search' | 'knowledge' | 'sparql' | 'guide'>('landing');
  const [searchQuery, setSearchQuery] = useState('');
  const [heroInput, setHeroInput] = useState('');
  const [showHeroDropdown, setShowHeroDropdown] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);

  const [filterJenis, setFilterJenis] = useState('all');
  const [filterMotif, setFilterMotif] = useState('all');
  const [filterAcara, setFilterAcara] = useState('all');
  const [filterWarna, setFilterWarna] = useState('all');
  const [filterPulau, setFilterPulau] = useState('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'name-asc' | 'name-desc' | 'complexity'>('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedBatik, setSelectedBatik] = useState<BatikItem | null>(null);

  const allBatiks = ontologyBundle.batiks as unknown as BatikItem[];
  
  // Auto-cycle Hero Showcase
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % HERO_FEATURED.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const marqueeBatiks = useMemo(() => {
    const matched = allBatiks.filter(b => MARQUEE_IDS.includes(b.id));
    return [...matched, ...matched];
  }, [allBatiks]);

  const showcaseBatiks = useMemo(() => {
    return allBatiks.filter(b => SHOWCASE_IDS.includes(b.id));
  }, [allBatiks]);

  const heroSearchResults = useMemo(() => {
    const q = heroInput.trim().toLowerCase();
    if (q.length < 2) return [];
    return allBatiks.filter(b => 
      b.nama.toLowerCase().includes(q) ||
      b.wilayah.nama.toLowerCase().includes(q) ||
      b.wilayah.provinsi.toLowerCase().includes(q) ||
      b.motif.nama.toLowerCase().includes(q) ||
      b.deskripsi.toLowerCase().includes(q)
    ).slice(0, 5);
  }, [heroInput, allBatiks]);

  // Semantic search results
  const { results: rawResults, semanticMatch, typoCorrection } = searchSemanticBatik(searchQuery, {
    jenis: filterJenis,
    motif: filterMotif,
    acara: filterAcara,
    warna: filterWarna,
    pulau: filterPulau,
  });

  // Sorted results
  const filteredBatiks = useMemo(() => {
    const list = [...rawResults];
    if (sortBy === 'name-asc') {
      list.sort((a, b) => a.nama.localeCompare(b.nama));
    } else if (sortBy === 'name-desc') {
      list.sort((a, b) => b.nama.localeCompare(a.nama));
    } else if (sortBy === 'complexity') {
      const order: Record<string, number> = { 'Sangat Tinggi': 4, 'Tinggi': 3, 'Sedang': 2, 'Rendah': 1 };
      list.sort((a, b) => (order[b.tingkatKerumitan] || 0) - (order[a.tingkatKerumitan] || 0));
    }
    return list;
  }, [rawResults, sortBy]);

  // Handle direct search triggering from other tabs
  const handleTriggerSearch = (q: string) => {
    setSearchQuery(q);
    setActiveTab('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setFilterJenis('all');
    setFilterMotif('all');
    setFilterAcara('all');
    setFilterWarna('all');
    setFilterPulau('all');
    setSortBy('relevance');
  };

  const hasActiveFilters = searchQuery !== '' || filterJenis !== 'all' || filterMotif !== 'all' || filterAcara !== 'all' || filterWarna !== 'all' || filterPulau !== 'all';

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#2A180B] font-sans antialiased">
      
      {/* ============================================================== */}
      {/* HEADER UTAMA INSTITUSIONAL DENGAN NAVIGASI MODERN              */}
      {/* ============================================================== */}
      <header className="bg-[#0B132B] text-white border-b-2 border-[#C59B27]/40 shadow-xl sticky top-0 z-40 backdrop-blur-md bg-[#0B132B]/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            
            {/* Logo & Identitas Sistem */}
            <div 
              onClick={() => setActiveTab('landing')}
              className="flex items-center gap-3 cursor-pointer group select-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C59B27] to-[#8B5A2B] p-0.5 shadow-md group-hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-[10px] bg-[#0B132B] flex items-center justify-center text-[#E8C56A]">
                  <Compass className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="text-[10px] tracking-widest uppercase text-[#C59B27] font-bold flex items-center gap-1.5">
                  <span>Portal Web Semantik</span>
                  <span className="w-1 h-1 rounded-full bg-[#C59B27]" />
                  <span>OWL 2 Knowledge Graph</span>
                </div>
                <h1 className="text-base sm:text-lg font-bold tracking-wide text-white leading-tight font-display">
                  SISTEM INFORMASI SEMANTIK BATIK NUSANTARA
                </h1>
              </div>
            </div>

            {/* Menu Navigasi Modul Modern */}
            <nav className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold py-1">
              <button
                onClick={() => setActiveTab('landing')}
                className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'landing'
                    ? 'bg-[#C59B27] text-[#0B132B] font-bold shadow'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>Beranda</span>
              </button>

              <button
                onClick={() => setActiveTab('search')}
                className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'search'
                    ? 'bg-[#C59B27] text-[#0B132B] font-bold shadow'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                <span>Katalog Semantik</span>
              </button>

              <button
                onClick={() => setActiveTab('knowledge')}
                className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'knowledge'
                    ? 'bg-[#C59B27] text-[#0B132B] font-bold shadow'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Dasar Pengetahuan</span>
              </button>

              <button
                onClick={() => setActiveTab('sparql')}
                className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'sparql'
                    ? 'bg-[#C59B27] text-[#0B132B] font-bold shadow'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>SPARQL Lab</span>
              </button>

              <button
                onClick={() => setActiveTab('guide')}
                className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'guide'
                    ? 'bg-[#C59B27] text-[#0B132B] font-bold shadow'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Panduan NetBeans</span>
              </button>
            </nav>

          </div>
        </div>
      </header>

      {/* ============================================================== */}
      {/* KONTEN UTAMA APLIKASI                                          */}
      {/* ============================================================== */}
      <main className="flex-1 w-full">
        
        {/* ============================================================== */}
        {/* MODUL 1: BERANDA & HERO UTAMA (CREATIVE TIM NEXTJS/TAILWIND STYLE) */}
        {/* ============================================================== */}
        {activeTab === 'landing' && (
          <div className="space-y-16 pb-20">
            
            {/* HERO SHOWCASE SECTION (SPLIT-SCREEN INTERACTIVE) */}
            <div className="bg-gradient-to-b from-[#080D1A] via-[#0F172A] to-[#080D1A] text-white py-14 sm:py-20 border-b border-[#C59B27]/30 relative overflow-hidden">
              <div className="absolute -right-20 -top-20 w-96 h-96 bg-[#C59B27]/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-[#8B5A2B]/15 rounded-full blur-3xl pointer-events-none" />

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
                  
                  {/* Left Column: Typography, Capsule Search, CTAs & Metrics */}
                  <div className="lg:col-span-7 space-y-6">
                    
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#C59B27]/15 border border-[#C59B27]/40 text-[#E8C56A] text-xs font-bold tracking-wide shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>UNESCO Intangible Cultural Heritage of Humanity • W3C OWL 2</span>
                    </div>

                    {/* Main Title */}
                    <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.12] text-white font-display">
                      Khazanah Adiluhung <br />
                      <span className="text-gold-gradient">Batik Nusantara</span> <br />
                      <span className="text-xl sm:text-2xl lg:text-3xl text-gray-300 font-sans font-normal tracking-normal">Berbasis Graf Pengetahuan Ontologi</span>
                    </h2>

                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-2xl font-sans">
                      Eksplorasi cerdas <strong>48 kain batik nusantara</strong> dan <strong>29 kelas taksonomi</strong> yang terhubung melalui graf semantik OWL 2 / W3C RDF. Temukan makna sakral filosofis, norma larangan keraton Jawa, kriya canting tradisional, serta konteks seremonial ritus adat Indonesia.
                    </p>

                    {/* Interactive Search Capsule with Live Auto-Dropdown */}
                    <div className="pt-1 max-w-xl relative">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#C59B27]">
                          <Search className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          value={heroInput}
                          onChange={(e) => {
                            setHeroInput(e.target.value);
                            setShowHeroDropdown(e.target.value.trim().length >= 2);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleTriggerSearch(heroInput);
                              setShowHeroDropdown(false);
                            }
                          }}
                          placeholder="Ketik konsep motif (contoh: parang, kawung, manten, duka, ikan, soga)..."
                          className="w-full pl-11 pr-28 py-3.5 bg-slate-900/90 border border-[#C59B27]/40 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C59B27] text-xs font-medium shadow-2xl backdrop-blur-md"
                        />
                        <button 
                          onClick={() => {
                            handleTriggerSearch(heroInput);
                            setShowHeroDropdown(false);
                          }}
                          className="absolute inset-y-0 right-2 px-5 my-1.5 bg-gradient-to-r from-[#C59B27] to-[#E8C56A] text-[#080D1A] font-bold text-xs rounded-xl hover:from-[#E8C56A] hover:to-[#C59B27] transition shadow-md flex items-center gap-1.5"
                        >
                          <span>Cari</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Floating Live Search Dropdown */}
                      {showHeroDropdown && (
                        <div className="absolute left-0 right-0 top-full mt-2 bg-[#0F172A] border border-[#C59B27]/40 rounded-2xl shadow-2xl p-2 z-50 divide-y divide-slate-800">
                          {heroSearchResults.length === 0 ? (
                            <div className="p-3 text-center text-xs text-gray-400">
                              Tidak ditemukan motif yang cocok dengan &quot;<strong>{heroInput}</strong>&quot;. Tekan Enter untuk mencari lebih luas.
                            </div>
                          ) : (
                            <>
                              {heroSearchResults.map((b) => (
                                <div 
                                  key={b.id}
                                  onClick={() => {
                                    setSelectedBatik(b);
                                    setShowHeroDropdown(false);
                                  }}
                                  className="p-2.5 hover:bg-slate-800 rounded-xl transition cursor-pointer flex items-center gap-3 group text-white"
                                >
                                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-black/40 shrink-0 border border-[#C59B27]/30">
                                    <BatikImage id={b.id} alt={b.nama} className="w-full h-full" />
                                  </div>
                                  <div className="overflow-hidden flex-1">
                                    <div className="flex items-center justify-between">
                                      <h5 className="text-xs font-bold text-[#E8C56A] group-hover:text-amber-300 truncate">{b.nama}</h5>
                                      <span className="text-[9px] px-2 py-0.5 rounded bg-[#C59B27]/20 text-[#E8C56A] font-bold uppercase">{b.motif.kategori}</span>
                                    </div>
                                    <p className="text-[11px] text-gray-300 truncate">{b.wilayah.nama}, {b.wilayah.provinsi}</p>
                                  </div>
                                </div>
                              ))}
                              <div className="p-2 text-center bg-black/30 rounded-b-xl">
                                <button 
                                  onClick={() => {
                                    handleTriggerSearch(heroInput);
                                    setShowHeroDropdown(false);
                                  }} 
                                  className="text-[11px] font-bold text-[#E8C56A] hover:underline"
                                >
                                  Lihat Semua Hasil di Katalog Semantik ➔
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Quick Concept Pills */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="text-gray-400 text-[11px] font-semibold flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" /> Topik Cepat:
                      </span>
                      {[
                        { label: '👑 Keraton', q: 'keraton' },
                        { label: '💍 Manten', q: 'manten' },
                        { label: '🕊️ Lelayu', q: 'lelayu' },
                        { label: '🌿 Soga Alami', q: 'soga' },
                        { label: '🪶 Canting', q: 'canting' },
                        { label: '☁️ Megamendung', q: 'megamendung' },
                      ].map((chip) => (
                        <button
                          key={chip.q}
                          onClick={() => handleTriggerSearch(chip.q)}
                          className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-[#C59B27] hover:text-[#080D1A] text-gray-200 border border-white/15 transition text-[11px] font-medium"
                        >
                          {chip.label}
                        </button>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-bold">
                      <button 
                        onClick={() => setActiveTab('search')}
                        className="px-6 py-3.5 bg-gradient-to-r from-[#C59B27] to-[#E8C56A] hover:from-[#E8C56A] hover:to-[#C59B27] text-[#080D1A] rounded-xl shadow-xl transition flex items-center gap-2 transform hover:-translate-y-0.5"
                      >
                        <LayoutGrid className="w-4 h-4" /> Eksplorasi 48 Koleksi Motif
                      </button>
                      <button 
                        onClick={() => setActiveTab('knowledge')}
                        className="px-6 py-3.5 bg-slate-900/90 hover:bg-slate-800 text-white rounded-xl border border-[#C59B27]/40 transition flex items-center gap-2 transform hover:-translate-y-0.5 shadow-lg"
                      >
                        <BookOpen className="w-4 h-4 text-[#C59B27]" /> Dasar Pengetahuan Bergambar
                      </button>
                      <button 
                        onClick={() => setActiveTab('sparql')}
                        className="px-5 py-3.5 bg-black/60 hover:bg-black/80 text-emerald-400 font-mono rounded-xl border border-slate-700 transition flex items-center gap-2"
                      >
                        <Terminal className="w-4 h-4" /> SPARQL Lab
                      </button>
                    </div>

                    {/* Quick Metrics Row */}
                    <div className="pt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl text-xs">
                      <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 backdrop-blur-sm">
                        <span className="text-gray-400 text-[10px] uppercase font-semibold block">Individu Batik</span>
                        <span className="text-2xl font-extrabold text-[#E8C56A] font-display">48</span>
                        <span className="text-[10px] text-gray-500 block">Kain Terdata</span>
                      </div>
                      <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 backdrop-blur-sm">
                        <span className="text-gray-400 text-[10px] uppercase font-semibold block">Kelas Taksonomi</span>
                        <span className="text-2xl font-extrabold text-[#E8C56A] font-display">29</span>
                        <span className="text-[10px] text-gray-500 block">Konsep OWL</span>
                      </div>
                      <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 backdrop-blur-sm">
                        <span className="text-gray-400 text-[10px] uppercase font-semibold block">Relasi Objek</span>
                        <span className="text-2xl font-extrabold text-[#E8C56A] font-display">16</span>
                        <span className="text-[10px] text-gray-500 block">Object Properties</span>
                      </div>
                      <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 backdrop-blur-sm">
                        <span className="text-gray-400 text-[10px] uppercase font-semibold block">Verifikasi</span>
                        <span className="text-2xl font-extrabold text-emerald-400 font-display">100%</span>
                        <span className="text-[10px] text-gray-500 block">Valid Jena Model</span>
                      </div>
                    </div>

                  </div>

                  {/* Right Column: Interactive 3D Showcase Card (Creative Tim Style) */}
                  <div className="lg:col-span-5 space-y-4">
                    
                    {/* The Active Showcase Card */}
                    <div className="bg-slate-900/85 backdrop-blur-md rounded-3xl p-5 shadow-2xl border border-[#C59B27]/30 relative overflow-hidden group">
                      
                      {/* Card Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-amber-900/20 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-[#C59B27]/20 text-[#E8C56A] border border-[#C59B27]/30 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            {HERO_FEATURED[heroIndex].badge}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono text-gray-400 bg-black/50 px-2.5 py-0.5 rounded-full border border-gray-700">
                            {heroIndex + 1} / {HERO_FEATURED.length}
                          </span>
                          <span className="w-2 h-2 rounded-full bg-[#E8C56A] animate-ping" />
                        </div>
                      </div>

                      {/* Main Image Stage */}
                      <div 
                        onClick={() => {
                          const item = allBatiks.find(b => b.id === HERO_FEATURED[heroIndex].id);
                          if (item) setSelectedBatik(item);
                        }}
                        className="mt-3.5 h-64 sm:h-72 w-full relative rounded-2xl overflow-hidden bg-[#080D1A] border border-[#C59B27]/20 group/stage cursor-pointer"
                      >
                        <BatikImage 
                          id={HERO_FEATURED[heroIndex].id} 
                          alt={HERO_FEATURED[heroIndex].nama}
                          className="w-full h-full object-cover transition-all duration-700 group-hover/stage:scale-105"
                        />
                        {/* Floating region badge */}
                        <div className="absolute bottom-3 left-3 px-3 py-1 bg-[#080D1A]/85 backdrop-blur-md rounded-xl text-white text-xs font-semibold flex items-center gap-1.5 border border-[#C59B27]/30 shadow-md">
                          <MapPin className="w-3.5 h-3.5 text-[#E8C56A]" />
                          <span>{HERO_FEATURED[heroIndex].wilayah}</span>
                        </div>
                        {/* Floating inspect button */}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            const item = allBatiks.find(b => b.id === HERO_FEATURED[heroIndex].id);
                            if (item) setSelectedBatik(item);
                          }}
                          className="absolute top-3 right-3 p-2.5 bg-[#080D1A]/80 hover:bg-[#C59B27] hover:text-[#080D1A] text-[#E8C56A] rounded-xl backdrop-blur-md border border-[#C59B27]/30 transition shadow-lg group-hover/stage:scale-110"
                          title="Buka Graf Triples"
                        >
                          <Maximize2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Body Text & Navigation */}
                      <div className="pt-4 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-[#E8C56A] tracking-wider">
                              {HERO_FEATURED[heroIndex].teknik}
                            </span>
                            <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                              {HERO_FEATURED[heroIndex].nama}
                            </h3>
                          </div>
                          {/* Prev/Next Controls */}
                          <div className="flex items-center gap-1">
                            <button 
                              onClick={() => setHeroIndex(prev => (prev - 1 + HERO_FEATURED.length) % HERO_FEATURED.length)}
                              className="p-2 rounded-xl bg-slate-800/80 hover:bg-[#C59B27] hover:text-[#080D1A] text-gray-300 border border-slate-700 transition" 
                              title="Sebelumnya"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => setHeroIndex(prev => (prev + 1) % HERO_FEATURED.length)}
                              className="p-2 rounded-xl bg-slate-800/80 hover:bg-[#C59B27] hover:text-[#080D1A] text-gray-300 border border-slate-700 transition" 
                              title="Berikutnya"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <p className="text-xs text-amber-100/80 italic line-clamp-2 leading-relaxed bg-black/30 p-2.5 rounded-xl border border-white/5">
                          &quot;{HERO_FEATURED[heroIndex].filosofi}&quot;
                        </p>

                        <button 
                          onClick={() => {
                            const item = allBatiks.find(b => b.id === HERO_FEATURED[heroIndex].id);
                            if (item) setSelectedBatik(item);
                          }}
                          className="w-full py-2.5 bg-[#C59B27]/20 hover:bg-[#C59B27] hover:text-[#080D1A] text-[#E8C56A] font-bold text-xs rounded-xl border border-[#C59B27]/40 transition flex items-center justify-center gap-2 shadow-sm"
                        >
                          <Network className="w-4 h-4" /> Buka Graf Relasi Triples & Sintaks RDF
                        </button>
                      </div>

                    </div>

                    {/* Interactive 5-Thumbnail Switcher Strip */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] text-gray-400 font-medium block">Pilih Mahakarya Utama:</span>
                      <div className="grid grid-cols-5 gap-2">
                        {HERO_FEATURED.map((item, idx) => (
                          <button
                            key={item.id}
                            onClick={() => setHeroIndex(idx)}
                            className={`h-14 sm:h-16 rounded-xl overflow-hidden border-2 transition-all p-0.5 bg-[#080D1A] group cursor-pointer ${
                              idx === heroIndex 
                                ? 'border-[#E8C56A] shadow-md scale-105' 
                                : 'border-slate-700/60 opacity-70 hover:opacity-100 hover:border-[#E8C56A]/60'
                            }`}
                            title={item.nama}
                          >
                            <BatikImage id={item.id} alt={item.nama} className="w-full h-full object-cover rounded-lg group-hover:scale-110 transition duration-300" />
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>
              </div>
            </div>

            {/* INTERACTIVE MARQUEE / LIVE BATIK SLIDER */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C59B27]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#4A2E18]">
                    Galeri Mahakarya Nusantara Bergerak (Klik Kartu untuk Rincian)
                  </span>
                </div>
                <span className="text-xs text-gray-500">Arahkan kursor untuk jeda</span>
              </div>

              <div className="relative overflow-hidden rounded-2xl bg-white border border-[#E8DFC9] shadow-sm py-4">
                <div className="animate-marquee gap-4 px-4">
                  {marqueeBatiks.map((b, idx) => (
                    <div
                      key={`${b.id}-${idx}`}
                      onClick={() => setSelectedBatik(b)}
                      className="shrink-0 flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 hover:bg-amber-50 border border-amber-900/10 hover:border-[#C59B27] transition cursor-pointer group shadow-xs w-64 select-none"
                    >
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-black/30 shrink-0 border border-amber-900/15">
                        <BatikImage id={b.id} alt={b.nama} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                      </div>
                      <div className="overflow-hidden space-y-0.5">
                        <span className="text-[9px] uppercase font-bold text-amber-700 block">{b.jenisLabel}</span>
                        <h5 className="text-xs font-bold text-slate-900 truncate group-hover:text-[#99732B] transition">{b.nama}</h5>
                        <p className="text-[10px] text-gray-500 truncate flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5 text-[#C59B27]" /> {b.wilayah.nama}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* VISUAL TAXONOMY: 4 PILAR KATEGORI MOTIF (CREATIVE TIM VISUAL CARDS) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#E8DFC9] pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#99732B]">Taksonomi Semantik</span>
                  <h3 className="text-2xl font-bold font-display text-slate-900">Jelajahi Berdasarkan 4 Pilar Kategori Motif</h3>
                </div>
                <p className="text-xs text-gray-600 max-w-md">
                  Setiap ornamen batik diklasifikasikan ke dalam kelas ontologi formal yang memiliki makna simbolik dan filosofis khas.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Card 1: Geometris */}
                <div 
                  onClick={() => {
                    setFilterMotif('geometris');
                    setActiveTab('search');
                  }}
                  className="relative overflow-hidden rounded-2xl h-80 border border-amber-900/10 shadow-md hover:shadow-2xl hover:border-[#C59B27] transition-all duration-500 cursor-pointer group flex flex-col justify-between p-6 bg-[#080D1A]"
                >
                  <div className="absolute inset-0 bg-cover bg-center opacity-25 group-hover:opacity-40 group-hover:scale-110 transition duration-700" style={{ backgroundImage: `url('/img/Batik_Kawung.svg')` }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080D1A] via-[#080D1A]/70 to-transparent" />
                  
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-[#C59B27]/20 text-[#E8C56A] text-[10px] font-bold uppercase tracking-wider border border-[#C59B27]/40">
                      14 Kain Koleksi
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[#C59B27]/20 text-[#E8C56A] flex items-center justify-center border border-[#C59B27]/30 group-hover:rotate-12 transition">
                      <GridIcon className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="relative z-10 space-y-2 text-white">
                    <h4 className="text-xl font-bold font-display text-[#E8C56A] group-hover:text-amber-300 transition">Motif Geometris</h4>
                    <p className="text-xs text-gray-300 leading-relaxed line-clamp-2">
                      Pola simetris tatanan kosmis: Kawung, Parang, Ceplok, Slobog, Banji. Melambangkan keteraturan batin.
                    </p>
                    <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-[#E8C56A] group-hover:translate-x-1 transition">
                      <span>Jelajahi Geometris</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>

                {/* Card 2: Flora */}
                <div 
                  onClick={() => {
                    setFilterMotif('flora');
                    setActiveTab('search');
                  }}
                  className="relative overflow-hidden rounded-2xl h-80 border border-amber-900/10 shadow-md hover:shadow-2xl hover:border-[#C59B27] transition-all duration-500 cursor-pointer group flex flex-col justify-between p-6 bg-[#080D1A]"
                >
                  <div className="absolute inset-0 bg-cover bg-center opacity-25 group-hover:opacity-40 group-hover:scale-110 transition duration-700" style={{ backgroundImage: `url('/img/Batik_Truntum.svg')` }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080D1A] via-[#080D1A]/70 to-transparent" />
                  
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/40">
                      16 Kain Koleksi
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 group-hover:rotate-12 transition">
                      <Flower className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="relative z-10 space-y-2 text-white">
                    <h4 className="text-xl font-bold font-display text-emerald-400 group-hover:text-emerald-300 transition">Motif Flora</h4>
                    <p className="text-xs text-gray-300 leading-relaxed line-clamp-2">
                      Keindahan tanaman & bunga: Truntum, Sido Asih, Sido Luhur, Sekar Jagad. Simbol kesuburan & cinta kasih.
                    </p>
                    <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition">
                      <span>Jelajahi Flora</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>

                {/* Card 3: Fauna */}
                <div 
                  onClick={() => {
                    setFilterMotif('fauna');
                    setActiveTab('search');
                  }}
                  className="relative overflow-hidden rounded-2xl h-80 border border-amber-900/10 shadow-md hover:shadow-2xl hover:border-[#C59B27] transition-all duration-500 cursor-pointer group flex flex-col justify-between p-6 bg-[#080D1A]"
                >
                  <div className="absolute inset-0 bg-cover bg-center opacity-25 group-hover:opacity-40 group-hover:scale-110 transition duration-700" style={{ backgroundImage: `url('/img/Batik_Singa_Barong.svg')` }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080D1A] via-[#080D1A]/70 to-transparent" />
                  
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold uppercase tracking-wider border border-blue-500/40">
                      10 Kain Koleksi
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30 group-hover:rotate-12 transition">
                      <Shield className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="relative z-10 space-y-2 text-white">
                    <h4 className="text-xl font-bold font-display text-blue-400 group-hover:text-blue-300 transition">Motif Fauna</h4>
                    <p className="text-xs text-gray-300 leading-relaxed line-clamp-2">
                      Satwa nyata & mitologis: Singa Barong, Paksi Naga Liman, Sawung Galing, Garuda. Simbol kewibawaan.
                    </p>
                    <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-blue-400 group-hover:translate-x-1 transition">
                      <span>Jelajahi Fauna</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>

                {/* Card 4: Alam Semesta */}
                <div 
                  onClick={() => {
                    setFilterMotif('alam');
                    setActiveTab('search');
                  }}
                  className="relative overflow-hidden rounded-2xl h-80 border border-amber-900/10 shadow-md hover:shadow-2xl hover:border-[#C59B27] transition-all duration-500 cursor-pointer group flex flex-col justify-between p-6 bg-[#080D1A]"
                >
                  <div className="absolute inset-0 bg-cover bg-center opacity-25 group-hover:opacity-40 group-hover:scale-110 transition duration-700" style={{ backgroundImage: `url('/img/Batik_Megamendung.svg')` }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080D1A] via-[#080D1A]/70 to-transparent" />
                  
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold uppercase tracking-wider border border-purple-500/40">
                      8 Kain Koleksi
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30 group-hover:rotate-12 transition">
                      <Cloud className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="relative z-10 space-y-2 text-white">
                    <h4 className="text-xl font-bold font-display text-purple-400 group-hover:text-purple-300 transition">Motif Alam Semesta</h4>
                    <p className="text-xs text-gray-300 leading-relaxed line-clamp-2">
                      Elemen kosmos & cakrawala: Megamendung (awan taois), Semen Rama, Hujan Panas. Ketenangan batin.
                    </p>
                    <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-purple-400 group-hover:translate-x-1 transition">
                      <span>Jelajahi Alam</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* VISUAL DAUR HIDUP ADAT & SEREMONIAL NUSANTARA */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              <div className="bg-gradient-to-br from-[#080D1A] to-[#0F172A] rounded-3xl p-6 sm:p-10 border border-[#C59B27]/30 text-white space-y-6 shadow-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#E8C56A] flex items-center gap-1.5">
                      <HeartHandshake className="w-4 h-4 text-[#C59B27]" /> Nilai Sakral Budaya
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-bold font-display text-white mt-1">
                      Daur Hidup Adat: Kelahiran, Pernikahan, & Lelayu
                    </h3>
                  </div>
                  <button 
                    onClick={() => setActiveTab('knowledge')} 
                    className="px-5 py-2.5 bg-[#C59B27]/20 hover:bg-[#C59B27] hover:text-[#080D1A] text-[#E8C56A] rounded-xl border border-[#C59B27]/40 text-xs font-bold transition flex items-center gap-2"
                  >
                    <span>Buka Modul Adat Lengkap</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  
                  {/* Adat 1: Kelahiran / Mitoni */}
                  <div 
                    onClick={() => {
                      setFilterAcara('kelahiran');
                      setActiveTab('search');
                    }}
                    className="bg-slate-900/80 hover:bg-slate-800/90 rounded-2xl p-4 border border-amber-500/20 hover:border-amber-400 transition cursor-pointer group space-y-3"
                  >
                    <div className="h-36 rounded-xl overflow-hidden bg-black/40 relative">
                      <BatikImage id="Batik_Wahyu_Tumurun" alt="Batik Wahyu Tumurun" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 text-[10px] font-bold">Mitoni / 7 Bulanan</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white group-hover:text-[#E8C56A] transition">Wahyu Tumurun</h4>
                      <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">Doa turunnya wahyu petunjuk dan kemuliaan bagi calon buah hati.</p>
                    </div>
                  </div>

                  {/* Adat 2: Pernikahan */}
                  <div 
                    onClick={() => {
                      setFilterAcara('pernikahan');
                      setActiveTab('search');
                    }}
                    className="bg-slate-900/80 hover:bg-slate-800/90 rounded-2xl p-4 border border-amber-500/20 hover:border-amber-400 transition cursor-pointer group space-y-3"
                  >
                    <div className="h-36 rounded-xl overflow-hidden bg-black/40 relative">
                      <BatikImage id="Batik_Sido_Asih" alt="Batik Sido Asih" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-pink-950/80 text-pink-300 text-[10px] font-bold">Pernikahan Adat</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white group-hover:text-[#E8C56A] transition">Sido Asih & Truntum</h4>
                      <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">Harapan saling mengasihi lahir batin dan cinta yang senantiasa bersemi.</p>
                    </div>
                  </div>

                  {/* Adat 3: Lelayu / Kematian */}
                  <div 
                    onClick={() => {
                      setFilterAcara('kematian');
                      setActiveTab('search');
                    }}
                    className="bg-slate-900/80 hover:bg-slate-800/90 rounded-2xl p-4 border border-amber-500/20 hover:border-amber-400 transition cursor-pointer group space-y-3"
                  >
                    <div className="h-36 rounded-xl overflow-hidden bg-black/40 relative">
                      <BatikImage id="Batik_Slobog" alt="Batik Slobog" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 text-gray-300 text-[10px] font-bold">Lelayu / Kematian</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white group-hover:text-[#E8C56A] transition">Batik Slobog & Tambal</h4>
                      <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">Doa kelapangan dan kemudahan perjalanan arwah menuju Sang Khalik.</p>
                    </div>
                  </div>

                  {/* Adat 4: Awisan Dalem Keraton */}
                  <div 
                    onClick={() => handleTriggerSearch('keraton')}
                    className="bg-slate-900/80 hover:bg-slate-800/90 rounded-2xl p-4 border border-amber-500/20 hover:border-amber-400 transition cursor-pointer group space-y-3"
                  >
                    <div className="h-36 rounded-xl overflow-hidden bg-black/40 relative">
                      <BatikImage id="Batik_Parang_Rusak" alt="Batik Parang Rusak" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 text-[10px] font-bold">Larangan Keraton</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white group-hover:text-[#E8C56A] transition">Parang Rusak Barong</h4>
                      <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">Busana sakral eksklusif raja dan ksatria wangsa Mataram Islam.</p>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* SOROTAN 8 MAHAKARYA BATIK NUSANTARA (CREATIVE TIM CARD GRID) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              <div className="border-b border-[#E8DFC9] pb-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#99732B]">
                    Kurasi Khusus Warisan Keraton &amp; Pesisir
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#1C130D] mt-0.5 font-display">
                    Sorotan 8 Mahakarya Batik Nusantara
                  </h3>
                </div>
                <button 
                  onClick={() => setActiveTab('search')}
                  className="text-xs font-bold text-[#4A2E18] hover:text-[#99732B] flex items-center gap-1.5 transition">
                  Lihat Seluruh 48 Koleksi <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Grid 8 Kartu Mahakarya */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {showcaseBatiks.map((b) => (
                  <div 
                    key={b.id} 
                    className="bg-white rounded-3xl overflow-hidden border border-[#E8DFC9] shadow-md hover:shadow-2xl hover:border-[#C59B27] transition-all duration-500 flex flex-col justify-between group transform hover:-translate-y-1.5"
                  >
                    <div>
                      <div 
                        onClick={() => setSelectedBatik(b)}
                        className="h-52 w-full bg-[#080D1A] overflow-hidden relative cursor-pointer"
                      >
                        <BatikImage 
                          id={b.id} 
                          alt={b.nama} 
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                        />
                        <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#080D1A]/85 text-[#E8C56A] rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs border border-[#C59B27]/30">
                          {b.jenisLabel}
                        </span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBatik(b);
                          }}
                          className="absolute top-3 right-3 p-2 bg-[#080D1A]/80 hover:bg-[#C59B27] hover:text-[#080D1A] text-[#E8C56A] rounded-xl backdrop-blur-xs border border-[#C59B27]/30 transition shadow opacity-0 group-hover:opacity-100"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 bg-[#080D1A]/80 rounded-md text-[10px] font-semibold text-gray-200 flex items-center gap-1 backdrop-blur-xs">
                          <MapPin className="w-3 h-3 text-[#C59B27]" /> {b.wilayah.nama}
                        </div>
                      </div>

                      <div className="p-5 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            {b.motif.kategori}
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium">Pulau {b.wilayah.pulau}</span>
                        </div>
                        <h4 
                          onClick={() => setSelectedBatik(b)}
                          className="text-base font-bold text-slate-900 group-hover:text-amber-700 transition line-clamp-1 font-display cursor-pointer"
                        >
                          {b.nama}
                        </h4>
                        <p className="text-xs text-gray-600 italic line-clamp-2 bg-slate-50 p-3 rounded-xl border border-amber-900/10 leading-relaxed">
                          &quot;{b.maknaFilosofis}&quot;
                        </p>
                      </div>
                    </div>

                    <div className="p-5 pt-0">
                      <button
                        onClick={() => setSelectedBatik(b)}
                        className="w-full py-2.5 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-[#C59B27] hover:to-amber-500 hover:text-[#080D1A] text-amber-950 font-bold text-xs rounded-xl transition border border-amber-200 flex items-center justify-center gap-2 shadow-xs group-hover:shadow-md"
                      >
                        <Network className="w-3.5 h-3.5" /> Lihat Detail Relasi Triples
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3 PILAR ARSITEKTUR WEB SEMANTIK */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8DFC9] shadow-sm grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                    <Layers className="w-6 h-6 text-[#99732B]" />
                  </div>
                  <h4 className="font-bold text-base text-[#1C130D]">Model Ontologi Formal OWL 2</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Struktur taksonomi berstandar W3C memodelkan relasi material, kriya, makna filosofis, dan ritual adat ke dalam graf pengetahuan terpadu.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold">
                    <Sparkles className="w-6 h-6 text-blue-700" />
                  </div>
                  <h4 className="font-bold text-base text-[#1C130D]">Penalaran Sinonim Budaya</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Kueri awam seperti &apos;manten&apos;, &apos;ikan&apos;, atau &apos;soga&apos; secara otomatis diperluas ke konsep ontologi kelas dan properti yang relevan.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold">
                    <Terminal className="w-6 h-6 text-emerald-700" />
                  </div>
                  <h4 className="font-bold text-base text-[#1C130D]">Mesin Kueri SPARQL 1.1</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Laboratorium interaktif untuk mengeksekusi SPARQL query pattern, mengekstrak tupel semantik, dan mengekspor hasil ke format CSV.
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* MODUL 2: KATALOG & TEMU KEMBALI SEMANTIK                       */}
        {/* ============================================================== */}
        {activeTab === 'search' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
            
            {/* Panel Input Pencarian & Filter */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E8DFC9] shadow-sm space-y-5">
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4A2E18]">
                    Kueri Temu Kembali Semantik (Mendukung Sinonim Budaya &amp; Kelas Ontologi)
                  </label>
                  {hasActiveFilters && (
                    <button
                      onClick={resetAllFilters}
                      className="text-xs font-semibold text-[#99732B] hover:text-[#4A2E18] flex items-center gap-1 transition"
                    >
                      <RotateCcw className="w-3 h-3" /> Reset Filter
                    </button>
                  )}
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Search className="w-4 h-4 text-[#C59B27]" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Masukkan kata kunci pencarian (contoh: manten, duka, ikan, bunga, jogja, canting, lilin, soga, alam)..."
                    className="w-full pl-10 pr-24 py-3.5 bg-[#FAF7F2] border border-[#D9CEBC] rounded-xl text-[#2A180B] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C59B27] text-sm font-medium transition shadow-inner"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')} 
                      className="absolute inset-y-0 right-3 px-3 my-1.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-semibold transition"
                    >
                      Hapus
                    </button>
                  )}
                </div>
              </div>

              {/* Rekomendasi Kueri Sinonim Budaya & Keinginan Unik */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-[#8B5A2B] font-semibold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" /> Rekomendasi Kueri Cepat:
                </span>
                {['manten', 'wisuda', 'calon mertua', 'bucin', 'sultan', 'naga', 'awan mendung', 'sembuh sakit', 'megamendug', 'parng'].map((syn) => (
                  <button
                    key={syn}
                    onClick={() => setSearchQuery(syn)}
                    className="px-2.5 py-1 bg-[#FAF7F2] hover:bg-[#F0E6D2] hover:border-[#C59B27] text-[#4A2E18] rounded-lg border border-[#E8DFC9] font-medium transition text-[11px]"
                  >
                    &quot;{syn}&quot;
                  </button>
                ))}
              </div>

              {/* Banner Koreksi Typo */}
              {typoCorrection && (
                <div className="p-3.5 rounded-xl bg-blue-50 border-l-4 border-blue-500 text-xs text-blue-950 flex items-center justify-between gap-3 shadow-sm animate-fade-in">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-blue-100 text-blue-600 font-bold">💡</span>
                    <div>
                      <span className="font-bold">Koreksi Salah Ketik (Typo):</span> Menampilkan hasil untuk{' '}
                      <strong className="text-blue-700 underline font-semibold">&quot;{typoCorrection.corrected}&quot;</strong>{' '}
                      <span className="text-gray-500">(dikoreksi dari &quot;{typoCorrection.original}&quot; &bull; akurasi {Math.round(typoCorrection.confidence * 100)}%)</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSearchQuery(typoCorrection.original)}
                    className="text-[11px] text-blue-600 hover:text-blue-800 underline font-medium whitespace-nowrap cursor-pointer"
                  >
                    Cari &quot;{typoCorrection.original}&quot; saja
                  </button>
                </div>
              )}

              {/* Panel Penalaran Semantik (Semantic Query Expansion Card) */}
              {semanticMatch && (
                <div className={`p-4 rounded-xl border-l-4 text-xs text-[#2A180B] space-y-1.5 shadow-sm ${
                  semanticMatch.isQuirky 
                    ? 'bg-gradient-to-r from-purple-50/80 via-amber-50/60 to-rose-50/50 border-purple-600' 
                    : 'bg-gradient-to-r from-amber-50 to-orange-50 border-[#C59B27]'
                }`}>
                  <div className="font-bold flex items-center justify-between flex-wrap gap-2">
                    <span className="text-[#8B5A2B] uppercase tracking-wider text-[11px] flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" /> 
                      {semanticMatch.isQuirky ? 'Pemahaman Keinginan Budaya Unik:' : 'Penalaran Semantik (Semantic Query Expansion):'}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {semanticMatch.isQuirky && (
                        <span className="px-2 py-0.5 bg-purple-700 text-white rounded-md font-bold text-[10px] tracking-wide">
                          ✨ Keinginan Pengguna
                        </span>
                      )}
                      <span className="px-2 py-0.5 bg-[#C59B27] text-[#0B132B] rounded-md font-mono font-bold text-[11px]">
                        {semanticMatch.canonicalLabel}
                      </span>
                    </div>
                  </div>
                  <p className="leading-relaxed text-gray-700">
                    Kata kunci <strong>&quot;{semanticMatch.matchedKeyword}&quot;</strong> dipetakan secara formal ke konsep ontologi <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono font-bold text-[#4A2E18]">:{semanticMatch.ontologyClass}</code> via relasi <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">:{semanticMatch.property}</code>. {semanticMatch.reasoning}
                  </p>
                </div>
              )}

              {/* Baris Filter Terperinci */}
              <div className="pt-3 border-t border-[#E8DFC9] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
                
                {/* Filter Teknik */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Teknik Pembuatan:</label>
                  <select 
                    value={filterJenis} 
                    onChange={(e) => setFilterJenis(e.target.value)} 
                    className="w-full bg-[#FAF7F2] border border-[#D9CEBC] rounded-lg px-2.5 py-2 font-medium text-xs focus:ring-1 focus:ring-[#C59B27]"
                  >
                    <option value="all">Semua Teknik</option>
                    <option value="batik_tulis">Batik Tulis</option>
                    <option value="batik_cap">Batik Cap</option>
                    <option value="batik_cetak">Batik Cetak / Sablon</option>
                    <option value="batik_kombinasi">Batik Kombinasi</option>
                  </select>
                </div>

                {/* Filter Motif */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Kategori Motif:</label>
                  <select 
                    value={filterMotif} 
                    onChange={(e) => setFilterMotif(e.target.value)} 
                    className="w-full bg-[#FAF7F2] border border-[#D9CEBC] rounded-lg px-2.5 py-2 font-medium text-xs focus:ring-1 focus:ring-[#C59B27]"
                  >
                    <option value="all">Semua Motif</option>
                    <option value="flora">Flora (Tumbuhan)</option>
                    <option value="fauna">Fauna (Satwa)</option>
                    <option value="geometris">Geometris (Simetris)</option>
                    <option value="alam">Alam (Awan/Ombak)</option>
                  </select>
                </div>

                {/* Filter Acara Adat */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Konteks Seremonial:</label>
                  <select 
                    value={filterAcara} 
                    onChange={(e) => setFilterAcara(e.target.value)} 
                    className="w-full bg-[#FAF7F2] border border-[#D9CEBC] rounded-lg px-2.5 py-2 font-medium text-xs focus:ring-1 focus:ring-[#C59B27]"
                  >
                    <option value="all">Semua Acara</option>
                    <option value="pernikahan">Pernikahan Adat</option>
                    <option value="kelahiran">Mitoni / Kelahiran</option>
                    <option value="kematian">Lelayu / Kematian</option>
                    <option value="kerajaan">Lingkungan Keraton</option>
                    <option value="busana_formal">Busana Formal</option>
                  </select>
                </div>

                {/* Filter Pewarna */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Formula Pewarna:</label>
                  <select 
                    value={filterWarna} 
                    onChange={(e) => setFilterWarna(e.target.value)} 
                    className="w-full bg-[#FAF7F2] border border-[#D9CEBC] rounded-lg px-2.5 py-2 font-medium text-xs focus:ring-1 focus:ring-[#C59B27]"
                  >
                    <option value="all">Semua Pewarna</option>
                    <option value="alami">Alami Organik (Soga/Indigo)</option>
                    <option value="sintetis">Sintetis Kimia (Remazol)</option>
                  </select>
                </div>

                {/* Filter Pulau */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Wilayah Pulau:</label>
                  <select 
                    value={filterPulau} 
                    onChange={(e) => setFilterPulau(e.target.value)} 
                    className="w-full bg-[#FAF7F2] border border-[#D9CEBC] rounded-lg px-2.5 py-2 font-medium text-xs focus:ring-1 focus:ring-[#C59B27]"
                  >
                    <option value="all">Seluruh Nusantara</option>
                    <option value="Jawa">Pulau Jawa</option>
                    <option value="Sumatera">Pulau Sumatera</option>
                    <option value="Kalimantan">Pulau Kalimantan</option>
                    <option value="Papua">Papua</option>
                    <option value="Bali">Bali</option>
                    <option value="Sulawesi">Sulawesi</option>
                  </select>
                </div>

              </div>

              {/* Bar Status & Kontrol Tampilan */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#E8DFC9] text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <span>Menampilkan <strong>{filteredBatiks.length}</strong> entitas kain batik</span>
                  {hasActiveFilters && (
                    <span className="text-gray-400 font-mono text-[11px]">
                      (dari total 48)
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {/* Sort Dropdown */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-500 text-[11px]">Urutkan:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-[#FAF7F2] border border-[#D9CEBC] rounded-lg px-2 py-1 text-xs font-semibold focus:ring-1 focus:ring-[#C59B27]"
                    >
                      <option value="relevance">Relevansi Semantik</option>
                      <option value="name-asc">Nama (A - Z)</option>
                      <option value="name-desc">Nama (Z - A)</option>
                      <option value="complexity">Tingkat Kerumitan</option>
                    </select>
                  </div>

                  {/* View Mode Toggle */}
                  <div className="flex items-center border border-[#D9CEBC] rounded-lg overflow-hidden bg-[#FAF7F2]">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-1.5 transition ${viewMode === 'grid' ? 'bg-[#0B132B] text-white' : 'text-gray-500 hover:text-black'}`}
                      title="Tampilan Grid 3 Kolom"
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-1.5 transition ${viewMode === 'list' ? 'bg-[#0B132B] text-white' : 'text-gray-500 hover:text-black'}`}
                      title="Tampilan Daftar Baris"
                    >
                      <List className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>

            </div>

            {/* ============================================================== */}
            {/* GRID HASIL KATALOG LENGKAP                                     */}
            {/* ============================================================== */}
            {filteredBatiks.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBatiks.map((b) => (
                    <div 
                      key={b.id} 
                      className="bg-white rounded-2xl overflow-hidden border border-[#E8DFC9] shadow-sm hover:shadow-xl hover:border-[#C59B27] transition-all duration-300 flex flex-col justify-between group transform hover:-translate-y-1"
                    >
                      <div>
                        {/* Gambar Motif SVG Terverifikasi */}
                        <div className="h-48 w-full bg-[#F2ECE1] overflow-hidden relative">
                          <BatikImage 
                            id={b.id} 
                            alt={b.nama} 
                            className="w-full h-full"
                          />
                          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                            <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-md bg-[#0B132B]/85 text-[#E8C56A] backdrop-blur-xs uppercase tracking-wider">
                              {b.jenisLabel}
                            </span>
                            <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-white/90 text-[#4A2E18] backdrop-blur-xs uppercase">
                              {b.motif.kategori}
                            </span>
                          </div>

                          <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 backdrop-blur-xs rounded text-[10px] text-gray-200 font-mono">
                            :{b.id}
                          </div>
                        </div>

                        {/* Konten Kartu */}
                        <div className="p-4 sm:p-5 space-y-2.5">
                          <div>
                            <h3 className="text-base font-bold text-[#1C130D] group-hover:text-[#99732B] transition line-clamp-1">
                              {b.nama}
                            </h3>
                            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-[#C59B27]" />
                              {b.wilayah.nama}, {b.wilayah.provinsi} ({b.wilayah.pulau})
                            </p>
                          </div>

                          <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8DFC9] text-xs text-gray-700 italic line-clamp-2 leading-relaxed">
                            &quot;{b.maknaFilosofis || b.deskripsi}&quot;
                          </div>

                          {/* Chips Tag Tambahan */}
                          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px]">
                            {b.acara && b.acara.slice(0, 2).map((a) => (
                              <span key={a.id} className="px-2 py-0.5 rounded bg-[#F0E6D2] text-[#4A2E18] font-medium">
                                {a.nama}
                              </span>
                            ))}
                            {b.pewarnaan && b.pewarnaan.length > 0 && (
                              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-medium">
                                {b.pewarnaan[0].tipe}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Footer Kartu */}
                      <div className="p-4 sm:p-5 pt-3 border-t border-[#E8DFC9] flex items-center justify-between text-xs bg-[#FAF7F2]/50">
                        <span className="text-gray-500 text-[11px]">
                          Kerumitan: <strong className="text-[#4A2E18]">{b.tingkatKerumitan}</strong>
                        </span>
                        <button
                          onClick={() => setSelectedBatik(b)}
                          className="px-3.5 py-1.5 bg-[#F0E6D2] hover:bg-[#C59B27] hover:text-[#0B132B] text-[#4A2E18] font-bold rounded-lg transition border border-[#D9CEBC] shadow-xs flex items-center gap-1"
                        >
                          <Compass className="w-3.5 h-3.5" /> Detail Entitas
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              ) : (
                /* List View */
                <div className="space-y-3">
                  {filteredBatiks.map((b) => (
                    <div
                      key={b.id}
                      onClick={() => setSelectedBatik(b)}
                      className="bg-white rounded-xl p-4 border border-[#E8DFC9] hover:border-[#C59B27] shadow-xs hover:shadow-md transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-black/10 shrink-0">
                          <BatikImage id={b.id} alt={b.nama} className="w-full h-full" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-[#0B132B] text-[#E8C56A] text-[10px] font-bold rounded uppercase">
                              {b.jenisLabel}
                            </span>
                            <span className="px-2 py-0.5 bg-[#FAF7F2] text-gray-700 border border-[#E8DFC9] text-[10px] font-semibold rounded uppercase">
                              {b.motif.kategori}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-[#1C130D] group-hover:text-[#99732B] transition">
                            {b.nama}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {b.wilayah.nama}, {b.wilayah.provinsi} &bull; Kerumitan: {b.tingkatKerumitan}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBatik(b);
                          }}
                          className="px-3.5 py-2 bg-[#F0E6D2] hover:bg-[#C59B27] hover:text-[#0B132B] text-[#4A2E18] font-bold text-xs rounded-xl transition border border-[#D9CEBC]"
                        >
                          Lihat Entitas Triples
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              /* State Kosong */
              <div className="bg-white rounded-2xl p-12 text-center border border-[#E8DFC9] space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#FAF7F2] border border-[#E8DFC9] flex items-center justify-center text-[#99732B] mx-auto">
                  <Search className="w-8 h-8 opacity-50" />
                </div>
                <div className="space-y-1 max-w-md mx-auto">
                  <h3 className="text-base font-bold text-[#1C130D]">Tidak Ada Entitas yang Cocok</h3>
                  <p className="text-xs text-gray-600">
                    Tidak ditemukan kain batik dengan kueri <strong>&quot;{searchQuery}&quot;</strong> pada filter aktif. Cobalah menyederhanakan filter atau menggunakan rekomendasi kueri sinonim.
                  </p>
                </div>
                <button
                  onClick={resetAllFilters}
                  className="px-5 py-2.5 bg-[#C59B27] text-[#0B132B] font-bold text-xs rounded-xl shadow hover:bg-[#E8C56A] transition inline-flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" /> Reset Seluruh Filter
                </button>
              </div>
            )}

          </div>
        )}

        {/* ============================================================== */}
        {/* MODUL 3: DASAR PENGETAHUAN ONTOLOGI (SOLVES IMAGE ISSUE)       */}
        {/* ============================================================== */}
        {activeTab === 'knowledge' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            <KnowledgeBaseModule
              onSelectBatik={(b) => setSelectedBatik(b)}
              onGoToSearchWithQuery={handleTriggerSearch}
            />
          </div>
        )}

        {/* ============================================================== */}
        {/* MODUL 4: LABORATORIUM SPARQL 1.1                               */}
        {/* ============================================================== */}
        {activeTab === 'sparql' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            <SparqlModule />
          </div>
        )}

        {/* ============================================================== */}
        {/* MODUL 5: PANDUAN EKSEKUSI NETBEANS & NEXT.JS                   */}
        {/* ============================================================== */}
        {activeTab === 'guide' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E8DFC9] shadow-sm space-y-5 text-xs text-gray-800 leading-relaxed">
              
              <div className="border-b border-[#E8DFC9] pb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#99732B]">
                  Integrasi Lingkungan Pengembang
                </span>
                <h3 className="text-xl font-bold font-display text-[#1C130D] mt-0.5">
                  Prosedur Eksekusi Apache NetBeans &amp; Mode Pengembang Next.js
                </h3>
              </div>

              {/* Metode 1: NetBeans Run (F6) */}
              <div className="p-5 bg-[#FAF7F2] rounded-xl border border-[#E8DFC9] space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-[#4A2E18]">
                  <span className="w-6 h-6 rounded-full bg-[#C59B27] text-[#0B132B] flex items-center justify-center text-xs font-bold">1</span>
                  <span>Metode 1: Eksekusi Otomatis NetBeans IDE (Run Project / F6)</span>
                </div>
                <p className="text-gray-700">
                  Proyek ini terkonfigurasi dengan kelas Java <code>batikgui.BatikServer</code> yang terdaftar sebagai main class di <code>pom.xml</code> dan <code>nbactions.xml</code>:
                </p>
                <ol className="list-decimal list-inside space-y-1.5 text-gray-700 ml-2">
                  <li>Buka proyek <strong>batik-ontology</strong> di Apache NetBeans IDE (Versi 20+).</li>
                  <li>Klik menu <strong>Run &gt; Run Project</strong> atau cukup tekan tombol <kbd className="px-2 py-0.5 bg-white border border-gray-300 rounded font-mono text-[10px] font-bold shadow-xs">F6</kbd>.</li>
                  <li>NetBeans akan mengompilasi proyek Maven, memuat ontologi <code>batik-lengkap.rdf</code> via Apache Jena, menyalakan server lokal pada port <code>8080</code>, dan <strong>membuka peramban secara otomatis</strong>.</li>
                </ol>
              </div>

              {/* Metode 2: Next.js Dev */}
              <div className="p-5 bg-[#FAF7F2] rounded-xl border border-[#E8DFC9] space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-[#4A2E18]">
                  <span className="w-6 h-6 rounded-full bg-[#C59B27] text-[#0B132B] flex items-center justify-center text-xs font-bold">2</span>
                  <span>Metode 2: Next.js Fast-Refresh Dev Server</span>
                </div>
                <p className="text-gray-700">
                  Untuk modifikasi langsung komponen antarmuka React dan Tailwind CSS secara interaktif:
                </p>
                <pre className="bg-[#0B132B] text-emerald-400 p-3 rounded-xl font-mono text-xs overflow-x-auto">
npm.cmd run dev
                </pre>
                <p className="text-gray-500">
                  Aplikasi Next.js berjalan pada port <code>http://localhost:3000</code> dengan dukungan Hot Module Replacement (HMR).
                </p>
              </div>

              {/* Metode 3: Maven CLI */}
              <div className="p-5 bg-[#FAF7F2] rounded-xl border border-[#E8DFC9] space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-[#4A2E18]">
                  <span className="w-6 h-6 rounded-full bg-[#C59B27] text-[#0B132B] flex items-center justify-center text-xs font-bold">3</span>
                  <span>Metode 3: Eksekusi Maven CLI NetBeans Mandiri</span>
                </div>
                <pre className="bg-[#0B132B] text-emerald-400 p-3 rounded-xl font-mono text-xs overflow-x-auto">
&quot;C:\Program Files\NetBeans-24\netbeans\java\maven\bin\mvn.cmd&quot; compile exec:java
                </pre>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* ============================================================== */}
      {/* MODAL DETAIL ENTITAS GRAF PENGETAHUAN                         */}
      {/* ============================================================== */}
      <BatikDetailModal
        batik={selectedBatik}
        onClose={() => setSelectedBatik(null)}
      />

      {/* ============================================================== */}
      {/* FOOTER INSTITUSIONAL                                          */}
      {/* ============================================================== */}
      <footer className="bg-[#0B132B] text-gray-400 py-8 border-t-2 border-[#C59B27]/40 mt-auto text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3 text-center sm:text-left flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <p className="font-bold text-white text-sm font-display tracking-wide">
              SISTEM INFORMASI SEMANTIK BATIK NUSANTARA
            </p>
            <p className="text-gray-400 text-[11px]">
              Dibangun di atas Basis Pengetahuan Terstruktur OWL 2, Apache Jena Framework &amp; Next.js Tailwind CSS
            </p>
          </div>

          <div className="flex items-center justify-center sm:justify-end gap-2 text-[11px] text-gray-300">
            <span className="px-2.5 py-1 rounded-md bg-white/10 border border-white/15">
              48 Individu Batik
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white/10 border border-white/15">
              29 Kelas OWL
            </span>
            <span className="px-2.5 py-1 rounded-md bg-[#C59B27]/20 border border-[#C59B27]/40 text-[#E8C56A] font-bold">
              UNESCO ICH
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
