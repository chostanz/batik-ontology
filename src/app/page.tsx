'use client';

import React, { useState } from 'react';
import ontologyBundle from '@/lib/ontologyData.json';
import { searchSemanticBatik, BatikItem } from '@/lib/semanticEngine';
import { Search, Compass, BookOpen, Terminal, Cpu, X, MapPin, ChevronRight, Award, ArrowRight } from 'lucide-react';

export default function BatikApp() {
  const [activeTab, setActiveTab] = useState<'landing' | 'search' | 'knowledge' | 'guide'>('landing');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterJenis, setFilterJenis] = useState('all');
  const [filterMotif, setFilterMotif] = useState('all');
  const [filterAcara, setFilterAcara] = useState('all');
  const [filterWarna, setFilterWarna] = useState('all');
  const [filterPulau, setFilterPulau] = useState('all');
  const [selectedBatik, setSelectedBatik] = useState<BatikItem | null>(null);

  const allBatiks = ontologyBundle.batiks as unknown as BatikItem[];
  const featuredIds = ['Batik_Parang_Rusak', 'Batik_Megamendung', 'Batik_Kawung', 'Batik_Truntum'];
  const featuredBatiks = allBatiks.filter(b => featuredIds.includes(b.id));

  const { results: filteredBatiks, semanticMatch } = searchSemanticBatik(searchQuery, {
    jenis: filterJenis,
    motif: filterMotif,
    acara: filterAcara,
    warna: filterWarna,
    pulau: filterPulau,
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#2A1E13] font-sans">
      
      {/* Header Institusional */}
      <header className="bg-[#151D2A] text-white border-b-2 border-[#99732B]/40 shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#99732B]/20 border border-[#99732B]/40 flex items-center justify-center text-[#99732B] shrink-0">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] tracking-wider uppercase text-[#C79E4A] font-bold">
                  Kementerian / Portal Kebudayaan Digital
                </div>
                <h1 className="text-lg sm:text-xl font-bold tracking-wide text-white leading-tight">
                  SISTEM INFORMASI SEMANTIK BATIK NUSANTARA
                </h1>
              </div>
            </div>

            {/* Menu Navigasi Modul */}
            <nav className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
              <button
                onClick={() => setActiveTab('landing')}
                className={`px-3.5 py-1.5 rounded transition ${activeTab === 'landing' ? 'bg-[#99732B] text-[#151D2A] font-bold' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>
                Beranda
              </button>
              <button
                onClick={() => setActiveTab('search')}
                className={`px-3.5 py-1.5 rounded transition ${activeTab === 'search' ? 'bg-[#99732B] text-[#151D2A] font-bold' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>
                Katalog & Pencarian Semantik
              </button>
              <button
                onClick={() => setActiveTab('knowledge')}
                className={`px-3.5 py-1.5 rounded transition ${activeTab === 'knowledge' ? 'bg-[#99732B] text-[#151D2A] font-bold' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>
                Dasar Pengetahuan Ontologi
              </button>
              <button
                onClick={() => setActiveTab('guide')}
                className={`px-3.5 py-1.5 rounded transition ${activeTab === 'guide' ? 'bg-[#99732B] text-[#151D2A] font-bold' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>
                Panduan NetBeans
              </button>
            </nav>

          </div>
        </div>
      </header>

      {/* Konten Utama */}
      <main className="flex-1 w-full">
        
        {/* ============================================== */}
        {/* MODUL 1: BERANDA & LANDING PAGE UTAMA          */}
        {/* ============================================== */}
        {activeTab === 'landing' && (
          <div className="space-y-12 pb-12">
            
            {/* Hero Section */}
            <div className="bg-[#151D2A] text-white py-14 border-b border-[#99732B]/30 relative">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  
                  <div className="lg:col-span-7 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#99732B]/20 border border-[#99732B]/40 text-[#C79E4A] text-xs font-semibold uppercase tracking-wider">
                      <Award className="w-4 h-4" /> UNESCO Intangible Cultural Heritage of Humanity
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight text-white">
                      Khazanah Warisan Budaya Batik Berbasis Graf Pengetahuan Ontologi
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-xl">
                      Platform penelusuran digital berbasis Web Semantik (OWL 2 / RDF) yang menghubungkan 48 ragam kain batik nusantara, 29 kelas taksonomi, makna filosofis motif sakral, teknik kriya canting tradisional, serta konteks seremonial daur hidup adat istiadat Indonesia.
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-semibold">
                      <button 
                        onClick={() => setActiveTab('search')}
                        className="px-5 py-2.5 bg-[#99732B] hover:bg-[#C79E4A] text-[#151D2A] rounded-lg shadow font-bold transition flex items-center gap-2">
                        <Search className="w-4 h-4" /> Mulai Pencarian Semantik
                      </button>
                      <button 
                        onClick={() => setActiveTab('knowledge')}
                        className="px-5 py-2.5 bg-[#232E40] hover:bg-white/10 text-white rounded-lg border border-[#99732B]/40 transition flex items-center gap-2">
                        <BookOpen className="w-4 h-4" /> Eksplorasi Taksonomi Ontologi
                      </button>
                    </div>
                  </div>

                  {/* Panel Statistik */}
                  <div className="lg:col-span-5 bg-[#232E40]/90 border border-[#99732B]/30 rounded-xl p-5 shadow-xl space-y-4">
                    <div className="text-xs font-bold uppercase tracking-wider text-[#C79E4A] border-b border-gray-700 pb-2">
                      Metrik Pengetahuan Ontologi Terstruktur
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-black/30 rounded border border-gray-700/80">
                        <span className="text-gray-400 block text-[10px] uppercase font-semibold">Kain Batik Terdata</span>
                        <span className="text-2xl font-bold text-[#C79E4A]">48</span>
                        <span className="text-[10px] text-gray-400 block mt-0.5">Individu Bernama</span>
                      </div>
                      <div className="p-3 bg-black/30 rounded border border-gray-700/80">
                        <span className="text-gray-400 block text-[10px] uppercase font-semibold">Kelas Konsep OWL</span>
                        <span className="text-2xl font-bold text-[#C79E4A]">29</span>
                        <span className="text-[10px] text-gray-400 block mt-0.5">Hierarki Taksonomi</span>
                      </div>
                      <div className="p-3 bg-black/30 rounded border border-gray-700/80">
                        <span className="text-gray-400 block text-[10px] uppercase font-semibold">Relasi Objek (Triples)</span>
                        <span className="text-2xl font-bold text-[#C79E4A]">16</span>
                        <span className="text-[10px] text-gray-400 block mt-0.5">Object Properties</span>
                      </div>
                      <div className="p-3 bg-black/30 rounded border border-gray-700/80">
                        <span className="text-gray-400 block text-[10px] uppercase font-semibold">Atribut Literal</span>
                        <span className="text-2xl font-bold text-[#C79E4A]">29</span>
                        <span className="text-[10px] text-gray-400 block mt-0.5">Datatype Properties</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Showcase 4 Mahakarya Utama */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
              <div className="border-b border-[#E4D6C3] pb-3 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#99732B]">Kurasi Khusus Warisan Keraton & Pesisir</span>
                  <h3 className="text-xl font-bold text-[#2A1E13] mt-0.5">
                    Sorotan 4 Mahakarya Batik Nusantara
                  </h3>
                </div>
                <button 
                  onClick={() => setActiveTab('search')}
                  className="text-xs font-semibold text-[#523E2A] hover:text-[#2A1E13] underline flex items-center gap-1">
                  Lihat Seluruh 48 Koleksi <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {featuredBatiks.map((b) => (
                  <div key={b.id} className="bg-white rounded-xl overflow-hidden border border-[#E4D6C3] shadow-sm hover:shadow-md hover:border-[#99732B] transition flex flex-col justify-between group">
                    <div>
                      <div className="h-44 w-full bg-[#F2ECE1] overflow-hidden relative">
                        <img 
                          src={`/img/${b.id}`} 
                          alt={b.nama} 
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/75 text-[#C79E4A] rounded text-[10px] font-bold uppercase tracking-wider">
                          {b.jenisLabel}
                        </span>
                      </div>
                      <div className="p-4 space-y-2">
                        <h4 className="text-sm font-bold text-[#2A1E13] group-hover:text-[#99732B] transition">
                          {b.nama}
                        </h4>
                        <p className="text-[11px] text-gray-500">{b.wilayah.nama}, {b.wilayah.provinsi}</p>
                        <p className="text-xs text-gray-700 italic line-clamp-3 bg-[#FAF7F2] p-2.5 rounded border border-[#E4D6C3]">
                          &quot;{b.maknaFilosofis}&quot;
                        </p>
                      </div>
                    </div>
                    <div className="p-4 pt-0">
                      <button
                        onClick={() => setSelectedBatik(b)}
                        className="w-full py-2 bg-[#F2ECE1] hover:bg-[#99732B] hover:text-white text-[#2A1E13] font-semibold text-xs rounded transition border border-[#CDB99F]">
                        Lihat Detail Entitas
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ============================================== */}
        {/* MODUL 2: KATALOG & TEMU KEMBALI SEMANTIK       */}
        {/* ============================================== */}
        {activeTab === 'search' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            
            {/* Panel Input Pencarian */}
            <div className="bg-white rounded-xl p-5 border border-[#E4D6C3] shadow-sm space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#523E2A]">
                  Kueri Temu Kembali Semantik (Mendukung Sinonim Budaya & Konsep Ontologi)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Masukkan kata kunci pencarian (contoh: manten, duka, ikan, bunga, jogja, canting, lilin, soga)..."
                    className="w-full pl-4 pr-24 py-3 bg-[#FAF7F2] border border-[#CDB99F] rounded-lg text-[#2A1E13] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#99732B] text-sm font-medium"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute inset-y-0 right-2 px-3 text-gray-400 hover:text-black text-xs font-semibold">
                      Hapus
                    </button>
                  )}
                </div>
              </div>

              {/* Rekomendasi Sinonim */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
                <span className="text-[#6B5339] font-semibold mr-1">Rekomendasi Kueri Sinonim:</span>
                {['manten', 'ikan', 'bunga', 'lelayu', 'istana', 'soga', 'canting', 'lilin'].map((syn) => (
                  <button
                    key={syn}
                    onClick={() => setSearchQuery(syn)}
                    className="px-2.5 py-1 bg-[#F2ECE1] hover:bg-[#E4D6C3] text-[#3D2D1E] rounded border border-[#E4D6C3] font-medium">
                    &quot;{syn}&quot;
                  </button>
                ))}
              </div>

              {/* Panel Penalaran Semantik */}
              {semanticMatch && (
                <div className="p-3.5 rounded-lg bg-amber-50 border-l-4 border-[#99732B] text-xs text-[#2A1E13] space-y-1">
                  <div className="font-bold flex items-center justify-between">
                    <span className="text-[#523E2A] uppercase tracking-wider text-[11px]">Ekspansi Kueri Semantik (Semantic Query Expansion):</span>
                    <span className="px-2 py-0.5 bg-amber-200 text-[#2A1E13] rounded font-mono font-semibold">
                      {semanticMatch.canonicalLabel}
                    </span>
                  </div>
                  <p className="leading-relaxed text-gray-700">
                    Kata kunci <strong>&quot;{semanticMatch.matchedKeyword}&quot;</strong> dipetakan ke konsep ontologi <code className="bg-amber-100 px-1 rounded font-mono font-bold">{semanticMatch.ontologyClass}</code>. {semanticMatch.reasoning}
                  </p>
                </div>
              )}

              {/* Filter */}
              <div className="pt-3 border-t border-[#F2ECE1] grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Teknik:</label>
                  <select value={filterJenis} onChange={(e) => setFilterJenis(e.target.value)} className="w-full bg-[#FAF7F2] border border-[#CDB99F] rounded px-2 py-1.5 font-medium text-xs">
                    <option value="all">Semua Teknik</option>
                    <option value="batik_tulis">Batik Tulis</option>
                    <option value="batik_cap">Batik Cap</option>
                    <option value="batik_cetak">Batik Cetak</option>
                    <option value="batik_kombinasi">Batik Kombinasi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Kategori Motif:</label>
                  <select value={filterMotif} onChange={(e) => setFilterMotif(e.target.value)} className="w-full bg-[#FAF7F2] border border-[#CDB99F] rounded px-2 py-1.5 font-medium text-xs">
                    <option value="all">Semua Kategori</option>
                    <option value="flora">Flora</option>
                    <option value="fauna">Fauna</option>
                    <option value="geometris">Geometris</option>
                    <option value="alam">Alam</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Konteks Acara:</label>
                  <select value={filterAcara} onChange={(e) => setFilterAcara(e.target.value)} className="w-full bg-[#FAF7F2] border border-[#CDB99F] rounded px-2 py-1.5 font-medium text-xs">
                    <option value="all">Semua Acara</option>
                    <option value="pernikahan">Pernikahan Adat</option>
                    <option value="kelahiran">Mitoni / Kelahiran</option>
                    <option value="kematian">Lelayu / Kematian</option>
                    <option value="kerajaan">Lingkungan Keraton</option>
                    <option value="busana_formal">Busana Formal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Pewarna:</label>
                  <select value={filterWarna} onChange={(e) => setFilterWarna(e.target.value)} className="w-full bg-[#FAF7F2] border border-[#CDB99F] rounded px-2 py-1.5 font-medium text-xs">
                    <option value="all">Semua Pewarna</option>
                    <option value="alami">Alami</option>
                    <option value="sintetis">Sintetis</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Wilayah Pulau:</label>
                  <select value={filterPulau} onChange={(e) => setFilterPulau(e.target.value)} className="w-full bg-[#FAF7F2] border border-[#CDB99F] rounded px-2 py-1.5 font-medium text-xs">
                    <option value="all">Seluruh Pulau</option>
                    <option value="Jawa">Jawa</option>
                    <option value="Sumatera">Sumatera</option>
                    <option value="Kalimantan">Kalimantan</option>
                    <option value="Papua">Papua</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-600 pt-2 border-t border-[#F2ECE1]">
                <span>Menampilkan <strong>{filteredBatiks.length}</strong> entitas</span>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilterJenis('all');
                    setFilterMotif('all');
                    setFilterAcara('all');
                    setFilterWarna('all');
                    setFilterPulau('all');
                  }}
                  className="text-[#6B5339] hover:underline font-semibold">
                  Reset Filter
                </button>
              </div>
            </div>

            {/* Grid Kartu Batik Lengkap dengan Gambar */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredBatiks.map((b) => (
                <div key={b.id} className="bg-white rounded-xl overflow-hidden border border-[#E4D6C3] shadow-sm hover:border-[#99732B] transition flex flex-col justify-between group">
                  <div>
                    <div className="h-44 w-full bg-[#F2ECE1] overflow-hidden relative">
                      <img 
                        src={`/img/${b.id}`} 
                        alt={b.nama} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute top-2 left-2 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-black/75 text-[#C79E4A] backdrop-blur-sm uppercase">
                          {b.jenisLabel}
                        </span>
                        <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-white/90 text-gray-800 backdrop-blur-sm uppercase">
                          {b.motif.kategori}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <div>
                        <h3 className="text-base font-bold text-[#2A1E13]">{b.nama}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {b.wilayah.nama}, {b.wilayah.provinsi} ({b.wilayah.pulau})
                        </p>
                      </div>

                      <div className="p-2.5 bg-[#FAF7F2] rounded border border-[#E4D6C3] text-xs text-gray-700 italic line-clamp-2">
                        &quot;{b.maknaFilosofis || b.deskripsi}&quot;
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-3 border-t border-[#F2ECE1] flex items-center justify-between text-xs">
                    <span className="text-gray-500 text-[11px]">Kerumitan: <strong>{b.tingkatKerumitan}</strong></span>
                    <button
                      onClick={() => setSelectedBatik(b)}
                      className="px-2.5 py-1 bg-[#F2ECE1] hover:bg-[#99732B] hover:text-white text-[#2A1E13] font-semibold rounded transition border border-[#CDB99F]">
                      Rincian Entitas
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ============================================== */}
        {/* MODUL 3: DASAR PENGETAHUAN ONTOLOGI            */}
        {/* ============================================== */}
        {activeTab === 'knowledge' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            <div className="bg-white rounded-xl p-6 border border-[#E4D6C3] shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-[#2A1E13]">Spesifikasi Model Ontologi Batik Nusantara</h2>
              <p className="text-xs text-gray-700 leading-relaxed">
                Ontologi ini merepresentasikan 29 Kelas OWL, 16 Object Properties, 29 Data Properties, dan 160 Named Individuals dalam format OWL 2 berbasis Apache Jena.
              </p>
            </div>
          </div>
        )}

        {/* ============================================== */}
        {/* MODUL 4: PANDUAN EKSEKUSI NETBEANS            */}
        {/* ============================================== */}
        {activeTab === 'guide' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
            <div className="bg-white rounded-xl p-6 border border-[#E4D6C3] space-y-3 text-xs leading-relaxed text-gray-800">
              <h2 className="text-base font-bold text-[#2A1E13]">Panduan Eksekusi Apache NetBeans</h2>
              <p>
                Proyek ini terintegrasi penuh dengan Apache NetBeans melalui kelas Java <code>BatikServer.java</code>. Tekan <strong>Run Project (F6)</strong> di NetBeans untuk memuat model ontologi dan membuka peramban web pada port <code>8080</code>.
              </p>
            </div>
          </div>
        )}

      </main>

      {/* Modal Detail dengan Gambar Penuh */}
      {selectedBatik && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#CDB99F]">
            
            {/* Header Modal dengan Gambar */}
            <div className="relative bg-[#151D2A] text-white">
              <div className="h-44 w-full overflow-hidden bg-black/40">
                <img 
                  src={`/img/${selectedBatik.id}`} 
                  alt={selectedBatik.nama} 
                  className="w-full h-full object-cover opacity-90"
                />
              </div>
              <div className="p-4 absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/60 to-transparent">
                <span className="px-2 py-0.5 bg-[#99732B] text-white text-[11px] font-bold rounded uppercase">
                  {selectedBatik.jenisLabel}
                </span>
                <h3 className="text-xl font-bold mt-1 text-white">{selectedBatik.nama}</h3>
                <p className="text-xs text-gray-300">{selectedBatik.wilayah.nama}, {selectedBatik.wilayah.provinsi}</p>
              </div>
              <button 
                onClick={() => setSelectedBatik(null)} 
                className="absolute top-3 right-3 px-2 py-1 rounded bg-black/60 hover:bg-black text-white text-xs font-semibold">
                Tutup
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs text-gray-800 max-h-[60vh] overflow-y-auto">
              <div className="p-3 bg-[#FAF7F2] rounded border border-[#E4D6C3] text-xs italic">
                <strong>Makna Filosofis:</strong> {selectedBatik.maknaFilosofis || 'Tidak ada catatan filosofis.'}
              </div>
              <div className="space-y-2 text-gray-700">
                <p><strong>Deskripsi:</strong> {selectedBatik.deskripsi}</p>
                <p><strong>Aturan Pemakaian:</strong> {selectedBatik.aturanPemakaian}</p>
                <p><strong>Bahan Kain:</strong> {selectedBatik.bahanKain}</p>
                <p><strong>Warna Dominan:</strong> {selectedBatik.warnaDominan}</p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Footer Institusional */}
      <footer className="bg-[#151D2A] text-gray-400 py-6 border-t border-[#99732B]/30 mt-auto text-xs text-center">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-semibold text-white">Sistem Ontologi & Temu Kembali Semantik Batik Nusantara</p>
          <p className="text-gray-400 text-[11px]">
            Berdasarkan Basis Pengetahuan Terstruktur OWL 2 / Apache Jena RDF Framework
          </p>
        </div>
      </footer>

    </div>
  );
}
