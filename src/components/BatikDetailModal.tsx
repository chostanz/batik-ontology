'use client';

import React, { useState } from 'react';
import { BatikItem } from '@/lib/semanticEngine';
import { BatikImage } from './BatikImage';
import { 
  X, MapPin, Sparkles, BookOpen, Layers, Share2, 
  Check, ExternalLink, Award, Feather, ShieldAlert, 
  Palette, Tag, Maximize2, Minimize2
} from 'lucide-react';

interface BatikDetailModalProps {
  batik: BatikItem | null;
  onClose: () => void;
  onSelectRelated?: (batikId: string) => void;
}

export function BatikDetailModal({ batik, onClose, onSelectRelated }: BatikDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'triples' | 'craft' | 'turtle'>('overview');
  const [copied, setCopied] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  if (!batik) return null;

  const generateTurtle = (b: BatikItem) => {
    return `@prefix : <http://www.semanticweb.org/asus/ontologies/2026/8/untitled-ontology-3#> .
@prefix owl: <http://www.w3.org/2002/07/owl#> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

:${b.id} a owl:NamedIndividual, :${b.tipe} ;
    :namaBatik "${b.nama}"^^xsd:string ;
    :deskripsi "${b.deskripsi}"^^xsd:string ;
    :maknaFilosofis "${b.maknaFilosofis}"^^xsd:string ;
    :sejarah "${b.sejarah}"^^xsd:string ;
    :aturanPemakaian "${b.aturanPemakaian}"^^xsd:string ;
    :golonganPemakai "${b.golonganPemakai}"^^xsd:string ;
    :warnaDominan "${b.warnaDominan}"^^xsd:string ;
    :bahanKain "${b.bahanKain}"^^xsd:string ;
    :jenisKain "${b.jenisKain}"^^xsd:string ;
    :tingkatKerumitan "${b.tingkatKerumitan}"^^xsd:string ;
    :berasalDari :${b.wilayah.id} ;
    :memilikiMotif :${b.motif.id} ;
    :dibuatDenganTeknik :${b.teknik.id} ${
      b.acara && b.acara.length > 0 
        ? ';\n    :memilikiKegunaan ' + b.acara.map(a => `:${a.id}`).join(', ') 
        : ''
    } ${
      b.malam && b.malam.length > 0 
        ? ';\n    :menggunakanBahanMalam ' + b.malam.map(m => `:${m.id}`).join(', ') 
        : ''
    } ${
      b.pewarnaan && b.pewarnaan.length > 0 
        ? ';\n    :menggunakanPewarnaan ' + b.pewarnaan.map(p => `:${p.id}`).join(', ') 
        : ''
    } .`;
  };

  const copyTurtle = () => {
    navigator.clipboard.writeText(generateTurtle(batik));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fade-in">
      <div 
        className="bg-[#FCFAF7] rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl border border-[#D9CEBC] my-auto flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Modal with Visual Hero */}
        <div className="relative bg-[#0B132B] text-white">
          <div className={`${isZoomed ? 'h-80' : 'h-52 sm:h-60'} w-full overflow-hidden transition-all duration-300 relative group`}>
            <BatikImage 
              id={batik.id} 
              alt={batik.nama} 
              className="w-full h-full opacity-90 group-hover:opacity-100" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B] via-[#0B132B]/50 to-transparent" />
            
            {/* Zoom Toggle Button */}
            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className="absolute top-3.5 left-3.5 p-2 rounded-lg bg-black/50 hover:bg-black/80 text-white/90 hover:text-white backdrop-blur-md border border-white/20 transition text-xs flex items-center gap-1.5"
              title={isZoomed ? 'Perkecil tampilan gambar' : 'Perbesar motif batik'}
            >
              {isZoomed ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline font-mono text-[11px]">{isZoomed ? 'Kecilkan' : 'Zoom Motif'}</span>
            </button>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 p-2 rounded-full bg-black/50 hover:bg-black/90 text-white/90 hover:text-white backdrop-blur-md border border-white/20 transition"
            aria-label="Tutup modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Title and Badges Info on top of gradient */}
          <div className="p-4 sm:p-6 absolute bottom-0 left-0 right-0 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 bg-[#C59B27] text-[#0B132B] text-[11px] font-bold rounded-md uppercase tracking-wider shadow">
                {batik.jenisLabel}
              </span>
              <span className="px-2.5 py-0.5 bg-[#1C2541]/90 text-[#E8C56A] border border-[#C59B27]/40 text-[11px] font-semibold rounded-md uppercase">
                Motif {batik.motif.kategori}
              </span>
              <span className="px-2.5 py-0.5 bg-white/10 backdrop-blur-sm text-gray-200 text-[11px] rounded-md font-medium flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#E8C56A]" /> {batik.wilayah.nama}, {batik.wilayah.provinsi} ({batik.wilayah.pulau})
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-wide">
              {batik.nama}
            </h2>
            <div className="font-mono text-[11px] text-[#C59B27] flex items-center gap-1">
              <span>URI:</span>
              <span className="text-gray-300">:{batik.id}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-4 sm:px-6 pt-3 border-b border-[#E8DFC9] bg-[#F7F3EA] text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-[#C59B27] text-[#4A2E18] font-bold'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Filosofi & Narasi
          </button>

          <button
            onClick={() => setActiveTab('triples')}
            className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'triples'
                ? 'border-[#C59B27] text-[#4A2E18] font-bold'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Relasi Graf Triples (OWL)
          </button>

          <button
            onClick={() => setActiveTab('craft')}
            className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'craft'
                ? 'border-[#C59B27] text-[#4A2E18] font-bold'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Palette className="w-3.5 h-3.5" /> Kriya & Material
          </button>

          <button
            onClick={() => setActiveTab('turtle')}
            className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'turtle'
                ? 'border-[#C59B27] text-[#4A2E18] font-bold'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" /> Format RDF / Turtle
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs text-[#2A180B] flex-1">
          
          {/* TAB 1: FILOSOFI & NARASI */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              
              {/* Makna Filosofis Highlight Card */}
              <div className="p-4 rounded-xl bg-[#F0E6D2] border-l-4 border-[#C59B27] shadow-sm space-y-1.5">
                <span className="text-[10px] font-bold text-[#8B5A2B] uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#C59B27]" /> Makna Filosofis & Nilai Spiritual
                </span>
                <p className="text-sm italic text-[#2A180B] leading-relaxed font-serif">
                  &quot;{batik.maknaFilosofis || 'Kearifan lokal warisan leluhur bangsa Indonesia.'}&quot;
                </p>
              </div>

              {/* Deskripsi & Sejarah */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-xl border border-[#E8DFC9] space-y-2 shadow-xs">
                  <h4 className="font-bold text-[#4A2E18] text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#C59B27]" /> Deskripsi Visual Motif
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    {batik.deskripsi}
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-[#E8DFC9] space-y-2 shadow-xs">
                  <h4 className="font-bold text-[#4A2E18] text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Feather className="w-3.5 h-3.5 text-[#C59B27]" /> Asal-Usul & Sejarah
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    {batik.sejarah}
                  </p>
                </div>
              </div>

              {/* Aturan Adat & Golongan Pemakai */}
              <div className="p-4 bg-white rounded-xl border border-[#E8DFC9] space-y-3 shadow-xs">
                <h4 className="font-bold text-[#4A2E18] text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-[#C59B27]" /> Norma Adat & Konteks Sosial Pemakaian
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-[#FAF7F2] rounded-lg border border-[#E8DFC9]">
                    <span className="text-gray-500 font-medium block text-[10px] uppercase">Aturan Pemakaian</span>
                    <span className="font-semibold text-[#2A180B] mt-0.5 block">{batik.aturanPemakaian}</span>
                  </div>
                  <div className="p-3 bg-[#FAF7F2] rounded-lg border border-[#E8DFC9]">
                    <span className="text-gray-500 font-medium block text-[10px] uppercase">Golongan Pemakai</span>
                    <span className="font-semibold text-[#2A180B] mt-0.5 block">{batik.golonganPemakai}</span>
                  </div>
                </div>
              </div>

              {/* UNESCO Status */}
              <div className="p-3 rounded-lg bg-[#0B132B] text-white flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#C59B27]" />
                  <span className="font-medium text-gray-200">{batik.statusWarisanBudaya}</span>
                </div>
                <a 
                  href={batik.sumberReferensi || 'https://ich.unesco.org/en/RL/indonesian-batik-00170'} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-[#E8C56A] hover:underline flex items-center gap-1 text-[11px] shrink-0"
                >
                  UNESCO Portal <ExternalLink className="w-3 h-3" />
                </a>
              </div>

            </div>
          )}

          {/* TAB 2: RELASI GRAF TRIPLES (OWL ONTOLOGY) */}
          {activeTab === 'triples' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-lg bg-[#FAF7F2] border border-[#E8DFC9] text-xs text-gray-700">
                Graf ontologi merepresentasikan entitas individu bernilai semantik formal. Setiap kartu triple di bawah mencerminkan tupel <code>&lt;Subject, Predicate, Object&gt;</code> yang dapat diinferensikan oleh Jena Reasoner.
              </div>

              <div className="space-y-2.5 font-mono text-xs">
                
                {/* Triple: Asal Wilayah */}
                <div className="p-3 bg-white rounded-lg border border-[#E8DFC9] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600 font-bold">:{batik.id}</span>
                    <span className="text-[#C59B27] font-semibold">:berasalDari</span>
                    <span className="bg-blue-50 text-blue-900 px-2 py-0.5 rounded font-bold">:{batik.wilayah.id}</span>
                  </div>
                  <span className="text-gray-500 text-[11px] font-sans">
                    Wilayah {batik.wilayah.nama}, {batik.wilayah.provinsi} ({batik.wilayah.pulau})
                  </span>
                </div>

                {/* Triple: Motif */}
                <div className="p-3 bg-white rounded-lg border border-[#E8DFC9] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600 font-bold">:{batik.id}</span>
                    <span className="text-[#C59B27] font-semibold">:memilikiMotif</span>
                    <span className="bg-emerald-50 text-emerald-900 px-2 py-0.5 rounded font-bold">:{batik.motif.id}</span>
                  </div>
                  <span className="text-gray-500 text-[11px] font-sans">
                    Motif {batik.motif.nama} (Kategori {batik.motif.kategori})
                  </span>
                </div>

                {/* Triple: Teknik */}
                <div className="p-3 bg-white rounded-lg border border-[#E8DFC9] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600 font-bold">:{batik.id}</span>
                    <span className="text-[#C59B27] font-semibold">:dibuatDenganTeknik</span>
                    <span className="bg-amber-50 text-amber-900 px-2 py-0.5 rounded font-bold">:{batik.teknik.id}</span>
                  </div>
                  <span className="text-gray-500 text-[11px] font-sans">
                    {batik.teknik.nama} (Alat: {batik.teknik.alat})
                  </span>
                </div>

                {/* Triples: Acara */}
                {batik.acara && batik.acara.map((a) => (
                  <div key={a.id} className="p-3 bg-white rounded-lg border border-[#E8DFC9] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600 font-bold">:{batik.id}</span>
                      <span className="text-[#C59B27] font-semibold">:dipakaiPadaAcara</span>
                      <span className="bg-purple-50 text-purple-900 px-2 py-0.5 rounded font-bold">:{a.id}</span>
                    </div>
                    <span className="text-gray-500 text-[11px] font-sans">
                      {a.nama}
                    </span>
                  </div>
                ))}

                {/* Triples: Bahan Malam */}
                {batik.malam && batik.malam.map((m) => (
                  <div key={m.id} className="p-3 bg-white rounded-lg border border-[#E8DFC9] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600 font-bold">:{batik.id}</span>
                      <span className="text-[#C59B27] font-semibold">:menggunakanBahanMalam</span>
                      <span className="bg-orange-50 text-orange-900 px-2 py-0.5 rounded font-bold">:{m.id}</span>
                    </div>
                    <span className="text-gray-500 text-[11px] font-sans">
                      {m.nama} ({m.fungsi})
                    </span>
                  </div>
                ))}

                {/* Triples: Pewarnaan */}
                {batik.pewarnaan && batik.pewarnaan.map((p) => (
                  <div key={p.id} className="p-3 bg-white rounded-lg border border-[#E8DFC9] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600 font-bold">:{batik.id}</span>
                      <span className="text-[#C59B27] font-semibold">:menggunakanPewarnaan</span>
                      <span className="bg-rose-50 text-rose-900 px-2 py-0.5 rounded font-bold">:{p.id}</span>
                    </div>
                    <span className="text-gray-500 text-[11px] font-sans">
                      {p.nama} (Sumber: {p.sumber}, Warna: {p.warna})
                    </span>
                  </div>
                ))}

              </div>
            </div>
          )}

          {/* TAB 3: KRIYA & MATERIAL */}
          {activeTab === 'craft' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                <div className="p-3.5 bg-white rounded-xl border border-[#E8DFC9] space-y-1">
                  <span className="text-[10px] text-gray-500 font-bold uppercase">Bahan Kain Dasar</span>
                  <div className="text-sm font-bold text-[#4A2E18]">{batik.bahanKain}</div>
                  <span className="text-[11px] text-gray-500">Mori prima / primissima bermutu tinggi</span>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-[#E8DFC9] space-y-1">
                  <span className="text-[10px] text-gray-500 font-bold uppercase">Jenis Bentuk Kain</span>
                  <div className="text-sm font-bold text-[#4A2E18]">{batik.jenisKain}</div>
                  <span className="text-[11px] text-gray-500">Ukuran standar kain panjang (jarik/sarung)</span>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-[#E8DFC9] space-y-1">
                  <span className="text-[10px] text-gray-500 font-bold uppercase">Tingkat Kerumitan Kriya</span>
                  <div className="text-sm font-bold text-[#C59B27]">{batik.tingkatKerumitan}</div>
                  <span className="text-[11px] text-gray-500">Berdasarkan proses perintangan & pewarnaan</span>
                </div>
              </div>

              {/* Detail Malam & Pewarna */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-xl border border-[#E8DFC9] space-y-3">
                  <h4 className="font-bold text-[#4A2E18] text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#C59B27]" /> Komposisi Lilin Malam
                  </h4>
                  {batik.malam && batik.malam.length > 0 ? (
                    <div className="space-y-2">
                      {batik.malam.map((m) => (
                        <div key={m.id} className="p-2.5 bg-[#FAF7F2] rounded-lg border border-[#E8DFC9] space-y-1">
                          <div className="font-bold text-[#2A180B]">{m.nama}</div>
                          <div className="text-[11px] text-gray-600"><span className="font-semibold">Fungsi:</span> {m.fungsi}</div>
                          <div className="text-[10px] text-gray-500"><span className="font-semibold">Bahan:</span> {m.komposisi}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">Malam klowong dan tembokan standar.</p>
                  )}
                </div>

                <div className="p-4 bg-white rounded-xl border border-[#E8DFC9] space-y-3">
                  <h4 className="font-bold text-[#4A2E18] text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-[#C59B27]" /> Zat Pewarna Kain
                  </h4>
                  <div className="space-y-2">
                    <div className="p-2.5 bg-[#FAF7F2] rounded-lg border border-[#E8DFC9]">
                      <span className="text-gray-500 text-[10px] uppercase font-semibold block">Warna Dominan</span>
                      <span className="font-bold text-[#2A180B]">{batik.warnaDominan}</span>
                    </div>

                    {batik.pewarnaan && batik.pewarnaan.length > 0 ? (
                      batik.pewarnaan.map((p) => (
                        <div key={p.id} className="p-2.5 bg-[#FAF7F2] rounded-lg border border-[#E8DFC9] space-y-0.5">
                          <div className="font-bold text-[#2A180B] flex items-center justify-between">
                            <span>{p.nama}</span>
                            <span className="px-1.5 py-0.2 bg-amber-100 text-amber-900 rounded text-[10px] uppercase">{p.tipe}</span>
                          </div>
                          <div className="text-[11px] text-gray-600">Sumber: {p.sumber}</div>
                        </div>
                      ))
                    ) : (
                      <div className="p-2.5 bg-[#FAF7F2] rounded-lg border border-[#E8DFC9] text-gray-500 italic text-[11px]">
                        Menggunakan perpaduan warna alami atau sintetis lokal.
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: FORMAT RDF / TURTLE */}
          {activeTab === 'turtle' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600 font-semibold">
                  Representasi Terstruktur W3C RDF Turtle (Jena Serializer)
                </span>
                <button
                  onClick={copyTurtle}
                  className="px-3 py-1.5 bg-[#C59B27] hover:bg-[#E8C56A] text-[#0B132B] font-bold text-xs rounded-lg transition flex items-center gap-1.5 shadow"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Tersalin ke Clipboard!' : 'Salin Sintaks Turtle'}</span>
                </button>
              </div>

              <div className="bg-[#0B132B] text-emerald-400 p-4 rounded-xl font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800 shadow-inner max-h-72">
                <pre>{generateTurtle(batik)}</pre>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 bg-[#F7F3EA] border-t border-[#E8DFC9] flex items-center justify-between">
          <div className="text-[11px] text-gray-500 font-medium">
            Entitas Terdata: <strong className="text-[#2A180B]">{batik.id}</strong> (OWL 2 Individual)
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#E8DFC9] hover:bg-[#C59B27] hover:text-[#0B132B] text-[#4A2E18] font-bold text-xs rounded-lg transition"
          >
            Tutup Jendela
          </button>
        </div>

      </div>
    </div>
  );
}
